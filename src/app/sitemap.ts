import type { MetadataRoute } from 'next'
import { BOOK_CATALOG }       from '@/lib/catalog'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://storyweave.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url:             APP_URL,
      lastModified:    now,
      changeFrequency: 'weekly',
      priority:        1.0,
    },
  ]

  const bookRoutes: MetadataRoute.Sitemap = BOOK_CATALOG.map(book => ({
    url:             `${APP_URL}/customize/${book.id}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.8,
  }))

  return [...staticRoutes, ...bookRoutes]
}
