/**
 * Builds the complete multi-page HTML document that Puppeteer will print to PDF.
 *
 * Layout:
 *  - Page 1 : full-bleed cover (gradient + character portrait)
 *  - Pages 2…N: full-bleed scene illustration with text overlay at the bottom.
 *               If no AI scene is available the page falls back to a gradient
 *               background + SVG character (same as before).
 *
 * Fonts are pulled from Google Fonts (requires network on the rendering machine).
 * Puppeteer waits for networkidle0 so fonts are loaded before printing.
 */

import { characterSVGString, type AppearanceInput } from './character-svg-string'
import { getStoryPages } from '../story-templates'

// ── Name highlighting (replaces {{NAME}} with a <mark>) ───────────────────────
function injectName(text: string, name: string): string {
  return text.replace(
    /\{\{NAME\}\}/g,
    `<mark class="nm">${name}</mark>`
  )
}

// ── Gradient fallback map for pages without a scene image ─────────────────────
// Tailwind class → CSS value. Every gradient key used in story-templates.ts
// needs an entry here (or the fallback colour is used instead).
const GRADIENT_CSS: Record<string, string> = {
  'from-emerald-50 to-teal-100':   'linear-gradient(155deg,#ecfdf5 0%,#ccfbf1 100%)',
  'from-teal-50 to-emerald-100':   'linear-gradient(155deg,#f0fdfa 0%,#d1fae5 100%)',
  'from-emerald-50 to-green-100':  'linear-gradient(155deg,#ecfdf5 0%,#dcfce7 100%)',
  'from-amber-50 to-yellow-100':   'linear-gradient(155deg,#fffbeb 0%,#fef9c3 100%)',
  'from-yellow-50 to-amber-100':   'linear-gradient(155deg,#fefce8 0%,#fef3c7 100%)',
  'from-violet-50 to-purple-100':  'linear-gradient(155deg,#f5f3ff 0%,#ede9fe 100%)',
  'from-violet-50 to-indigo-100':  'linear-gradient(155deg,#f5f3ff 0%,#e0e7ff 100%)',
  'from-violet-50 to-blue-100':    'linear-gradient(155deg,#f5f3ff 0%,#dbeafe 100%)',
  'from-indigo-50 to-blue-100':    'linear-gradient(155deg,#eef2ff 0%,#dbeafe 100%)',
  'from-indigo-50 to-violet-100':  'linear-gradient(155deg,#eef2ff 0%,#ede9fe 100%)',
  'from-sky-50 to-blue-100':       'linear-gradient(155deg,#f0f9ff 0%,#dbeafe 100%)',
  'from-sky-50 to-cyan-100':       'linear-gradient(155deg,#f0f9ff 0%,#cffafe 100%)',
  'from-sky-50 to-indigo-100':     'linear-gradient(155deg,#f0f9ff 0%,#e0e7ff 100%)',
  'from-sky-50 to-teal-100':       'linear-gradient(155deg,#f0f9ff 0%,#ccfbf1 100%)',
  'from-blue-50 to-indigo-100':    'linear-gradient(155deg,#eff6ff 0%,#e0e7ff 100%)',
  'from-blue-50 to-sky-100':       'linear-gradient(155deg,#eff6ff 0%,#e0f2fe 100%)',
  'from-blue-50 to-teal-100':      'linear-gradient(155deg,#eff6ff 0%,#ccfbf1 100%)',
  'from-blue-50 to-cyan-100':      'linear-gradient(155deg,#eff6ff 0%,#cffafe 100%)',
  'from-teal-50 to-cyan-100':      'linear-gradient(155deg,#f0fdfa 0%,#cffafe 100%)',
  'from-teal-50 to-sky-100':       'linear-gradient(155deg,#f0fdfa 0%,#e0f2fe 100%)',
  'from-teal-50 to-green-100':     'linear-gradient(155deg,#f0fdfa 0%,#dcfce7 100%)',
  'from-cyan-50 to-teal-100':      'linear-gradient(155deg,#ecfeff 0%,#ccfbf1 100%)',
  'from-cyan-50 to-sky-100':       'linear-gradient(155deg,#ecfeff 0%,#e0f2fe 100%)',
  'from-cyan-50 to-blue-100':      'linear-gradient(155deg,#ecfeff 0%,#dbeafe 100%)',
  'from-red-50 to-rose-100':       'linear-gradient(155deg,#fef2f2 0%,#ffe4e6 100%)',
  'from-red-50 to-orange-100':     'linear-gradient(155deg,#fef2f2 0%,#ffedd5 100%)',
  'from-red-50 to-amber-100':      'linear-gradient(155deg,#fef2f2 0%,#fef3c7 100%)',
  'from-rose-50 to-orange-100':    'linear-gradient(155deg,#fff1f2 0%,#ffedd5 100%)',
  'from-rose-50 to-red-100':       'linear-gradient(155deg,#fff1f2 0%,#fee2e2 100%)',
  'from-orange-50 to-amber-100':   'linear-gradient(155deg,#fff7ed 0%,#fef3c7 100%)',
  'from-orange-50 to-red-100':     'linear-gradient(155deg,#fff7ed 0%,#fee2e2 100%)',
  'from-amber-50 to-red-100':      'linear-gradient(155deg,#fffbeb 0%,#fee2e2 100%)',
  'from-amber-50 to-orange-100':   'linear-gradient(155deg,#fffbeb 0%,#ffedd5 100%)',
  'from-lime-50 to-green-100':     'linear-gradient(155deg,#f7fee7 0%,#dcfce7 100%)',
  'from-lime-50 to-yellow-100':    'linear-gradient(155deg,#f7fee7 0%,#fef9c3 100%)',
  'from-green-50 to-lime-100':     'linear-gradient(155deg,#f0fdf4 0%,#ecfccb 100%)',
  'from-yellow-50 to-orange-100':  'linear-gradient(155deg,#fefce8 0%,#ffedd5 100%)',
  'from-purple-50 to-indigo-100':  'linear-gradient(155deg,#faf5ff 0%,#e0e7ff 100%)',
  'from-purple-50 to-violet-100':  'linear-gradient(155deg,#faf5ff 0%,#ede9fe 100%)',
  'from-purple-50 to-fuchsia-100': 'linear-gradient(155deg,#faf5ff 0%,#fae8ff 100%)',
  'from-fuchsia-50 to-purple-100': 'linear-gradient(155deg,#fdf4ff 0%,#ede9fe 100%)',
  'from-fuchsia-50 to-violet-100': 'linear-gradient(155deg,#fdf4ff 0%,#ede9fe 100%)',
  'from-violet-50 to-fuchsia-100': 'linear-gradient(155deg,#f5f3ff 0%,#fae8ff 100%)',
  'from-pink-50 to-fuchsia-100':   'linear-gradient(155deg,#fdf2f8 0%,#fae8ff 100%)',
  'from-emerald-50 to-cyan-100':   'linear-gradient(155deg,#ecfdf5 0%,#cffafe 100%)',
}
const FALLBACK_GRADIENT = 'linear-gradient(155deg,#f8fafc 0%,#e2e8f0 100%)'

