import type { Metadata } from 'next'
import { themeForSchoolId, themeForSchoolName } from '@/lib/schoolTheme'

// Server metadata wrapper for the client listing page: sharing a listing
// previews the actual item ("$15 · SJR Polo") instead of the generic card.
// Additive on purpose... page.tsx stays a client component, untouched.

type MetaListing = {
  id: string
  item_type: string
  price: number
  school_id: string | null
  school_name: string
  status: string
}

async function fetchListing(id: string): Promise<MetaListing | null> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    const res = await fetch(
      `${url}/rest/v1/listings?id=eq.${encodeURIComponent(id)}&select=id,item_type,price,school_id,school_name,status`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 300 } },
    )
    const rows = (await res.json()) as MetaListing[]
    return rows?.[0] ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listing = await fetchListing(params.id)
  if (!listing) return {}

  const theme = themeForSchoolId(listing.school_id) || themeForSchoolName(listing.school_name)
  const school = theme ? theme.shortName : listing.school_name
  const priceLabel = listing.price === 0 ? 'Free' : `$${listing.price}`
  const title = `${priceLabel} · ${listing.item_type} · ${school}`
  const description = `Used ${school} uniform on UniformPass. No fees, no shipping, meet up local.`
  const image = `/api/og/listing?id=${listing.id}`

  return {
    title,
    description,
    openGraph: { title, description, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default function ListingLayout({ children }: { children: React.ReactNode }) {
  return children
}
