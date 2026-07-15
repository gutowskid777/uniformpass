'use client'

// The badge's meaning is rendered inline, not in a title tooltip: the launch audience
// is on phones and hover does not exist on touch. `compact` is for grid cards, where
// there is no room for the explainer.
export default function VerifiedBadge({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow-sm">
        ✓ Verified
      </span>
    )
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow-sm">
        ✓ Verified by UniformPass
      </span>
      <span className="text-xs text-gray-500">We picked it up and checked it ourselves.</span>
    </span>
  )
}
