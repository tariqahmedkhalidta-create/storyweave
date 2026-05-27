/**
 * Pure-function SVG generator for PDF embedding.
 * Produces raw SVG markup (no React / JSX) — identical visuals to CharacterSVG.tsx.
 * Uses HTML SVG attribute names (stroke-width, fill-opacity, etc.).
 *
 * Viewbox: 200 × 280
 * Head centre: (100, 95) r=55
 */

// ── Color maps (mirror src/lib/types.ts) ─────────────────────────────────────

const SKIN: Record<string, string> = {
  'light':        '#FDDBB4',
  'medium-light': '#F5C090',
  'medium':       '#D4956A',
  'medium-dark':  '#A0674A',
  'dark':         '#5C3D2E',
}

const HAIR: Record<string, string> = {
  blonde: '#F5D77E',
  red:    '#C0392B',
  brown:  '#6B3A2A',
  black:  '#2A1A0E',
  auburn: '#8B2500',
}

const EYES: Record<string, string> = {
  blue:  '#4A90D9',
  green: '#27AE60',
  brown: '#795548',
  hazel: '#8D6E63',
  gray:  '#78909C',
}

// Outfit palette — shirt + matching pants, indexed by first letter of name
const SHIRTS  = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#EF4444']
const PANTS   = ['#312e81', '#831843', '#064e3b', '#78350f', '#7f1d1d']
const SHOE_BG = '#1a1a2e'
const SHOE_SH = '#3a3a5e'

// ── Helpers ───────────────────────────────────────────────────────────────────

