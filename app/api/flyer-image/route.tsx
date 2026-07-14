import { ImageResponse } from 'next/og'
import QRCode from 'qrcode'
import { SITE_URL } from '@/lib/schoolTheme'
import { loadOgFonts } from '@/lib/ogFonts'

export const runtime = 'edge'

// The digital flyer. One job (per the GTM playbook): a parent in a school
// group, 3 seconds, sees the two doors... need uniforms -> shop your school;
// outgrown pile -> we pick it up, you get cash. School-neutral on purpose.
// ~35 words total. Everything else lives on the site, not the flyer.

const SIZE = { width: 1080, height: 1350 }

function Hanger({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 13 v-1.8 a2.3 2.3 0 1 0 -2.3 -2.3" />
        <path d="M16 13 L6 22 H26 Z" />
      </g>
    </svg>
  )
}

function Cash({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="9" width="26" height="14" rx="2.5" />
        <circle cx="16" cy="16" r="4" />
        <path d="M7.5 13v6M24.5 13v6" />
      </g>
    </svg>
  )
}

async function qrDataUri(): Promise<string | null> {
  try {
    const svg = await QRCode.toString(SITE_URL, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#1E1B4B', light: '#FFFFFF' },
    })
    return `data:image/svg+xml;base64,${btoa(svg)}`
  } catch {
    return null
  }
}

function Door({ icon, question, line, highlight }: { icon: React.ReactNode; question: string; line: string; highlight?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: highlight ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)',
        border: highlight ? '3px solid #FDE68A' : '2px solid rgba(255,255,255,0.28)',
        borderRadius: 36,
        padding: '44px 36px',
      }}
    >
      <div
        style={{
          width: 108,
          height: 108,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.14)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-1px', marginTop: 26 }}>{question}</div>
      <div style={{ fontSize: 29, lineHeight: 1.3, marginTop: 12, opacity: 0.92 }}>{line}</div>
    </div>
  )
}

export async function GET() {
  const [qr, fonts] = await Promise.all([qrDataUri(), loadOgFonts()])

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(160deg, #312E81 0%, #4338CA 55%, #4F46E5 100%)',
          color: 'white',
          padding: 72,
          fontFamily: 'Inter',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Hanger size={44} color="#ffffff" />
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1px' }}>UniformPass</div>
        </div>

        {/* Headline + one line: seller-first, the pile is the money */}
        <div style={{ fontSize: 108, fontWeight: 900, letterSpacing: '-4px', lineHeight: 1.0, marginTop: 56 }}>
          Turn uniforms into cash.
        </div>
        <div style={{ fontSize: 37, lineHeight: 1.35, marginTop: 38, opacity: 0.94, maxWidth: 900 }}>
          Sell what your kids outgrew... or shop your school&apos;s used uniforms.
        </div>

        {/* The two doors: the do-nothing pickup leads */}
        <div style={{ display: 'flex', gap: 28, marginTop: 60 }}>
          <Door
            highlight
            icon={<Cash size={64} color="#FDE68A" />}
            question="Auto Sell"
            line="We pick up your pile. You get cash."
          />
          <Door
            icon={<Hanger size={64} color="#FDE68A" />}
            question="Buy and sell"
            line="Your school's marketplace for uniforms and merch."
          />
        </div>

        {/* Close: QR + URL */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            marginTop: 'auto',
            background: '#ffffff',
            borderRadius: 32,
            padding: '34px 44px',
          }}
        >
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="" width={190} height={190} style={{ width: 190, height: 190 }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: '-2px', color: '#312E81' }}>
              uniformpass.shop
            </div>
            <div style={{ fontSize: 27, fontWeight: 700, color: '#6B7280', marginTop: 10 }}>
              No fees · No shipping · Meet locally
            </div>
          </div>
        </div>
      </div>
    ),
    { ...SIZE, fonts },
  )
}
