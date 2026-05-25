/**
 * POST /api/generate/[orderId]
 *
 * Triggers PDF generation for the given order and returns a download URL.
 * In production this would be called by the Stripe webhook after payment
 * succeeds. During development / testing it can be called directly.
 *
 * Response 200: { downloadUrl: string; cached: boolean }
 * Response 404: { error: string }   — order not found
 * Response 500: { error: string }   — generation failed
 */

import { NextResponse } from 'next/server'
import { generateBookPDF } from '@/services/pdf.service'

// Must run in Node.js — Puppeteer is not compatible with the Edge runtime
export const runtime = 'nodejs'

// Puppeteer can take 10-20s to start + render; raise the timeout ceiling
export const maxDuration = 60

export async function POST(
  _req: Request,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params

  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId.' }, { status: 400 })
  }

  const result = await generateBookPDF(orderId)

  if (!result.success) {
    const status = result.error === 'Order not found.' ? 404 : 500
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({
    downloadUrl: result.downloadUrl,
    cached:      result.cached,
  })
}
