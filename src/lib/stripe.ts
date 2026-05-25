/**
 * Stripe server-side singleton — lazy initialisation.
 *
 * Import this wherever you need the Stripe Node SDK (API routes, services).
 * Never import this file into client components — it reads STRIPE_SECRET_KEY,
 * which must never be exposed to the browser.
 *
 * The client is created on first use rather than at module load time so that
 * Next.js can complete the build even when env vars haven't been set yet
 * (e.g. on the first Vercel deploy before secrets are wired up).
 * At request time the missing-key error surfaces immediately.
 */

import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (_stripe) return _stripe

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      'Missing STRIPE_SECRET_KEY. Set it in Vercel → Settings → Environment Variables.'
    )
  }

  _stripe = new Stripe(key, {
    apiVersion: '2024-06-20',
    typescript: true,
  })
  return _stripe
}

/**
 * Direct export kept for backwards compatibility.
 * Prefer getStripe() in new code — it gives a clearer error message.
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
