/**
 * StoryWeave PDF Generation Microservice
 *
 * Runs Puppeteer inside a persistent Docker container on Render.
 * The Next.js app cannot run Puppeteer directly (serverless bundle limits),
 * so it delegates to this service via HTTP after payment is confirmed.
 *
 * Endpoints:
 *   POST /generate  — kick off PDF generation (responds 202 immediately;
 *                     result is delivered via the callbackUrl in the body)
 *   GET  /health    — load-balancer health check
 *
 * Security:
 *   Every request must carry  Authorization: Bearer <PDF_SERVICE_SECRET>
 *   The same secret is set in both the Next.js env and this service's env.
 *
 * Flow:
 *   1. Next.js webhook fires POST /generate (fire-and-forget)
 *   2. This service generates the PDF with Puppeteer (5 AI illustrations + render)
 *   3. Progress updates are POSTed back to progressUrl during generation
 *   4. Uploads the PDF to S3 / R2
 *   5. POSTs the final result back to callbackUrl (Next.js /api/orders/[id]/fulfill)
 *   6. Next.js marks the order fulfilled and sends the "book ready" email
 */

import express, { type Request, type Response, type NextFunction } from 'express'
import fs from 'fs/promises'

// Relative imports from the parent src/ directory.
// The Dockerfile copies src/ alongside pdf-service/ so these paths resolve.
import { runPDFJob, type PDFJobInput } from '../src/workers/pdf.worker'
import { storage }                     from '../src/lib/storage'
import type { CharacterAppearance }    from '../src/lib/types'

// ── Bootstrap ─────────────────────────────────────────────────────────────────

const app    = express()
const PORT   = Number(process.env.PORT ?? 8080)
const SECRET = process.env.PDF_SERVICE_SECRET

app.use(express.json())

// ── Auth middleware ───────────────────────────────────────────────────────────

function requireSecret(req: Request, res: Response, next: NextFunction) {
  if (!SECRET) {
    console.error('[pdf-service] PDF_SERVICE_SECRET is not set — rejecting all requests')
    res.status(500).json({ error: 'Service misconfigured.' })
    return
  }
  const auth = req.headers.authorization
  if (auth !== `Bearer ${SECRET}`) {
    res.status(401).json({ error: 'Unauthorized.' })
    return
  }
  next()
}

// ── POST /generate ────────────────────────────────────────────────────────────

interface GenerateBody {
  orderId:      string
  childName:    string
  appearance:   CharacterAppearance
  bookTitle:    string
  bookId?:      string
  callbackUrl:  string   // Next.js /api/orders/[orderId]/fulfill
  progressUrl?: string   // Next.js /api/orders/[orderId]/progress  (optional)
}

app.post('/generate', requireSecret, (req: Request, res: Response) => {
  const body = req.body as GenerateBody
  const { orderId, childName, appearance, bookTitle, bookId, callbackUrl, progressUrl } = body

  if (!orderId || !childName || !appearance || !callbackUrl) {
    res.status(400).json({ error: 'Missing required fields.' })
    return
  }

  // Acknowledge immediately — Puppeteer work happens in the background
  res.status(202).json({ received: true, orderId })

  // Run generation asynchronously (no await here)
  processJob({ orderId, childName, appearance, bookTitle, bookId }, callbackUrl, progressUrl)
    .catch(err => console.error(`[pdf-service] Unexpected error for order ${orderId}:`, err))
})

// ── Job processor ─────────────────────────────────────────────────────────────

async function processJob(
  input:        PDFJobInput,
  callbackUrl:  string,
  progressUrl?: string,
) {
  const { orderId } = input
  console.log(`[pdf-service] Starting job for order ${orderId}`)

  // Build an onProgress callback that POSTs updates to the Next.js progress endpoint
  const onProgress = progressUrl
    ? async (msg: string) => { await sendProgress(progressUrl, msg) }
    : undefined

  let filePath: string | null = null
  let s3Key:    string | null = null

  try {
    // 1. Generate PDF with Puppeteer (includes AI illustration calls)
    filePath = await runPDFJob({ ...input, onProgress })
    console.log(`[pdf-service] ✓ PDF generated for order ${orderId}`)

    // 2. Upload to S3 / R2 if configured
    if (storage.isConfigured()) {
      s3Key = await storage.uploadPDF(orderId, filePath)
      console.log(`[pdf-service] ✓ Uploaded to S3: ${s3Key}`)

      // Clean up local temp file — bucket is now the source of truth
      await fs.unlink(filePath).catch(() => {})
      filePath = null
    }

    // 3. Callback: notify Next.js that the job succeeded
    await sendCallback(callbackUrl, { success: true, s3Key })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[pdf-service] ✗ Job failed for order ${orderId}:`, message)

    // Clean up temp file on failure too
    if (filePath) await fs.unlink(filePath).catch(() => {})

    // Callback: notify Next.js of failure so it can mark the order failed
    await sendCallback(callbackUrl, { success: false, error: message })
  }
}

// ── Callback helper ───────────────────────────────────────────────────────────

interface CallbackPayload {
  success: boolean
  s3Key?:  string | null
  error?:  string
}

async function sendCallback(url: string, payload: CallbackPayload) {
  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${SECRET}`,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      console.error(`[pdf-service] Callback ${url} returned ${res.status}`)
    } else {
      console.log(`[pdf-service] ✓ Callback delivered to ${url}`)
    }
  } catch (err) {
    console.error(`[pdf-service] Failed to reach callback ${url}:`, err)
  }
}

// ── Progress helper ───────────────────────────────────────────────────────────

async function sendProgress(url: string, message: string) {
  try {
    await fetch(url, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${SECRET}`,
      },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(5_000),
    })
  } catch {
    // Non-fatal — progress updates are best-effort
  }
}

// ── GET /health ───────────────────────────────────────────────────────────────

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'storyweave-pdf-service' })
})

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[pdf-service] Listening on :${PORT}`)
  console.log(`[pdf-service] Secret configured: ${Boolean(SECRET)}`)
  console.log(`[pdf-service] Storage configured: ${storage.isConfigured()}`)
})
