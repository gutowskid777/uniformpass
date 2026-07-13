import type { Metadata } from 'next'
import Link from 'next/link'
import QRCode from 'qrcode'
import { SITE_URL } from '@/lib/schoolTheme'
import FlyerScale from '@/components/FlyerScale'
import PrintButton from '@/components/PrintButton'
import '../flyer.css'

// The paper flyer: one school-neutral letter-size sheet with a QR code and
// tear-off tabs, for the corkboard at pickup, the parish hall, the deli.
// Designed at 816x1056px, previewed scaled, printed exact.

export const metadata: Metadata = {
  title: 'Print the UniformPass flyer',
  robots: { index: false },
}

const PRIMARY = '#4338CA'
const PRIMARY_DARK = '#312E81'
const ACCENT = '#C7D2FE'
const WASH = '#EEF2FF'

const TRUST_ITEMS = ['No fees', 'No shipping', 'Meet up locally in NJ']

function Check({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20, color }} aria-hidden>
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
    </svg>
  )
}

export default async function FlyerPrintPage() {
  const qrSvg = await QRCode.toString(SITE_URL, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#111827', light: '#0000' },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Screen-only controls */}
      <div className="no-print mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">The paper flyer</h1>
        <p className="text-gray-600 mt-2 text-base">
          Print on plain paper. Pin it at school pickup, the parish hall, the deli corkboard.
          Sharing in a group chat instead?{' '}
          <Link href="/flyer" className="font-semibold text-indigo-600 underline underline-offset-2">
            Use the digital flyer
          </Link>.
        </p>
        <div className="mt-4">
          <PrintButton />
        </div>
      </div>

      {/* The sheet */}
      <FlyerScale>
        <div className="flyer-sheet shadow-xl rounded-lg overflow-hidden" style={{ display: 'flex', flexDirection: 'column', padding: 40 }}>
          {/* Brand band */}
          <div style={{ background: PRIMARY_DARK, borderRadius: 24, padding: '26px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#fff', fontSize: 40, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                The uniform exchange
              </div>
              <div style={{ color: ACCENT, fontSize: 19, fontWeight: 700, marginTop: 6 }}>
                For NJ private school families
              </div>
            </div>
            <svg width="64" height="64" viewBox="0 0 32 32" aria-hidden>
              <g fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 13 v-1.8 a2.3 2.3 0 1 0 -2.3 -2.3" />
                <path d="M16 13 L6 22 H26 Z" />
              </g>
            </svg>
          </div>

          {/* Headline */}
          <div style={{ marginTop: 34 }}>
            <div style={{ fontSize: 62, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.0, color: '#111827' }}>
              Turn uniforms into cash.
            </div>
            <div style={{ fontSize: 22, color: '#374151', marginTop: 16, lineHeight: 1.4, maxWidth: 660 }}>
              Sell what your kids outgrew... or shop your school&apos;s used uniforms.
            </div>
          </div>

          {/* QR + offers */}
          <div style={{ display: 'flex', gap: 24, marginTop: 30, flex: 1 }}>
            {/* QR block */}
            <div style={{ width: 296, borderRadius: 24, border: `3px solid ${PRIMARY}`, padding: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="flyer-qr" style={{ width: 220, height: 220 }} dangerouslySetInnerHTML={{ __html: qrSvg }} />
              <div style={{ fontSize: 17, fontWeight: 700, color: '#374151', marginTop: 20, textAlign: 'center' }}>
                Point your camera here
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: PRIMARY, marginTop: 4, letterSpacing: '-0.01em' }}>
                uniformpass.shop
              </div>
            </div>

            {/* Offer cards: Auto Sell leads */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: PRIMARY_DARK, borderRadius: 24, padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: ACCENT, textTransform: 'uppercase' }}>
                  Auto Sell
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginTop: 8, lineHeight: 1.1 }}>
                  You do nothing.
                </div>
                <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginTop: 8, lineHeight: 1.4 }}>
                  We pick up your pile. You get cash.
                </div>
              </div>

              <div style={{ background: WASH, borderRadius: 24, padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: PRIMARY_DARK, textTransform: 'uppercase' }}>
                  Buy and sell
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: PRIMARY_DARK, letterSpacing: '-0.02em', marginTop: 8, lineHeight: 1.1 }}>
                  Exactly what you need.
                </div>
                <div style={{ fontSize: 17, color: '#4B5563', marginTop: 8 }}>
                  Your school&apos;s marketplace for uniforms and merch.
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

      <p className="no-print text-sm text-gray-400 mt-6 text-center">
        Prints on one letter-size page. Color looks best, but it holds up in black and white.
      </p>
    </div>
  )
}
