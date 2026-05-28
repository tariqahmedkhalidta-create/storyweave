/**
 * Builds the complete multi-page HTML document that Puppeteer will print to PDF.
 *
 * Layout:
 *  - Page 1 : full-bleed cover (gradient + character + title)
 *  - Pages 2…N: two-column story pages (character left | text right)
 *
 * Fonts are pulled from Google Fonts (requires network on the rendering machine).
 * Puppeteer waits for networkidle0 so fonts are loaded before printing.
 */

import { characterSVGString, type AppearanceInput } from './character-svg-string'
import { getStoryPages } from '../story-templates'

// ── Tailwind gradient class → CSS gradient ────────────────────────────────────
// Must contain an entry for every gradient key used in story-templates.ts.
const GRADIENT_CSS: Record<string, string> = {
  // ── Enchanted Forest ──────────────────────────────────────────────────────
  'from-emerald-50 to-teal-100':  'linear-gradient(155deg, #ecfdf5 0%, #ccfbf1 100%)',
  'from-amber-50 to-yellow-100':  'linear-gradient(155deg, #fffbeb 0%, #fef9c3 100%)',
  'from-violet-50 to-purple-100': 'linear-gradient(155deg, #f5f3ff 0%, #ede9fe 100%)',
  'from-sky-50 to-blue-100':      'linear-gradient(155deg, #f0f9ff 0%, #dbeafe 100%)',
  // ── A Starlight Adventure ─────────────────────────────────────────────────
  'from-indigo-50 to-blue-100':   'linear-gradient(155deg, #eef2ff 0%, #dbeafe 100%)',
  'from-sky-50 to-cyan-100':      'linear-gradient(155deg, #f0f9ff 0%, #cffafe 100%)',
  'from-blue-50 to-indigo-100':   'linear-gradient(155deg, #eff6ff 0%, #e0e7ff 100%)',
  // ── The Ocean of Dreams ───────────────────────────────────────────────────
  'from-teal-50 to-cyan-100':     'linear-gradient(155deg, #f0fdfa 0%, #cffafe 100%)',
  'from-cyan-50 to-teal-100':     'linear-gradient(155deg, #ecfeff 0%, #ccfbf1 100%)',
  // ── The Dragon Keeper ─────────────────────────────────────────────────────
  'from-red-50 to-rose-100':      'linear-gradient(155deg, #fef2f2 0%, #ffe4e6 100%)',
  'from-orange-50 to-amber-100':  'linear-gradient(155deg, #fff7ed 0%, #fef3c7 100%)',
  'from-rose-50 to-red-100':      'linear-gradient(155deg, #fff1f2 0%, #fee2e2 100%)',
  'from-amber-50 to-orange-100':  'linear-gradient(155deg, #fffbeb 0%, #ffedd5 100%)',
  // ── The Time Traveller ────────────────────────────────────────────────────
  'from-lime-50 to-green-100':    'linear-gradient(155deg, #f7fee7 0%, #dcfce7 100%)',
  'from-yellow-50 to-amber-100':  'linear-gradient(155deg, #fefce8 0%, #fef3c7 100%)',
  // ── New books (unique gradients only — duplicates omitted) ────────────────
  'from-indigo-50 to-violet-100': 'linear-gradient(155deg, #eef2ff 0%, #ede9fe 100%)',
  'from-purple-50 to-indigo-100': 'linear-gradient(155deg, #faf5ff 0%, #e0e7ff 100%)',
  'from-blue-50 to-sky-100':      'linear-gradient(155deg, #eff6ff 0%, #e0f2fe 100%)',
  'from-purple-50 to-violet-100': 'linear-gradient(155deg, #faf5ff 0%, #ede9fe 100%)',
  'from-fuchsia-50 to-purple-100':'linear-gradient(155deg, #fdf4ff 0%, #ede9fe 100%)',
  'from-pink-50 to-fuchsia-100':  'linear-gradient(155deg, #fdf2f8 0%, #fae8ff 100%)',
  'from-lime-50 to-yellow-100':   'linear-gradient(155deg, #f7fee7 0%, #fef9c3 100%)',
  'from-emerald-50 to-cyan-100':  'linear-gradient(155deg, #ecfdf5 0%, #cffafe 100%)',
}
const FALLBACK_GRADIENT = 'linear-gradient(155deg, #f8fafc 0%, #e2e8f0 100%)'

// ── Name highlighting (replaces {{NAME}} with a <mark>) ───────────────────────
function injectName(text: string, name: string): string {
  return text.replace(
    /\{\{NAME\}\}/g,
    `<mark class="nm">${name}</mark>`
  )
}

// ── HTML builder ─────────────────────────────────────────────────────────────

export interface BookData {
  childName:          string
  appearance:         AppearanceInput
  bookTitle?:         string
  bookId?:            string
  /** Base64 data-URL from AI image generator — if set, replaces the SVG character */
  characterImageUrl?: string
}

