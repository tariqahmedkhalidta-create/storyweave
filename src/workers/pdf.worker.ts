/**
 * PDF Worker — Puppeteer-based renderer.
 *
 * Takes a job descriptor, builds the full-book HTML, launches a headless
 * Chrome instance, prints to PDF, and writes the file to the local tmp dir.
 *
 * In production this function body would be wrapped in a BullMQ job processor:
 *
 *   const worker = new Worker('pdf-generation', async (job) => {
 *     return runPDFJob(job.data)
 *   }, { connection: redis })
 *
 * For local testing we call it directly from pdf.service.ts.
 *
 * Prerequisites:
 *   npm install puppeteer
 *   (Puppeteer downloads Chromium automatically on first install)
 */

import puppeteer from 'puppeteer'
import fs        from 'fs/promises'
import path      from 'path'
import os        from 'os'

import { buildBookHTML } from '../lib/pdf/page-template'
import type { AppearanceInput } from '../lib/pdf/character-svg-string'
import { generateCharacterImage } from '../lib/ai-character'

// ── Output directory ──────────────────────────────────────────────────────────
// Using os.tmpdir() so this works on macOS, Linux, and Windows.
export const PDF_TMP_DIR = path.join(os.tmpdir(), 'storybooks')

// ── Job descriptor ────────────────────────────────────────────────────────────
export interface PDFJobInput {
  orderId:   string
  childName: string
  appearance: AppearanceInput
  bookTitle?: string
  bookId?:    string
}

// ── Core renderer ─────────────────────────────────────────────────────────────
/**
 * Generates a personalized PDF for the given job and writes it to disk.
 * @returns Absolute path to the generated PDF file.
 */
export async function runPDFJob(input: PDFJobInput): Promise<string> {
  const { orderId, childName, appearance, bookTitle, bookId } = input

  // Ensure output directory exists
  await fs.mkdir(PDF_TMP_DIR, { recursive: true })
  const outputPath = path.join(PDF_TMP_DIR, `${orderId}.pdf`)

  // Generate AI character illustration (falls back gracefully to SVG if unavailable)
  console.log('[pdf.worker] Generating AI character illustration…')
  const characterImageUrl = await generateCharacterImage(appearance) ?? undefined

  // Build the full multi-page HTML document
  const html = buildBookHTML({ childName, appearance, bookTitle, bookId, characterImageUrl })

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none', // crisper text rendering in PDFs
    ],
  })

  try {
    const tab = await browser.newPage()

    // Match A4 width at 96 dpi so layout calculations are correct
    await tab.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 })

    // Load HTML — waitUntil:'networkidle0' ensures Google Fonts are downloaded
    await tab.setContent(html, { waitUntil: 'networkidle0', timeout: 30_000 })

    // Print to PDF
    // preferCSSPageSize:true honours our @page { size: A4; margin: 0 } rule
    await tab.pdf({
      path:               outputPath,
      printBackground:    true,
      preferCSSPageSize:  true,
    })

    console.log(`[pdf.worker] ✓ Generated ${outputPath}`)
    return outputPath
  } finally {
    await browser.close()
  }
}
