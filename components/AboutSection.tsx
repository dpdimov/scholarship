'use client'

import { useState } from 'react'

export default function AboutSection() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-gray-200 pt-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mx-auto text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
      >
        <span>Sources</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="mt-4 text-sm text-gray-600 leading-relaxed text-center space-y-2">
          <p>
            This project draws on two works by Dimo Dimov:
          </p>
          <p>
            <em>The Entrepreneurial Scholar</em> (Edward Elgar, 2020) — on scholarly identity,
            positioning, and the interplay between theory and practice.
          </p>
          <p>
            &ldquo;Philosophy of Entrepreneurship as Conceptual Housekeeping&rdquo;
            (<em>Entrepreneurship &amp; Regional Development</em>, 2024) — on the rigour of
            conceptual architecture within theory-building.
          </p>
        </div>
      )}
    </div>
  )
}
