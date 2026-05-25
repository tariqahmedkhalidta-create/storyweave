import type { Metadata }        from 'next'
import { notFound }             from 'next/navigation'
import { PersonalizationTool }  from '@/components/personalization/PersonalizationTool'
import { getBook, BOOK_CATALOG } from '@/lib/catalog'

interface Props {
  params: { bookId: string }
}

// ── Static params ─────────────────────────────────────────────────────────────
// Pre-render all 5 book pages at build time so they're served as static HTML.
// New books added to BOOK_CATALOG are picked up automatically on the next build.
export function generateStaticParams() {
  return BOOK_CATALOG.map(b => ({ bookId: b.id }))
}

// ── Per-book metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = getBook(params.bookId)
  if (!book) return {}

  const title       = `Personalise "${book.title}"`
  const description = `${book.description} Starring your child — enter their name, design their character, and download a beautiful 24-page personalised PDF in under a minute.`
  // Relative path — resolved to a full URL via metadataBase in layout.tsx
  const ogImageUrl  = `/customize/${book.id}/opengraph-image.png`

  return {
    title,
    description,

    openGraph: {
      type:        'website',
      title:       `${book.title} — Personalised Storybook | StoryWeave`,
      description: book.description,
      images: [{
        url:    ogImageUrl,
        width:  1200,
        height: 630,
        alt:    `${book.title} — a personalised storybook by StoryWeave`,
      }],
    },

    twitter: {
      card:        'summary_large_image',
      title:       `${book.title} — Personalised Storybook`,
      description: book.tagline,
      images:      [ogImageUrl],
    },

    alternates: {
      canonical: `/customize/${book.id}`,
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CustomizePage({ params }: Props) {
  const book = getBook(params.bookId)
  if (!book) notFound()

  return (
    <main className="min-h-screen bg-slate-50">
      <PersonalizationTool
        bookId={book.id}
        bookTitle={book.title}
        priceFormatted={book.priceFormatted}
      />
    </main>
  )
}
