'use client'

import { useState } from 'react'
import { CharacterSVG } from './CharacterSVG'
import { getStoryPages } from '@/lib/story-templates'
import type { PersonalizationConfig } from '@/lib/types'

interface Props {
  config:     PersonalizationConfig
  bookId:     string
  bookTitle:  string
}

// Splits story text on {{NAME}} and highlights every occurrence
function renderStoryText(text: string, name: string) {
  const display = name.trim() || 'your child'
  const parts = text.split('{{NAME}}')
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && (
        <mark className="bg-yellow-200 text-yellow-900 px-1 py-0.5 rounded-md font-bold not-italic">
          {display}
        </mark>
      )}
    </span>
  ))
}

export function StoryPreview({ config, bookId, bookTitle }: Props) {
  const pages = getStoryPages(bookId)
  const [idx, setIdx] = useState(0)
  const page = pages[idx]

  return (
    <div className="space-y-4">
      {/* Book card */}
      <div
        className={`relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5
          bg-gradient-to-br ${page.gradient} transition-all duration-500`}
      >
        {/* Decorative corner stars */}
        <span className="absolute top-3 right-4 text-3xl opacity-10 select-none pointer-events-none">✦</span>
        <span className="absolute bottom-16 left-3 text-xl opacity-10 select-none pointer-events-none">✦</span>

        {/* Book header bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/50">
          <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
            {bookTitle}
          </p>
          <p className="text-[11px] text-slate-400 tabular-nums">
            Page {page.pageNumber}
          </p>
        </div>

        {/* Two-column layout: character | text */}
        <div className="flex flex-col sm:flex-row min-h-[300px]">
          {/* Character illustration */}
          <div className="sm:w-[38%] flex items-end justify-center px-4 pt-4 pb-6">
            <div className="w-36 h-48">
              <CharacterSVG appearance={config.appearance} name={config.childName} />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-white/60 my-6" />

          {/* Story text */}
          <div className="sm:w-[62%] flex items-center px-6 py-6">
            <p className={`font-serif text-[1.05rem] leading-relaxed italic text-slate-700 transition-opacity duration-300`}>
              {renderStoryText(page.text, config.childName)}
            </p>
          </div>
        </div>

        {/* Watermark ribbon */}
        <div className="bg-white/50 border-t border-white/70 px-5 py-2 text-center">
          <p className="text-[10px] text-slate-400 tracking-wide uppercase">
            Preview · Purchase to unlock all 24 pages
          </p>
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={idx === 0}
          aria-label="Previous page"
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500
            hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition"
        >
          ←
        </button>

        <div className="flex gap-2">
          {pages.map((p, i) => (
            <button
              key={p.pageNumber}
              onClick={() => setIdx(i)}
              aria-label={`Jump to page ${p.pageNumber}`}
              className={`rounded-full transition-all duration-200 ${
                i === idx
                  ? 'w-6 h-2.5 bg-violet-500'
                  : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setIdx(i => Math.min(pages.length - 1, i + 1))}
          disabled={idx === pages.length - 1}
          aria-label="Next page"
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500
            hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition"
        >
          →
        </button>
      </div>
    </div>
  )
}
