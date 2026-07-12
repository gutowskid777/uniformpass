'use client'

// A small "Verified by UniformPass" badge with a plain-English explainer on hover.
// Uses the native title tooltip on purpose: it can never be clipped by a card's
// overflow-hidden (the previous custom popup was, so it never showed on Browse cards).
export default function VerifiedBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      title="Operator-listed and quality-checked by UniformPass — we picked it up, checked it, and listed it ourselves."
      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow-sm cursor-help"
    >
      ✓ {compact ? 'Verified' : 'Verified by UniformPass'}
    </span>
  )
}
