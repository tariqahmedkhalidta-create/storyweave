/**
 * POST /api/orders/[orderId]/progress
 *
 * Internal callback — called by the Render PDF microservice after each AI
 * illustration is generated, to relay live progress to the polling frontend.
 *
 * Security: same Bearer secret used by the fulfill endpoint.
 *
 * Body:  { message: string }
 * 200:   { ok: true }
 * 400/401: error
 */

import { NextResponse } from 'next/server'
import { cartStore }    from '@/lib/cart-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ProgressBody {
  message: string
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

  // ── Parse ─────────────────────────────────────────────────────────────────
  let body: ProgressBody
  try {
    body = await req.json() as ProgressBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!body.message || typeof body.message !== 'string') {
    return NextResponse.json({ error: 'message is required.' }, { status: 400 })
  }

  // ── Store ─────────────────────────────────────────────────────────────────
  await cartStore.updateProgress(orderId, body.message)

  return NextResponse.json({ ok: true })
}