function darken(hex: string, amount: number): string {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex
  const n = parseInt(clean, 16)
  const clamp = (v: number) => Math.min(255, Math.max(0, v))
  const r = clamp((n >> 16)         - amount).toString(16).padStart(2, '0')
  const g = clamp(((n >> 8) & 0xff) - amount).toString(16).padStart(2, '0')
  const b = clamp((n & 0xff)        - amount).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

// ── Hair shapes ───────────────────────────────────────────────────────────────
// Head centre moved to (100, 95) vs old (100, 118) — y values shifted ~23px up.

function hairShape(style: string, c: string): string {
  const hi = darken(c, -30) // lighter highlight colour (safe because we clamp below separately)
  switch (style) {

    case 'straight': return `
      <path d="M45 90 Q45 34 100 28 Q155 34 155 90 L155 74 Q151 22 100 18 Q49 22 45 74 Z" fill="${c}"/>
      <rect x="38" y="86" width="14" height="66" rx="7" fill="${c}"/>
      <rect x="148" y="86" width="14" height="66" rx="7" fill="${c}"/>
      <path d="M62 36 Q100 26 138 36" fill="none" stroke="${hi}" stroke-width="4" stroke-linecap="round" stroke-opacity="0.35"/>`

    case 'wavy': return `
      <path d="M45 90 Q45 34 100 28 Q155 34 155 90 L155 74 Q151 22 100 18 Q49 22 45 74 Z" fill="${c}"/>
      <path d="M38 86 Q32 99 40 111 Q30 124 40 136 Q32 146 42 152 L54 152 L54 86 Z" fill="${c}"/>
      <path d="M162 86 Q168 99 160 111 Q170 124 160 136 Q168 146 158 152 L146 152 L146 86 Z" fill="${c}"/>
      <path d="M62 36 Q100 26 138 36" fill="none" stroke="${hi}" stroke-width="4" stroke-linecap="round" stroke-opacity="0.35"/>`

    case 'curly': return `
      <path d="M45 90 Q45 38 100 34 Q155 38 155 90" fill="${c}"/>
      <circle cx="52"  cy="62"  r="22" fill="${c}"/>
      <circle cx="74"  cy="40"  r="20" fill="${c}"/>
      <circle cx="100" cy="34"  r="20" fill="${c}"/>
      <circle cx="126" cy="40"  r="20" fill="${c}"/>
      <circle cx="148" cy="62"  r="22" fill="${c}"/>
      <circle cx="45"  cy="88"  r="18" fill="${c}"/>
      <circle cx="155" cy="88"  r="18" fill="${c}"/>
      <circle cx="42"  cy="110" r="16" fill="${c}"/>
      <circle cx="158" cy="110" r="16" fill="${c}"/>
      <circle cx="100" cy="34"  r="9"  fill="${hi}" fill-opacity="0.30"/>
      <circle cx="74"  cy="40"  r="7"  fill="${hi}" fill-opacity="0.30"/>
      <circle cx="126" cy="40"  r="7"  fill="${hi}" fill-opacity="0.30"/>`

    case 'coily': return `
      <ellipse cx="100" cy="50"  rx="62" ry="42" fill="${c}"/>
      <circle  cx="58"  cy="58"  r="25"          fill="${c}"/>
      <circle  cx="142" cy="58"  r="25"          fill="${c}"/>
      <circle  cx="100" cy="36"  r="28"          fill="${c}"/>
      <circle  cx="74"  cy="42"  r="22"          fill="${c}"/>
      <circle  cx="126" cy="42"  r="22"          fill="${c}"/>
      <ellipse cx="42"  cy="90"  rx="16" ry="28" fill="${c}"/>
      <ellipse cx="158" cy="90"  rx="16" ry="28" fill="${c}"/>
      <circle  cx="100" cy="36"  r="12"          fill="${hi}" fill-opacity="0.28"/>
      <circle  cx="74"  cy="42"  r="9"           fill="${hi}" fill-opacity="0.25"/>
      <circle  cx="126" cy="42"  r="9"           fill="${hi}" fill-opacity="0.25"/>`

    case 'braided': return `
      <path    d="M45 90 Q45 34 100 28 Q155 34 155 90 L155 74 Q151 22 100 18 Q49 22 45 74 Z" fill="${c}"/>
      <ellipse cx="37"  cy="100" rx="13" ry="18" fill="${c}"/>
      <ellipse cx="38"  cy="122" rx="12" ry="16" fill="${c}"/>
      <ellipse cx="37"  cy="142" rx="11" ry="14" fill="${c}"/>
      <ellipse cx="38"  cy="160" rx="9"  ry="12" fill="${c}"/>
      <ellipse cx="163" cy="100" rx="13" ry="18" fill="${c}"/>
      <ellipse cx="162" cy="122" rx="12" ry="16" fill="${c}"/>
      <ellipse cx="163" cy="142" rx="11" ry="14" fill="${c}"/>
      <ellipse cx="162" cy="160" rx="9"  ry="12" fill="${c}"/>
      <path d="M62 36 Q100 26 138 36" fill="none" stroke="${hi}" stroke-width="4" stroke-linecap="round" stroke-opacity="0.35"/>`

    default: return ''
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface AppearanceInput {
  skinTone:  string
  hairColor: string
  hairStyle: string
  eyeColor:  string
}

/**
 * Returns a self-contained <svg> string ready to embed in an HTML document.
 * Pass width/height via the `size` option to scale the 200×280 viewBox.
 */
export function characterSVGString(
  appearance: AppearanceInput,
  name: string,
  size: { width: number; height: number } = { width: 200, height: 280 }
): string {
  const skin    = SKIN[appearance.skinTone]   ?? '#F5C090'
  const hair    = HAIR[appearance.hairColor]  ?? '#6B3A2A'
  const eye     = EYES[appearance.eyeColor]   ?? '#795548'
  const shade   = darken(skin, 28)
  const eyebrow = darken(hair, 18)

  const idx     = name.trim().length > 0
    ? name.toLowerCase().charCodeAt(0) % SHIRTS.length
    : 0
  const shirt   = SHIRTS[idx]
  const pants   = PANTS[idx]
  const shirtSh = darken(shirt, 45)
  const eyeDark = darken(eye, 40)

  return `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg"
      width="${size.width}" height="${size.height}" style="overflow:visible">

  <!-- ── Shoes ─────────────────────────────────────────────────────────── -->
  <ellipse cx="76"  cy="266" rx="24" ry="10" fill="${SHOE_BG}"/>
  <ellipse cx="124" cy="266" rx="24" ry="10" fill="${SHOE_BG}"/>
  <ellipse cx="70"  cy="263" rx="14" ry="6"  fill="${SHOE_SH}"/>
  <ellipse cx="118" cy="263" rx="14" ry="6"  fill="${SHOE_SH}"/>

  <!-- ── Legs / pants ──────────────────────────────────────────────────── -->
  <rect x="61"  y="214" width="29" height="50" rx="12" fill="${pants}"/>
  <rect x="110" y="214" width="29" height="50" rx="12" fill="${pants}"/>
  <!-- Highlight strip -->
  <rect x="73"  y="214" width="9"  height="50" rx="4"  fill="rgba(255,255,255,0.14)"/>
  <rect x="118" y="214" width="9"  height="50" rx="4"  fill="rgba(255,255,255,0.14)"/>

  <!-- ── Shirt body ────────────────────────────────────────────────────── -->
  <path d="M60 150 Q52 168 50 190 L50 222 L150 222 L150 190 Q148 168 140 150 Z" fill="${shirt}"/>
  <!-- Side fold shadows -->
  <path d="M60 150 Q54 166 52 184 L52 222 L70 222 L70 184 Q70 166 70 150 Z" fill="${shirtSh}" fill-opacity="0.12"/>
  <path d="M140 150 Q146 166 148 184 L148 222 L130 222 L130 184 Q130 166 130 150 Z" fill="${shirtSh}" fill-opacity="0.12"/>

  <!-- Shirt pocket -->
  <rect x="110" y="180" width="22" height="18" rx="5" fill="${shirtSh}" fill-opacity="0.22"/>
  <line x1="110" y1="186" x2="132" y2="186" stroke="${shirtSh}" stroke-width="1" stroke-opacity="0.30"/>
  <!-- Pocket button -->
  <circle cx="121" cy="192" r="3" fill="${shirtSh}" fill-opacity="0.40"/>

  <!-- ── Arms ──────────────────────────────────────────────────────────── -->
  <path d="M62 158 Q46 180 40 207 Q38 218 40 224" stroke="${shirt}"  stroke-width="24" fill="none" stroke-linecap="round"/>
  <path d="M138 158 Q154 180 160 207 Q162 218 160 224" stroke="${shirt}" stroke-width="24" fill="none" stroke-linecap="round"/>
  <!-- Arm shadow -->
  <path d="M62 158 Q46 180 40 207 Q38 218 40 224" stroke="${shirtSh}" stroke-width="24" fill="none" stroke-linecap="round" stroke-opacity="0.11"/>
  <path d="M138 158 Q154 180 160 207 Q162 218 160 224" stroke="${shirtSh}" stroke-width="24" fill="none" stroke-linecap="round" stroke-opacity="0.11"/>

  <!-- Collar (V-neck white triangle) -->
  <path d="M82 150 L100 170 L118 150" fill="white" fill-opacity="0.88" stroke="${shirtSh}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- ── Hands ──────────────────────────────────────────────────────────── -->
  <circle cx="40"  cy="228" r="14" fill="${skin}"/>
  <circle cx="160" cy="228" r="14" fill="${skin}"/>
  <!-- Knuckle detail -->
  <path d="M32 223 Q40 219 48 223" stroke="${shade}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-opacity="0.45"/>
  <path d="M152 223 Q160 219 168 223" stroke="${shade}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-opacity="0.45"/>

  <!-- ── Hair (behind head) ─────────────────────────────────────────────── -->
  ${hairShape(appearance.hairStyle, hair)}

  <!-- ── Ears ───────────────────────────────────────────────────────────── -->
  <ellipse cx="45"  cy="97" rx="12" ry="16" fill="${skin}"/>
  <ellipse cx="155" cy="97" rx="12" ry="16" fill="${skin}"/>
  <ellipse cx="45"  cy="97" rx="7"  ry="10" fill="${shade}" fill-opacity="0.50"/>
  <ellipse cx="155" cy="97" rx="7"  ry="10" fill="${shade}" fill-opacity="0.50"/>

  <!-- ── Head ───────────────────────────────────────────────────────────── -->
  <circle cx="100" cy="95" r="55" fill="${skin}"/>

  <!-- ── Blush ──────────────────────────────────────────────────────────── -->
  <ellipse cx="68"  cy="114" rx="18" ry="11" fill="#FF9EAD" fill-opacity="0.42"/>
  <ellipse cx="132" cy="114" rx="18" ry="11" fill="#FF9EAD" fill-opacity="0.42"/>

  <!-- ── Eye whites ─────────────────────────────────────────────────────── -->
  <ellipse cx="78"  cy="93" rx="15" ry="16" fill="white"/>
  <ellipse cx="122" cy="93" rx="15" ry="16" fill="white"/>

  <!-- ── Irises ─────────────────────────────────────────────────────────── -->
  <circle cx="78"  cy="95" r="12" fill="${eye}"/>
  <circle cx="122" cy="95" r="12" fill="${eye}"/>
  <!-- Iris depth ring -->
  <circle cx="78"  cy="95" r="12" fill="none" stroke="${eyeDark}" stroke-width="2.5"/>
  <circle cx="122" cy="95" r="12" fill="none" stroke="${eyeDark}" stroke-width="2.5"/>

  <!-- ── Pupils ─────────────────────────────────────────────────────────── -->
  <circle cx="79"  cy="96" r="7" fill="#080815"/>
  <circle cx="123" cy="96" r="7" fill="#080815"/>

  <!-- ── Eye shine (main + secondary) ──────────────────────────────────── -->
  <circle cx="83"  cy="90" r="4"   fill="white"/>
  <circle cx="127" cy="90" r="4"   fill="white"/>
  <circle cx="75"  cy="100" r="2"  fill="rgba(255,255,255,0.60)"/>
  <circle cx="119" cy="100" r="2"  fill="rgba(255,255,255,0.60)"/>

  <!-- ── Upper eyelid line + lashes ─────────────────────────────────────── -->
  <path d="M63 87 Q78 80 93 87" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
  <line x1="65"  y1="87" x2="62"  y2="82" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="78"  y1="81" x2="77"  y2="76" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="91"  y1="87" x2="94"  y2="83" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M107 87 Q122 80 137 87" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
  <line x1="109" y1="87" x2="106" y2="82" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="122" y1="81" x2="121" y2="76" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="135" y1="87" x2="138" y2="83" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round"/>

  <!-- ── Lower eyelid (subtle) ──────────────────────────────────────────── -->
  <path d="M64 103 Q78 107 92 103" stroke="${shade}" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-opacity="0.38"/>
  <path d="M108 103 Q122 107 136 103" stroke="${shade}" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-opacity="0.38"/>

  <!-- ── Eyebrows ───────────────────────────────────────────────────────── -->
  <path d="M62 79 Q78 72 94 77" stroke="${eyebrow}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M106 77 Q122 72 138 79" stroke="${eyebrow}" stroke-width="5" fill="none" stroke-linecap="round"/>

  <!-- ── Nose (soft nostril dots) ───────────────────────────────────────── -->
  <circle cx="95"  cy="110" r="4" fill="${shade}" fill-opacity="0.30"/>
  <circle cx="105" cy="110" r="4" fill="${shade}" fill-opacity="0.30"/>

  <!-- ── Smile (open, teeth showing) ───────────────────────────────────── -->
  <!-- Mouth interior -->
  <path d="M82 122 Q100 140 118 122" fill="#c96060" stroke="${darken(skin, 50)}" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Teeth -->
  <path d="M85 123 Q100 136 115 123 L115 127 Q100 132 85 127 Z" fill="white"/>
  <!-- Tooth divider -->
  <line x1="100" y1="123" x2="100" y2="128" stroke="${darken(skin, 30)}" stroke-width="1" stroke-opacity="0.28"/>
  <!-- Lower lip curve -->
  <path d="M85 129 Q100 135 115 129" stroke="${darken(skin, 30)}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-opacity="0.50"/>
</svg>`
}
