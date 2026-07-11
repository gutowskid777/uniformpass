import { ImageResponse } from 'next/og'
import QRCode from 'qrcode'
import { SITE_URL } from '@/lib/schoolTheme'
import { loadOgFonts } from '@/lib/ogFonts'

export const runtime = 'edge'

// The digital flyer: one school-neutral 1080x1350 image (4:5, chat and feed
// friendly) that a parent can save and drop in any group. No school names on
// purpose... every school's families should feel invited.

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

function TrustCheck({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg viewBox="0 0 20 20" width="26" height="26">
        <path
          fill="#6EE7B7"
          fillRule="evenodd"
          d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
          clipRule="evenodd"
        />
      </svg>
      <span style={{ fontSize: 27, fontWeight: 700 }}>{label}</span>
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

        {/* Headline */}
        <div style={{ fontSize: 104, fontWeight: 900, letterSpacing: '-4px', lineHeight: 1.02, marginTop: 64 }}>
          Skip the $80 uniform.
        </div>
        <div style={{ fontSize: 38, lineHeight: 1.35, marginTop: 28, opacity: 0.94, maxWidth: 900 }}>
          Buy and sell used uniforms with families at your school. No fees, no shipping... you just meet up.
        </div>

        {/* Buy + sell cards */}
        <div style={{ display: 'flex', gap: 28, marginTop: 56 }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.96)',
              borderRadius: 32,
              padding: '36px 40px',
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '3px', color: '#4338CA' }}>BUYING</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 14 }}>
              <span style={{ fontSize: 44, fontWeight: 700, color: '#9CA3AF', textDecoration: 'line-through' }}>$80</span>
              <span style={{ fontSize: 84, fontWeight: 900, color: '#312E81', letterSpacing: '-2px' }}>$15</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                background: '#16A34A',
                color: 'white',
                fontSize: 26,
                fontWeight: 800,
                borderRadius: 999,
                padding: '10px 24px',
                marginTop: 12,
              }}
            >
              You save $65
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.14)',
              border: '2px solid rgba(255,255,255,0.35)',
              borderRadius: 32,
              padding: '36px 40px',
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '3px', color: '#C7D2FE' }}>SELLING</div>
            <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-1px', marginTop: 14 }}>
              Keep 50%. Do nothing.
            </div>
            <div style={{ fontSize: 27, lineHeight: 1.35, marginTop: 14, opacity: 0.92 }}>
              We pick up your outgrown pile, sell it, and you get half. Free pickup.
            </div>
          </div>
        </div>

        {/* Trust row */}
        <div style={{ display: 'flex', gap: 34, marginTop: 52, opacity: 0.95 }}>
          <TrustCheck label="No fees" />
          <TrustCheck label="No shipping" />
          <TrustCheck label="Meet up local" />
          <TrustCheck label="Run by NJ parents" />
        </div>

        {/* URL + QR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 30, fontWeight: 700, opacity: 0.8 }}>Find your school at</div>
            <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-2px', color: '#FDE68A' }}>
              uniformpass.shop
            </div>
          </div>
          {qr && (
            <div style={{ display: 'flex', background: 'white', borderRadius: 24, padding: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="" width={168} height={168} style={{ width: 168, height: 168 }} />
            </div>
          )}
        </div>
      </div>
    ),
    { ...SIZE, fonts },
  )
}
