'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type Req = { id: string; status: string; item_summary: string; school_name: string | null; created_at: string }

const STATUS_LABEL: Record<string, string> = {
  new: 'Received... we’ll be in touch',
  scheduled: 'Pickup scheduled',
  picked_up: 'Picked up',
  listed: 'Listed for sale',
  done: 'Sold. Done.',
  declined: 'Declined',
  cancelled: 'Cancelled',
}

export default function PickupStatusPage() {
  const params = useParams()
  const id = params.id as string

  const [token, setToken] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [invalid, setInvalid] = useState(false)
  const [req, setReq] = useState<Req | null>(null)
  const [cancellable, setCancellable] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const t = sp.get('token') || ''
    setIsNew(sp.get('new') === '1')
    setToken(t)
    if (!t) { setInvalid(true); setLoading(false); return }
    fetch('/api/pickups/cancel', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'load', id, token: t }),
    })
      .then(async res => {
        if (!res.ok) { setInvalid(true); return }
        const j = await res.json()
        setReq(j.request)
        setCancellable(j.cancellable)
      })
      .catch(() => setInvalid(true))
      .finally(() => setLoading(false))
  }, [id])

  const cancel = async () => {
    if (!confirm('Cancel this pickup request?')) return
    setCancelling(true); setError('')
    const res = await fetch('/api/pickups/cancel', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', id, token }),
    })
    const j = await res.json()
    if (res.ok) {
      setReq(r => (r ? { ...r, status: 'cancelled' } : r))
      setCancellable(false)
    } else setError(j.error || 'Could not cancel')
    setCancelling(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (invalid || !req) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Link not valid</h1>
        <p className="text-gray-500 mb-6">This pickup link is missing or incorrect. Need help? Contact us.</p>
        <Link href="/contact" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors">Contact us</Link>
      </div>
    )
  }

  const cancelled = req.status === 'cancelled'

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      {isNew && !cancelled && (
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900">Got it! We’ll be in touch.</h1>
          <p className="text-gray-500 mt-2">Thanks for keeping uniforms out of the landfill. Bookmark this page to check status or cancel.</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold text-gray-800">Your pickup request</h2>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            cancelled ? 'bg-gray-100 text-gray-500' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {STATUS_LABEL[req.status] || req.status}
          </span>
        </div>
        <dl className="text-sm space-y-1.5">
          <div className="flex gap-2"><dt className="text-gray-500 w-20 shrink-0">Items</dt><dd className="text-gray-900">{req.item_summary}</dd></div>
          {req.school_name && <div className="flex gap-2"><dt className="text-gray-500 w-20 shrink-0">School</dt><dd className="text-gray-900">{req.school_name}</dd></div>}
          <div className="flex gap-2"><dt className="text-gray-500 w-20 shrink-0">Submitted</dt><dd className="text-gray-900">{new Date(req.created_at).toLocaleDateString()}</dd></div>
        </dl>

        {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">{error}</div>}

        {cancelled ? (
          <p className="mt-5 text-sm text-gray-500">This request has been cancelled. Changed your mind? <Link href="/sell-for-me" className="text-indigo-600 underline">Start a new one</Link>.</p>
        ) : cancellable ? (
          <button onClick={cancel} disabled={cancelling}
            className="mt-5 text-sm font-semibold px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors">
            {cancelling ? 'Cancelling…' : 'Cancel this request'}
          </button>
        ) : (
          <p className="mt-5 text-sm text-gray-500">This pickup is already being handled. Need to change something? <Link href="/contact" className="text-indigo-600 underline">Contact us</Link>.</p>
        )}
      </div>

      <div className="text-center mt-6">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">Back to marketplace</Link>
      </div>
    </div>
  )
}
