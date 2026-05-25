/**
 * Per-book OpenGraph / Twitter card image.
 *
 * Next.js resolves this file at  /customize/[bookId]/opengraph-image.png
 * and wires it into every og:image / twitter:image tag automatically.
 *
 * Each image uses the book's brand colours from the catalogue so that link
 * previews on social media match the in-app cover cards.
 */

import { ImageResponse }   from 'next/og'
import { getBook, BOOK_CATALOG } from '@/lib/catalog'

export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Pre-render all 5 books at build time
export function generateStaticParams() {
  return BOOK_CATALOG.map(b => ({ bookId: b.id }))
}

export default function OgImage({ params }: { params: { bookId: string } }) {
  const book = getBook(params.bookId)

  // Fall back to generic violet if the book slug is unknown
  const coverFrom  = book?.coverFrom  ?? '#3b0764'
  const coverTo    = book?.coverTo    ?? '#1e1b4b'
  const coverEmoji = book?.coverEmoji ?? '✦'
  const title      = book?.title      ?? 'StoryWeave'
  const tagline    = book?.tagline    ?? 'Personalised children\'s storybooks'

  return new ImageResponse(
    (
      <div
        style={{
          width:          '100%',
          height:         '100%',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          background:     `linear-gradient(135deg, ${coverFrom} 0%, ${coverTo} 100%)`,
          fontFamily:     'sans-serif',
          color:          '#ffffff',
          padding:        '60px 80px',
          position:       'relative',
        }}
      >
        {/* Decorative large circle — top right */}
        <div
          style={{
            position:     'absolute',
            top:          -80,
            right:        -80,
            width:        320,
            height:       320,
            borderRadius: '50%',
            background:   'rgba(255,255,255,0.06)',
          }}
        />
        {/* Decorative large circle — bottom left */}
        <div
          style={{
            position:     'absolute',
            bottom:       -100,
            left:         -60,
            width:        380,
            height:       380,
            borderRadius: '50%',
            background:   'rgba(0,0,0,0.12)',
          }}
        />

        {/* StoryWeave eyebrow label */}
        <div
          style={{
            fontSize:       18,
            fontWeight:     700,
            letterSpacing:  '4px',
            textTransform:  'uppercase',
            opacity:        0.55,
            marginBottom:   28,
          }}
        >
          StoryWeave · A Personalised Storybook
        </div>

        {/* Cover emoji */}
        <div style={{ fontSize: 100, lineHeight: 1, marginBottom: 32, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }}>
          {coverEmoji}
        </div>

        {/* Book title */}
        <div
          style={{
            fontSize:      80,
            fontWeight:    800,
            lineHeight:    1.1,
            textAlign:     'center',
            letterSpacing: '-1px',
            maxWidth:      900,
            marginBottom:  20,
            textShadow:    '0 2px 20px rgba(0,0,0,0.3)',
          }}
        >
          {title}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize:   30,
            fontWeight: 400,
            opacity:    0.75,
            textAlign:  'center',
            maxWidth:   700,
            lineHeight: 1.4,
          }}
        >
          {tagline}
        </div>

        {/* Bottom call-to-action strip */}
        <div
          style={{
            position:       'absolute',
            bottom:         0,
            left:           0,
            right:          0,
            height:         64,
            background:     'rgba(0,0,0,0.25)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontSize:       18,
            fontWeight:     600,
            letterSpacing:  '2px',
            textTransform:  'uppercase',
            opacity:        0.8,
          }}
        >
          Personalise with your child's name · Instant PDF Download
        </div>
      </div>
    ),
    { ...size },
  )
}
