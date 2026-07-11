'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Listing } from '@/lib/supabase'

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">← Back to listings</Link>

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{sellerName}&apos;s listings</h1>
        {!loading && (
          <p className="text-gray-500 mt-1">
            {listings.length} item{listings.length !== 1 ? 's' : ''} available · grab several in one pickup
          </p>
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
