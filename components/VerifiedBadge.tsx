'use client'

import { useId } from 'react'

export default function VerifiedBadge({ compact = false }: { compact?: boolean }) {
  const tooltipId = useId()

  return (
    <span className="relative inline-flex group/verified">
      <span
        role="button"
        tabIndex={0}
        aria-describedby={tooltipId}
        onClick={e => { e.preventDefault(); e.stopPropagation() }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow-sm cursor-help"
      >
        ✓ {compact ? 'Verified' : 'Verified by UniformPass'}
      </span>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute z-30 bottom-full right-0 mb-2 hidden w-52 rounded-lg bg-gray-900 px-3 py-2 text-left text-xs font-medium leading-snug text-white shadow-lg group-hover/verified:block group-focus-within/verified:block"
      >
        Operator-listed and quality-checked by UniformPass.
      </span>
    </span>
  )
}
