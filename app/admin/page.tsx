'use client'

import { useEffect, useState } from 'react'
import { supabase, type Listing, type PickupRequest, type ContactMessage, CONDITION_LABELS, CATEGORY_LABELS } from '@/lib/supabase'

const PLACEHOLDER = 'https://placehold.co/100x100/e8e8f0/9999bb?text=?'

const STATUS_OPTIONS = ['available', 'sold', 'inactive', 'draft'] as const
type Status = typeof STATUS_OPTIONS[number]

const PICKUP_STATUSES = ['new', 'scheduled', 'picked_up', 'listed', 'done', 'declined', 'cancelled'] as const
type PickupStatus = typeof PICKUP_STATUSES[number]

const PICKUP_STATUS_STYLES: Record<string, string> = {
  new: 'bg-indigo-100 text-indigo-700',
  scheduled: 'bg-blue-100 text-blue-700',
  picked_up: 'bg-amber-100 text-amber-700',
  listed: 'bg-green-100 text-green-700',
  done: 'bg-gray-100 text-gray-500',
  declined: 'bg-red-100 text-red-500',
  cancelled: 'bg-gray-100 text-gray-400',
}

const STATUS_STYLES: Record<Status, string> = {
  available: 'bg-green-100 text-green-700',
  sold: 'bg-gray-100 text-gray-500',
  inactive: 'bg-gray-100 text-gray-500',
  draft: 'bg-purple-100 text-purple-700',
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [actionPending, setActionPending] = useState<string | null>(null)
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [view, setView] = useState<'listings' | 'pickups' | 'messages'>('listings')
  const [pickups, setPickups] = useState<PickupRequest[]>([])
  const [pickupsLoading, setPickupsLoading] = useState(false)
  const [pickupsError, setPickupsError] = useState('')
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [messagesError, setMessagesError] = useState('')

  useEffect(() => {
    const pw = sessionStorage.getItem('admin_pw')
    if (pw) { setPassword(pw); setAuthed(true) }
  }, [])

  // Password is verified SERVER-SIDE now — it's never compared against a bundled value.
  const login = async () => {
    try {
      const res = await fetch('/api/admin/listings', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ action: 'verify' }),
      })
      if (!res.ok) { setPasswordError(true); return }
      sessionStorage.setItem('admin_pw', password)
      setAuthed(true)
      setPasswordError(false)
    } catch {
      setPasswordError(true)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('admin_pw')
    setAuthed(false)
  }

  const fetchListings = async () => {
    setLoading(true)
    let query = supabase.from('listings').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    const all = data || []
    setListings(all)

    // Count by status
    const c: Record<string, number> = { all: all.length }
    for (const s of STATUS_OPTIONS) c[s] = all.filter(l => l.status === s).length
    setCounts(c)
    setLoading(false)
  }

  useEffect(() => {
    if (authed) fetchListings()
  }, [authed, filter])

  const updateStatus = async (id: string, status: Status) => {
    setActionPending(id + '-status')
    await fetch('/api/admin/listings', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ action: 'status', id, status }),
    })
    await fetchListings()
    setActionPending(null)
  }

  const toggleVerified = async (id: string, current: boolean) => {
    setActionPending(id + '-verify')
    await fetch('/api/admin/listings', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ action: 'verified', id, is_verified: !current }),
    })
    await fetchListings()
    setActionPending(null)
  }

  const fetchPickups = async () => {
    setPickupsLoading(true)
    setPickupsError('')
    try {
      const res = await fetch('/api/pickup-requests', { headers: { 'x-admin-password': password } })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load requests')
      setPickups(json.requests || [])
    } catch (err: unknown) {
      setPickupsError(err instanceof Error ? err.message : 'Failed to load requests')
    }
    setPickupsLoading(false)
  }

  const updatePickupStatus = async (id: string, status: PickupStatus) => {
    setActionPending(id + '-pickup')
    try {
      const res = await fetch('/api/pickup-requests', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Update failed')
      await fetchPickups()
    } catch (err: unknown) {
      setPickupsError(err instanceof Error ? err.message : 'Update failed')
    }
    setActionPending(null)
  }

  const fetchMessages = async () => {
    setMessagesLoading(true)
    setMessagesError('')
    try {
      const res = await fetch('/api/contact', { headers: { 'x-admin-password': password } })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load messages')
      setMessages(json.messages || [])
    } catch (err: unknown) {
      setMessagesError(err instanceof Error ? err.message : 'Failed to load messages')
    }
    setMessagesLoading(false)
  }

  useEffect(() => {
    if (authed && view === 'pickups') fetchPickups()
    if (authed && view === 'messages') fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, view])

  const deleteListing = async (id: string, itemType: string) => {
    if (!confirm(`Delete "${itemType}"? This cannot be undone.`)) return
    setActionPending(id + '-delete')
    await fetch('/api/admin/listings', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ action: 'delete', id }),
    })
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
            <input type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              autoFocus
              className={`w-full rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 ${passwordError ? 'border-red-400' : 'border-gray-300'}`} />
            {passwordError && <p className="text-xs text-red-500 mt-1">Incorrect password.</p>}
          </div>
          <button onClick={login} className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
            Sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {view === 'listings'
              ? `${counts.available || 0} available · ${counts.sold || 0} sold · ${counts.draft || 0} draft`
              : view === 'pickups'
              ? `${pickups.filter(p => p.status === 'new').length} new · ${pickups.length} total pickup requests`
              : `${messages.length} message${messages.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-900 underline">Sign out</button>
      </div>

      {/* View toggle */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['listings', 'pickups', 'messages'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              view === v ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {v === 'listings' ? 'Listings' : v === 'pickups' ? 'Pickup requests' : 'Messages'}
            {v === 'pickups' && pickups.some(p => p.status === 'new') && (
              <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {pickups.filter(p => p.status === 'new').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {view === 'listings' && (
      <>
      {/* Status tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', ...STATUS_OPTIONS] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {f} {counts[f] !== undefined ? `(${counts[f]})` : ''}
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
          {listings.map(listing => {
            const status = listing.status as Status
            const locationStr = [listing.location_city, listing.location_state].filter(Boolean).join(', ')
            return (
              <div key={listing.id} className={`bg-white rounded-xl border flex items-center gap-4 p-4 ${
                status === 'sold' || status === 'draft' || status === 'inactive' ? 'border-gray-200 opacity-70' : 'border-gray-200'
              }`}>
                {/* Photo */}
                <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <img src={listing.photos?.[0] || PLACEHOLDER} alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 truncate">{listing.item_type}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-500'}`}>
                      {status}
                    </span>
                    {listing.is_lot && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Lot</span>}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {listing.school_name} · Size {listing.size} · {CATEGORY_LABELS[listing.category]} · {CONDITION_LABELS[listing.condition]}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {listing.price === 0 ? 'Free' : `$${listing.price}`} · {locationStr} · {listing.seller_name} · {new Date(listing.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {/* Status selector */}
                  <select
                    value={status}
                    disabled={actionPending !== null}
                    onChange={e => updateStatus(listing.id, e.target.value as Status)}
                    className="text-xs rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 py-1"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>

                  <button onClick={() => toggleVerified(listing.id, listing.is_verified)}
                    disabled={actionPending !== null}
                    className={`text-xs font-semibold px-2 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                      listing.is_verified
                        ? 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}>
                    {actionPending === listing.id + '-verify' ? '...' : listing.is_verified ? '✓ Verified' : 'Mark verified'}
                  </button>

                  <div className="flex gap-1">
                    <a href={`/listing/${listing.id}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center text-xs font-medium px-2 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                      View
                    </a>
                    <button onClick={() => deleteListing(listing.id, listing.item_type)}
                      disabled={actionPending !== null}
                      className="flex-1 text-xs font-medium px-2 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors">
                      {actionPending === listing.id + '-delete' ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      </>
      )}

      {view === 'pickups' && (
        pickupsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pickupsError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{pickupsError}</div>
        ) : pickups.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No pickup requests yet.</div>
        ) : (
          <div className="space-y-3">
            {pickups.map(req => (
              <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{req.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${PICKUP_STATUS_STYLES[req.status] || 'bg-gray-100 text-gray-500'}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                      {req.payout_choice === 'donate' && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                          💚 Donating their share
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-indigo-700 font-medium mt-0.5">{req.contact}</p>
                    <p className="text-sm text-gray-600 mt-1">{req.item_summary}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {[req.school_name, req.town, req.est_items ? `~${req.est_items} items` : null]
                        .filter(Boolean).join(' · ')} · {new Date(req.created_at).toLocaleDateString()}
                    </p>
                    {req.notes && <p className="text-xs text-gray-500 mt-1 italic">&ldquo;{req.notes}&rdquo;</p>}
                  </div>
                  <select value={req.status} disabled={actionPending !== null}
                    onChange={e => updatePickupStatus(req.id, e.target.value as PickupStatus)}
                    className="text-xs rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 py-1 shrink-0 capitalize">
                    {PICKUP_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {view === 'messages' && (
        messagesLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messagesError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{messagesError}</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No messages yet.</div>
        ) : (
          <div className="space-y-3">
            {messages.map(m => (
              <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="font-semibold text-gray-900">{m.name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-400">{new Date(m.created_at).toLocaleString()}</p>
                </div>
                {m.email && (
                  <a href={`mailto:${m.email}`} className="text-sm text-indigo-600 hover:underline">{m.email}</a>
                )}
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{m.message}</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
