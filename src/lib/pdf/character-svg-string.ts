/**
 * Pure-function SVG generator for PDF embedding.
 * Produces raw SVG markup (no React / JSX) — identical visuals to CharacterSVG.tsx.
 * Uses HTML SVG attribute names (stroke-width, fill-opacity, etc.).
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
  red:    '#B83232',
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

const SHIRTS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#EF4444']

// ── Helpers ───────────────────────────────────────────────────────────────────

function darken(hex: string, amount: number): string {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex
  const n = parseInt(clean, 16)
  const r = Math.max(0, (n >> 16) - amount).toString(16).padStart(2, '0')
  const g = Math.max(0, ((n >> 8) & 0xff) - amount).toString(16).padStart(2, '0')
  const b = Math.max(0, (n & 0xff) - amount).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

// ── Hair shapes (raw SVG fragments) ──────────────────────────────────────────

function hairShape(style: string, c: string): string {
  switch (style) {
    case 'straight': return `
      <path d="M50 112 Q50 56 100 50 Q150 56 150 112 L150 98 Q146 44 100 40 Q54 44 50 98 Z" fill="${c}"/>
      <rect x="44" y="107" width="14" height="60" rx="7" fill="${c}"/>
      <rect x="142" y="107" width="14" height="60" rx="7" fill="${c}"/>`

    case 'wavy': return `
      <path d="M50 112 Q50 56 100 50 Q150 56 150 112 L150 98 Q146 44 100 40 Q54 44 50 98 Z" fill="${c}"/>
      <path d="M44 107 Q38 120 46 132 Q36 144 46 156 Q38 166 48 172 L60 172 L60 107 Z" fill="${c}"/>
      <path d="M156 107 Q162 120 154 132 Q164 144 154 156 Q162 166 152 172 L140 172 L140 107 Z" fill="${c}"/>`

    case 'curly': return `
      <path d="M50 112 Q50 60 100 56 Q150 60 150 112" fill="${c}"/>
      <circle cx="58"  cy="82"  r="22" fill="${c}"/>
      <circle cx="80"  cy="60"  r="19" fill="${c}"/>
      <circle cx="100" cy="54"  r="19" fill="${c}"/>
      <circle cx="120" cy="60"  r="19" fill="${c}"/>
      <circle cx="142" cy="82"  r="22" fill="${c}"/>
      <circle cx="50"  cy="108" r="18" fill="${c}"/>
      <circle cx="150" cy="108" r="18" fill="${c}"/>
      <circle cx="46"  cy="130" r="15" fill="${c}"/>
      <circle cx="154" cy="130" r="15" fill="${c}"/>`

    case 'coily': return `
      <ellipse cx="100" cy="68"  rx="60" ry="40" fill="${c}"/>
      <circle  cx="62"  cy="76"  r="24"          fill="${c}"/>
      <circle  cx="138" cy="76"  r="24"          fill="${c}"/>
      <circle  cx="100" cy="54"  r="26"          fill="${c}"/>
      <circle  cx="76"  cy="60"  r="20"          fill="${c}"/>
      <circle  cx="124" cy="60"  r="20"          fill="${c}"/>
      <ellipse cx="46"  cy="108" rx="16" ry="26" fill="${c}"/>
      <ellipse cx="154" cy="108" rx="16" ry="26" fill="${c}"/>`

    case 'braided': return `
      <path    d="M50 112 Q50 56 100 50 Q150 56 150 112 L150 98 Q146 44 100 40 Q54 44 50 98 Z" fill="${c}"/>
      <ellipse cx="43"  cy="120" rx="12" ry="16" fill="${c}"/>
      <ellipse cx="45"  cy="142" rx="11" ry="14" fill="${c}"/>
      <ellipse cx="43"  cy="162" rx="10" ry="13" fill="${c}"/>
      <ellipse cx="45"  cy="180" rx="8"  ry="10" fill="${c}"/>
      <ellipse cx="157" cy="120" rx="12" ry="16" fill="${c}"/>
      <ellipse cx="155" cy="142" rx="11" ry="14" fill="${c}"/>
      <ellipse cx="157" cy="162" rx="10" ry="13" fill="${c}"/>
      <ellipse cx="155" cy="180" rx="8"  ry="10" fill="${c}"/>`

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
  const shade   = darken(skin, 20)
  const shirt   = name.trim().length > 0
    ? SHIRTS[name.toLowerCase().charCodeAt(0) % SHIRTS.length]
    : SHIRTS[0]
  const shirtSh = darken(shirt, 30)

  return `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg"
      width="${size.width}" height="${size.height}" style="overflow:visible">

  <!-- Body / shirt -->
  <path d="M68 172 Q62 182 60 195 L54 272 L146 272 L140 195 Q138 182 132 172 Z" fill="${shirt}"/>
  <text x="100" y="232" text-anchor="middle" font-size="18" fill="rgba(255,255,255,0.55)">★</text>
  <path d="M87 172 Q100 186 113 172" fill="none" stroke="${shirtSh}" stroke-width="2" stroke-linecap="round"/>

  <!-- Arms + hands -->
  <ellipse cx="46"  cy="200" rx="14" ry="40" fill="${shirt}" transform="rotate(-8 46 200)"/>
  <ellipse cx="154" cy="200" rx="14" ry="40" fill="${shirt}" transform="rotate(8 154 200)"/>
  <circle  cx="37"  cy="234" r="15" fill="${skin}"/>
  <circle  cx="163" cy="234" r="15" fill="${skin}"/>

  <!-- Hair (behind head) -->
  ${hairShape(appearance.hairStyle, hair)}

  <!-- Ears -->
  <ellipse cx="50"  cy="118" rx="12" ry="16" fill="${skin}"/>
  <ellipse cx="150" cy="118" rx="12" ry="16" fill="${skin}"/>
  <ellipse cx="50"  cy="118" rx="7"  ry="10" fill="${shade}"/>
  <ellipse cx="150" cy="118" rx="7"  ry="10" fill="${shade}"/>

  <!-- Head -->
  <circle cx="100" cy="118" r="54" fill="${skin}"/>

  <!-- Blush -->
  <ellipse cx="70"  cy="132" rx="14" ry="9" fill="#FFB6C1" fill-opacity="0.45"/>
  <ellipse cx="130" cy="132" rx="14" ry="9" fill="#FFB6C1" fill-opacity="0.45"/>

  <!-- Eye whites -->
  <ellipse cx="82"  cy="112" rx="13" ry="14" fill="white"/>
  <ellipse cx="118" cy="112" rx="13" ry="14" fill="white"/>

  <!-- Irises + pupils + shine -->
  <circle cx="83"  cy="114" r="10"  fill="${eye}"/>
  <circle cx="119" cy="114" r="10"  fill="${eye}"/>
  <circle cx="84"  cy="115" r="5.5" fill="#111"/>
  <circle cx="120" cy="115" r="5.5" fill="#111"/>
  <circle cx="88"  cy="110" r="3"   fill="white"/>
  <circle cx="124" cy="110" r="3"   fill="white"/>

  <!-- Eyebrows -->
  <path d="M70 99 Q82 93 93 98"   stroke="${hair}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M107 98 Q118 93 130 99" stroke="${hair}" stroke-width="3.5" fill="none" stroke-linecap="round"/>

  <!-- Nose + smile -->
  <ellipse cx="100" cy="126" rx="5" ry="4" fill="${shade}" fill-opacity="0.5"/>
  <path d="M86 138 Q100 152 114 138" stroke="${darken(skin, 40)}" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`
}
