'use client'

import type { CharacterAppearance, HairStyle } from '@/lib/types'
import { SKIN_TONES, HAIR_COLORS, EYE_COLORS } from '@/lib/types'

// Deterministic shirt palette — cycles by first letter of name
const SHIRT_COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#EF4444']

interface Props {
  appearance: CharacterAppearance
  name: string
}

function darken(hex: string, amount: number): string {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex
  const num = parseInt(clean, 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0xff) - amount)
  const b = Math.max(0, (num & 0xff) - amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function HairShape({ style, color }: { style: HairStyle; color: string }) {
  switch (style) {
    case 'straight':
      return (
        <g>
          {/* Top cap */}
          <path d="M50 112 Q50 56 100 50 Q150 56 150 112 L150 98 Q146 44 100 40 Q54 44 50 98 Z" fill={color} />
          {/* Side falls */}
          <rect x="44" y="107" width="14" height="60" rx="7" fill={color} />
          <rect x="142" y="107" width="14" height="60" rx="7" fill={color} />
        </g>
      )
    case 'wavy':
      return (
        <g>
          <path d="M50 112 Q50 56 100 50 Q150 56 150 112 L150 98 Q146 44 100 40 Q54 44 50 98 Z" fill={color} />
          {/* Left wavy side */}
          <path
            d="M44 107 Q38 120 46 132 Q36 144 46 156 Q38 166 48 172 L60 172 L60 107 Z"
            fill={color}
          />
          {/* Right wavy side */}
          <path
            d="M156 107 Q162 120 154 132 Q164 144 154 156 Q162 166 152 172 L140 172 L140 107 Z"
            fill={color}
          />
        </g>
      )
    case 'curly':
      return (
        <g>
          <path d="M50 112 Q50 60 100 56 Q150 60 150 112" fill={color} />
          <circle cx="58" cy="82" r="22" fill={color} />
          <circle cx="80" cy="60" r="19" fill={color} />
          <circle cx="100" cy="54" r="19" fill={color} />
          <circle cx="120" cy="60" r="19" fill={color} />
          <circle cx="142" cy="82" r="22" fill={color} />
          <circle cx="50" cy="108" r="18" fill={color} />
          <circle cx="150" cy="108" r="18" fill={color} />
          <circle cx="46" cy="130" r="15" fill={color} />
          <circle cx="154" cy="130" r="15" fill={color} />
        </g>
      )
    case 'coily':
      return (
        <g>
          <ellipse cx="100" cy="68" rx="60" ry="40" fill={color} />
          <circle cx="62" cy="76" r="24" fill={color} />
          <circle cx="138" cy="76" r="24" fill={color} />
          <circle cx="100" cy="54" r="26" fill={color} />
          <circle cx="76" cy="60" r="20" fill={color} />
          <circle cx="124" cy="60" r="20" fill={color} />
          <ellipse cx="46" cy="108" rx="16" ry="26" fill={color} />
          <ellipse cx="154" cy="108" rx="16" ry="26" fill={color} />
        </g>
      )
    case 'braided':
      return (
        <g>
          <path d="M50 112 Q50 56 100 50 Q150 56 150 112 L150 98 Q146 44 100 40 Q54 44 50 98 Z" fill={color} />
          {/* Left braid segments */}
          <ellipse cx="43" cy="120" rx="12" ry="16" fill={color} />
          <ellipse cx="45" cy="142" rx="11" ry="14" fill={color} />
          <ellipse cx="43" cy="162" rx="10" ry="13" fill={color} />
          <ellipse cx="45" cy="180" rx="8" ry="10" fill={color} />
          {/* Right braid segments */}
          <ellipse cx="157" cy="120" rx="12" ry="16" fill={color} />
          <ellipse cx="155" cy="142" rx="11" ry="14" fill={color} />
          <ellipse cx="157" cy="162" rx="10" ry="13" fill={color} />
          <ellipse cx="155" cy="180" rx="8" ry="10" fill={color} />
        </g>
      )
  }
}

export function CharacterSVG({ appearance, name }: Props) {
  const skinHex   = SKIN_TONES[appearance.skinTone].hex
  const hairHex   = HAIR_COLORS[appearance.hairColor].hex
  const eyeHex    = EYE_COLORS[appearance.eyeColor].hex
  const skinShade = darken(skinHex, 20)
  const shirtHex  = name.trim().length > 0
    ? SHIRT_COLORS[name.toLowerCase().charCodeAt(0) % SHIRT_COLORS.length]
    : SHIRT_COLORS[0]
  const shirtShade = darken(shirtHex, 30)

  return (
    <svg
      viewBox="0 0 200 280"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Character preview"
      className="w-full h-full drop-shadow-md"
    >
      {/* ── Body / shirt ───────────────────────────────── */}
      <path
        d="M68 172 Q62 182 60 195 L54 272 L146 272 L140 195 Q138 182 132 172 Z"
        fill={shirtHex}
      />

      {/* Shirt star badge */}
      <text x="100" y="232" textAnchor="middle" fontSize="18" fill="rgba(255,255,255,0.55)">
        ★
      </text>

      {/* Collar seam */}
      <path
        d="M87 172 Q100 186 113 172"
        fill="none"
        stroke={shirtShade}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Arms */}
      <ellipse cx="46" cy="200" rx="14" ry="40" fill={shirtHex} transform="rotate(-8 46 200)" />
      <ellipse cx="154" cy="200" rx="14" ry="40" fill={shirtHex} transform="rotate(8 154 200)" />

      {/* Hands */}
      <circle cx="37"  cy="234" r="15" fill={skinHex} />
      <circle cx="163" cy="234" r="15" fill={skinHex} />

      {/* ── Hair (rendered behind head) ────────────────── */}
      <HairShape style={appearance.hairStyle} color={hairHex} />

      {/* ── Ears ───────────────────────────────────────── */}
      <ellipse cx="50"  cy="118" rx="12" ry="16" fill={skinHex} />
      <ellipse cx="150" cy="118" rx="12" ry="16" fill={skinHex} />
      <ellipse cx="50"  cy="118" rx="7"  ry="10" fill={skinShade} />
      <ellipse cx="150" cy="118" rx="7"  ry="10" fill={skinShade} />

      {/* ── Head ───────────────────────────────────────── */}
      <circle cx="100" cy="118" r="54" fill={skinHex} />

      {/* Cheek blush */}
      <ellipse cx="70"  cy="132" rx="14" ry="9" fill="#FFB6C1" fillOpacity="0.45" />
      <ellipse cx="130" cy="132" rx="14" ry="9" fill="#FFB6C1" fillOpacity="0.45" />

      {/* ── Eyes ───────────────────────────────────────── */}
      {/* Whites */}
      <ellipse cx="82"  cy="112" rx="13" ry="14" fill="white" />
      <ellipse cx="118" cy="112" rx="13" ry="14" fill="white" />
      {/* Irises */}
      <circle cx="83"  cy="114" r="10" fill={eyeHex} />
      <circle cx="119" cy="114" r="10" fill={eyeHex} />
      {/* Pupils */}
      <circle cx="84"  cy="115" r="5.5" fill="#111" />
      <circle cx="120" cy="115" r="5.5" fill="#111" />
      {/* Shine */}
      <circle cx="88"  cy="110" r="3" fill="white" />
      <circle cx="124" cy="110" r="3" fill="white" />

      {/* ── Eyebrows ────────────────────────────────────── */}
      <path
        d="M70 99 Q82 93 93 98"
        stroke={hairHex}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M107 98 Q118 93 130 99"
        stroke={hairHex}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Nose ────────────────────────────────────────── */}
      <ellipse cx="100" cy="126" rx="5" ry="4" fill={skinShade} fillOpacity="0.5" />

      {/* ── Smile ───────────────────────────────────────── */}
      <path
        d="M86 138 Q100 152 114 138"
        stroke={darken(skinHex, 40)}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
