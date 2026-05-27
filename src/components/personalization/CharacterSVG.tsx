'use client'

import type { CharacterAppearance, HairStyle } from '@/lib/types'
import { SKIN_TONES, HAIR_COLORS, EYE_COLORS } from '@/lib/types'

/**
 * Illustrated character SVG — children's-book quality.
 * Viewbox 200 × 280  |  Head centre (100, 95) r=55
 */

// Outfit palette — shirt + matching pants, indexed by first letter of name
const SHIRT_COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#EF4444']
const PANTS_COLORS = ['#312e81', '#831843', '#064e3b', '#78350f', '#7f1d1d']
const SHOE_BG      = '#1a1a2e'
const SHOE_SH      = '#3a3a5e'

function darken(hex: string, amount: number): string {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex
  const num   = parseInt(clean, 16)
  const clamp = (v: number) => Math.min(255, Math.max(0, v))
  const r = clamp((num >> 16)         - amount)
  const g = clamp(((num >> 8) & 0xff) - amount)
  const b = clamp((num & 0xff)        - amount)
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

// ── Hair ─────────────────────────────────────────────────────────────────────

function HairShape({ style, color }: { style: HairStyle; color: string }) {
  const hi = darken(color, -30)   // highlight (lighter)

  switch (style) {
    case 'straight':
      return (
        <g>
          <path d="M45 90 Q45 34 100 28 Q155 34 155 90 L155 74 Q151 22 100 18 Q49 22 45 74 Z" fill={color}/>
          <rect x="38" y="86" width="14" height="66" rx="7" fill={color}/>
          <rect x="148" y="86" width="14" height="66" rx="7" fill={color}/>
          <path d="M62 36 Q100 26 138 36" fill="none" stroke={hi} strokeWidth="4" strokeLinecap="round" strokeOpacity="0.35"/>
        </g>
      )

    case 'wavy':
      return (
        <g>
          <path d="M45 90 Q45 34 100 28 Q155 34 155 90 L155 74 Q151 22 100 18 Q49 22 45 74 Z" fill={color}/>
          <path d="M38 86 Q32 99 40 111 Q30 124 40 136 Q32 146 42 152 L54 152 L54 86 Z" fill={color}/>
          <path d="M162 86 Q168 99 160 111 Q170 124 160 136 Q168 146 158 152 L146 152 L146 86 Z" fill={color}/>
          <path d="M62 36 Q100 26 138 36" fill="none" stroke={hi} strokeWidth="4" strokeLinecap="round" strokeOpacity="0.35"/>
        </g>
      )

    case 'curly':
      return (
        <g>
          <path d="M45 90 Q45 38 100 34 Q155 38 155 90" fill={color}/>
          <circle cx="52"  cy="62"  r="22" fill={color}/>
          <circle cx="74"  cy="40"  r="20" fill={color}/>
          <circle cx="100" cy="34"  r="20" fill={color}/>
          <circle cx="126" cy="40"  r="20" fill={color}/>
          <circle cx="148" cy="62"  r="22" fill={color}/>
          <circle cx="45"  cy="88"  r="18" fill={color}/>
          <circle cx="155" cy="88"  r="18" fill={color}/>
          <circle cx="42"  cy="110" r="16" fill={color}/>
          <circle cx="158" cy="110" r="16" fill={color}/>
          {/* Curl highlights */}
          <circle cx="100" cy="34"  r="9"  fill={hi} fillOpacity="0.30"/>
          <circle cx="74"  cy="40"  r="7"  fill={hi} fillOpacity="0.30"/>
          <circle cx="126" cy="40"  r="7"  fill={hi} fillOpacity="0.30"/>
        </g>
      )

    case 'coily':
      return (
        <g>
          <ellipse cx="100" cy="50"  rx="62" ry="42" fill={color}/>
          <circle  cx="58"  cy="58"  r="25"          fill={color}/>
          <circle  cx="142" cy="58"  r="25"          fill={color}/>
          <circle  cx="100" cy="36"  r="28"          fill={color}/>
          <circle  cx="74"  cy="42"  r="22"          fill={color}/>
          <circle  cx="126" cy="42"  r="22"          fill={color}/>
          <ellipse cx="42"  cy="90"  rx="16" ry="28" fill={color}/>
          <ellipse cx="158" cy="90"  rx="16" ry="28" fill={color}/>
          {/* Coil highlights */}
          <circle cx="100" cy="36"  r="12" fill={hi} fillOpacity="0.28"/>
          <circle cx="74"  cy="42"  r="9"  fill={hi} fillOpacity="0.25"/>
          <circle cx="126" cy="42"  r="9"  fill={hi} fillOpacity="0.25"/>
        </g>
      )

    case 'braided':
      return (
        <g>
          <path    d="M45 90 Q45 34 100 28 Q155 34 155 90 L155 74 Q151 22 100 18 Q49 22 45 74 Z" fill={color}/>
          <ellipse cx="37"  cy="100" rx="13" ry="18" fill={color}/>
          <ellipse cx="38"  cy="122" rx="12" ry="16" fill={color}/>
          <ellipse cx="37"  cy="142" rx="11" ry="14" fill={color}/>
          <ellipse cx="38"  cy="160" rx="9"  ry="12" fill={color}/>
          <ellipse cx="163" cy="100" rx="13" ry="18" fill={color}/>
          <ellipse cx="162" cy="122" rx="12" ry="16" fill={color}/>
          <ellipse cx="163" cy="142" rx="11" ry="14" fill={color}/>
          <ellipse cx="162" cy="160" rx="9"  ry="12" fill={color}/>
          <path d="M62 36 Q100 26 138 36" fill="none" stroke={hi} strokeWidth="4" strokeLinecap="round" strokeOpacity="0.35"/>
        </g>
      )
  }
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  appearance: CharacterAppearance
  name: string
}

export function CharacterSVG({ appearance, name }: Props) {
  const skinHex  = SKIN_TONES[appearance.skinTone].hex
  const hairHex  = HAIR_COLORS[appearance.hairColor].hex
  const eyeHex   = EYE_COLORS[appearance.eyeColor].hex
  const shade    = darken(skinHex, 28)
  const eyebrow  = darken(hairHex, 18)
  const eyeDark  = darken(eyeHex, 40)

  const idx      = name.trim().length > 0
    ? name.toLowerCase().charCodeAt(0) % SHIRT_COLORS.length
    : 0
  const shirtHex = SHIRT_COLORS[idx]
  const pantsHex = PANTS_COLORS[idx]
  const shirtSh  = darken(shirtHex, 45)

  return (
    <svg
      viewBox="0 0 200 280"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Character preview"
      className="w-full h-full drop-shadow-md"
    >
      {/* ── Shoes ─────────────────────────────────────────────────────────── */}
      <ellipse cx="76"  cy="266" rx="24" ry="10" fill={SHOE_BG}/>
      <ellipse cx="124" cy="266" rx="24" ry="10" fill={SHOE_BG}/>
      <ellipse cx="70"  cy="263" rx="14" ry="6"  fill={SHOE_SH}/>
      <ellipse cx="118" cy="263" rx="14" ry="6"  fill={SHOE_SH}/>

      {/* ── Legs / pants ──────────────────────────────────────────────────── */}
      <rect x="61"  y="214" width="29" height="50" rx="12" fill={pantsHex}/>
      <rect x="110" y="214" width="29" height="50" rx="12" fill={pantsHex}/>
      {/* Highlight strip */}
      <rect x="73"  y="214" width="9"  height="50" rx="4" fill="rgba(255,255,255,0.14)"/>
      <rect x="118" y="214" width="9"  height="50" rx="4" fill="rgba(255,255,255,0.14)"/>

      {/* ── Shirt body ────────────────────────────────────────────────────── */}
      <path d="M60 150 Q52 168 50 190 L50 222 L150 222 L150 190 Q148 168 140 150 Z" fill={shirtHex}/>
      {/* Side fold shadows */}
      <path d="M60 150 Q54 166 52 184 L52 222 L70 222 L70 184 Q70 166 70 150 Z" fill={shirtSh} fillOpacity="0.12"/>
      <path d="M140 150 Q146 166 148 184 L148 222 L130 222 L130 184 Q130 166 130 150 Z" fill={shirtSh} fillOpacity="0.12"/>

      {/* Shirt pocket */}
      <rect x="110" y="180" width="22" height="18" rx="5" fill={shirtSh} fillOpacity="0.22"/>
      <line x1="110" y1="186" x2="132" y2="186" stroke={shirtSh} strokeWidth="1" strokeOpacity="0.30"/>
      <circle cx="121" cy="192" r="3" fill={shirtSh} fillOpacity="0.40"/>

      {/* ── Arms ──────────────────────────────────────────────────────────── */}
      <path d="M62 158 Q46 180 40 207 Q38 218 40 224" stroke={shirtHex} strokeWidth="24" fill="none" strokeLinecap="round"/>
      <path d="M138 158 Q154 180 160 207 Q162 218 160 224" stroke={shirtHex} strokeWidth="24" fill="none" strokeLinecap="round"/>
      {/* Arm shadow */}
      <path d="M62 158 Q46 180 40 207 Q38 218 40 224" stroke={shirtSh} strokeWidth="24" fill="none" strokeLinecap="round" strokeOpacity="0.11"/>
      <path d="M138 158 Q154 180 160 207 Q162 218 160 224" stroke={shirtSh} strokeWidth="24" fill="none" strokeLinecap="round" strokeOpacity="0.11"/>

      {/* Collar (V-neck) */}
      <path d="M82 150 L100 170 L118 150" fill="white" fillOpacity="0.88" stroke={shirtSh} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── Hands ─────────────────────────────────────────────────────────── */}
      <circle cx="40"  cy="228" r="14" fill={skinHex}/>
      <circle cx="160" cy="228" r="14" fill={skinHex}/>
      {/* Knuckle detail */}
      <path d="M32 223 Q40 219 48 223"   stroke={shade} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeOpacity="0.45"/>
      <path d="M152 223 Q160 219 168 223" stroke={shade} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeOpacity="0.45"/>

      {/* ── Hair (behind head) ────────────────────────────────────────────── */}
      <HairShape style={appearance.hairStyle} color={hairHex}/>

      {/* ── Ears ──────────────────────────────────────────────────────────── */}
      <ellipse cx="45"  cy="97" rx="12" ry="16" fill={skinHex}/>
      <ellipse cx="155" cy="97" rx="12" ry="16" fill={skinHex}/>
      <ellipse cx="45"  cy="97" rx="7"  ry="10" fill={shade} fillOpacity="0.50"/>
      <ellipse cx="155" cy="97" rx="7"  ry="10" fill={shade} fillOpacity="0.50"/>

      {/* ── Head ──────────────────────────────────────────────────────────── */}
      <circle cx="100" cy="95" r="55" fill={skinHex}/>

      {/* ── Blush ─────────────────────────────────────────────────────────── */}
      <ellipse cx="68"  cy="114" rx="18" ry="11" fill="#FF9EAD" fillOpacity="0.42"/>
      <ellipse cx="132" cy="114" rx="18" ry="11" fill="#FF9EAD" fillOpacity="0.42"/>

      {/* ── Eye whites ────────────────────────────────────────────────────── */}
      <ellipse cx="78"  cy="93" rx="15" ry="16" fill="white"/>
      <ellipse cx="122" cy="93" rx="15" ry="16" fill="white"/>

      {/* ── Irises ────────────────────────────────────────────────────────── */}
      <circle cx="78"  cy="95" r="12" fill={eyeHex}/>
      <circle cx="122" cy="95" r="12" fill={eyeHex}/>
      {/* Depth ring */}
      <circle cx="78"  cy="95" r="12" fill="none" stroke={eyeDark} strokeWidth="2.5"/>
      <circle cx="122" cy="95" r="12" fill="none" stroke={eyeDark} strokeWidth="2.5"/>

      {/* ── Pupils ────────────────────────────────────────────────────────── */}
      <circle cx="79"  cy="96" r="7" fill="#080815"/>
      <circle cx="123" cy="96" r="7" fill="#080815"/>

      {/* ── Eye shine (main + secondary) ──────────────────────────────────── */}
      <circle cx="83"  cy="90"  r="4"  fill="white"/>
      <circle cx="127" cy="90"  r="4"  fill="white"/>
      <circle cx="75"  cy="100" r="2"  fill="rgba(255,255,255,0.60)"/>
      <circle cx="119" cy="100" r="2"  fill="rgba(255,255,255,0.60)"/>

      {/* ── Upper eyelid + lashes ─────────────────────────────────────────── */}
      <path d="M63 87 Q78 80 93 87" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <line x1="65"  y1="87" x2="62"  y2="82" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="78"  y1="81" x2="77"  y2="76" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="91"  y1="87" x2="94"  y2="83" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M107 87 Q122 80 137 87" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <line x1="109" y1="87" x2="106" y2="82" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="122" y1="81" x2="121" y2="76" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="135" y1="87" x2="138" y2="83" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>

      {/* ── Lower eyelid (subtle) ─────────────────────────────────────────── */}
      <path d="M64 103 Q78 107 92 103"   stroke={shade} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeOpacity="0.38"/>
      <path d="M108 103 Q122 107 136 103" stroke={shade} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeOpacity="0.38"/>

      {/* ── Eyebrows ──────────────────────────────────────────────────────── */}
      <path d="M62 79 Q78 72 94 77"  stroke={eyebrow} strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M106 77 Q122 72 138 79" stroke={eyebrow} strokeWidth="5" fill="none" strokeLinecap="round"/>

      {/* ── Nose (soft nostril dots) ───────────────────────────────────────── */}
      <circle cx="95"  cy="110" r="4" fill={shade} fillOpacity="0.30"/>
      <circle cx="105" cy="110" r="4" fill={shade} fillOpacity="0.30"/>

      {/* ── Smile (open, teeth) ───────────────────────────────────────────── */}
      {/* Mouth interior */}
      <path d="M82 122 Q100 140 118 122" fill="#c96060" stroke={darken(skinHex, 50)} strokeWidth="1.5" strokeLinecap="round"/>
      {/* Teeth */}
      <path d="M85 123 Q100 136 115 123 L115 127 Q100 132 85 127 Z" fill="white"/>
      {/* Tooth centre line */}
      <line x1="100" y1="123" x2="100" y2="128" stroke={darken(skinHex, 30)} strokeWidth="1" strokeOpacity="0.28"/>
      {/* Lower lip */}
      <path d="M85 129 Q100 135 115 129" stroke={darken(skinHex, 30)} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeOpacity="0.50"/>
    </svg>
  )
}
