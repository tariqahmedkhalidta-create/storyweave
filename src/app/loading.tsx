export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-violet-200" />
          <div className="absolute inset-0 rounded-full border-4 border-violet-600
            border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-400">Loading…</p>
      </div>
    </main>
  )
}
