'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Listing, CONDITION_LABELS, CATEGORY_LABELS, CONTACT_LABELS } from '@/lib/supabase'

const PLACEHOLDER = 'https://placehold.co/800x600/e8e8f0/9999bb?text=No+photo'

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          router.replace('/')
          return
        }
        setListing(data)
        setLoading(false)
      })
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!listing) return null

  const photos = listing.photos?.length ? listing.photos : [PLACEHOLDER]

  const conditionColor: Record<string, string> = {
    new: 'bg-green-100 text-green-700 border-green-200',
    good: 'bg-blue-100 text-blue-700 border-blue-200',
    fair: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  }

  const contactHref = () => {
    if (listing.contact_method === 'email') return `mailto:${listing.contact_info}?subject=UniformPass: ${listing.item_type} (${listing.school_name})`
    return undefined
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-indigo-600 hover:underline mb-6 inline-block">
        ← Back to listings
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Photo gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
            <img
              src={photos[activePhoto] || PLACEHOLDER}
              alt={listing.item_type}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
            />
          </div>
          {photos.length > 1 && (
            <div className="flex gap-2">
              {photos.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activePhoto ? 'border-indigo-500' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm text-gray-500 font-medium">{listing.school_name}</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{listing.item_type}</h1>
            </div>
            <p className="text-2xl font-bold text-indigo-700">${listing.price}</p>
          </div>

          {listing.status === 'sold' && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm font-medium mb-4">
              This listing has been marked as sold.
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${conditionColor[listing.condition]}`}>
              {CONDITION_LABELS[listing.condition]}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
              {CATEGORY_LABELS[listing.category]}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
              Size {listing.size}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
              {listing.gender === 'boy' ? 'Boys' : listing.gender === 'girl' ? 'Girls' : 'Unisex'}
            </span>
          </div>

          {/* Details table */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200 mb-6">
            <Row label="School" value={listing.school_name} />
            <Row label="Location" value={`${listing.location_city}, NJ`} />
            <Row label="Contact via" value={CONTACT_LABELS[listing.contact_method]} />
            <Row label="Posted by" value={listing.seller_name} />
            <Row label="Listed" value={new Date(listing.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
          </div>

          {listing.description && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
              <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
            </div>
          )}

          {/* Contact button */}
          {listing.status === 'active' && (
            <div>
              {!showContact ? (
                <button
                  onClick={() => setShowContact(true)}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors text-lg"
                >
                  Show contact info
                </button>
              ) : (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-indigo-900 mb-1">
                    Contact {listing.seller_name} via {CONTACT_LABELS[listing.contact_method]}:
                  </p>
                  {listing.contact_method === 'email' ? (
                    <a
                      href={contactHref()}
                      className="text-indigo-700 font-semibold hover:underline break-all"
                    >
                      {listing.contact_info}
                    </a>
                  ) : (
                    <p className="text-indigo-700 font-semibold break-all">{listing.contact_info}</p>
                  )}
                  <p className="text-xs text-indigo-600 mt-2">
                    Mention you found this on UniformPass when you reach out.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center px-4 py-3">
      <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}
