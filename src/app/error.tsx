'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface Props {
  error:  Error & { digest?: string }
  reset:  () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Log to your error tracking service here (e.g. Sentry)
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
          bg-rose-100 mb-6 text-3xl">
          ⚠
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          An unexpected error occurred. Please try again — if the problem
          persists, contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700
              text-white font-semibold shadow-lg hover:-translate-y-0.5
              transition-all duration-200"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border-2 border-slate-200
              hover:border-violet-300 text-slate-600 hover:text-violet-700
              font-semibold transition-colors duration-200"
          >
            ← Home
          </Link>
        </div>
      </div>
    </main>
  )
}
