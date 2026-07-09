import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'UniformPass — buy & sell school uniforms'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '0 80px',
          textAlign: 'center',
        }}
      >
        {/* Hanger mark */}
        <svg width="120" height="120" viewBox="0 0 32 32" style={{ marginBottom: 12 }}>
          <g fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 13 v-1.8 a2.3 2.3 0 1 0 -2.3 -2.3" />
            <path d="M16 13 L6 22 H26 Z" />
          </g>
        </svg>
        <div style={{ fontSize: 104, fontWeight: 800, letterSpacing: '-3px', lineHeight: 1 }}>
          UniformPass
        </div>
        <div style={{ fontSize: 40, marginTop: 24, opacity: 0.92 }}>
          Buy &amp; sell school uniforms — no fees, meet up local
        </div>
        <div style={{ fontSize: 26, marginTop: 28, opacity: 0.75 }}>
          SJR · Don Bosco · Bergen Catholic
        </div>
      </div>
    ),
    { ...size },
  )
}
