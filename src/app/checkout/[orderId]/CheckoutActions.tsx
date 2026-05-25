'use client'

/**
 * Client-side checkout UI.
 *
 * Stage machine:
 *
 *  loading   →  Fetching a PaymentIntent clientSecret from the server
 *  form      →  Stripe Elements payment form is visible
 *  processing →  stripe.confirmPayment() is in flight
 *  polling   →  Payment succeeded; waiting for webhook + PDF generation
 *  complete  →  PDF ready — showing download link
 *  error     →  Any unrecoverable error
 *
 * Redirect flow (3DS / bank redirects):
 *  Stripe may redirect the user away and back with ?redirect_status=succeeded
 *  in the URL. We detect this on mount and jump straight to 'polling'.
 */

import {
  useState, useEffect, useRef, useCallback,
} from 'react'
import { loadStripe }  from '@stripe/stripe-js'
import {
  Elements, PaymentElement,
  useStripe, useElements,
} from '@stripe/react-stripe-js'

// ── Stripe initialisation ─────────────────────────────────────────────────────
// loadStripe must be called outside any component to avoid re-creating the
// Stripe.js instance on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
)

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  orderId:        string
  priceFormatted: string
}

type Stage = 'email' | 'loading' | 'form' | 'processing' | 'polling' | 'complete' | 'error'

// ── Stripe Elements appearance (matches violet design system) ─────────────────

