'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Listing, CONTACT_METHOD_LABELS } from '@/lib/supabase'

const PLACEHOLDER = 'https://placehold.co/400x533/e8e8f0/9999bb?text=No+photo'

export default function SellerPage() {
  const params = useParams()
  const userId = params.id as string
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setListings(data || []); setLoading(false) })
  }, [userId])

  const sellerName = listings[0]?.seller_name || 'This seller'
  const sellingSince = listings.length
    ? formatSince(listings.reduce((min, l) => (l.created_at < min ? l.created_at : min), listings[0].created_at))
    : null
  const contact = listings.find(l => l.contact_info)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">← Back to listings</Link>

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{sellerName}&apos;s listings</h1>
        {!loading && (
          <p className="text-gray-500 mt-1">
            {sellingSince && `Selling since ${sellingSince} · `}
            {listings.length} item{listings.length !== 1 ? 's' : ''} available · grab several in one pickup
          </p>
        )}
        {!loading && contact?.contact_info && (
          <div className="mt-5 max-w-sm">
            <ContactAction method={contact.contact_method} info={contact.contact_info} seller={sellerName} />
            <p className="text-xs text-gray-400 mt-2">Ask about sizes or set up one pickup for everything.</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-24 text-gray-500">This seller has no active listings right now.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {listings.map(l => (
            <Link key={l.id} href={`/listing/${l.id}`} className="group block bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              <div className="relative w-full" style={{ paddingBottom: '133%' }}>
                <img src={l.photos?.[0] || PLACEHOLDER} alt={l.item_type}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }} />
              </div>
              <div className="p-3">
                <p className="text-lg font-bold text-gray-900 leading-tight">{l.price === 0 ? 'Free' : `$${l.price}`}</p>
                <p className="text-sm text-gray-800 font-medium truncate mt-0.5">{l.item_type}</p>
                <p className="text-xs text-gray-500 truncate">{l.school_name}</p>
                <p className="text-xs text-gray-400 mt-1">{l.is_lot ? 'Multiple sizes' : `Size ${l.size}`}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function formatSince(iso: string): string {
  const d = new Date(iso)
  const opts: Intl.DateTimeFormatOptions = d.getFullYear() === new Date().getFullYear()
    ? { month: 'long' }
    : { month: 'long', year: 'numeric' }
  return d.toLocaleDateString('en-US', opts)
}

function formatContact(method: string | null, info: string): string {
  if (method === 'text') {
    const d = info.replace(/\D/g, '')
    if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
    if (d.length === 11 && d[0] === '1') return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`
    return info
  }
  return info
}

function ContactAction({ method, info, seller }: { method: string | null; info: string; seller: string }) {
  const label = CONTACT_METHOD_LABELS[method || 'other'] || 'Contact'
  const firstName = (seller || 'the seller').split(' ')[0]

  let href: string | null = null
  let action = `Contact ${firstName}`
  if (method === 'text') { href = `sms:${info.replace(/[^\d+]/g, '')}`; action = `Text ${firstName}` }
  else if (method === 'email') { href = `mailto:${info}`; action = `Email ${firstName}` }
  else if (method === 'venmo') { href = `https://venmo.com/u/${info.replace(/^@/, '')}`; action = `Venmo ${firstName}` }

  if (!href) {
    return (
      <div className="flex flex-col bg-white border border-indigo-200 rounded-lg px-4 py-3">
        <span className="text-xs uppercase tracking-wide text-indigo-400 font-semibold">{label}</span>
        <span className="text-base font-semibold text-indigo-800 break-all">{info}</span>
      </div>
    )
  }

  return (
    <a href={href} target={method === 'venmo' ? '_blank' : undefined} rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 bg-indigo-600 text-white rounded-xl px-5 py-4 hover:bg-indigo-700 transition-colors">
      <span className="flex flex-col min-w-0">
        <span className="text-lg font-bold leading-tight">{action}</span>
        <span className="text-[13px] text-indigo-200 mt-0.5">{label} · {formatContact(method, info)}</span>
      </span>
      <span className="text-xl shrink-0" aria-hidden>→</span>
    </a>
  )
}