export function buildBookHTML({ childName, appearance, bookTitle = 'The Enchanted Forest', bookId = 'enchanted-forest', characterImageUrl }: BookData): string {
  // Character visuals — use AI image if available, otherwise fall back to SVG
  const coverChar = characterImageUrl
    ? `<img src="${characterImageUrl}" width="170" height="238" style="object-fit:contain;object-position:bottom" alt="${childName}"/>`
    : characterSVGString(appearance, childName, { width: 170, height: 238 })

  const pageChar = characterImageUrl
    ? `<img src="${characterImageUrl}" width="148" height="207" style="object-fit:contain;object-position:bottom" alt="${childName}"/>`
    : characterSVGString(appearance, childName, { width: 148, height: 207 })

  // Keep SVG vars for legacy reference (unused when AI image present)
  const coverSVG = coverChar
  const pageSVG  = pageChar

  const storyPages = getStoryPages(bookId).map(p => {
    const bg = GRADIENT_CSS[p.gradient] ?? FALLBACK_GRADIENT
    return `
      <div class="page">
        <div class="split">

          <!-- Left: character panel -->
          <div class="char-panel" style="background:${bg}">
            <span class="deco" style="top:6%;left:8%">✦</span>
            <span class="deco" style="bottom:14%;right:10%">✦</span>
            <div class="char-wrap">${pageSVG}</div>
          </div>

          <!-- Right: text panel -->
          <div class="text-panel">
            <div class="text-body">
              <p class="story">${injectName(p.text, childName)}</p>
            </div>
            <footer class="pg-footer">
              <span class="pg-book">${bookTitle}</span>
              <span class="pg-dots">· · ·</span>
              <span class="pg-num">Page ${p.pageNumber}</span>
            </footer>
          </div>

        </div>
      </div>`
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
    /* ── Reset ─────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @page { size: A4; margin: 0; }

    body {
      font-family: 'Nunito', system-ui, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Page shell ─────────────────────────────────────── */
    .page {
      width:            210mm;
      height:           297mm;
      overflow:         hidden;
      position:         relative;
      page-break-after: always;
    }
    .page:last-child { page-break-after: avoid; }

    /* ── Cover ──────────────────────────────────────────── */
    .cover {
      background: linear-gradient(160deg, #3b0764 0%, #4c1d95 30%, #5b21b6 65%, #1e1b4b 100%);
      display:         flex;
      flex-direction:  column;
      align-items:     center;
      justify-content: center;
      gap:             0;
      color:           white;
    }
    .cover-star {
      position:   absolute;
      font-size:  28px;
      color:      white;
      opacity:    0.12;
      user-select: none;
    }
    .cover-content {
      display:        flex;
      flex-direction: column;
      align-items:    center;
      gap:            14px;
      position:       relative;
      z-index:        1;
      padding:        0 32px;
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
      font-size:   44px;
      font-weight: 900;
      line-height: 1.15;
      text-shadow: 0 2px 24px rgba(0,0,0,0.35);
    }
    .cover-sub {
      font-family: 'Lora', Georgia, serif;
      font-size:   22px;
      font-style:  italic;
      color:       #fde68a;
      margin-top:  2px;
    }
    .cover-char { margin: 10px 0; filter: drop-shadow(0 10px 28px rgba(0,0,0,0.45)); }
    .cover-footer {
      font-size:      12px;
      font-weight:    600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color:          rgba(255,255,255,0.35);
      margin-top:     4px;
    }

    /* ── Story page split layout ────────────────────────── */
    .split {
      display:    flex;
      width:      100%;
      height:     100%;
    }
    .char-panel {
      width:           40%;
      height:          100%;
      display:         flex;
      align-items:     flex-end;
      justify-content: center;
      padding-bottom:  56px;
      position:        relative;
    }
    .char-wrap { filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15)); }

    .deco {
      position:    absolute;
      font-size:   22px;
      color:       rgba(0,0,0,0.12);
      user-select: none;
    }

    .text-panel {
      width:           60%;
      height:          100%;
      background:      #ffffff;
      border-left:     1px solid rgba(0,0,0,0.06);
      display:         flex;
      flex-direction:  column;
      justify-content: space-between;
    }
    .text-body {
      flex:    1;
      display: flex;
      align-items: center;
      padding: 52px 44px 36px 44px;
    }
    .story {
      font-family: 'Lora', Georgia, serif;
      font-size:   19px;
      font-style:  italic;
      line-height: 1.9;
      color:       #334155;
    }

    /* Name highlight */
    .nm {
      background:     #fef08a;
      color:          #713f12;
      padding:        1px 5px;
      border-radius:  4px;
      font-style:     normal;
      font-weight:    600;
      text-decoration: none;
    }

    /* Page footer */
    .pg-footer {
      padding:     14px 28px;
      border-top:  1px solid #f1f5f9;
      background:  #fafafa;
      display:     flex;
      align-items: center;
      justify-content: space-between;
    }
    .pg-book {
      font-size:      10px;
      font-weight:    700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color:          #94a3b8;
    }
    .pg-dots { color: #cbd5e1; font-size: 14px; letter-spacing: 3px; }
    .pg-num  {
      font-size:   10px;
      font-weight: 600;
      color:       #94a3b8;
    }
  </style>
</head>
<body>

  <!-- ── Cover page ───────────────────────────────────── -->
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
      <div class="cover-char">${coverSVG}</div>
      <p class="cover-footer">StoryWeave ✦ Made with love</p>
    </div>
  </div>

  <!-- ── Story pages ──────────────────────────────────── -->
  ${storyPages}

</body>
</html>`
}
