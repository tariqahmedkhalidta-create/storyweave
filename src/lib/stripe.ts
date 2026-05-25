/**
 * Stripe server-side singleton.
 *
 * Import this wherever you need the Stripe Node SDK (API routes, services).
 * Never import this file into client components — it reads STRIPE_SECRET_KEY,
 * which must never be exposed to the browser.
 */

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    'Missing STRIPE_SECRET_KEY. Add it to .env.local — see .env.local.example.'
  )
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
})
