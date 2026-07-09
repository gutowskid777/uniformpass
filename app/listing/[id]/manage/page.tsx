'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { type Listing, SIZES, CONTACT_METHODS } from '@/lib/supabase'

const STATUS_TABS = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
] as const

type ManageForm = {
  status: string
  price: string
  item_type: string
  size: string
  is_lot: boolean
  condition: string
  category: string
  gender: string
  description: string
  contact_method: string
  contact_info: string
}

function prefill(l: Listing): ManageForm {
  return {
    status: l.status,
    price: l.price != null ? String(l.price) : '',
    item_type: l.item_type || '',
    size: l.is_lot ? '' : l.size || '',
    is_lot: l.is_lot || false,
    condition: l.condition,
    category: l.category,
    gender: l.gender,
    description: l.description || '',
    contact_method: l.contact_method || 'text',
    contact_info: l.contact_info || '',
  }
}

export default function ManageListingPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [token, setToken] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [invalid, setInvalid] = useState(false)
  const [listing, setListing] = useState<Listing | null>(null)
  const [form, setForm] = useState<ManageForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [statusSaving, setStatusSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const t = sp.get('token') || ''
    setIsNew(sp.get('new') === '1')
    setToken(t)
    if (!t) { setInvalid(true); setLoading(false); return }
    fetch('/api/listings/manage', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'load', listingId: id, token: t }),
    })
      .then(async res => {
        if (!res.ok) { setInvalid(true); return }
        const { listing } = await res.json()
        setListing(listing)
        setForm(prefill(listing))
      })
      .catch(() => setInvalid(true))
      .finally(() => setLoading(false))
  }, [id])

  const set = (key: keyof ManageForm, value: string | boolean) =>
    setForm(f => (f ? { ...f, [key]: value } : f))

  const buildUpdates = (f: ManageForm) => ({
    status: f.status,
    price: f.price,
    item_type: f.item_type.trim(),
    size: f.is_lot ? 'Multiple sizes' : f.size,
    is_lot: f.is_lot,
    condition: f.condition,
    category: f.category,
    gender: f.gender,
    description: f.description.trim(),
    contact_method: f.contact_info.trim() ? f.contact_method : 'other',
    contact_info: f.contact_info.trim(),
  })

  const patchStatus = async (status: string) => {
    if (!form) return
    setStatusSaving(true); setError('')
    setForm({ ...form, status })
    const res = await fetch('/api/listings/manage', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'update', listingId: id, token, updates: { status } }),
    })
    if (!res.ok) setError((await res.json()).error || 'Could not update status')
    setStatusSaving(false)
  }

  const save = async () => {
    if (!form) return
    setSaving(true); setError(''); setSaved(false)
    if (!form.item_type.trim()) { setError('Item description can’t be empty.'); setSaving(false); return }
    const res = await fetch('/api/listings/manage', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'update', listingId: id, token, updates: buildUpdates(form) }),
    })
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    else setError((await res.json()).error || 'Could not save changes')
    setSaving(false)
  }

  const del = async () => {
    if (!confirm('Delete this listing permanently? This cannot be undone.')) return
    setDeleting(true); setError('')
    const res = await fetch('/api/listings/manage', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'delete', listingId: id, token }),
    })
    if (res.ok) {
      localStorage.removeItem(`uniformpass_manage_${id}`)
      router.push('/')
    } else {
      setError((await res.json()).error || 'Could not delete listing')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (invalid || !form) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage link not valid</h1>
        <p className="text-gray-500 mb-6">This link is missing or incorrect. Lost your link, or on a new device? Email us and we&apos;ll edit or take down your listing for you.</p>
        <a href="mailto:djg323@cornell.edu" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors">Email djg323@cornell.edu</a>
        <div className="mt-4"><Link href="/" className="text-sm text-indigo-600 hover:underline">Back to marketplace</Link></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {isNew && (
        <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
          <p className="font-bold text-emerald-900">✅ Your listing is live!</p>
          <p className="text-sm text-emerald-800 mt-1">
            Find it anytime under <Link href="/my-listings" className="underline font-semibold">My Listings</Link>.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage listing</h1>
          <p className="text-sm text-gray-500 mt-0.5">{listing?.item_type} · {listing?.school_name}</p>
        </div>
        <Link href={`/listing/${id}`} className="text-sm text-indigo-600 hover:underline">View public page →</Link>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Status {statusSaving && <span className="text-gray-400">· saving…</span>}</p>
        <div className="flex gap-2">
          {STATUS_TABS.map(s => (
            <button key={s.value} onClick={() => patchStatus(s.value)} disabled={statusSaving}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors disabled:opacity-50 ${
                form.status === s.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}>
              {s.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Mark it <b>Sold</b> to hide it from the marketplace without deleting it.</p>
      </div>

      {/* Editable details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-4">
        <h2 className="font-semibold text-gray-800">Details</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item description</label>
          <input type="text" value={form.item_type} onChange={e => set('item_type', e.target.value)}
            className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select value={form.condition} onChange={e => set('condition', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="new">New / Never worn</option>
              <option value="good">Good condition</option>
              <option value="fair">Fair / Some wear</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={form.is_lot} onChange={e => set('is_lot', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Multiple sizes (lot)
            </label>
          </div>
          {!form.is_lot ? (
            <select value={form.size} onChange={e => set('size', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Select size...</option>
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              <option value="Other">Other</option>
            </select>
          ) : (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">Describe the sizes in the comments below.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="uniform">Uniform</option>
              <option value="sport">Sport</option>
              <option value="spirit">Spirit wear</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select value={form.gender} onChange={e => set('gender', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="unisex">Unisex</option>
              <option value="boy">Boys</option>
              <option value="girl">Girls</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
          <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
            className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">How buyers reach you</label>
          <div className="grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-3">
            <select value={form.contact_method} onChange={e => set('contact_method', e.target.value)}
              className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
              {CONTACT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <input type="text"
              placeholder={CONTACT_METHODS.find(m => m.value === form.contact_method)?.placeholder}
              value={form.contact_info} onChange={e => set('contact_info', e.target.value)}
              className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <p className="text-xs text-gray-400 mt-1">Shown publicly on your listing. Photos and school aren’t editable here. Delete and repost to change those.</p>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}

      <div className="flex gap-3 mb-8">
        <button onClick={save} disabled={saving}
          className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-200 p-5">
        <p className="font-semibold text-gray-900">Take it down</p>
        <p className="text-sm text-gray-500 mt-0.5 mb-3">Permanently delete this listing and its photos.</p>
        <button onClick={del} disabled={deleting}
          className="text-sm font-semibold px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors">
          {deleting ? 'Deleting…' : 'Delete listing'}
        </button>
      </div>
    </div>
  )
}
