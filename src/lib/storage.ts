/**
 * Cloud object storage — backed by a Cloudflare R2 bucket via a
 * lightweight Cloudflare Worker proxy (cloudflare-worker/).
 *
 * Configuration (env vars, see .env.local.example):
 *   STORAGE_WORKER_URL    — full URL of the deployed R2 proxy Worker
 *                           e.g. https://storyweave-r2.tariq-storyweave.workers.dev
 *   STORAGE_WORKER_SECRET — shared secret (must match AUTH_SECRET set on the Worker)
 *
 * Graceful degradation:
 *   When env vars are absent (local dev without a Worker), `isConfigured()`
 *   returns false and callers fall back to serving PDFs from /tmp.
 *
 * Download:
 *   Instead of pre-signed S3 URLs, the /api/download route fetches the file
 *   from the Worker (server-side) and streams it to the browser — no S3
 *   credentials or signed-URL machinery needed.
 */

import fs from 'fs/promises'

const WORKER_URL    = process.env.STORAGE_WORKER_URL?.replace(/\/$/, '')
const WORKER_SECRET = process.env.STORAGE_WORKER_SECRET

/** Sanitise a string for use in a Content-Disposition filename */
function safeFilename(str: string): string {
  return str.replace(/[^a-zA-Z0-9\-_ ]/g, '').trim()
}

// ── Public API ────────────────────────────────────────────────────────────────

export const storage = {

  /**
   * Returns true when all required environment variables are present.
   * Use this to gate upload/download logic so the app works in dev without a Worker.
   */
  isConfigured(): boolean {
    return Boolean(WORKER_URL && WORKER_SECRET)
  },

  /**
   * Upload a generated PDF to R2 via the Worker.
   *
   * Object key format: `fulfilled/{orderId}/storybook.pdf`
   *
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
   *
   * @param key       Object key returned by uploadPDF()
   * @param bookTitle Used to build the Content-Disposition filename
   * @param childName Used to build the Content-Disposition filename
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

    // Return a new Response that adds the Content-Disposition header
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
