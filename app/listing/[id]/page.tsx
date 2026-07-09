'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Listing, CONDITION_LABELS, CATEGORY_LABELS, GENDER_LABELS, PAYMENT_OPTIONS, CONTACT_METHOD_LABELS } from '@/lib/supabase'

const PLACEHOLDER = 'https://placehold.co/800x600/e8e8f0/9999bb?text=No+photo'

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [manageToken, setManageToken] = useState<string | null>(null)

  useEffect(() => {
    setManageToken(localStorage.getItem(`uniformpass_manage_${id}`))
  }, [id])

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

  const paymentLabels = (listing.payment_methods || [])
    .map(m => PAYMENT_OPTIONS.find(o => o.value === m)?.label || m)

  const locationStr = [listing.location_city, listing.location_state]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">
          ← Back to listings
        </Link>
        {manageToken && (
          <Link href={`/listing/${id}/manage?token=${manageToken}`}
            className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-full transition-colors">
            Manage your listing
          </Link>
        )}
      </div>

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
              {listing.is_verified && (
                <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-600 text-white">
                  ✓ Verified by UniformPass
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-indigo-700">
              {listing.price === 0 ? 'Free' : `$${listing.price}`}
            </p>
          </div>

          {listing.status === 'sold' && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm font-medium mb-4">
              This listing has been marked as sold.
            </div>
          )}

          {listing.is_lot && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-4 py-2 text-sm font-medium mb-4">
              📦 Lot listing — multiple items / sizes included
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
            {!listing.is_lot && (
              <span className="text-xs font-medium px-3 py-1 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
                Size {listing.size}
              </span>
            )}
            <span className="text-xs font-medium px-3 py-1 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
              {GENDER_LABELS[listing.gender] || listing.gender}
            </span>
          </div>

          {/* Details table */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200 mb-6">
            <Row label="School" value={listing.school_name} />
            {locationStr && <Row label="Location" value={locationStr} />}
            {paymentLabels.length > 0 && (
              <Row label="Payment" value={paymentLabels.join(' · ')} />
            )}
            <Row label="Listed by" value={listing.seller_name} />
            <Row label="Posted" value={new Date(listing.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
          </div>

          {/* Comments */}
          {listing.description && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Comments from seller</p>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

          {/* Contact seller */}
          {listing.status !== 'sold' && (
            listing.contact_info ? (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <p className="text-sm font-medium text-indigo-900 mb-2">Contact {listing.seller_name}</p>
                <ContactAction method={listing.contact_method} info={listing.contact_info} />
                <p className="text-xs text-indigo-500 mt-3">
                  Message directly and arrange to meet up. Payment is cash or Venmo in person — never through this site.
                </p>
              </div>
            ) : (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-700">
                This seller hasn&apos;t listed contact info. Check the comments above, or reach out through your school community.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

function ContactAction({ method, info }: { method: string | null; info: string }) {
  const label = CONTACT_METHOD_LABELS[method || 'other'] || 'Contact'
  let href: string | null = null
  if (method === 'text') href = `sms:${info.replace(/[^\d+]/g, '')}`
  else if (method === 'email') href = `mailto:${info}`
  else if (method === 'venmo') href = `https://venmo.com/u/${info.replace(/^@/, '')}`

  const inner = (
    <>
      <span className="text-xs uppercase tracking-wide text-indigo-400 font-semibold">{label}</span>
      <span className="text-base font-semibold text-indigo-800 break-all">{info}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} target={method === 'venmo' ? '_blank' : undefined} rel="noopener noreferrer"
        className="flex flex-col bg-white border border-indigo-200 rounded-lg px-4 py-3 hover:border-indigo-400 hover:shadow-sm transition-all">
        {inner}
      </a>
    )
  }
  return <div className="flex flex-col bg-white border border-indigo-200 rounded-lg px-4 py-3">{inner}</div>
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center px-4 py-3">
      <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}
