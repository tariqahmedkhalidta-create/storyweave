/**
 * AI Character Illustration Generator
 *
 * Calls the Hugging Face Inference API (FLUX.1-schnell) to generate a
 * watercolour children's-book-style character illustration.
 *
 * Returns a base64 data-URL ready to drop into an <img> tag, or null if
 * the token is missing / the API call fails (caller falls back to SVG).
 */

export interface AppearanceInput {
  skinTone:  string
  hairColor: string
  hairStyle: string
  eyeColor:  string
}

// ── Human-readable description maps ──────────────────────────────────────────

const SKIN: Record<string, string> = {
  'light':        'fair light skin',
  'medium-light': 'medium-light skin',
  'medium':       'medium olive skin',
  'medium-dark':  'medium-dark brown skin',
  'dark':         'deep dark brown skin',
}

const HAIR_COLOR: Record<string, string> = {
  blonde: 'blonde',
  red:    'bright red',
  brown:  'brown',
  black:  'black',
  auburn: 'auburn reddish-brown',
}

const HAIR_STYLE: Record<string, string> = {
  straight: 'straight',
  wavy:     'wavy',
  curly:    'curly',
  coily:    'coily afro',
  braided:  'braided',
}

const EYES: Record<string, string> = {
  blue:  'blue',
  green: 'green',
  brown: 'brown',
  hazel: 'hazel',
  gray:  'gray',
}

// ── Prompt builder ────────────────────────────────────────────────────────────

export function buildCharacterPrompt(appearance: AppearanceInput): string {
  const skin  = SKIN[appearance.skinTone]       ?? 'medium skin'
  const hc    = HAIR_COLOR[appearance.hairColor] ?? 'brown'
  const hs    = HAIR_STYLE[appearance.hairStyle] ?? 'straight'
  const eyes  = EYES[appearance.eyeColor]        ?? 'brown'

  return (
    `children's book illustration, adorable young child, ${skin}, ` +
    `${hc} ${hs} hair, ${eyes} eyes, big expressive sparkling eyes, rosy cheeks, ` +
    `happy smile showing teeth, wearing a colorful outfit with shorts and sneakers, ` +
    `full body standing pose, white background, ` +
    `professional watercolor storybook art style, soft pastel colors, ` +
    `Quentin Blake meets Pixar, clean crisp illustration, no text, no shadows`
  )
}

// ── API call ──────────────────────────────────────────────────────────────────

const HF_ENDPOINT =
  'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell/v1/text-to-image'

/**
 * Generates a character illustration via FLUX.1-schnell on Hugging Face.
 * Returns a base64 data-URL (`data:image/jpeg;base64,...`) or `null` on failure.
 */
export async function generateCharacterImage(
  appearance: AppearanceInput,
): Promise<string | null> {
  const token = process.env.HUGGINGFACE_TOKEN
  if (!token) {
    console.warn('[ai-character] HUGGINGFACE_TOKEN not set — skipping AI illustration')
    return null
  }

  const prompt = buildCharacterPrompt(appearance)
  console.log('[ai-character] Generating with prompt:', prompt.slice(0, 80) + '…')

  try {
    const res = await fetch(HF_ENDPOINT, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 4,   // schnell works in 1–4 steps
          width:               512,
          height:              768, // portrait orientation for character
          guidance_scale:      0,   // schnell ignores CFG
        },
      }),
      signal: AbortSignal.timeout(60_000),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[ai-character] HF error', res.status, text.slice(0, 200))
      return null
    }

    const buffer   = await res.arrayBuffer()
    const mime     = res.headers.get('content-type') ?? 'image/jpeg'
    const base64   = Buffer.from(buffer).toString('base64')

    console.log(`[ai-character] ✓ Generated ${Math.round(buffer.byteLength / 1024)} KB`)
    return `data:${mime};base64,${base64}`
  } catch (err) {
    console.error('[ai-character] Failed:', err)
    return null
  }
}
