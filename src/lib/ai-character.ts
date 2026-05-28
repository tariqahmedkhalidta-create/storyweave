/**
 * AI Character & Scene Illustration Generator
 *
 * Calls the Hugging Face Inference API (FLUX.1-schnell) to generate
 * watercolour children's-book-style illustrations.
 *
 *  generateCharacterImage(appearance)               → cover portrait (512×768)
 *  generateSceneImage(appearance, childName, scene) → story scene (384×640)
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

// ── Internal API helper ───────────────────────────────────────────────────────

// The HF router is at router.huggingface.co — the old api-inference.huggingface.co
// hostname no longer resolves from Vercel's servers.
const HF_ENDPOINT =
  'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell'

/** Sends one request to FLUX.1-schnell and returns a data-URL or null. */
async function callFlux(
  prompt: string,
  width:  number,
  height: number,
  label:  string,
): Promise<string | null> {
  const token = process.env.HUGGINGFACE_TOKEN
  if (!token) {
    console.warn('[ai-character] HUGGINGFACE_TOKEN not set — skipping AI illustration')
    return null
  }

  console.log(`[ai-character] ${label} — prompt: ${prompt.slice(0, 80)}…`)

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
          width,
          height,
        },
      }),
      signal: AbortSignal.timeout(60_000),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[ai-character] ${label} HF error ${res.status}:`, text.slice(0, 200))
      return null
    }

    const buffer = await res.arrayBuffer()
    const mime   = res.headers.get('content-type') ?? 'image/jpeg'
    const base64 = Buffer.from(buffer).toString('base64')

    console.log(`[ai-character] ✓ ${label} — ${Math.round(buffer.byteLength / 1024)} KB`)
    return `data:${mime};base64,${base64}`
  } catch (err) {
    console.error(`[ai-character] ${label} failed:`, err)
    return null
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Generates a cover character portrait via FLUX.1-schnell (512×768).
 * Returns a base64 data-URL or `null` on failure (caller falls back to SVG).
 */
export async function generateCharacterImage(
  appearance: AppearanceInput,
): Promise<string | null> {
  const prompt = buildCharacterPrompt(appearance)
  return callFlux(prompt, 512, 768, 'cover portrait')
}

/**
 * Generates a full scene illustration for a story page (384×640).
 *
 * @param appearance  Character appearance (injected for style consistency)
 * @param childName   Child's name — replaces {{NAME}} in scene descriptions
 * @param scene       Visual scene text from StoryPage.scene
 */
export async function generateSceneImage(
  appearance: AppearanceInput,
  childName:  string,
  scene:      string,
): Promise<string | null> {
  const skin = SKIN[appearance.skinTone]       ?? 'medium skin'
  const hc   = HAIR_COLOR[appearance.hairColor] ?? 'brown'
  const hs   = HAIR_STYLE[appearance.hairStyle] ?? 'straight'
  const eyes = EYES[appearance.eyeColor]        ?? 'brown'

  // Replace {{NAME}} placeholder with the real child's name
  const sceneText = scene.replace(/\{\{NAME\}\}/g, childName)

  const prompt =
    `children's book watercolor illustration, ${sceneText}, ` +
    `the young child has ${skin}, ${hc} ${hs} hair, ${eyes} eyes, ` +
    `full scene composition with detailed background, soft pastel colors, ` +
    `professional storybook art style, Quentin Blake meets Pixar, ` +
    `warm inviting atmosphere, no text, no speech bubbles`

  return callFlux(prompt, 384, 640, `scene — ${scene.slice(0, 40)}`)
}