const STRIPE_APPEARANCE: import('@stripe/stripe-js').Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary:     '#7c3aed',
    colorBackground:  '#ffffff',
    colorText:        '#1e293b',
    colorDanger:      '#ef4444',
    colorTextSecondary: '#64748b',
    fontFamily:       'system-ui, -apple-system, sans-serif',
    fontSizeBase:     '15px',
    spacingUnit:      '4px',
    borderRadius:     '10px',
  },
  rules: {
    '.Input': {
      border:    '2px solid #e2e8f0',
      boxShadow: 'none',
      padding:   '12px 14px',
    },
    '.Input:focus': {
      border:    '2px solid #7c3aed',
      outline:   'none',
      boxShadow: '0 0 0 4px rgba(124,58,237,0.08)',
    },
    '.Input--invalid': {
      border: '2px solid #ef4444',
    },
    '.Label': {
      fontSize:     '12px',
      fontWeight:   '600',
      color:        '#475569',
      marginBottom: '6px',
    },
    '.Error': {
      fontSize: '12px',
      color:    '#ef4444',
    },
  },
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function Spinner({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin flex-shrink-0 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────

const PROGRESS_STEPS = [
  { id: 'form',     label: 'Payment'    },
  { id: 'polling',  label: 'Generating' },
  { id: 'complete', label: 'Ready!'     },
] as const

const STAGE_ORDER: Stage[] = ['email', 'loading', 'form', 'processing', 'polling', 'complete']

function ProgressBar({ stage }: { stage: Stage }) {
  const currentIdx = STAGE_ORDER.indexOf(stage)

  return (
    <ol
      className="flex items-center justify-center mb-6"
      aria-label="Order progress"
    >
      {PROGRESS_STEPS.map((step, i) => {
        const stepIdx = STAGE_ORDER.indexOf(step.id as Stage)
        const done    = currentIdx > stepIdx
        const active  = currentIdx === stepIdx ||
          (step.id === 'form' && stage === 'processing')

        return (
          <li key={step.id} className="flex items-center">
            <span
              aria-current={active ? 'step' : undefined}
              className={`
                w-7 h-7 rounded-full flex items-center justify-center
                text-xs font-bold border-2 transition-all duration-300
                ${done   ? 'bg-emerald-500 border-emerald-500 text-white'       : ''}
                ${active ? 'bg-violet-600  border-violet-600  text-white'       : ''}
                ${!done && !active ? 'bg-white border-slate-200 text-slate-300' : ''}
              `}
            >
              {done ? '✓' : i + 1}
            </span>

            <span
              className={`
                ml-2 text-xs font-semibold hidden sm:inline transition-colors duration-300
                ${done   ? 'text-emerald-600' : ''}
                ${active ? 'text-violet-700'  : ''}
                ${!done && !active ? 'text-slate-300' : ''}
              `}
            >
              {step.label}
            </span>

            {i < PROGRESS_STEPS.length - 1 && (
              <span
                className={`
                  mx-2 sm:mx-4 h-px w-8 sm:w-14 transition-colors duration-300
                  ${done ? 'bg-emerald-300' : 'bg-slate-200'}
                `}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

// ── Polling status steps ──────────────────────────────────────────────────────

function PollingStatus() {
  // Animate step 2 and 3 progressively with local timers
  const [genStarted, setGenStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setGenStarted(true), 3_000)
    return () => clearTimeout(t)
  }, [])

  const steps = [
    { label: 'Payment confirmed',         done: true,        active: false           },
    { label: 'Personalising your story',  done: genStarted,  active: !genStarted     },
    { label: 'Rendering PDF',             done: false,        active: genStarted      },
  ]

  return (
    <div className="bg-white rounded-xl ring-1 ring-black/5 px-5 py-4 space-y-3.5">
      {steps.map(step => (
        <div key={step.label} className="flex items-center gap-3">
          <span
            className={`
              w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]
              ${step.done   ? 'bg-emerald-500 text-white'  : ''}
              ${step.active ? 'bg-violet-100'              : ''}
              ${!step.done && !step.active ? 'bg-slate-100' : ''}
            `}
          >
            {step.done && '✓'}
            {step.active && <Spinner className="h-3 w-3 text-violet-500" />}
          </span>
          <span
            className={`
              text-sm font-medium
              ${step.done   ? 'text-emerald-700' : ''}
              ${step.active ? 'text-violet-700'  : ''}
              ${!step.done && !step.active ? 'text-slate-400' : ''}
            `}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Inner payment form (must live inside <Elements>) ──────────────────────────

interface PaymentFormProps {
  priceFormatted:   string
  isProcessing:     boolean
  onPaymentSuccess: () => void
  onProcessing:     (v: boolean) => void
  onError:          (msg: string) => void
}

function PaymentForm({
  priceFormatted,
  isProcessing,
  onPaymentSuccess,
  onProcessing,
  onError,
}: PaymentFormProps) {
  const stripe      = useStripe()
  const elements    = useElements()
  const [ready, setReady] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || isProcessing) return

    onProcessing(true)
    onError('')

    // Trigger built-in client-side validation
    const { error: submitError } = await elements.submit()
    if (submitError) {
      onError(submitError.message ?? 'Please check your card details.')
      onProcessing(false)
      return
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe redirects here for payment methods that require it (e.g. 3DS).
        // We detect redirect_status=succeeded on mount and jump to polling.
        return_url: `${window.location.origin}${window.location.pathname}?redirect_status=succeeded`,
      },
      // Cards, Apple Pay, Google Pay → no redirect needed
      redirect: 'if_required',
    })

    if (error) {
      // card_error and validation_error messages are safe to show users
      onError(error.message ?? 'Payment failed. Please try again.')
      onProcessing(false)
    } else if (paymentIntent?.status === 'succeeded') {
      onPaymentSuccess()
    }
  }

  const disabled = !stripe || !ready || isProcessing

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement
        onReady={() => setReady(true)}
        options={{ layout: 'tabs' }}
      />

      <button
        type="submit"
        disabled={disabled}
        className={`
          w-full py-4 rounded-xl font-semibold text-lg
          flex items-center justify-center gap-2.5
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300
          ${disabled
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
          }
        `}
      >
        {isProcessing ? (
          <><Spinner /> Processing payment…</>
        ) : (
          <><span>🔒</span> Pay {priceFormatted} securely</>
        )}
      </button>

      <p className="text-center text-xs text-slate-400">
        Processed securely by Stripe. Your card details never touch our servers.
      </p>
    </form>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function CheckoutActions({ orderId, priceFormatted }: Props) {
  // Start on the email stage; jump straight to polling on Stripe redirect
  const [stage,        setStage]        = useState<Stage>('email')
  const [email,        setEmail]        = useState('')
  const [emailError,   setEmailError]   = useState('')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [downloadUrl,  setDownloadUrl]  = useState('')
  const [errorMsg,     setErrorMsg]     = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  // retryKey forces the fetch-client-secret effect to re-run on retry
  const [retryKey,     setRetryKey]     = useState(0)

  // Keep a ref to stage so async callbacks read the latest value
  const stageRef = useRef(stage)
  stageRef.current = stage

  // ── Detect Stripe redirect on mount ────────────────────────────────────────
  // Stripe redirects back here with ?redirect_status=succeeded for payment
  // methods like 3DS, iDEAL, Bancontact, etc.
  // The email was already stored before the redirect, so we skip the email step.
  useEffect(() => {
    const params         = new URLSearchParams(window.location.search)
    const redirectStatus = params.get('redirect_status')
    if (redirectStatus === 'succeeded') {
      setStage('polling')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once on mount only

  // ── Fetch PaymentIntent after email is confirmed ──────────────────────────
  // Triggered when stage enters 'loading' (i.e. after the user submits their
  // email address). retryKey re-runs this for the "Try Again" path.
  useEffect(() => {
    if (stage !== 'loading') return

    setErrorMsg('')

    fetch('/api/checkout/payment-intent', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ orderId, email }),
    })
      .then(r => r.json())
      .then((data: { clientSecret?: string; error?: string }) => {
        if (!data.clientSecret) throw new Error(data.error ?? 'Could not initialise payment.')
        setClientSecret(data.clientSecret)
        setStage('form')
      })
      .catch(err => {
        setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
        setStage('error')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, retryKey]) // `email` and `orderId` are stable by the time this fires

  // ── Poll order status until PDF is ready ──────────────────────────────────
  useEffect(() => {
    if (stage !== 'polling') return

    let cancelled = false

    const poll = async () => {
      while (!cancelled) {
        await new Promise(r => setTimeout(r, 2_000))
        if (cancelled) return

        try {
          const res  = await fetch(`/api/orders/${orderId}/status`)
          const data = await res.json() as { status: string; downloadUrl?: string }

          if (data.status === 'fulfilled' && data.downloadUrl) {
            if (!cancelled) { setDownloadUrl(data.downloadUrl); setStage('complete') }
            return
          }
          if (data.status === 'failed') {
            if (!cancelled) {
              setErrorMsg('Your book could not be generated. Please contact support.')
              setStage('error')
            }
            return
          }
          // status is 'paid' | 'generating' → keep polling
        } catch {
          // Network hiccup — continue polling silently
        }
      }
    }

    poll()

    // Safety net: give up after 3 minutes
    const timeout = setTimeout(() => {
      if (!cancelled && stageRef.current === 'polling') {
        cancelled = true
        setErrorMsg('PDF generation is taking longer than expected. Please refresh the page.')
        setStage('error')
      }
    }, 180_000)

    return () => { cancelled = true; clearTimeout(timeout) }
  }, [stage, orderId])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEmailSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    // Basic format check (the server/Resend will reject truly bad addresses)
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError('')
    setEmail(trimmed)
    setStage('loading')
  }, [email])

  const handlePaymentSuccess = useCallback(() => setStage('polling'),  [])
  const handleRetry          = useCallback(() => {
    setErrorMsg('')
    setIsProcessing(false)
    setClientSecret(null)
    // Go back to the email step on retry so the user can correct it if needed
    setStage('email')
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <ProgressBar stage={stage} />

      {/* ── Email: collect address before showing payment form ──────────── */}
      {stage === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
          <div className="bg-white rounded-xl ring-1 ring-black/5 p-5 shadow-sm space-y-4">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Where should we send your book?
            </p>

            <div className="space-y-1.5">
              <label
                htmlFor="customer-email"
                className="block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>
              <input
                id="customer-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError('') }}
                className={`
                  w-full px-3.5 py-3 rounded-[10px] text-sm text-slate-900
                  border-2 outline-none transition-all duration-150
                  placeholder:text-slate-300
                  focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10
                  ${emailError ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-white'}
                `}
              />
              {emailError && (
                <p className="text-xs text-rose-600 font-medium">{emailError}</p>
              )}
              <p className="text-xs text-slate-400">
                We'll send you an order confirmation and a download link when your
                book is ready. No spam, ever.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-semibold text-lg
              flex items-center justify-center gap-2.5
              bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white
              shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
          >
            Continue to Payment →
          </button>
        </form>
      )}

      {/* ── Loading: fetching clientSecret ──────────────────────────────── */}
      {stage === 'loading' && (
        <div className="w-full py-4 rounded-xl bg-slate-50 ring-1 ring-slate-200
          flex items-center justify-center gap-2.5 text-slate-500 text-sm font-medium">
          <Spinner /> Preparing secure checkout…
        </div>
      )}

      {/* ── Form / Processing: Stripe Elements ──────────────────────────── */}
      {(stage === 'form' || stage === 'processing') && clientSecret && (
        <>
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: STRIPE_APPEARANCE }}
          >
            <div className="bg-white rounded-xl ring-1 ring-black/5 p-5 shadow-sm space-y-4">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Payment Details
              </p>
              <PaymentForm
                priceFormatted={priceFormatted}
                isProcessing={isProcessing}
                onPaymentSuccess={handlePaymentSuccess}
                onProcessing={setIsProcessing}
                onError={setErrorMsg}
              />
            </div>
          </Elements>

          {errorMsg && (
            <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200
              rounded-xl px-4 py-3">
              <span className="text-rose-500 flex-shrink-0 mt-0.5">⚠</span>
              <p className="text-sm text-rose-700">{errorMsg}</p>
            </div>
          )}
        </>
      )}

      {/* ── Polling: waiting for webhook + PDF ──────────────────────────── */}
      {stage === 'polling' && (
        <div className="space-y-3">
          <div className="w-full py-5 rounded-xl bg-violet-600 text-white shadow-lg
            flex flex-col items-center justify-center gap-1.5">
            <div className="flex items-center gap-2.5 font-semibold text-lg">
              <Spinner /> Creating your personalised book…
            </div>
            <p className="text-violet-200 text-xs">This usually takes 10–20 seconds</p>
          </div>
          <PollingStatus />
        </div>
      )}

      {/* ── Complete: download button ────────────────────────────────────── */}
      {stage === 'complete' && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200
            rounded-xl px-4 py-3.5">
            <span className="text-emerald-500 text-xl flex-shrink-0">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Your book is ready!</p>
              <p className="text-xs text-emerald-600 mt-0.5">
                Your personalised PDF has been generated. Click below to download it.
              </p>
            </div>
          </div>

          <a
            href={downloadUrl}
            download
            className="w-full py-4 rounded-xl font-semibold text-lg
              flex items-center justify-center gap-2.5
              bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white
              shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
          >
            ⬇ Download Your Book (PDF)
          </a>

          <p className="text-center text-xs text-slate-400">
            {email && <>A copy has also been sent to <strong>{email}</strong>.{' '}</>}
            <button
              onClick={handleRetry}
              className="text-violet-500 hover:text-violet-700 underline underline-offset-2 transition-colors"
            >
              Download again
            </button>
          </p>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {stage === 'error' && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200
            rounded-xl px-4 py-3">
            <span className="text-rose-500 text-xl flex-shrink-0">⚠</span>
            <div>
              <p className="text-sm font-semibold text-rose-800">Something went wrong</p>
              <p className="text-xs text-rose-600 mt-0.5">{errorMsg}</p>
            </div>
          </div>

          <button
            onClick={handleRetry}
            className="w-full py-4 rounded-xl font-semibold text-lg
              flex items-center justify-center gap-2
              bg-violet-600 hover:bg-violet-700 text-white shadow-lg
              hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
          >
            ↺ Try Again
          </button>
        </div>
      )}
    </div>
  )
}
