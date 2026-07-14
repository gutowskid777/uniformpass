'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { supabase, type Listing, type PickupRequest } from '@/lib/supabase'

const PLACEHOLDER = 'https://placehold.co/100x100/e8e8f0/9999bb?text=?'
const LOCKED = ['picked_up', 'listed', 'done', 'cancelled']
const STATUS_LABEL: Record<string, string> = {
  new: 'Received... we’ll be in touch',
  scheduled: 'Pickup scheduled',
  picked_up: 'Picked up',
  listed: 'Listed for sale',
  done: 'Sold. Done.',
  declined: 'Declined',
  cancelled: 'Cancelled',
}

type Pickup = Pick<PickupRequest, 'id' | 'item_summary' | 'school_name' | 'town' | 'est_items' | 'notes' | 'status' | 'created_at'>
type PickupDraft = { item_summary: string; est_items: string; notes: string }

export default function MyListingsPage() {
  const { user, loading: authLoading } = useAuth()
  const [dataLoading, setDataLoading] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [pickups, setPickups] = useState<Pickup[]>([])
  const [manageTokens, setManageTokens] = useState<Record<string, string>>({})
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [pendingAction, setPendingAction] = useState('')
  const [editingPickupId, setEditingPickupId] = useState<string | null>(null)
  const [pickupDraft, setPickupDraft] = useState<PickupDraft>({ item_summary: '', est_items: '', notes: '' })
  const [savedToast, setSavedToast] = useState(false)

  // Coming back from "Save as draft" on /new: a brief confirmation, then clear the URL.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    if (sp.get('saved') !== 'draft') return
    setSavedToast(true)
    window.history.replaceState({}, '', '/my-listings')
    const t = setTimeout(() => setSavedToast(false), 4500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!user) {
      setListings([])
      setPickups([])
      setDataLoading(false)
      return
    }

    let active = true
    setDataLoading(true)
    setLoadError('')

    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Please sign in again to load your stuff.')

      const [listingResult, pickupResponse] = await Promise.all([
        supabase.from('listings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        fetch('/api/my/pickups', {
          method: 'POST',
          headers: { 'content-type': 'application/json', Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ action: 'list' }),
        }),
      ])

      if (listingResult.error) throw new Error('We couldn’t load your listings right now. Try refreshing.')
      const pickupJson = await pickupResponse.json()
      // Never surface raw server/config errors to users; keep it generic + actionable.
      if (!pickupResponse.ok) throw new Error('We couldn’t load your pickup requests. Try refreshing or signing in again.')
      if (!active) return

      const foundListings = listingResult.data || []
      setListings(foundListings)
      setPickups(pickupJson.requests || [])
      setManageTokens(Object.fromEntries(foundListings.flatMap(listing => {
        const token = localStorage.getItem(`uniformpass_manage_${listing.id}`)
        return token ? [[listing.id, token]] : []
      })))
    }

    load()
      .catch(error => { if (active) setLoadError(error instanceof Error ? error.message : 'Could not load your stuff.') })
      .finally(() => { if (active) setDataLoading(false) })

    return () => { active = false }
  }, [user])

  const accessToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Please sign in again.')
    return session.access_token
  }

  const listingAction = async (listing: Listing, action: 'update' | 'delete', targetStatus?: Listing['status']) => {
    if (action === 'delete' && !confirm(`Delete ${listing.item_type}? This cannot be undone.`)) return
    const key = `${listing.id}-${action}`
    setPendingAction(key)
    setActionError('')
    try {
      const jwt = await accessToken()
      const nextStatus = targetStatus ?? (listing.status === 'sold' ? 'available' : 'sold')
      const response = await fetch('/api/listings/manage', {
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({
          action,
          listingId: listing.id,
          ...(action === 'update' ? { updates: { status: nextStatus } } : {}),
        }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || `Could not ${action} listing.`)
      if (action === 'delete') setListings(current => current.filter(item => item.id !== listing.id))
      else setListings(current => current.map(item => item.id === listing.id ? { ...item, status: nextStatus } : item))
    } catch (error) {
      setActionError(error instanceof Error ? error.message : `Could not ${action} listing.`)
    } finally {
      setPendingAction('')
    }
  }

  const beginPickupEdit = (pickup: Pickup) => {
    setActionError('')
    setEditingPickupId(pickup.id)
    setPickupDraft({
      item_summary: pickup.item_summary,
      est_items: pickup.est_items == null ? '' : String(pickup.est_items),
      notes: pickup.notes || '',
    })
  }

  const savePickup = async (pickup: Pickup) => {
    const summary = pickupDraft.item_summary.trim()
    if (!summary) {
      setActionError('Please describe the items in your pickup request.')
      return
    }
    const parsedItems = pickupDraft.est_items === '' ? null : Number(pickupDraft.est_items)
    if (parsedItems !== null && !Number.isFinite(parsedItems)) {
      setActionError('Estimated items must be a number.')
      return
    }

    const updates = { item_summary: summary, est_items: parsedItems, notes: pickupDraft.notes.trim() || null }
    setPendingAction(`${pickup.id}-update`)
    setActionError('')
    try {
      const jwt = await accessToken()
      const response = await fetch('/api/my/pickups', {
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ action: 'update', id: pickup.id, updates }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Could not update pickup request.')
      setPickups(current => current.map(item => item.id === pickup.id ? { ...item, ...updates } : item))
      setEditingPickupId(null)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not update pickup request.')
    } finally {
      setPendingAction('')
    }
  }

  const cancelPickup = async (pickup: Pickup) => {
    if (!confirm('Cancel this pickup request?')) return
    setPendingAction(`${pickup.id}-cancel`)
    setActionError('')
    try {
      const jwt = await accessToken()
      const response = await fetch('/api/my/pickups', {
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ action: 'cancel', id: pickup.id }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error || 'Could not cancel pickup request.')
      setPickups(current => current.map(item => item.id === pickup.id ? { ...item, status: 'cancelled' } : item))
      setEditingPickupId(null)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not cancel pickup request.')
    } finally {
      setPendingAction('')
    }
  }

  if (authLoading || (user && dataLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">👕</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to see your stuff</h1>
        <p className="text-gray-500 mb-6">Your listings and pickup requests will be waiting for you.</p>
        <Link href="/signin?redirect=/my-listings" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-colors">Sign in</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        <p className="text-gray-500 mt-1">Manage everything you&apos;ve posted or arranged for pickup.</p>
      </div>

      {savedToast && (
        <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm font-medium">
          ✅ Draft saved. It&apos;s in your listings below... finish and post it whenever.
        </div>
      )}

      {loadError && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{loadError}</div>}
      {actionError && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{actionError}</div>}

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Your listings</h2>
        {listings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-6 text-center">
            <p className="text-gray-500 text-sm mb-4">No listings yet.</p>
            <Link href="/new" className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">Post a listing</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map(listing => {
              const token = manageTokens[listing.id]
              const manageHref = `/listing/${listing.id}/manage${token ? `?token=${encodeURIComponent(token)}` : ''}`
              const sold = listing.status === 'sold'
              const isDraft = listing.status === 'draft'
              const primaryTarget = isDraft ? 'available' : sold ? 'available' : 'sold'
              const primaryLabel = pendingAction === `${listing.id}-update`
                ? (isDraft ? 'Posting…' : 'Saving…')
                : (isDraft ? 'Post it' : sold ? 'Mark available' : 'Mark sold')
              return (
                <div key={listing.id} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                  <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <img src={listing.photos?.[0] || PLACEHOLDER} alt="" className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 truncate">{listing.item_type}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        sold ? 'bg-gray-100 text-gray-500' : isDraft || listing.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{listing.school_name}</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{listing.price === 0 ? 'Free' : `$${listing.price}`}</p>
                  </div>
                  <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
                    <Link href={manageHref} className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full transition-colors">Manage</Link>
                    <button type="button" onClick={() => listingAction(listing, 'update', primaryTarget)} disabled={Boolean(pendingAction)}
                      className={`text-sm font-semibold px-3 py-2 rounded-full border disabled:opacity-50 transition-colors ${
                        isDraft ? 'text-white bg-green-600 border-green-600 hover:bg-green-700' : 'text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                      }`}>
                      {primaryLabel}
                    </button>
                    <button type="button" onClick={() => listingAction(listing, 'delete')} disabled={Boolean(pendingAction)}
                      className="text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-full disabled:opacity-50 transition-colors">
                      {pendingAction === `${listing.id}-delete` ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Your pickup requests</h2>
        {pickups.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-6 text-center">
            <p className="text-gray-500 text-sm mb-3">No pickup requests yet.</p>
            <Link href="/sell-for-me" className="text-sm font-semibold text-indigo-600 hover:underline">Arrange a pickup</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {pickups.map(pickup => {
              const editable = !LOCKED.includes(pickup.status)
              const editing = editingPickupId === pickup.id
              return (
                <div key={pickup.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="font-semibold text-gray-800">Pickup request</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${pickup.status === 'cancelled' ? 'bg-gray-100 text-gray-500' : 'bg-indigo-100 text-indigo-700'}`}>
                      {STATUS_LABEL[pickup.status] || pickup.status}
                    </span>
                  </div>

                  {editing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
                        <input value={pickupDraft.item_summary} onChange={e => setPickupDraft(current => ({ ...current, item_summary: e.target.value }))}
                          className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated number of items</label>
                        <input type="number" value={pickupDraft.est_items} onChange={e => setPickupDraft(current => ({ ...current, est_items: e.target.value }))}
                          className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea value={pickupDraft.notes} onChange={e => setPickupDraft(current => ({ ...current, notes: e.target.value }))} rows={3}
                          className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => savePickup(pickup)} disabled={Boolean(pendingAction)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                          {pendingAction === `${pickup.id}-update` ? 'Saving…' : 'Save changes'}
                        </button>
                        <button type="button" onClick={() => setEditingPickupId(null)} disabled={Boolean(pendingAction)}
                          className="border border-gray-300 text-gray-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors">Cancel edit</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <dl className="text-sm space-y-1.5">
                        <div className="flex gap-2"><dt className="text-gray-500 w-20 shrink-0">Items</dt><dd className="text-gray-900">{pickup.item_summary}</dd></div>
                        {pickup.school_name && <div className="flex gap-2"><dt className="text-gray-500 w-20 shrink-0">School</dt><dd className="text-gray-900">{pickup.school_name}</dd></div>}
                        {pickup.town && <div className="flex gap-2"><dt className="text-gray-500 w-20 shrink-0">Town</dt><dd className="text-gray-900">{pickup.town}</dd></div>}
                        {pickup.est_items != null && <div className="flex gap-2"><dt className="text-gray-500 w-20 shrink-0">Estimate</dt><dd className="text-gray-900">{pickup.est_items} items</dd></div>}
                        {pickup.notes && <div className="flex gap-2"><dt className="text-gray-500 w-20 shrink-0">Notes</dt><dd className="text-gray-900">{pickup.notes}</dd></div>}
                        <div className="flex gap-2"><dt className="text-gray-500 w-20 shrink-0">Submitted</dt><dd className="text-gray-900">{new Date(pickup.created_at).toLocaleDateString()}</dd></div>
                      </dl>
                      {editable ? (
                        <div className="flex gap-2 mt-5">
                          <button type="button" onClick={() => beginPickupEdit(pickup)} disabled={Boolean(pendingAction)}
                            className="text-sm font-semibold px-4 py-2 rounded-full border border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 transition-colors">Edit</button>
                          <button type="button" onClick={() => cancelPickup(pickup)} disabled={Boolean(pendingAction)}
                            className="text-sm font-semibold px-4 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors">
                            {pendingAction === `${pickup.id}-cancel` ? 'Cancelling…' : 'Cancel request'}
                          </button>
                        </div>
                      ) : (
                        <p className="mt-5 text-sm text-gray-500">This pickup is already being handled. Need to change something? <Link href="/contact" className="text-indigo-600 underline">Contact us</Link>.</p>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
