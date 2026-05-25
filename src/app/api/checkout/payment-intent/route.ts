/**
 * POST /api/checkout/payment-intent
 *
 * Creates a Stripe PaymentIntent for an existing order and returns
 * the clientSecret to the browser. The clientSecret is used by
 * Stripe Elements on the client to complete the payment — it is safe
 * to expose to the browser but must only be used for this specific payment.
 *
 * Idempotency: if a PaymentIntent already exists for this order (e.g. the
 * user refreshed the checkout page) we return the existing clientSecret
 * rather than creating a second charge.
 *
 * Body:  { orderId: string }
 * 200:   { clientSecret: string }
 * 404:   { error: string }   — order not found
 * 500:   { error: string }   — Stripe or server error
 */

import { NextResponse } from 'next/server'
import { stripe }      from '@/lib/stripe'
import { cartStore }   from '@/lib/cart-store'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json() as { orderId?: string; email?: string }
    const { orderId, email } = body

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required.' }, { status: 400 })
    }

    const order = await cartStore.get(orderId)
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    // Persist the customer's email so we can send transactional emails later.
    // We do this eagerly (even before payment) so it survives a redirect.
    if (email && email !== order.customerEmail) {
      await cartStore.setCustomerEmail(orderId, email)
    }

    // ── Idempotency: reuse an existing PaymentIntent ────────────────────────
    if (order.stripePaymentIntentId) {
      const existing = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId)

      // Only reuse if it's still awaiting payment
      if (existing.status === 'requires_payment_method' || existing.status === 'requires_confirmation') {
        return NextResponse.json({ clientSecret: existing.client_secret })
      }
    }

    // ── Create a new PaymentIntent ──────────────────────────────────────────
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   order.priceCents,
      currency: 'usd',
      // automatic_payment_methods enables cards, Apple Pay, Google Pay, etc.
      automatic_payment_methods: { enabled: true },
      // orderId is stored in metadata so the webhook knows which order to fulfil
      metadata: { orderId },
      // Surface the order description in the Stripe Dashboard
      description: `${order.bookTitle} — personalised for ${order.childName}`,
      // receipt_email surfaces in the Stripe Dashboard and triggers Stripe's
      // own receipt if you have that feature enabled
      ...(email ? { receipt_email: email } : {}),
    })

    // Persist the PaymentIntent ID so we can reuse it on refresh
    await cartStore.setPaymentIntent(orderId, paymentIntent.id)

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('[payment-intent]', err)
    return NextResponse.json(
      { error: 'Could not create payment session. Please try again.' },
      { status: 500 }
    )
  }
}
