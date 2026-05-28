/**
 * GET /api/orders/[orderId]/status
 *
 * Lightweight polling endpoint used by the checkout page to detect when
 * the Stripe webhook has been received and the PDF has been generated.
 *
 * The client polls every 2 s after a successful payment confirmation.
 *
 * 200: { status: OrderStatus; downloadUrl: string | null }
 * 404: { error: string }
 */

import { NextResponse } from 'next/server'
import { cartStore }    from '@/lib/cart-store'

export const runtime = 'nodejs'

// Disable caching — status changes frequently during PDF generation
export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { orderId: string } }
) {
  const order = await cartStore.get(params.orderId)

  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
  }

  return NextResponse.json({
    status:          order.status,
    downloadUrl:     order.status === 'fulfilled'
      ? `/api/download/${params.orderId}`
      : null,
    progressMessage: order.progressMessage ?? null,
  })
}