// ── HTML builder ─────────────────────────────────────────────────────────────

export interface BookData {
  childName:          string
  appearance:         AppearanceInput
  bookTitle?:         string
  bookId?:            string
  /** AI portrait for the cover page (512×768 data-URL) */
  coverImageUrl?:     string
  /** AI scene illustrations per story page — index 0 = page 1, etc. (data-URLs) */
  pageImageUrls?:     (string | null | undefined)[]
  /** @deprecated Use coverImageUrl instead */
  characterImageUrl?: string
}

export function buildBookHTML({
  childName,
  appearance,
  bookTitle = 'The Enchanted Forest',
  bookId    = 'enchanted-forest',
  coverImageUrl,
  pageImageUrls,
  characterImageUrl,
}: BookData): string {
  // Support legacy callers that still pass characterImageUrl
  const effectiveCoverUrl = coverImageUrl ?? characterImageUrl

  // Cover character visual
  const coverChar = effectiveCoverUrl
    ? `<img src="${effectiveCoverUrl}" width="200" height="280"
         style="object-fit:contain;object-position:bottom;filter:drop-shadow(0 12px 32px rgba(0,0,0,0.5))"
         alt="${childName}"/>`
    : characterSVGString(appearance, childName, { width: 200, height: 280 })

  // SVG fallback for story pages (used when no scene image available)
  const pageSVGFallback = characterSVGString(appearance, childName, { width: 160, height: 224 })

  const storyPages = getStoryPages(bookId).map((p, i) => {
    const bg       = GRADIENT_CSS[p.gradient ?? ''] ?? FALLBACK_GRADIENT
    const sceneUrl = pageImageUrls?.[i]

    if (sceneUrl) {
      // ── Full-bleed scene illustration ──────────────────────────────────────
      return `
      <div class="page">
        <img class="full-scene" src="${sceneUrl}" alt="Story illustration — page ${p.pageNumber}"/>

        <!-- Bottom text overlay -->
        <div class="overlay">
          <div class="overlay-inner">
            <p class="story-text">${injectName(p.text, childName)}</p>
            <div class="pg-bar">
              <span class="pg-book">${bookTitle}</span>
              <span class="pg-num">Page ${p.pageNumber}</span>
            </div>
          </div>
        </div>
      </div>`
    } else {
      // ── Fallback: gradient background + centred SVG + bottom text ─────────
      return `
      <div class="page fallback-page" style="background:${bg}">
        <div class="fallback-char">
          <span class="deco" style="top:6%;left:8%">✦</span>
          <span class="deco" style="top:12%;right:9%">✦</span>
          ${pageSVGFallback}
        </div>

        <!-- Bottom text overlay -->
        <div class="overlay fallback-overlay">
          <div class="overlay-inner">
            <p class="story-text story-text--dark">${injectName(p.text, childName)}</p>
            <div class="pg-bar pg-bar--dark">
              <span class="pg-book">${bookTitle}</span>
              <span class="pg-num">Page ${p.pageNumber}</span>
            </div>
          </div>
        </div>
      </div>`
    }
  }).join('\n')

  return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${bookTitle} — starring ${childName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    /* ── Reset ───────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @page { size: A4; margin: 0; }

    body {
      font-family: 'Nunito', system-ui, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Page shell ──────────────────────────────────────── */
    .page {
      width:            210mm;
      height:           297mm;
      overflow:         hidden;
      position:         relative;
      page-break-after: always;
    }
    .page:last-child { page-break-after: avoid; }

    /* ── Cover ───────────────────────────────────────────── */
    .cover {
      background: linear-gradient(160deg, #3b0764 0%, #4c1d95 30%, #5b21b6 65%, #1e1b4b 100%);
      display:         flex;
      flex-direction:  column;
      align-items:     center;
      justify-content: center;
      color:           white;
    }
    .cover-star {
      position:    absolute;
      font-size:   28px;
      color:       white;
      opacity:     0.12;
      user-select: none;
    }
    .cover-content {
      display:        flex;
      flex-direction: column;
      align-items:    center;
      gap:            12px;
      position:       relative;
      z-index:        1;
      padding:        0 40px;
      text-align:     center;
    }
    .cover-eyebrow {
      font-size:      10px;
      font-weight:    700;
      letter-spacing: 4px;
      text-transform: uppercase;
      color:          rgba(255,255,255,0.5);
    }
    .cover-title {
      font-family: 'Nunito', sans-serif;
      font-size:   46px;
      font-weight: 900;
      line-height: 1.15;
      text-shadow: 0 2px 24px rgba(0,0,0,0.4);
    }
    .cover-sub {
      font-family: 'Lora', Georgia, serif;
      font-size:   23px;
      font-style:  italic;
      color:       #fde68a;
      margin-top:  2px;
    }
    .cover-char { margin: 8px 0; }
    .cover-footer {
      font-size:      11px;
      font-weight:    600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color:          rgba(255,255,255,0.3);
      margin-top:     4px;
    }

    /* ── Full-bleed scene image ───────────────────────────── */
    .full-scene {
      position:        absolute;
      inset:           0;
      width:           100%;
      height:          100%;
      object-fit:      cover;
      object-position: center top;
      display:         block;
    }

    /* ── Text overlay (on scene pages) ───────────────────── */
    .overlay {
      position:   absolute;
      bottom:     0;
      left:       0;
      right:      0;
      /* Dark scrim: opaque at bottom, fades to transparent ~55% up */
      background: linear-gradient(
        to top,
        rgba(8, 10, 28, 0.92)  0%,
        rgba(8, 10, 28, 0.82) 25%,
        rgba(8, 10, 28, 0.55) 50%,
        rgba(8, 10, 28, 0.0)  100%
      );
      padding:    0;
    }
    .overlay-inner {
      padding: 52px 44px 28px 44px;
    }
    .story-text {
      font-family: 'Lora', Georgia, serif;
      font-size:   18px;
      font-style:  italic;
      line-height: 1.85;
      color:       rgba(255, 255, 255, 0.97);
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.7), 0 2px 16px rgba(0, 0, 0, 0.5);
      margin-bottom: 18px;
    }

    /* Name highlight */
    .nm {
      background:      rgba(253, 224, 71, 0.28);
      color:           #fef08a;
      padding:         1px 5px;
      border-radius:   4px;
      font-style:      normal;
      font-weight:     600;
      text-decoration: none;
    }

    /* Page footer bar */
    .pg-bar {
      display:         flex;
      align-items:     center;
      justify-content: space-between;
      border-top:      1px solid rgba(255,255,255,0.12);
      padding-top:     10px;
    }
    .pg-book {
      font-size:      9px;
      font-weight:    700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color:          rgba(255,255,255,0.38);
    }
    .pg-num {
      font-size:   9px;
      font-weight: 600;
      color:       rgba(255,255,255,0.38);
    }

    /* ── Fallback page (no AI scene) ─────────────────────── */
    .fallback-page {
      display:         flex;
      flex-direction:  column;
      align-items:     center;
      justify-content: flex-start;
    }
    .fallback-char {
      flex:             1;
      display:          flex;
      align-items:      flex-end;
      justify-content:  center;
      padding-bottom:   0;
      position:         relative;
      width:            100%;
      padding-top:      40px;
    }
    .fallback-char > svg,
    .fallback-char > img {
      filter: drop-shadow(0 4px 16px rgba(0,0,0,0.15));
    }
    .deco {
      position:    absolute;
      font-size:   24px;
      color:       rgba(0,0,0,0.1);
      user-select: none;
    }

    /* Fallback overlay sits at bottom of the gradient bg */
    .fallback-overlay {
      position:   relative;
      width:      100%;
      background: rgba(255,255,255,0.72);
      backdrop-filter: blur(1px);
    }
    .story-text--dark {
      color:       #1e293b;
      text-shadow: none;
    }
    .pg-bar--dark .pg-book,
    .pg-bar--dark .pg-num {
      color: #94a3b8;
    }
    .pg-bar--dark {
      border-top-color: rgba(0,0,0,0.08);
    }
  </style>
</head>
<body>

  <!-- ── Cover page ───────────────────────────────────────── -->
  <div class="page cover">
    <span class="cover-star" style="top:7%;left:7%">✦</span>
    <span class="cover-star" style="top:11%;right:11%">✦</span>
    <span class="cover-star" style="bottom:17%;left:10%">✦</span>
    <span class="cover-star" style="bottom:11%;right:8%">✦</span>
    <span class="cover-star" style="top:42%;left:4%;font-size:16px">★</span>
    <span class="cover-star" style="top:58%;right:4%;font-size:16px">★</span>

    <div class="cover-content">
      <p class="cover-eyebrow">A personalized storybook</p>
      <h1 class="cover-title">${bookTitle}</h1>
      <p class="cover-sub">A story starring ${childName}</p>
      <div class="cover-char">${coverChar}</div>
      <p class="cover-footer">StoryWeave ✦ Made with love</p>
    </div>
  </div>

  <!-- ── Story pages ──────────────────────────────────────── -->
  ${storyPages}

</body>
</html>`
}
