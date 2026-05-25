import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
          bg-violet-100 mb-6 text-3xl">
          📖
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
          Page not found
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          This page doesn't exist — or the link may have expired.
          Head back to the home page to browse our storybooks.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-xl
            bg-violet-600 hover:bg-violet-700 text-white font-semibold
            shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          ← Back to StoryWeave
        </Link>
      </div>
    </main>
  )
}
