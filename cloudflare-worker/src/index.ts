interface Env {
  BUCKET: R2Bucket
  AUTH_SECRET: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const auth = request.headers.get('Authorization')
    if (!env.AUTH_SECRET || auth !== `Bearer ${env.AUTH_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    const url = new URL(request.url)
    const key = decodeURIComponent(url.pathname.slice(1)) // strip leading /

    if (!key) {
      return new Response('Key required', { status: 400 })
    }

    try {
      switch (request.method) {
        // ── Upload ─────────────────────────────────────────────────────────
        case 'PUT': {
          await env.BUCKET.put(key, request.body, {
            httpMetadata: { contentType: 'application/pdf' },
          })
          return Response.json({ ok: true, key })
        }

        // ── Download ───────────────────────────────────────────────────────
        case 'GET': {
          const obj = await env.BUCKET.get(key)
          if (!obj) {
            return new Response('Not Found', { status: 404 })
          }
          return new Response(obj.body, {
            headers: {
              'Content-Type':   'application/pdf',
              'Content-Length': String(obj.size),
            },
          })
        }

        default:
          return new Response('Method Not Allowed', { status: 405 })
      }
    } catch (err) {
      console.error('[r2-proxy] error:', err)
      return new Response(`Internal Error: ${err}`, { status: 500 })
    }
  },
}
