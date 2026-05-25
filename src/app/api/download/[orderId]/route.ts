/**
 * GET /api/download/[orderId]
 *
 * Serves the generated PDF to the browser.
 *
 * Strategy (tried in order):
 *   1. Cloud storage (S3 / R2) — if the order has a pdfS3Key and the storage
 *      env vars are present, generate a 5-minute pre-signed URL and 302
 *      redirect.  The file is served straight from the bucket; our server is
 *      never on the download hot path.
 *   2. Local /tmp fallback — for development without a bucket configured, or
 *      as a safety net if the upload failed (the local file is kept in that
 *      case).  The buffer is streamed directly.
 *
 * Response 302: redirect to pre-signed S3 URL          (production)
 * Response 200: application/pdf binary stream           (local fallback)
 * Response 404: { error: string }
 * Response 409: { error: string }                       (not yet fulfilled)
 */

import { NextResponse } from 'next/server'
import fs   from 'fs/promises'
import path from 'path'

import { cartStore }   from '@/lib/cart-store'
import { storage }     from '@/lib/storage'
import { PDF_TMP_DIR } from '@/workers/pdf.worker'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params

  // Verify the order exists (prevents arbitrary file-path probing)
  const order = await cartStore.get(orderId)
  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
  }

  if (order.status !== 'fulfilled') {
    return NextResponse.json(
      { error: 'PDF is not ready yet. Please generate it first.' },
      { status: 409 }
    )
  }

  // ── Strategy 1: cloud storage signed URL ───────────────────────────────────
  if (order.pdfS3Key && storage.isConfigured()) {
    try {
      const signedUrl = await storage.getSignedDownloadUrl(
        order.pdfS3Key,
        order.bookTitle,
        order.childName,
      )
      // 302 redirect — browser follows it and downloads straight from the bucket
      return NextResponse.redirect(signedUrl, { status: 302 })
    } catch (err) {
      console.error('[download] Failed to generate signed URL, falling back to /tmp:', err)
      // Fall through to local fallback below
    }
  }

  // ── Strategy 2: local /tmp fallback ────────────────────────────────────────
  const filePath = path.join(PDF_TMP_DIR, `${orderId}.pdf`)

  try {
    const buffer = await fs.readFile(filePath)

    const safeName  = order.childName.replace(/[^a-zA-Z0-9\-_ ]/g, '').trim() || 'child'
    const safeTitle = order.bookTitle.replace(/[^a-zA-Z0-9\-_ ]/g, '').trim()
    const filename  = `${safeTitle}-starring-${safeName}.pdf`

    return new Response(buffer, {
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length':      buffer.byteLength.toString(),
        'Cache-Control':       'no-store',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'PDF file not found. Please regenerate.' },
      { status: 404 }
    )
  }
}
