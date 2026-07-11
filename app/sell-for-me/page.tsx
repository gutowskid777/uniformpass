'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type School } from '@/lib/supabase'
import SchoolPicker from '@/components/SchoolPicker'
import { useAuth } from '@/components/AuthProvider'

const STEPS = [
  { icon: '📦', title: 'You gather the pile', body: 'Uniforms, gym clothes, or spirit wear. Any condition. Even one bag works.' },
  { icon: '🚗', title: 'We pick it up', body: 'We schedule a quick pickup near you. Hand it off and you’re done.' },
  { icon: '💵', title: 'We sell it, you keep 50%', body: 'We photograph, list, and sell it all. You get half the profit.' },
]

export default function SellForMePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [schools, setSchools] = useState<School[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    contact: '',
    school_id: '',
    school_name: '',
    custom_school: '',
    town: '',
    item_summary: '',
    est_items: '',
    notes: '',
  })

  useEffect(() => {
    supabase.from('schools').select('*').order('name').then(({ data }) => {
      if (data) setSchools(data)
    })
  }, [])

  // Login required to request a pickup.
  useEffect(() => {
    if (!authLoading && !user) router.replace('/signin?redirect=/sell-for-me')
  }, [authLoading, user, router])

  // Prefill from the account's saved profile.
  useEffect(() => {
    if (!user) return
    supabase.from('seller_profiles').select('*').eq('user_id', user.id).maybeSingle().then(({ data }) => {
      if (!data) return
      setForm(f => ({
        ...f,
        name: f.name || data.name || '',
        contact: f.contact || data.contact_info || '',
        town: f.town || data.town || '',
      }))
    })
  }, [user])

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Please enter your name.')
    if (!form.contact.trim()) return setError('Please enter a phone or email so we can reach you.')
    if (!form.school_id) return setError('Please pick the school these are from.')
    if (form.school_id === 'other' && !form.custom_school.trim()) return setError('Please type the school name.')
    if (!form.town.trim()) return setError('Please enter your town so we can arrange pickup.')
    if (!form.item_summary.trim()) return setError('Tell us roughly what you have.')
    setSubmitting(true)
    try {
      const id = crypto.randomUUID()
      const cancelToken = crypto.randomUUID()
      const { error: insertError } = await supabase.from('pickup_requests').insert({
        id,
        cancel_token: cancelToken,
        user_id: user?.id ?? null,
        name: form.name.trim(),
        contact: form.contact.trim(),
        school_id: form.school_id && form.school_id !== 'other' ? form.school_id : null,
        school_name: form.school_id === 'other' ? form.custom_school.trim() : (form.school_name || null),
        town: form.town.trim() || null,
        item_summary: form.item_summary.trim(),
        est_items: form.est_items ? Number(form.est_items) : null,
        notes: form.notes.trim() || null,
      })
      if (insertError) throw insertError
      localStorage.setItem(`uniformpass_pickup_${id}`, cancelToken)
      // Remember this seller's details for next time (account memory).
      if (user) {
        supabase.from('seller_profiles').upsert({
          user_id: user.id,
          name: form.name.trim(),
          contact_info: form.contact.trim(),
          town: form.town.trim(),
          updated_at: new Date().toISOString(),
        }).then(() => {})
      }
      // Notify the operator (best-effort — the request is already saved).
      fetch('/api/pickups/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          contact: form.contact.trim(),
          school: form.school_id === 'other' ? form.custom_school.trim() : form.school_name,
          town: form.town.trim(),
          item_summary: form.item_summary.trim(),
          est_items: form.est_items || null,
          notes: form.notes.trim() || null,
        }),
      }).catch(() => {})
      router.push(`/pickup/${id}?token=${cancelToken}&new=1`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  if (authLoading || !user) {
    return <div className="max-w-2xl mx-auto px-4 py-24 text-center text-gray-400">Loading…</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          We&apos;ll sell your uniforms for you.
        </h1>
        <p className="text-gray-500 text-lg mt-3">
          Have a pile headed for the trash? Hand it off and keep <span className="font-semibold text-indigo-700">50% of the profit</span>. We do everything else.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {STEPS.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className="font-semibold text-gray-900">{i + 1}. {s.title}</p>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Request a pickup</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
              <input type="text" placeholder="Maria R." value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone or email *</label>
              <input type="text" placeholder="(201) 555-0134" value={form.contact} onChange={e => set('contact', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School *</label>
              <SchoolPicker schools={schools}
                value={{ school_id: form.school_id, school_name: form.school_name, custom_school: form.custom_school }}
                onChange={v => setForm(f => ({ ...f, ...v }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your town * <span className="text-gray-400 font-normal">(for pickup)</span></label>
              <input type="text" placeholder="Montvale" value={form.town} onChange={e => set('town', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What do you have? *</label>
            <textarea rows={3} placeholder="e.g. ~15 SJR polos and dress pants, a few Bosco gym shirts, one blazer size 16"
              value={form.item_summary} onChange={e => set('item_summary', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Roughly how many items? <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="number" min="0" placeholder="20" value={form.est_items} onChange={e => set('est_items', e.target.value)}
              className="w-full sm:w-40 rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anything else? <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea rows={2} placeholder="Best times for pickup, condition notes, etc."
              value={form.notes} onChange={e => set('notes', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <button type="submit" disabled={submitting}
          className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors text-lg">
          {submitting ? 'Sending...' : 'Request my pickup'}
        </button>
        <p className="text-center text-xs text-gray-400">
          No obligation. We&apos;ll confirm the details before we come by.
        </p>
      </form>
    </div>
  )
}
