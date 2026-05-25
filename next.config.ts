import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    /**
     * Keep native Node.js modules out of the webpack bundle.
     * Puppeteer, aws-sdk, and Prisma all rely on native bindings or
     * dynamic requires that webpack cannot handle correctly.
     *
     * When the /api/generate route is removed in favour of the Fly.io
     * PDF service, you can drop 'puppeteer' from this list.
     */
    serverComponentsExternalPackages: [
      'puppeteer',
      '@aws-sdk/client-s3',
      '@aws-sdk/s3-request-presigner',
      '@prisma/client',
    ],
  },
}

export default nextConfig
