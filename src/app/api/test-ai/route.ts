/**
 * GET /api/test-ai
 * Temporary diagnostic endpoint — calls generateCharacterImage and reports the result.
 * Delete this file once AI illustrations are confirmed working.
 */
import { NextResponse } from 'next/server'
import { generateCharacterImage } from '@/lib/ai-character'

export const runtime    = 'nodejs'
export const maxDuration = 60

export async function GET() {
  const token = process.env.HUGGINGFACE_TOKEN
  if (!token) {
    return NextResponse.json({ ok: false, reason: 'HUGGINGFACE_TOKEN is not set in env' }, { status: 500 })
  }

  const start = Date.now()
  const result = await generateCharacterImage({
    skinTone:  'light',
    hairColor: 'brown',
    hairStyle: 'braided',
    eyeColor:  'brown',
  })
  const elapsed = Date.now() - start

  if (result) {
    return NextResponse.json({
      ok:      true,
      elapsed: `${elapsed}ms`,
      size:    `${Math.round(result.length / 1024)} KB (base64)`,
      preview: result.slice(0, 60) + '…',
    })
  }

  return NextResponse.json({
    ok:      false,
    elapsed: `${elapsed}ms`,
    reason:  'generateCharacterImage returned null — check server logs for the HTTP error',
  }, { status: 502 })
}
