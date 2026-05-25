'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  SKIN_TONES, HAIR_COLORS, HAIR_STYLES, EYE_COLORS,
  type PersonalizationConfig,
  type SkinTone, type HairColor, type HairStyle, type EyeColor,
} from '@/lib/types'
import { addToCart } from '@/app/actions/cart'
import { StoryPreview } from './StoryPreview'

const DEFAULT_CONFIG: PersonalizationConfig = {
  childName: '',
  appearance: {
    skinTone:  'medium-light',
    hairColor: 'brown',
    hairStyle: 'wavy',
    eyeColor:  'brown',
  },
}

interface Props {
  bookId: string
  bookTitle: string
  priceFormatted: string
}

// ── Small sub-components ──────────────────────────────────────────────────────

function SwatchButton({
  hex, label, selected, onClick,
}: { hex: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={selected}
      className={`w-10 h-10 rounded-full border-4 transition-all duration-150 hover:scale-110 focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2
        ${selected ? 'border-violet-500 scale-110 shadow-md' : 'border-transparent hover:border-slate-300'}`}
      style={{ backgroundColor: hex }}
    />
  )
}

function StylePill({
  label, selected, onClick,
}: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-1
        ${selected
          ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm'
          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
        }`}
    >
      {label}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 mb-3">
      {children}
    </label>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function PersonalizationTool({ bookId, bookTitle, priceFormatted }: Props) {
  const router                      = useRouter()
  const [isPending, startTransition] = useTransition()
  const [config, setConfig]         = useState<PersonalizationConfig>(DEFAULT_CONFIG)
  const [nameError, setNameError]   = useState('')
  const [cartError, setCartError]   = useState('')

  // Accepts letters, spaces, hyphens, apostrophes — max 20 chars
  const handleNameChange = useCallback((raw: string) => {
    const sanitized = raw.replace(/[^a-zA-Z\s\-']/g, '').slice(0, 20)
    setConfig(prev => ({ ...prev, childName: sanitized }))
    setNameError(raw !== sanitized && raw.length > 0 ? 'Only letters, spaces, and hyphens allowed.' : '')
  }, [])

  const updateAppearance = useCallback(
    <K extends keyof PersonalizationConfig['appearance']>(
      key: K,
      value: PersonalizationConfig['appearance'][K]
    ) => {
      setConfig(prev => ({ ...prev, appearance: { ...prev.appearance, [key]: value } }))
    },
    []
  )

  const randomize = useCallback(() => {
    const pick = <T extends string>(obj: Record<T, unknown>): T => {
      const keys = Object.keys(obj) as T[]
      return keys[Math.floor(Math.random() * keys.length)]
    }
    setConfig(prev => ({
      ...prev,
      appearance: {
        skinTone:  pick(SKIN_TONES),
        hairColor: pick(HAIR_COLORS),
        hairStyle: pick(HAIR_STYLES),
        eyeColor:  pick(EYE_COLORS),
      },
    }))
  }, [])

  const handleAddToCart = useCallback(() => {
    setCartError('')
    startTransition(async () => {
      const result = await addToCart({
        bookId,
        childName:  config.childName,
        appearance: config.appearance,
      })
      if (result.success) {
        router.push(`/checkout/${result.orderId}`)
      } else {
        setCartError(result.error)
      }
    })
  }, [bookId, config, router, startTransition])

  const isReady = config.childName.trim().length >= 2

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Page header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-1">
          Personalize Your Book
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{bookTitle}</h1>
        <p className="text-slate-500 mt-2">
          Make the hero look just like your child — the story updates instantly.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

        {/* ── LEFT: Customization panel ────────────────────────────────── */}
        <div className="lg:w-5/12 space-y-7">

          {/* Name input */}
          <section aria-label="Child's name">
            <SectionLabel>
              Child&apos;s Name <span className="text-rose-400 ml-0.5">*</span>
            </SectionLabel>
            <div className="relative">
              <input
                type="text"
                value={config.childName}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Lily"
                maxLength={20}
                aria-describedby={nameError ? 'name-error' : undefined}
                className={`w-full px-4 py-3 pr-14 text-lg rounded-xl border-2 outline-none transition-all
                  focus:ring-4 focus:ring-violet-100 placeholder:text-slate-300
                  ${nameError
                    ? 'border-rose-300 focus:border-rose-400'
                    : 'border-slate-200 focus:border-violet-400'
                  }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-300 tabular-nums select-none">
                {config.childName.length}/20
              </span>
            </div>

            {nameError && (
              <p id="name-error" className="text-rose-500 text-sm mt-1.5 flex items-center gap-1">
                <span aria-hidden>⚠</span> {nameError}
              </p>
            )}
            {!nameError && config.childName.trim().length >= 2 && (
              <p className="text-emerald-600 text-sm mt-1.5 flex items-center gap-1">
                <span aria-hidden>✓</span> Looks great!
              </p>
            )}
          </section>

          {/* Divider with randomize */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <button
              onClick={randomize}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-violet-600
                transition-colors px-2 py-1 rounded-lg hover:bg-violet-50"
            >
              <span>⟳</span> Randomize look
            </button>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Skin tone */}
          <section aria-label="Skin tone">
            <SectionLabel>Skin Tone</SectionLabel>
            <div className="flex gap-3 flex-wrap">
              {(Object.entries(SKIN_TONES) as [SkinTone, { label: string; hex: string }][]).map(
                ([key, { label, hex }]) => (
                  <SwatchButton
                    key={key}
                    hex={hex}
                    label={label}
                    selected={config.appearance.skinTone === key}
                    onClick={() => updateAppearance('skinTone', key)}
                  />
                )
              )}
            </div>
          </section>

          {/* Hair color */}
          <section aria-label="Hair color">
            <SectionLabel>Hair Color</SectionLabel>
            <div className="flex gap-3 flex-wrap">
              {(Object.entries(HAIR_COLORS) as [HairColor, { label: string; hex: string }][]).map(
                ([key, { label, hex }]) => (
                  <SwatchButton
                    key={key}
                    hex={hex}
                    label={label}
                    selected={config.appearance.hairColor === key}
                    onClick={() => updateAppearance('hairColor', key)}
                  />
                )
              )}
            </div>
          </section>

          {/* Hair style */}
          <section aria-label="Hair style">
            <SectionLabel>Hair Style</SectionLabel>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(Object.entries(HAIR_STYLES) as [HairStyle, { label: string }][]).map(
                ([key, { label }]) => (
                  <StylePill
                    key={key}
                    label={label}
                    selected={config.appearance.hairStyle === key}
                    onClick={() => updateAppearance('hairStyle', key)}
                  />
                )
              )}
            </div>
          </section>

          {/* Eye color */}
          <section aria-label="Eye color">
            <SectionLabel>Eye Color</SectionLabel>
            <div className="flex gap-3 flex-wrap">
              {(Object.entries(EYE_COLORS) as [EyeColor, { label: string; hex: string }][]).map(
                ([key, { label, hex }]) => (
                  <SwatchButton
                    key={key}
                    hex={hex}
                    label={label}
                    selected={config.appearance.eyeColor === key}
                    onClick={() => updateAppearance('eyeColor', key)}
                  />
                )
              )}
            </div>
          </section>

          {/* Add to cart */}
          <div className="pt-5 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Personalized digital PDF</p>
                <p className="text-xs text-slate-400">Instant download · 24 full-colour pages</p>
              </div>
              <span className="text-2xl font-bold text-slate-900">{priceFormatted}</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!isReady || isPending}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300
                flex items-center justify-center gap-2
                ${isReady && !isPending
                  ? 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving your book…
                </>
              ) : isReady ? (
                `Continue to Checkout — ${priceFormatted}`
              ) : (
                'Enter a name to continue'
              )}
            </button>

            {cartError && (
              <p className="text-rose-600 text-sm bg-rose-50 border border-rose-200 rounded-lg px-4 py-2.5 flex items-start gap-2">
                <span aria-hidden className="flex-shrink-0 mt-0.5">⚠</span>
                {cartError}
              </p>
            )}

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><span>🔒</span> Secure checkout</span>
              <span>·</span>
              <span>PDF ready in seconds</span>
              <span>·</span>
              <span>Print or share</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Live preview ───────────────────────────────────────── */}
        <div className="lg:w-7/12 lg:sticky lg:top-8 lg:self-start">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
              Live Preview
            </h2>
            <span className="text-xs bg-violet-100 text-violet-600 px-2.5 py-1 rounded-full font-semibold">
              Updates instantly ✦
            </span>
          </div>
          <StoryPreview config={config} bookId={bookId} bookTitle={bookTitle} />
        </div>

      </div>
    </div>
  )
}
