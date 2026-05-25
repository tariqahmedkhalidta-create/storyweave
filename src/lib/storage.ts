/**
 * Cloud object storage — AWS S3 and Cloudflare R2 compatible.
 *
 * Uses the AWS SDK v3 (which R2 supports via its S3-compatible API).
 *
 * Configuration (all via env vars, see .env.local.example):
 *   STORAGE_BUCKET            — bucket name (required)
 *   STORAGE_ACCESS_KEY_ID     — access key (required)
 *   STORAGE_SECRET_ACCESS_KEY — secret key (required)
 *   STORAGE_REGION            — AWS region; use "auto" for R2 (default: auto)
 *   STORAGE_ENDPOINT          — custom endpoint URL; required for R2,
 *                               leave unset for standard AWS S3
 *
 * Graceful degradation:
 *   When env vars are absent (local dev without a bucket), `isConfigured()`
 *   returns false and callers fall back to serving PDFs from /tmp.
 *   This means the app works fully in development without any cloud account.
 *
 * Download security:
 *   Buckets should be PRIVATE (no public-read ACL).
 *   Downloads are served via short-lived pre-signed URLs (default: 5 min).
 *   The actual S3 URL is never exposed to the client — our /api/download
 *   route generates a fresh signed URL and issues a 302 redirect.
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fs from 'fs/promises'

// ── Lazy singleton ────────────────────────────────────────────────────────────

let _client: S3Client | null = null

function getClient(): S3Client {
  if (_client) return _client

  _client = new S3Client({
    region:   process.env.STORAGE_REGION ?? 'auto',
    // endpoint is required for R2 and optional for S3
    ...(process.env.STORAGE_ENDPOINT
      ? { endpoint: process.env.STORAGE_ENDPOINT }
      : {}),
    credentials: {
      accessKeyId:     process.env.STORAGE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
    },
  })

  return _client
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Sanitise a string for use in a Content-Disposition filename */
function safeFilename(str: string): string {
  return str.replace(/[^a-zA-Z0-9\-_ ]/g, '').trim()
}

// ── Public API ────────────────────────────────────────────────────────────────

export const storage = {

  /**
   * Returns true when all required environment variables are present.
   * Use this to gate upload/download logic so the app works in dev without a bucket.
   */
  isConfigured(): boolean {
    return Boolean(
      process.env.STORAGE_BUCKET &&
      process.env.STORAGE_ACCESS_KEY_ID &&
      process.env.STORAGE_SECRET_ACCESS_KEY
    )
  },

  /**
   * Upload a generated PDF to the bucket.
   *
   * Object key format: `fulfilled/{orderId}/storybook.pdf`
   * This namespace keeps all book PDFs under a single prefix, making it
   * easy to apply lifecycle rules (e.g. delete after 30 days).
   *
   * @returns The object key — store this in the `pdfS3Key` DB column.
   */
  async uploadPDF(orderId: string, localFilePath: string): Promise<string> {
    const key    = `fulfilled/${orderId}/storybook.pdf`
    const buffer = await fs.readFile(localFilePath)

    await getClient().send(
      new PutObjectCommand({
        Bucket:      process.env.STORAGE_BUCKET!,
        Key:         key,
        Body:        buffer,
        ContentType: 'application/pdf',
        // No ACL = bucket default (should be private)
      })
    )

    console.log(`[storage] ✓ Uploaded ${key} (${buffer.byteLength} bytes)`)
    return key
  },

  /**
   * Generate a time-limited pre-signed GET URL for a stored PDF.
   *
   * The signed URL is passed directly to the browser as a 302 redirect,
   * so the browser downloads straight from the bucket — our server is
   * never on the download hot path.
   *
   * ResponseContentDisposition sets the save-as filename so the browser
   * doesn't save it as the S3 key path.
   *
   * @param key              Object key returned by uploadPDF()
   * @param bookTitle        Used to build the download filename
   * @param childName        Used to build the download filename
   * @param expiresInSeconds URL validity window (default 5 min)
   */
  async getSignedDownloadUrl(
    key:              string,
    bookTitle:        string,
    childName:        string,
    expiresInSeconds: number = 300
  ): Promise<string> {
    const filename = `${safeFilename(bookTitle)}-starring-${safeFilename(childName) || 'child'}.pdf`

    const command = new GetObjectCommand({
      Bucket:                     process.env.STORAGE_BUCKET!,
      Key:                        key,
      ResponseContentType:        'application/pdf',
      ResponseContentDisposition: `attachment; filename="${filename}"`,
    })

    return getSignedUrl(getClient(), command, { expiresIn: expiresInSeconds })
  },
}
