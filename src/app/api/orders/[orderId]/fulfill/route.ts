/**
 * POST /api/orders/[orderId]/fulfill
 *
 * Internal callback — called by the Fly.io PDF microservice after it has
 * finished generating and uploading the PDF.
 *
 * This endpoint is the "second half" of the fulfilment pipeline that runs
 * when PDF_SERVICE_URL is configured (i.e. in production).  In local dev
 * the entire pipeline runs inside pdf.service.ts without any HTTP calls.
 *
 * Security:
 *   Requests must carry  Authorization: Bearer <PDF_SERVICE_SECRET>
 *   The same secret is set on both Vercel and Fly.io — it is never exposed
 *   to the browser.
 *
 * Body:
 *   { success: true,  s3Key: string | null }   — PDF was generated OK
 *   { success: false, error: string }           — generation failed
 *
 * 200: { ok: true }
 * 400: { error: string }   — bad body
 * 401: { error: string }   — wrong or missing secret
 */

import { NextResponse }   from 'next/server'
import { cartStore }      from '@/lib/cart-store'
import { emailService }   from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface FulfillBody {
  success: boolean
  s3Key?:  string | null
  error?:  string
}

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params

  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = process.env.PDF_SERVICE_SECRET
  const auth   = req.headers.get('authorization')

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: FulfillBody
  try {
    body = await req.json() as FulfillBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  // ── Handle failure ────────────────────────────────────────────────────────
  if (!body.success) {
    console.error(`[fulfill] PDF generation failed for order ${orderId}:`, body.error)
    await cartStore.updateStatus(orderId, 'failed')
    return NextResponse.json({ ok: true })
  }

  // ── Handle success ────────────────────────────────────────────────────────
  console.log(`[fulfill] ✓ PDF ready for order ${orderId}, s3Key=${body.s3Key ?? 'none'}`)

  // Save the S3 / R2 object key if the PDF was uploaded
  if (body.s3Key) {
    await cartStore.setPdfKey(orderId, body.s3Key)
  }

  // Mark the order fulfilled (clients polling the status endpoint will see this)
  await cartStore.updateStatus(orderId, 'fulfilled')

  // Send "book is ready" email
  const order = await cartStore.get(orderId)
  if (order?.customerEmail) {
    emailService
      .sendBookReady({
        to:        order.customerEmail,
        childName: order.childName,
        bookTitle: order.bookTitle,
        orderId,
      })
      .catch(err => console.error('[fulfill] Book-ready email failed:', err))
  }

  return NextResponse.json({ ok: true })
}
