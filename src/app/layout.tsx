import type { Metadata, Viewport } from 'next'
import './globals.css'

// ── App URL ───────────────────────────────────────────────────────────────────
// NEXT_PUBLIC_APP_URL must be set in production (Vercel env vars).
// Falls back to localhost for local development.
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// ── Root metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  // metadataBase lets Next.js resolve relative image paths (e.g. /opengraph-image.png)
  // into fully-qualified URLs for og:image / twitter:image tags.
  metadataBase: new URL(APP_URL),

  // title.template applies to every child page that exports a string title.
  // The root default is shown when no child overrides it (i.e. the home page).
  title: {
    default:  'StoryWeave — Personalised Children\'s Storybooks',
    template: '%s | StoryWeave',
  },

  description:
    'Create a beautiful, personalised storybook that puts your child at the centre of a magical adventure. Choose from 5 stories, design their character, and download a stunning 24-page PDF in under a minute.',

  keywords: [
    'personalised storybook',
    'personalized children\'s book',
    'custom storybook for kids',
    'personalised gift for children',
    'digital children\'s book PDF',
    'kids storybook with their name',
    'unique gift for toddlers',
  ],

  // ── Open Graph ──────────────────────────────────────────────────────────────
  openGraph: {
    type:        'website',
    siteName:    'StoryWeave',
    url:         APP_URL,
    title:       'StoryWeave — Personalised Children\'s Storybooks',
    description: 'Create a beautiful, personalised storybook starring your child. 5 adventures to choose from — instant PDF download.',
    // /opengraph-image.png is served by src/app/opengraph-image.tsx
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'StoryWeave — personalised children\'s storybooks' }],
  },

  // ── Twitter / X card ────────────────────────────────────────────────────────
  twitter: {
    card:        'summary_large_image',
    title:       'StoryWeave — Personalised Children\'s Storybooks',
    description: 'Create a beautiful, personalised storybook starring your child. Instant PDF download.',
    images:      ['/opengraph-image.png'],
  },

  // ── Canonical & alternates ─────────────────────────────────────────────────
  alternates: {
    canonical: APP_URL,
  },

  // ── Indexing ────────────────────────────────────────────────────────────────
  // robots.ts handles the full rules file; this covers the meta tag fallback.
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:          true,
      follow:         true,
      'max-image-preview': 'large',
    },
  },
}

// ── Viewport (theme colour, width) ────────────────────────────────────────────
// Exported separately from metadata per Next.js 14 convention.
export const viewport: Viewport = {
  themeColor:    '#4c1d95',   // violet-900 — matches the hero gradient
  width:         'device-width',
  initialScale:  1,
}

// ── Root layout ───────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
