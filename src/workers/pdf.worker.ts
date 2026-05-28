/**
 * PDF Worker — Puppeteer-based renderer.
 *
 * Generates a personalised PDF for a given order:
 *   1. Cover portrait  (512×768)  via generateCharacterImage()
 *   2. Story-page scenes (384×640) via generateSceneImage() — one per story page
 *   3. Builds the full multi-page HTML with per-page scene illustrations
 *   4. Prints to PDF via Puppeteer/Chromium
 *
 * onProgress (optional): async callback invoked after each major step so the
 * caller can relay live updates to the frontend.
 */

import puppeteer from 'puppeteer'
import fs        from 'fs/promises'
import path      from 'path'
import os        from 'os'

import { buildBookHTML }           from '../lib/pdf/page-template'
import type { AppearanceInput }    from '../lib/pdf/character-svg-string'
import { generateCharacterImage, generateSceneImage } from '../lib/ai-character'
import { getStoryPages }           from '../lib/story-templates'

// ── Output directory ──────────────────────────────────────────────────────────
export const PDF_TMP_DIR = path.join(os.tmpdir(), 'storybooks')

// ── Job descriptor ────────────────────────────────────────────────────────────
export interface PDFJobInput {
  orderId:    string
  childName:  string
  appearance: AppearanceInput
  bookTitle?: string
  bookId?:    string
  /** Optional progress callback — called after each illustration is generated. */
  onProgress?: (msg: string) => Promise<void>
}

// ── Core renderer ─────────────────────────────────────────────────────────────
/**
 * Generates a personalized PDF for the given job and writes it to disk.
 * @returns Absolute path to the generated PDF file.
 */
export async function runPDFJob(input: PDFJobInput): Promise<string> {
  const { orderId, childName, appearance, bookTitle, bookId = 'enchanted-forest', onProgress } = input

  const report = async (msg: string) => {
    console.log(`[pdf.worker] ${msg}`)
    if (onProgress) {
      await onProgress(msg).catch(err =>
        console.warn('[pdf.worker] progress callback failed:', err)
      )
    }
  }

  // Ensure output directory exists
  await fs.mkdir(PDF_TMP_DIR, { recursive: true })
  const outputPath = path.join(PDF_TMP_DIR, `${orderId}.pdf`)

  // ── 1. Cover portrait ──────────────────────────────────────────────────────
  await report(`✨ Painting ${childName}'s cover portrait…`)
  const coverImageUrl = await generateCharacterImage(appearance) ?? undefined

  // ── 2. Story page scene illustrations ─────────────────────────────────────
  const storyPages    = getStoryPages(bookId)
  const pageImageUrls: (string | undefined)[] = []

  for (let i = 0; i < storyPages.length; i++) {
    const page = storyPages[i]
    const label = page.sceneLabel ?? `page ${i + 1}`

    await report(`🎨 Illustrating page ${i + 1} of ${storyPages.length} — ${label}…`)

    if (page.scene) {
      const img = await generateSceneImage(appearance, childName, page.scene)
      pageImageUrls.push(img ?? undefined)
    } else {
      // No scene defined — fall back to SVG for this page
      pageImageUrls.push(undefined)
    }
  }

  // ── 3. Build HTML ──────────────────────────────────────────────────────────
  await report(`📖 Rendering your storybook PDF…`)

  const html = buildBookHTML({
    childName,
    appearance,
    bookTitle,
    bookId,
    coverImageUrl,
    pageImageUrls,
  })

  // ── 4. Puppeteer print ─────────────────────────────────────────────────────
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
    ],
  })

  try {
    const tab = await browser.newPage()

    // Match A4 width at 96 dpi so layout calculations are correct
    await tab.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 })

    // Load HTML — waitUntil:'networkidle0' ensures Google Fonts are downloaded
    await tab.setContent(html, { waitUntil: 'networkidle0', timeout: 30_000 })

    // Print to PDF — preferCSSPageSize honours @page { size: A4; margin: 0 }
    await tab.pdf({
      path:              outputPath,
      printBackground:   true,
      preferCSSPageSize: true,
    })

    console.log(`[pdf.worker] ✓ PDF generated — ${outputPath}`)
    return outputPath
  } finally {
    await browser.close()
  }
}
