'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Listing, CONDITION_LABELS, CATEGORY_LABELS, GENDER_LABELS, PAYMENT_OPTIONS, CONTACT_METHOD_LABELS } from '@/lib/supabase'
import SharePanel from '@/components/SharePanel'
import VerifiedBadge from '@/components/VerifiedBadge'

const PLACEHOLDER = 'https://placehold.co/800x600/e8e8f0/9999bb?text=No+photo'

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [manageToken, setManageToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    setManageToken(localStorage.getItem(`uniformpass_manage_${id}`))
    supabase.auth.getSession().then(({ data: { session } }) => setUserId(session?.user.id ?? null))
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
  const isOwner = Boolean(manageToken || (userId && listing.user_id === userId))
  const sold = listing.status === 'sold'

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

  const showContactBar = listing.status !== 'sold' && !!listing.contact_info

  return (
    <div className={`max-w-5xl mx-auto px-4 pt-10 ${showContactBar ? 'pb-28 sm:pb-10' : 'pb-10'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link href={listing.school_id ? `/?school=${listing.school_id}` : '/'} className="text-sm text-indigo-600 hover:underline">
          ← Back to listings
        </Link>
        <div className="flex items-center gap-2">
          <SharePanel
            kind="listing"
            theme={null}
            listing={{ id: listing.id, itemType: listing.item_type, price: listing.price, schoolName: listing.school_name }}
            buttonClassName="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:border-gray-500 px-4 py-1.5 rounded-full transition-colors"
          />
          {isOwner && (
            <Link href={manageToken ? `/listing/${id}/manage?token=${manageToken}` : `/listing/${id}/manage`}
              className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-full transition-colors">
              Edit
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Photo gallery */}
        <div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-3">
            <img
              src={photos[activePhoto] || PLACEHOLDER}
              alt={listing.item_type}
              className={`w-full h-full object-cover ${sold ? 'grayscale opacity-60' : ''}`}
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
            />
            {sold && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-gray-900/85 text-white text-lg font-black tracking-widest px-6 py-2 rounded-lg -rotate-6">SOLD</span>
              </div>
            )}
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
                <span className="inline-flex mt-2"><VerifiedBadge /></span>
              )}
            </div>
            <p className={`text-4xl font-black leading-none shrink-0 ${sold ? 'text-gray-400 line-through' : 'text-indigo-700'}`}>
              {listing.price === 0 ? 'Free' : `$${listing.price}`}
            </p>
          </div>

          {sold && (
            <div className="bg-gray-100 border border-gray-200 text-gray-600 rounded-lg px-4 py-2 text-sm font-medium mb-4">
              Sold. This is here as a price reference... it&apos;s no longer available.
            </div>
          )}

          {listing.is_lot && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-4 py-2 text-sm font-medium mb-4">
              📦 Lot listing: multiple items / sizes included
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
            {locationStr && <Row label="Location" value={locationStr} />}
            {paymentLabels.length > 0 && (
              <Row label="Payment" value={paymentLabels.join(' · ')} />
            )}
            <Row label="Listed by" value={listing.seller_name} />
            <Row label="Posted" value={`${new Date(listing.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}${listing.edited_at ? ' · edited' : ''}`} />
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
            <>
              {/* Safety, right where the fear spikes */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3">
                <p className="text-[13px] font-bold text-gray-700">Meeting up, the safe way</p>
                <ul className="text-[13px] text-gray-600 mt-1 space-y-0.5">
                  <li>Meet in public, in daylight.</li>
                  <li>Pay on pickup, never a deposit.</li>
                </ul>
              </div>

              {listing.contact_info ? (
                <div id="contact" className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <p className="text-sm font-medium text-indigo-900 mb-2">Contact {listing.seller_name}</p>
                  <ContactAction method={listing.contact_method} info={listing.contact_info} seller={listing.seller_name} />
                  <p className="text-xs text-indigo-500 mt-3">
                    Message directly and arrange to meet up. Payment is in person, never through this site.
                  </p>
                </div>
              ) : (
                <div id="contact" className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <p className="text-sm text-indigo-700">
                    This seller hasn&apos;t listed contact info. Send us a note and we&apos;ll pass your message along.
                  </p>
                  <Link href="/contact"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full transition-colors">
                    Ask us about this item →
                  </Link>
                </div>
              )}
            </>
          )}

          {listing.user_id && (
            <Link href={`/seller/${listing.user_id}`}
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline">
              See everything {listing.seller_name} is selling →
            </Link>
          )}
        </div>
      </div>

      {showContactBar && (
        <div className="sm:hidden fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <p className="text-2xl font-black leading-none text-indigo-700 shrink-0">
              {listing.price === 0 ? 'Free' : `$${listing.price}`}
            </p>
            <a href={contactHref(listing.contact_method, listing.contact_info!) || '#contact'}
              target={listing.contact_method === 'venmo' ? '_blank' : undefined} rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold rounded-xl px-4 py-3 hover:bg-indigo-700 transition-colors">
              {contactAction(listing.contact_method, listing.seller_name)}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// Show the seller's real contact plainly — the tap-to-text/email link carries it anyway,
// and the buyer (a parent) just wants to see it. Pretty-print a 10-digit US phone.
function formatContact(method: string | null, info: string): string {
  if (method === 'text') {
    const d = info.replace(/\D/g, '')
    if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
    if (d.length === 11 && d[0] === '1') return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`
    return info
  }
  return info
}

function contactHref(method: string | null, info: string): string | null {
  if (method === 'text') return `sms:${info.replace(/[^\d+]/g, '')}`
  if (method === 'email') return `mailto:${info}`
  if (method === 'venmo') return `https://venmo.com/u/${info.replace(/^@/, '')}`
  return null
}

function contactAction(method: string | null, seller: string): string {
  const firstName = (seller || 'the seller').split(' ')[0]
  if (method === 'text') return `Text ${firstName}`
  if (method === 'email') return `Email ${firstName}`
  if (method === 'venmo') return `Venmo ${firstName}`
  return `Contact ${firstName}`
}

function ContactAction({ method, info, seller }: { method: string | null; info: string; seller: string }) {
  const label = CONTACT_METHOD_LABELS[method || 'other'] || 'Contact'
  const href = contactHref(method, info)
  const action = contactAction(method, seller)

  if (!href) {
    // "Other" contact (e.g. Instagram): there is no app link, so the value
    // itself is the only way through... show it plainly.
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center px-4 py-3">
      <span className="text-sm text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}
