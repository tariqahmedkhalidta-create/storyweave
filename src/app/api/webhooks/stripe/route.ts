/**
 * POST /api/webhooks/stripe
 *
 * Receives signed events from Stripe and fulfils orders after payment.
 *
 * IMPORTANT — Raw body requirement:
 *   Stripe signature verification requires the exact raw request body.
 *   We read it with `req.text()` BEFORE any JSON parsing. Never use
 *   `req.json()` here — it re-serialises the body and breaks the HMAC check.
 *
 * Security model:
 *   Every incoming request is verified against STRIPE_WEBHOOK_SECRET using
 *   stripe.webhooks.constructEvent(). Requests with invalid or missing
 *   signatures are rejected with 400 before any business logic runs.
 *
 * Idempotency:
 *   Stripe may deliver the same event more than once. The guard
 *   `order.status === 'pending_payment' || order.status === 'paid'`
 *   ensures we only trigger PDF generation once per order.
 *
 * Timeout:
 *   Stripe expects a 200 within ~30 s. PDF generation (Puppeteer) can
 *   take longer, so we fire it as a background promise and return 200
 *   immediately. In production, enqueue a BullMQ job here instead.
 */

import { NextResponse }    from 'next/server'
import type Stripe         from 'stripe'
import { stripe }          from '@/lib/stripe'
import { cartStore }       from '@/lib/cart-store'
import { dispatchPDFJob } from '@/services/pdf.service'
import { emailService }    from '@/lib/email'

export const runtime = 'nodejs'

// Do NOT let Next.js parse the body — we need the raw bytes for HMAC
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // ── 1. Read raw body ──────────────────────────────────────────────────────
  const rawBody  = await req.text()
  const sigHeader = req.headers.get('stripe-signature')

  if (!sigHeader) {
    console.warn('[webhook] Request missing stripe-signature header')
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 })
  }

  // ── 2. Verify Stripe signature ────────────────────────────────────────────
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sigHeader,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.warn('[webhook] Signature verification failed:', msg)
    // Return 400 so Stripe knows delivery failed and can alert you
    return NextResponse.json({ error: `Webhook signature invalid: ${msg}` }, { status: 400 })
  }

  // ── 3. Route event types ──────────────────────────────────────────────────
  switch (event.type) {

    case 'payment_intent.succeeded': {
      const pi      = event.data.object as Stripe.PaymentIntent
      const orderId = pi.metadata?.orderId

      if (!orderId) {
        console.error('[webhook] payment_intent.succeeded missing orderId in metadata', pi.id)
        break
      }

      const order = await cartStore.get(orderId)
      if (!order) {
        console.error('[webhook] Order not found for orderId:', orderId)
        break
      }

      // Guard against duplicate delivery
      if (order.status !== 'pending_payment') {
        console.log(`[webhook] Order ${orderId} already processed (status: ${order.status}), skipping.`)
        break
      }

      console.log(`[webhook] ✓ Payment succeeded for order ${orderId}`)
      await cartStore.updateStatus(orderId, 'paid')

      // Send order confirmation email (fire-and-forget, non-fatal)
      if (order.customerEmail) {
        emailService.sendOrderConfirmation({
          to:        order.customerEmail,
          childName: order.childName,
          bookTitle: order.bookTitle,
          orderId,
        }).catch(err => console.error('[webhook] Order confirmation email failed:', err))
      }

      // Dispatch PDF generation — fire-and-forget so we return 200 to Stripe
      // immediately.  In dev: runs Puppeteer in-process.  In prod: HTTP POST
      // to the Fly.io PDF microservice which calls back when done.
      dispatchPDFJob(orderId)

      break
    }

    case 'payment_intent.payment_failed': {
      const pi      = event.data.object as Stripe.PaymentIntent
      const orderId = pi.metadata?.orderId
      if (orderId) {
        console.warn(`[webhook] Payment failed for order ${orderId}`)
        await cartStore.updateStatus(orderId, 'failed')
      }
      break
    }

    default:
      // Unhandled event type — log and ignore
      console.log(`[webhook] Unhandled event type: ${event.type}`)
  }

  // ── 4. Acknowledge receipt ────────────────────────────────────────────────
  // Always return 200 for successfully processed events. Returning 4xx/5xx
  // here (for business logic errors) would cause Stripe to retry needlessly.
  return NextResponse.json({ received: true })
}
