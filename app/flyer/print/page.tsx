import type { Metadata } from 'next'
import QRCode from 'qrcode'
import { SITE_URL } from '@/lib/schoolTheme'
import FlyerScale from '@/components/FlyerScale'
import PrintButton from '@/components/PrintButton'
import FlyerTabs from '@/components/FlyerTabs'
import '../flyer.css'

// The paper flyer: one school-neutral letter-size sheet for the corkboard at
// pickup, the parish hall, the deli. Mirrors the digital flyer's look (bold
// indigo hero + two doors + QR) with tear-off tabs added for paper.
// Designed at 816x1056px, previewed scaled, printed exact.

export const metadata: Metadata = {
  title: 'Print the UniformPass flyer',
  robots: { index: false },
}

const PRIMARY_DARK = '#312E81'
const ACCENT = '#FDE68A'

function Hanger({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 13 v-1.8 a2.3 2.3 0 1 0 -2.3 -2.3" />
        <path d="M16 13 L6 22 H26 Z" />
      </g>
    </svg>
  )
}

function Cash({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="9" width="26" height="14" rx="2.5" />
        <circle cx="16" cy="16" r="4" />
        <path d="M7.5 13v6M24.5 13v6" />
      </g>
    </svg>
  )
}

function Door({ icon, title, line, highlight }: { icon: React.ReactNode; title: string; line: string; highlight?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: highlight ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
        border: highlight ? `3px solid ${ACCENT}` : '2px solid rgba(255,255,255,0.26)',
        borderRadius: 26,
        padding: '26px 22px',
      }}
    >
      <div style={{ width: 78, height: 78, borderRadius: 999, background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-1px', marginTop: 16 }}>{title}</div>
      <div style={{ fontSize: 18, lineHeight: 1.3, marginTop: 8, color: 'rgba(255,255,255,0.9)' }}>{line}</div>
    </div>
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
        <FlyerTabs />
        <div className="mt-5">
          <PrintButton />
        </div>
      </div>

      {/* The sheet */}
      <FlyerScale>
        <div className="flyer-sheet shadow-xl rounded-lg overflow-hidden" style={{ display: 'flex', flexDirection: 'column', padding: 40, gap: 22 }}>
          {/* Hero: same bold indigo look as the digital flyer */}
          <div
            style={{
              flex: 1,
              background: 'linear-gradient(160deg, #312E81 0%, #4338CA 55%, #4F46E5 100%)',
              borderRadius: 30,
              padding: '44px 46px',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Wordmark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Hanger size={42} color="#ffffff" />
              <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-1px' }}>UniformPass</div>
            </div>

            {/* Headline */}
            <div style={{ fontSize: 80, fontWeight: 900, letterSpacing: '-3px', lineHeight: 1.0, marginTop: 40 }}>
              Turn uniforms into cash.
            </div>
            <div style={{ fontSize: 24, lineHeight: 1.35, marginTop: 22, color: 'rgba(255,255,255,0.92)', maxWidth: 620 }}>
              Sell what your kids outgrew... or shop your school&apos;s used uniforms.
            </div>

            {/* Two doors: the do-nothing pickup leads */}
            <div style={{ display: 'flex', gap: 20, marginTop: 'auto' }}>
              <Door
                highlight
                icon={<Cash size={44} color={ACCENT} />}
                title="Auto Sell"
                line="We pick up your pile. You get cash."
              />
              <Door
                icon={<Hanger size={44} color={ACCENT} />}
                title="Buy and sell"
                line="Your school's marketplace for uniforms and merch."
              />
            </div>
          </div>

          {/* QR card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, background: '#fff', border: '2px solid #E5E7EB', borderRadius: 26, padding: '22px 30px' }}>
            <div className="flyer-qr" style={{ width: 150, height: 150, flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.14em', color: '#6366F1', textTransform: 'uppercase' }}>
                Scan to start
              </div>
              <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: '-2px', color: PRIMARY_DARK, marginTop: 4 }}>
                uniformpass.shop
              </div>
              <div style={{ fontSize: 19, fontWeight: 600, color: '#6B7280', marginTop: 8 }}>
                No fees · No shipping · Meet locally
              </div>
            </div>
          </div>

          {/* Tear-off tabs */}
          <div style={{ borderTop: '2px dashed #9CA3AF', position: 'relative', display: 'flex' }}>
            <span style={{ position: 'absolute', top: -13, left: 10, background: '#fff', padding: '0 6px', fontSize: 15, color: '#6B7280' }} aria-hidden>
              ✂
            </span>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 116,
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
                    color: '#312E81',
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
    </div>
  )
}
