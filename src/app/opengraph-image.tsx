/**
 * Default OpenGraph / Twitter card image for the StoryWeave homepage.
 *
 * Served at /opengraph-image.png by Next.js — referenced automatically
 * via the Metadata API when og:image is not otherwise overridden.
 *
 * 1200 × 630 is the standard OG image size (Facebook / LinkedIn / iMessage).
 */

import { ImageResponse } from 'next/og'

export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
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
          background:     'linear-gradient(135deg, #3b0764 0%, #4c1d95 35%, #5b21b6 65%, #1e1b4b 100%)',
          fontFamily:     'sans-serif',
          color:          '#ffffff',
          padding:        '60px',
        }}
      >
        {/* Decorative dots */}
        <div style={{ position: 'absolute', top: 48,  left: 60,  width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ position: 'absolute', top: 72,  right: 80, width: 8,  height: 8,  borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', bottom: 60, left: 100, width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
        <div style={{ position: 'absolute', bottom: 40, right: 60, width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />

        {/* Logo mark - circle */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', marginBottom: 24 }} />

        {/* Brand name */}
        <div
          style={{
            fontSize:      88,
            fontWeight:    800,
            letterSpacing: '-2px',
            lineHeight:    1,
            marginBottom:  20,
          }}
        >
          StoryWeave
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize:   34,
            fontWeight: 400,
            opacity:    0.75,
            textAlign:  'center',
            maxWidth:   760,
            lineHeight: 1.4,
          }}
        >
          Personalised storybooks starring your child
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            marginTop:      28,
            fontSize:       22,
            fontWeight:     600,
            opacity:        0.55,
            letterSpacing:  '2px',
            textTransform:  'uppercase',
          }}
        >
          Instant PDF · 24 full-colour pages
        </div>
      </div>
    ),
    { ...size },
  )
}
