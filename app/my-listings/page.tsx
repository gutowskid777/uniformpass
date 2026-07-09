'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, type Listing } from '@/lib/supabase'

const PLACEHOLDER = 'https://placehold.co/100x100/e8e8f0/9999bb?text=?'

export default function MyListingsPage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<{ listing: Listing; token: string }[]>([])

  useEffect(() => {
    const entries: { id: string; token: string }[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('uniformpass_manage_')) {
        const token = localStorage.getItem(k)
        if (token) entries.push({ id: k.replace('uniformpass_manage_', ''), token })
      }
    }
    if (entries.length === 0) { setLoading(false); return }

    supabase.from('listings').select('*').in('id', entries.map(e => e.id)).then(({ data }) => {
      const found = data || []
      const foundIds = new Set(found.map(l => l.id))
      // Prune tokens for listings that were deleted
      entries.forEach(e => { if (!foundIds.has(e.id)) localStorage.removeItem(`uniformpass_manage_${e.id}`) })
      const tokenById = Object.fromEntries(entries.map(e => [e.id, e.token]))
      found.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setItems(found.map(l => ({ listing: l, token: tokenById[l.id] })))
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        <p className="text-gray-500 mt-1">Everything you&apos;ve posted from this device.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">👕</div>
          <p className="text-gray-600 font-medium mb-1">No listings yet.</p>
          <p className="text-gray-400 text-sm mb-6">Listings you post will show up here on this device.</p>
          <Link href="/new" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-colors">Post a listing</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(({ listing, token }) => (
            <div key={listing.id} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-4">
              <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <img src={listing.photos?.[0] || PLACEHOLDER} alt="" className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">{listing.item_type}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    listing.status === 'sold' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
                  }`}>
                    {listing.status === 'sold' ? 'Sold' : 'Available'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{listing.school_name}</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{listing.price === 0 ? 'Free' : `$${listing.price}`}</p>
              </div>
              <Link href={`/listing/${listing.id}/manage?token=${token}`}
                className="shrink-0 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full transition-colors">
                Manage
              </Link>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-8 text-center">
        Saved on this device only. On a new phone or computer,{' '}
        <Link href="/contact" className="underline hover:text-gray-600">contact us</Link> and we&apos;ll help you manage a listing.
      </p>
    </div>
  )
}
