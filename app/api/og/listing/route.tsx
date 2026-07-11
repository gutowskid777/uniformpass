import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { themeForSchoolId, themeForSchoolName } from '@/lib/schoolTheme'
import { priceSlash } from '@/lib/retailPrices'
import MonogramPatch from '@/components/MonogramPatch'

export const runtime = 'edge'

const SIZE = { width: 1200, height: 630 }

type OgListing = {
  id: string
  item_type: string
  price: number
  school_id: string | null
  school_name: string
  category: string
  size: string
  is_lot: boolean
  is_verified: boolean
  photos: string[]
}

async function fetchListing(id: string): Promise<OgListing | null> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    const res = await fetch(
      `${url}/rest/v1/listings?id=eq.${encodeURIComponent(id)}&select=id,item_type,price,school_id,school_name,category,size,is_lot,is_verified,photos`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(2500) },
    )
    const rows = (await res.json()) as OgListing[]
    return rows?.[0] ?? null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') || ''
  const listing = await fetchListing(id)

  if (!listing) {
    // No listing: fall back to the generic app card via a plain redirect.
    return Response.redirect(new URL('/api/og', req.url), 302)
  }

  const theme = themeForSchoolId(listing.school_id) || themeForSchoolName(listing.school_name)
  const primary = theme?.primary ?? '#4F46E5'
  const primaryDark = theme?.primaryDark ?? '#312E81'
  const photo = listing.photos?.[0] || null
  const slash = priceSlash(listing.price, listing.item_type, listing.category)
  const priceLabel = listing.price === 0 ? 'Free' : `$${listing.price}`

  return new ImageResponse(
    (
      <div style={{ height: '100%', width: '100%', display: 'flex', background: '#ffffff' }}>
        {/* Left: the item photo (or a themed panel) */}
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            width={560}
            height={630}
            style={{ width: 560, height: 630, objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: 560,
              height: 630,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(150deg, ${primary} 0%, ${primaryDark} 100%)`,
            }}
          >
            {theme ? (
              <MonogramPatch theme={theme} size={220} />
            ) : (
              <div style={{ color: 'white', fontSize: 64, fontWeight: 800 }}>UniformPass</div>
            )}
          </div>
        )}

        {/* Right: the deal */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '52px 56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {theme && <MonogramPatch theme={theme} size={64} />}
            <div style={{ fontSize: 30, fontWeight: 800, color: '#374151' }}>
              {theme ? theme.shortName : listing.school_name}
            </div>
          </div>

          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1.12,
              marginTop: 36,
              letterSpacing: '-1px',
              maxHeight: 150,
              overflow: 'hidden',
            }}
          >
            {listing.item_type}
          </div>
          <div style={{ fontSize: 26, color: '#6B7280', marginTop: 10 }}>
            {listing.is_lot ? 'Lot · multiple sizes' : `Size ${listing.size}`}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 'auto' }}>
            {slash && (
              <span style={{ fontSize: 46, fontWeight: 700, color: '#9CA3AF', textDecoration: 'line-through' }}>
                {`$${slash.retail}`}
              </span>
            )}
            <span style={{ fontSize: 108, fontWeight: 900, color: primary, letterSpacing: '-3px', lineHeight: 1 }}>
              {priceLabel}
            </span>
          </div>
          {slash && (
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                background: '#16A34A',
                color: 'white',
                fontSize: 30,
                fontWeight: 800,
                borderRadius: 999,
                padding: '10px 28px',
                marginTop: 18,
              }}
            >
              {`You save $${slash.save}`}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 34 }}>
            {listing.is_verified ? (
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 23, fontWeight: 700, color: '#374151' }}>
                ✓ Verified by UniformPass
              </div>
            ) : (
              <div style={{ display: 'flex' }} />
            )}
            <div style={{ fontSize: 24, fontWeight: 700, color: '#9CA3AF' }}>uniformpass.shop</div>
          </div>
        </div>
      </div>
    ),
    { ...SIZE },
  )
}
