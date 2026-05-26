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
        {/* Decorative stars */}
        <div style={{ position: 'absolute', top: 48,  left: 60,  fontSize: 32, opacity: 0.15 }}>★</div>
        <div style={{ position: 'absolute', top: 72,  right: 80, fontSize: 24, opacity: 0.12 }}>★</div>
        <div style={{ position: 'absolute', bottom: 60, left: 100, fontSize: 20, opacity: 0.10 }}>★</div>
        <div style={{ position: 'absolute', bottom: 40, right: 60, fontSize: 28, opacity: 0.12 }}>★</div>

        {/* Logo mark */}
        <div style={{ fontSize: 64, marginBottom: 24, opacity: 0.9 }}>★</div>

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
