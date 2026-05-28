/**
 * GET /api/test-ai
 * Temporary diagnostic endpoint — calls the HF API directly and reports every detail.
 * Delete this file once AI illustrations are confirmed working.
 */
import { NextResponse } from 'next/server'

export const runtime     = 'nodejs'
export const maxDuration = 60

const HF_ENDPOINT =
  'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell'

export async function GET() {
  const token = process.env.HUGGINGFACE_TOKEN

  // Report token status without exposing the value
  const tokenInfo = !token
    ? 'NOT SET (empty/undefined)'
    : `SET — length ${token.length}, starts with "${token.slice(0, 10)}…"`

  if (!token) {
    return NextResponse.json({ ok: false, tokenInfo }, { status: 500 })
  }

  const start = Date.now()
  let status = 0
  let contentType = ''
  let body = ''

  try {
    const res = await fetch(HF_ENDPOINT, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        inputs: "children's book illustration, adorable young child, brown braided hair, happy smile, watercolor style",
        parameters: { num_inference_steps: 1, width: 256, height: 384 },
      }),
      signal: AbortSignal.timeout(55_000),
    })

    status      = res.status
    contentType = res.headers.get('content-type') ?? 'unknown'
    const elapsed = Date.now() - start

    if (res.ok) {
      const buf = await res.arrayBuffer()
      return NextResponse.json({
        ok:          true,
        tokenInfo,
        status,
        contentType,
        elapsed:     `${elapsed}ms`,
        imageSizeKB: Math.round(buf.byteLength / 1024),
      })
    }

    // Error path — capture the response body
    body = await res.text().catch(() => '(could not read body)')
    return NextResponse.json({
      ok: false, tokenInfo, status, contentType, elapsed: `${elapsed}ms`,
      errorBody: body.slice(0, 500),
    }, { status: 502 })

  } catch (err: unknown) {
    const elapsed = Date.now() - start
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({
      ok: false, tokenInfo, status, elapsed: `${elapsed}ms`,
      exception: message,
    }, { status: 502 })
  }
}
