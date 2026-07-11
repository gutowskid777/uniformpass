import type { Metadata } from 'next'
import Link from 'next/link'
import QRCode from 'qrcode'
import { getTheme, scopedUrl, SCHOOL_CODES, SCHOOL_THEMES, SITE_URL } from '@/lib/schoolTheme'
import MonogramPatch from '@/components/MonogramPatch'
import FlyerScale from '@/components/FlyerScale'
import PrintButton from '@/components/PrintButton'
import '../flyer.css'

// A letter-size (8.5x11) flyer a parent can print and pin at school pickup,
// the parish hall, or the deli corkboard. Big QR straight to the school's
// scoped page. Designed at 816x1056px, previewed scaled, printed exact.

export function generateStaticParams() {
  return [...SCHOOL_CODES.map(code => ({ school: code })), { school: 'all' }]
}

export function generateMetadata({ params }: { params: { school: string } }): Metadata {
  const theme = getTheme(params.school)
  const name = theme ? theme.fullName : 'UniformPass'
  return {
    title: `${name} flyer · print and share`,
    robots: { index: false },
  }
}

const TRUST_ITEMS = ['No fees', 'No shipping', 'Meet up local', 'Run by NJ parents']

function Check({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20, color }} aria-hidden>
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
    </svg>
  )
}

export default async function FlyerPage({ params }: { params: { school: string } }) {
  const theme = getTheme(params.school)
  const isGeneric = !theme

  const qrTarget = theme ? scopedUrl(theme.code) : SITE_URL
  const qrSvg = await QRCode.toString(qrTarget, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#111827', light: '#0000' },
  })

  const primary = theme?.primary ?? '#4338CA'
  const accent = theme?.accent ?? '#C7D2FE'
  const wash = theme?.wash ?? '#EEF2FF'
  const ink = theme?.ink ?? '#312E81'
  const short = theme?.shortName ?? 'school'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Screen-only controls */}
      <div className="no-print mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          {isGeneric ? 'The UniformPass flyer' : `The ${theme.fullName} flyer`}
        </h1>
        <p className="text-gray-600 mt-2 text-base">
          Print it on plain paper. Pin it at school pickup, the parish hall, the deli corkboard.
          The QR goes straight to {isGeneric ? 'uniformpass.shop' : `the ${short} page`}.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <PrintButton />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Other flyers:</span>
            {[...SCHOOL_CODES, 'all'].filter(c => c !== params.school).map(c => (
              <Link key={c} href={`/flyer/${c}`} className="font-semibold text-gray-700 underline underline-offset-2 hover:text-gray-900">
                {c === 'all' ? 'All schools' : SCHOOL_THEMES[c].monogram}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* The sheet */}
      <FlyerScale>
        <div className="flyer-sheet shadow-xl rounded-lg overflow-hidden" style={{ display: 'flex', flexDirection: 'column', padding: 40 }}>
          {/* School band */}
          {theme ? (
            <div style={{ background: theme.primary, borderRadius: 24, padding: '26px 30px', display: 'flex', alignItems: 'center', gap: 24 }}>
              <MonogramPatch theme={theme} size={92} />
              <div>
                <div style={{ color: '#fff', fontSize: 40, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                  {theme.fullName}
                </div>
                <div style={{ color: theme.accent, fontSize: 19, fontWeight: 700, marginTop: 6 }}>
                  {theme.town} · {theme.mascot} families
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: primary, borderRadius: 24, padding: '26px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#fff', fontSize: 40, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                  The uniform exchange
                </div>
                <div style={{ color: accent, fontSize: 19, fontWeight: 700, marginTop: 6 }}>
                  For NJ private school families
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {SCHOOL_CODES.map(c => (
                  <MonogramPatch key={c} theme={SCHOOL_THEMES[c]} size={64} />
                ))}
              </div>
            </div>
          )}

          {/* Headline */}
          <div style={{ marginTop: 34 }}>
            <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.0, color: '#111827' }}>
              Skip the $80 uniform.
            </div>
            <div style={{ fontSize: 22, color: '#374151', marginTop: 14, lineHeight: 1.4, maxWidth: 660 }}>
              {isGeneric
                ? 'Buy and sell used uniforms with families from your school. No fees, no shipping... you just meet up.'
                : `Buy and sell used ${short} uniforms with ${short} families near you. No fees, no shipping... you just meet up.`}
            </div>
          </div>

          {/* QR + offers */}
          <div style={{ display: 'flex', gap: 24, marginTop: 30, flex: 1 }}>
            {/* QR block */}
            <div style={{ width: 296, borderRadius: 24, border: `3px solid ${primary}`, padding: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="flyer-qr" style={{ width: 220, height: 220 }} dangerouslySetInnerHTML={{ __html: qrSvg }} />
              <div style={{ fontSize: 17, fontWeight: 700, color: '#374151', marginTop: 20, textAlign: 'center' }}>
                Point your camera here
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: primary, marginTop: 4, letterSpacing: '-0.01em' }}>
                uniformpass.shop
              </div>
            </div>

            {/* Offer cards */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: wash, borderRadius: 24, padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: ink, textTransform: 'uppercase' }}>
                  Buying
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 8 }}>
                  <span style={{ fontSize: 34, fontWeight: 700, color: '#9CA3AF', textDecoration: 'line-through' }}>$80</span>
                  <span style={{ fontSize: 56, fontWeight: 900, color: primary, letterSpacing: '-0.02em' }}>$15</span>
                  <span style={{ background: '#16A34A', color: '#fff', fontSize: 17, fontWeight: 800, borderRadius: 999, padding: '6px 14px' }}>
                    You save $65
                  </span>
                </div>
                <div style={{ fontSize: 17, color: '#4B5563', marginTop: 8 }}>
                  Blazers, polos, pants, spirit wear... listed by {isGeneric ? 'local' : short} families.
                </div>
              </div>

              <div style={{ background: primary, borderRadius: 24, padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: accent, textTransform: 'uppercase' }}>
                  Selling
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginTop: 8, lineHeight: 1.1 }}>
                  Keep 50%. Do nothing.
                </div>
                <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginTop: 8, lineHeight: 1.4 }}>
                  Outgrown pile? We pick it up, sell it for you, and you get half. Free pickup.
                </div>
              </div>
            </div>
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, padding: '0 6px' }}>
            <div style={{ display: 'flex', gap: 22 }}>
              {TRUST_ITEMS.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Check color="#16A34A" />
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#6B7280' }}>UniformPass</div>
          </div>

          {/* Tear-off tabs */}
          <div style={{ marginTop: 24, borderTop: '2px dashed #9CA3AF', position: 'relative', display: 'flex' }}>
            <span style={{ position: 'absolute', top: -13, left: 10, background: '#fff', padding: '0 6px', fontSize: 15, color: '#6B7280' }} aria-hidden>
              ✂
            </span>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 128,
                  borderLeft: i === 0 ? 'none' : '2px dashed #D1D5DB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 10,
                }}
              >
                <span
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#111827',
                    letterSpacing: '0.01em',
                  }}
                >
                  uniformpass.shop
                </span>
              </div>
            ))}
          </div>
        </div>
      </FlyerScale>

      {/* Screen-only footer note */}
      <p className="no-print text-sm text-gray-400 mt-6 text-center">
        Prints on one letter-size page. Color looks best, but it holds up in black and white.
      </p>
    </div>
  )
}
