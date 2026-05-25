/**
 * PDF Service — orchestrates PDF generation for a given order.
 *
 * Two modes, selected by the PDF_SERVICE_URL environment variable:
 *
 * ── Local / development (PDF_SERVICE_URL not set) ────────────────────────────
 *   generateBookPDF(orderId) runs Puppeteer directly in the same process.
 *   No extra infrastructure needed — just npm install and you're running.
 *
 * ── Production (PDF_SERVICE_URL set) ─────────────────────────────────────────
 *   dispatchPDFJob(orderId) fires a fire-and-forget HTTP POST to the Fly.io
 *   PDF microservice (pdf-service/server.ts).  The microservice runs Puppeteer,
 *   uploads to S3 / R2, then POSTs the result back to
 *   /api/orders/[orderId]/fulfill on the Next.js app.
 *
 *   The webhook handler calls dispatchPDFJob(); generateBookPDF() is still used
 *   by the /api/generate manual-trigger route and as the local dev pipeline.
 */

import path from 'path'
import fs   from 'fs/promises'

import { cartStore }              from '@/lib/cart-store'
import { runPDFJob, PDF_TMP_DIR } from '@/workers/pdf.worker'
import { storage }                from '@/lib/storage'
import { emailService }           from '@/lib/email'

// ── Return type ───────────────────────────────────────────────────────────────

export type GenerationResult =
  | { success: true;  downloadUrl: string; filePath: string; cached: boolean }
  | { success: false; error: string }

// ── Service ───────────────────────────────────────────────────────────────────

export async function generateBookPDF(orderId: string): Promise<GenerationResult> {

  // ── 1. Fetch order ──────────────────────────────────────────────────────────
  const order = await cartStore.get(orderId)
  if (!order) {
    return { success: false, error: 'Order not found.' }
  }

  const filePath = path.join(PDF_TMP_DIR, `${orderId}.pdf`)

  // ── 2. Return cached result if already fulfilled ───────────────────────────
  if (order.status === 'fulfilled') {
    // S3 / R2 path: key is durable — no need to check disk
    if (order.pdfS3Key && storage.isConfigured()) {
      console.log(`[pdf.service] Cache hit (S3) for order ${orderId}`)
      return {
        success:     true,
        downloadUrl: `/api/download/${orderId}`,
        filePath:    '',
        cached:      true,
      }
    }

    // Local /tmp path: verify the file still exists (OS may have flushed it)
    try {
      await fs.access(filePath)
      console.log(`[pdf.service] Cache hit (/tmp) for order ${orderId}`)
      return {
        success:     true,
        downloadUrl: `/api/download/${orderId}`,
        filePath,
        cached:      true,
      }
    } catch {
      // File was cleaned up — fall through to regenerate
      console.log(`[pdf.service] Cache miss for order ${orderId}, regenerating…`)
    }
  }

  // ── 3. Generate ─────────────────────────────────────────────────────────────
  try {
    await cartStore.updateStatus(orderId, 'generating')

    const outPath = await runPDFJob({
      orderId,
      childName:  order.childName,
      appearance: order.appearance,
      bookTitle:  order.bookTitle,
      bookId:     order.bookId,
    })

    // ── 4. Upload to cloud storage (if configured) ────────────────────────────
    if (storage.isConfigured()) {
      try {
        const s3Key = await storage.uploadPDF(orderId, outPath)
        await cartStore.setPdfKey(orderId, s3Key)

        // Clean up the local temp file — the bucket is now the source of truth
        await fs.unlink(outPath).catch(() => { /* best-effort */ })
      } catch (uploadErr) {
        // Non-fatal: log and continue — the local file is still there as fallback
        console.error('[pdf.service] S3 upload failed, keeping local file:', uploadErr)
      }
    }

    // ── 5. Mark fulfilled ─────────────────────────────────────────────────────
    await cartStore.updateStatus(orderId, 'fulfilled')

    // ── 6. Send "book is ready" email (non-fatal, fire-and-forget) ────────────
    if (order.customerEmail) {
      emailService.sendBookReady({
        to:        order.customerEmail,
        childName: order.childName,
        bookTitle: order.bookTitle,
        orderId,
      }).catch(err => console.error('[pdf.service] Book-ready email failed:', err))
    }

    return {
      success:     true,
      downloadUrl: `/api/download/${orderId}`,
      filePath:    outPath,
      cached:      false,
    }
  } catch (err) {
    console.error('[pdf.service] Generation failed:', err)
    await cartStore.updateStatus(orderId, 'failed')
    return {
      success: false,
      error:   err instanceof Error ? err.message : 'PDF generation failed. Please try again.',
    }
  }
}

// ── Production dispatch ───────────────────────────────────────────────────────

/**
 * Dispatch PDF generation for an order.
 *
 * • In development (no PDF_SERVICE_URL): calls generateBookPDF() directly.
 * • In production: fires a fire-and-forget HTTP POST to the Fly.io PDF
 *   microservice.  The microservice handles Puppeteer + S3 upload and
 *   calls back to /api/orders/[orderId]/fulfill when done.
 *
 * Either way the caller (the Stripe webhook) can return 200 to Stripe
 * immediately — this function never awaits the full PDF generation.
 */
export function dispatchPDFJob(orderId: string): void {
  if (process.env.PDF_SERVICE_URL) {
    dispatchToMicroservice(orderId).catch(err =>
      console.error('[pdf.service] Microservice dispatch failed:', err)
    )
  } else {
    // Local dev: run in-process, fire-and-forget
    generateBookPDF(orderId).catch(err =>
      console.error('[pdf.service] Local generation failed:', err)
    )
  }
}

async function dispatchToMicroservice(orderId: string): Promise<void> {
  const order = await cartStore.get(orderId)
  if (!order) {
    console.error(`[pdf.service] dispatchToMicroservice: order ${orderId} not found`)
    return
  }

  await cartStore.updateStatus(orderId, 'generating')

  const callbackUrl = `${process.env.NEXT_APP_URL}/api/orders/${orderId}/fulfill`

  const res = await fetch(`${process.env.PDF_SERVICE_URL}/generate`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.PDF_SERVICE_SECRET}`,
    },
    body: JSON.stringify({
      orderId,
      childName:   order.childName,
      appearance:  order.appearance,
      bookTitle:   order.bookTitle,
      bookId:      order.bookId,
      callbackUrl,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error(
      `[pdf.service] PDF service returned ${res.status}: ${body}`
    )
    await cartStore.updateStatus(orderId, 'failed')
  } else {
    console.log(`[pdf.service] ✓ Job dispatched to PDF service for order ${orderId}`)
  }
}
