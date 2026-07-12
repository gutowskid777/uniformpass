import type { SchoolTheme } from '@/lib/schoolTheme'

// The per-school identity unit: a varsity "patch" with the school initials.
// Deliberately NOT the school's real crest (trademark risk, no assets).
// Inline styles only so the exact same component renders in the DOM, in the
// printable flyer, and inside satori (the /api/og ImageResponse).

export default function MonogramPatch({ theme, size }: { theme: SchoolTheme; size: number }) {
  const letters = theme.monogram
  const fontSize = Math.round(size * (letters.length >= 3 ? 0.34 : 0.44))
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
        background: theme.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: Math.round(size * 0.07),
          left: Math.round(size * 0.07),
          right: Math.round(size * 0.07),
          bottom: Math.round(size * 0.07),
          borderRadius: Math.round(size * 0.16),
          border: `${Math.max(1, Math.round(size * 0.022))}px solid ${theme.accent}`,
          opacity: 0.9,
          display: 'flex',
        }}
      />
      <span
        style={{
          color: '#ffffff',
          fontSize,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {letters}
      </span>
    </div>
  )
}
