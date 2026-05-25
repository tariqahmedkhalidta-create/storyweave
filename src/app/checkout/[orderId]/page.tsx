import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cartStore } from '@/lib/cart-store'
import { SKIN_TONES, HAIR_COLORS, HAIR_STYLES, EYE_COLORS } from '@/lib/types'
import { CharacterSVG } from '@/components/personalization/CharacterSVG'
import { CheckoutActions } from './CheckoutActions'

// ── Types ────────────────────────────────────────────────────────────────────

interface Props {
  params: { orderId: string }
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props) {
  const order = await cartStore.get(params.orderId)
  if (!order) return {}
  return {
    title: `Checkout — ${order.bookTitle} | StoryWeave`,
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
      {children}
    </p>
  )
}

function AppearanceChip({
  label, value, swatchHex,
}: { label: string; value: string; swatchHex?: string }) {
  return (
    <div className="bg-slate-50 rounded-xl px-3 py-2.5 flex flex-col gap-1">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-1.5">
        {swatchHex && (
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
            style={{ backgroundColor: swatchHex }}
          />
        )}
        <p className="text-sm font-medium text-slate-700 leading-none">{value}</p>
      </div>
    </div>
  )
}

function PriceRow({
  label, value, highlight,
}: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`flex justify-between items-center ${
        highlight ? 'font-bold text-slate-900 text-lg pt-3 border-t border-slate-100' : 'text-sm text-slate-500'
      }`}
    >
      <span>{label}</span>
      <span className={highlight ? '' : value === 'Free' ? 'text-emerald-600 font-medium' : ''}>
        {value}
      </span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CheckoutPage({ params }: Props) {
  const order = await cartStore.get(params.orderId)
  if (!order) notFound()

  const { childName, appearance, bookTitle, priceFormatted, createdAt, orderId } = order

  const shortId    = orderId.slice(0, 8).toUpperCase()
  const dateString = createdAt.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Minimal nav keeps the user oriented without competing with the form */}
      <div className="border-b border-slate-100 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-violet-600 group-hover:scale-110 transition-transform">✦</span>
            <span className="font-bold text-slate-900 text-sm">StoryWeave</span>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* ── Back link ──────────────────────────────────────────────────── */}
        <Link
          href={`/customize/${order.bookId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-violet-600
            transition-colors mb-8 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          Edit personalization
        </Link>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-100 mb-4">
            <span className="text-2xl">✦</span>
          </div>
          <p className="text-xs font-bold tracking-widest text-violet-600 uppercase mb-1">
            Almost there!
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Review Your Order</h1>
          <p className="text-slate-400 text-sm mt-2 tabular-nums">
            Order #{shortId} · {dateString}
          </p>
        </div>

        {/* ── Order card ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden mb-5">

          {/* Book header: character + title */}
          <div className="flex items-end gap-5 p-6 bg-gradient-to-br from-violet-50 to-slate-50 border-b border-slate-100">
            <div className="w-28 h-36 flex-shrink-0 drop-shadow-sm">
              {/* CharacterSVG is a client component — rendered client-side, fine in a server component */}
              <CharacterSVG appearance={appearance} name={childName} />
            </div>
            <div className="pb-1">
              <span className="inline-block text-[10px] font-bold tracking-widest text-violet-600 uppercase mb-1.5">
                Personalized Storybook
              </span>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">{bookTitle}</h2>
              <p className="text-slate-600 mt-1">
                Starring{' '}
                <span className="font-bold text-violet-700">{childName}</span>
              </p>
              <p className="text-slate-400 text-xs mt-1.5">
                Digital PDF · 24 full-colour pages · Instant download
              </p>
            </div>
          </div>

          {/* Appearance summary */}
          <div className="px-6 py-5 border-b border-slate-100">
            <SectionHeading>Character Customization</SectionHeading>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <AppearanceChip
                label="Skin Tone"
                value={SKIN_TONES[appearance.skinTone].label}
                swatchHex={SKIN_TONES[appearance.skinTone].hex}
              />
              <AppearanceChip
                label="Hair Color"
                value={HAIR_COLORS[appearance.hairColor].label}
                swatchHex={HAIR_COLORS[appearance.hairColor].hex}
              />
              <AppearanceChip
                label="Hair Style"
                value={HAIR_STYLES[appearance.hairStyle].label}
              />
              <AppearanceChip
                label="Eye Color"
                value={EYE_COLORS[appearance.eyeColor].label}
                swatchHex={EYE_COLORS[appearance.eyeColor].hex}
              />
            </div>
          </div>

          {/* Price breakdown */}
          <div className="px-6 py-5 space-y-2.5">
            <SectionHeading>Order Summary</SectionHeading>
            <PriceRow label={bookTitle}         value={priceFormatted} />
            <PriceRow label="Personalization"   value="Free"           />
            <PriceRow label="Digital delivery"  value="Free"           />
            <PriceRow label="Total"             value={priceFormatted} highlight />
          </div>
        </div>

        {/* ── Guarantee badge ─────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-5">
          <span className="text-emerald-500 text-lg mt-0.5 flex-shrink-0">✓</span>
          <p className="text-sm text-emerald-800">
            <span className="font-semibold">100% happiness guarantee.</span>{' '}
            Not thrilled with your book? We&apos;ll regenerate it or refund you — no questions asked.
          </p>
        </div>

        {/* ── Stripe CTA (client component) ──────────────────────────────── */}
        <CheckoutActions orderId={orderId} priceFormatted={priceFormatted} />

        {/* ── Trust badges ────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">🔒 256-bit SSL</span>
          <span className="flex items-center gap-1.5">⚡ PDF ready in seconds</span>
          <span className="flex items-center gap-1.5">🖨 Print-ready quality</span>
        </div>

      </div>
    </main>
  )
}
