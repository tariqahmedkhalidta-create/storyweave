import type { MetadataRoute } from 'next'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://storyweave.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        // Exclude transactional, API, and order-state pages from indexing
        disallow:  ['/api/', '/checkout/', '/admin/'],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
