/**
 * Cloud object storage — backed by a Cloudflare R2 bucket via a
 * lightweight Cloudflare Worker proxy (cloudflare-worker/).
 *
 * The Worker URL is hardcoded as a default so no extra env var is required
 * on services that already have PDF_SERVICE_SECRET configured (e.g. Render).
 *
 * Configuration (env vars):
 *   STORAGE_WORKER_URL    — Worker URL (default: https://storyweave-r2.tariq-storyweave.workers.dev)
 *   STORAGE_WORKER_SECRET — Auth secret for the Worker.
 *                           Falls back to PDF_SERVICE_SECRET so Render needs no extra config.
 *
 * Graceful degradation:
 *   When no secret is available, `isConfigured()` returns false and callers
 *   fall back to serving PDFs from /tmp.
 */

import fs from 'fs/promises'

// Worker URL is public (not a secret) — hardcode the default so Render needs no extra env var
const WORKER_URL =
  (process.env.STORAGE_WORKER_URL ?? 'https://storyweave-r2.tariq-storyweave.workers.dev')
    .replace(/\/$/, '')

// Auth secret: prefer explicit STORAGE_WORKER_SECRET, fall back to PDF_SERVICE_SECRET
// Both Vercel and Render already have PDF_SERVICE_SECRET configured
const WORKER_SECRET =
  process.env.STORAGE_WORKER_SECRET ?? process.env.PDF_SERVICE_SECRET

/** Sanitise a string for use in a Content-Disposition filename */
function safeFilename(str: string): string {
  return str.replace(/[^a-zA-Z0-9\-_ ]/g, '').trim()
}

// ── Public API ────────────────────────────────────────────────────────────────

export const storage = {

  /**
   * Returns true when the Worker secret is available.
   * The URL is always known (hardcoded default), so only the secret gates this.
   */
  isConfigured(): boolean {
    return Boolean(WORKER_SECRET)
  },

  /**
   * Upload a generated PDF to R2 via the Worker.
   * @returns The object key — store this in the `pdfS3Key` DB column.
   */
  async uploadPDF(orderId: string, localFilePath: string): Promise<string> {
    const key    = `fulfilled/${orderId}/storybook.pdf`
    const buffer = await fs.readFile(localFilePath)

    const res = await fetch(`${WORKER_URL}/${key}`, {
      method:  'PUT',
      headers: {
        'Authorization': `Bearer ${WORKER_SECRET}`,
        'Content-Type':  'application/pdf',
      },
      body: buffer,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`[storage] Upload failed (${res.status}): ${text}`)
    }

    console.log(`[storage] ✓ Uploaded ${key} (${buffer.byteLength} bytes)`)
    return key
  },

  /**
   * Fetch a stored PDF from R2 and return the raw Response so the caller
   * can stream it straight to the browser.
   */
  async getDownloadResponse(
    key:       string,
    bookTitle: string,
    childName: string,
  ): Promise<Response> {
    const res = await fetch(`${WORKER_URL}/${key}`, {
      headers: { 'Authorization': `Bearer ${WORKER_SECRET}` },
    })

    if (!res.ok) {
      throw new Error(`[storage] Download failed (${res.status}): ${await res.text()}`)
    }

    const filename = `${safeFilename(bookTitle)}-starring-${safeFilename(childName) || 'child'}.pdf`

    return new Response(res.body, {
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control':       'no-store',
        ...(res.headers.get('Content-Length')
          ? { 'Content-Length': res.headers.get('Content-Length')! }
          : {}),
      },
    })
  },
}
