'use client'

import { useEffect, useState } from 'react'
import { supabase, type Listing, CONDITION_LABELS, CATEGORY_LABELS } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'uniform2026'
const PLACEHOLDER = 'https://placehold.co/100x100/e8e8f0/9999bb?text=?'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [actionPending, setActionPending] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'sold'>('all')

  // Persist auth in sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') === '1') {
      setAuthed(true)
    }
  }, [])

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authed', '1')
      setAuthed(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('admin_authed')
    setAuthed(false)
  }

  const fetchListings = async () => {
    setLoading(true)
    let query = supabase.from('listings').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (authed) fetchListings()
  }, [authed, filter])

  const markSold = async (id: string) => {
    setActionPending(id + '-sold')
    await supabase.from('listings').update({ status: 'sold' }).eq('id', id)
    await fetchListings()
    setActionPending(null)
  }

  const markActive = async (id: string) => {
    setActionPending(id + '-active')
    await supabase.from('listings').update({ status: 'active' }).eq('id', id)
    await fetchListings()
    setActionPending(null)
  }

  const deleteListing = async (id: string, itemType: string) => {
    if (!confirm(`Delete "${itemType}"? This cannot be undone.`)) return
    setActionPending(id + '-delete')
    // Delete photos from storage
    const listing = listings.find(l => l.id === id)
    if (listing?.photos?.length) {
      const paths = listing.photos.map(url => {
        const parts = url.split('/uniform-photos/')
        return parts[1] || ''
      }).filter(Boolean)
      if (paths.length) {
        await supabase.storage.from('uniform-photos').remove(paths)
      }
    }
    await supabase.from('listings').delete().eq('id', id)
    await fetchListings()
    setActionPending(null)
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">UniformPass listing management</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              autoFocus
              className={`w-full rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                passwordError ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {passwordError && <p className="text-xs text-red-500 mt-1">Incorrect password.</p>}
          </div>
          <button
            onClick={login}
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    )
  }

  const active = listings.filter(l => l.status === 'active').length
  const sold = listings.filter(l => l.status === 'sold').length

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {active} active · {sold} sold · {listings.length} total
          </p>
        </div>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-900 underline">
          Sign out
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'sold'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No listings found.</div>
      ) : (
        <div className="space-y-3">
          {listings.map(listing => (
            <div
              key={listing.id}
              className={`bg-white rounded-xl border flex items-center gap-4 p-4 ${
                listing.status === 'sold' ? 'border-gray-200 opacity-60' : 'border-gray-200'
              }`}
            >
              {/* Photo */}
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <img
                  src={listing.photos?.[0] || PLACEHOLDER}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 truncate">{listing.item_type}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    listing.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {listing.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {listing.school_name} · Size {listing.size} · {CATEGORY_LABELS[listing.category]} · {CONDITION_LABELS[listing.condition]}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ${listing.price} · {listing.location_city} · {listing.seller_name} · {listing.contact_info} ·{' '}
                  {new Date(listing.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                {listing.status === 'active' ? (
                  <button
                    onClick={() => markSold(listing.id)}
                    disabled={actionPending !== null}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    {actionPending === listing.id + '-sold' ? '...' : 'Mark sold'}
                  </button>
                ) : (
                  <button
                    onClick={() => markActive(listing.id)}
                    disabled={actionPending !== null}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    {actionPending === listing.id + '-active' ? '...' : 'Relist'}
                  </button>
                )}
                <a
                  href={`/listing/${listing.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  View
                </a>
                <button
                  onClick={() => deleteListing(listing.id, listing.item_type)}
                  disabled={actionPending !== null}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {actionPending === listing.id + '-delete' ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
