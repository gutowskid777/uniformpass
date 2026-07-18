import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { getTheme, type SchoolTheme } from '@/lib/schoolTheme'
import { loadOgFonts } from '@/lib/ogFonts'
import MonogramPatch from '@/components/MonogramPatch'

export const runtime = 'edge'

const SIZE = { width: 1200, height: 630 }

// Live per-school count for the proof chip. Best-effort: any failure or a
// near-empty school just drops the chip, never breaks the card.
async function fetchLiveCount(theme: SchoolTheme): Promise<number | null> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    const res = await fetch(
      `${url}/rest/v1/listings?select=id&status=eq.available&school_id=eq.${theme.dbId}`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact', Range: '0-0' },
        signal: AbortSignal.timeout(1500),
      },
    )
    const range = res.headers.get('content-range')
    const total = range?.split('/')[1]
    const n = total ? parseInt(total, 10) : NaN
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

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

export async function GET(req: NextRequest) {
  const theme = getTheme(req.nextUrl.searchParams.get('school'))
  const fonts = await loadOgFonts()

  if (!theme) {
    // Chosen: dark indigo, motto centered, bright green "cash". No wordmark, big.
    return new ImageResponse(
      (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 60, background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 62%, #3730A3 100%)', fontFamily: 'Inter' }}>
          <div style={{ fontSize: 100, fontWeight: 800, letterSpacing: '-3px', color: '#ffffff', textAlign: 'center', lineHeight: 1.0 }}>Turn uniforms into</div>
          <div style={{ fontSize: 200, fontWeight: 800, letterSpacing: '-6px', color: '#4ADE80', lineHeight: 1.0 }}>cash.</div>
        </div>
      ),
      { ...SIZE, fonts },
    )
  }

  const count = await fetchLiveCount(theme)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(150deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)`,
          color: 'white',
          padding: 64,
          fontFamily: 'Inter',
        }}
      >
        {/* Top: patch + school identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <MonogramPatch theme={theme} size={180} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.02 }}>
              {theme.fullName}
            </div>
            <div style={{ fontSize: 46, fontWeight: 800, color: theme.accent, marginTop: 8, letterSpacing: '-1px' }}>
              Uniform Exchange
            </div>
          </div>
        </div>

        {/* Hook */}
        <div style={{ fontSize: 36, lineHeight: 1.3, marginTop: 48, opacity: 0.95, maxWidth: 1000 }}>
          {`Skip the $80 uniform. Buy and sell with ${theme.shortName} families near you.`}
        </div>

        {/* Bottom: proof chips + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.14)',
                borderRadius: 999,
                padding: '12px 26px',
                fontSize: 25,
                fontWeight: 700,
              }}
            >
              {`Verified by UniformPass · ${theme.town}`}
            </div>
            {count !== null && count >= 3 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: theme.accent,
                  color: theme.accentInk,
                  borderRadius: 999,
                  padding: '12px 26px',
                  fontSize: 25,
                  fontWeight: 800,
                }}
              >
                {`${count} listed right now`}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 26, fontWeight: 700, opacity: 0.85 }}>
            <Hanger size={30} color="#ffffff" />
            uniformpass.shop
          </div>
        </div>
      </div>
    ),
    { ...SIZE, fonts },
  )
}
