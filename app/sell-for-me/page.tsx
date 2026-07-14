'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type School } from '@/lib/supabase'
import { getTheme } from '@/lib/schoolTheme'
import SchoolPicker from '@/components/SchoolPicker'
import { useAuth } from '@/components/AuthProvider'
import InlineAccountStep from '@/components/InlineAccountStep'

const STEPS = [
  { icon: '🛍️', title: 'Bag it up', body: 'Leave it by your door at a set time.' },
  { icon: '🚗', title: 'We pick it up', body: 'We come to you.' },
  { icon: '💵', title: 'You get paid', body: 'Cash or Venmo. Half is yours.' },
]

// One tap instead of "how many items?": a busy parent knows the SHAPE of the
// pile, not the count. The est number is what the operator sees in admin.
const PILE_SIZES = [
  { label: 'A few items', summary: 'A few items', est: 5 },
  { label: 'A grocery bag', summary: 'A grocery bag of uniforms', est: 15 },
  { label: 'Several bags', summary: 'Several bags of uniforms', est: 35 },
  { label: 'A closet-full', summary: 'A closet-full of uniforms', est: 60 },
]

export default function SellForMePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [schools, setSchools] = useState<School[]>([])
  const [showAccount, setShowAccount] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [pile, setPile] = useState('')
  const autoSummary = useRef('')

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
    payout_choice: 'donate',
  })

  useEffect(() => {
    supabase.from('schools').select('*').order('name').then(({ data }) => {
      if (data) setSchools(data)
    })
  }, [])

  // Arriving from a school-scoped link: the school is already chosen.
  useEffect(() => {
    if (schools.length === 0) return
    const params = new URLSearchParams(window.location.search)
    const sid = params.get('school_id') || getTheme(params.get('school'))?.dbId || ''
    if (!sid) return
    const match = schools.find(s => s.id === sid)
    if (match) setForm(f => (f.school_id ? f : { ...f, school_id: match.id, school_name: match.name }))
  }, [schools])

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

  // Tapping a pile size fills the numbers; it also drafts the summary line
  // unless the parent already typed their own.
  const pickPile = (chip: (typeof PILE_SIZES)[number]) => {
    setPile(chip.label)
    setForm(f => {
      const keepTyped = f.item_summary.trim() && f.item_summary !== autoSummary.current
      autoSummary.current = chip.summary
      return {
        ...f,
        est_items: String(chip.est),
        item_summary: keepTyped ? f.item_summary : chip.summary,
      }
    })
  }

  // The actual request — runs once we know who's asking (existing session or a
  // just-created account). Form stays in memory, so nothing is re-entered.
  const doSubmit = async (userId: string) => {
    setSubmitting(true)
    setError('')
    try {
      const id = crypto.randomUUID()
      const cancelToken = crypto.randomUUID()
      const { error: insertError } = await supabase.from('pickup_requests').insert({
        id,
        cancel_token: cancelToken,
        user_id: userId,
        name: form.name.trim(),
        contact: form.contact.trim(),
        school_id: form.school_id && form.school_id !== 'other' ? form.school_id : null,
        school_name: form.school_id === 'other' ? form.custom_school.trim() : (form.school_name || null),
        town: form.town.trim() || null,
        item_summary: form.item_summary.trim(),
        est_items: form.est_items ? Number(form.est_items) : null,
        notes: form.notes.trim() || null,
        payout_choice: form.payout_choice,
      })
      if (insertError) throw insertError
      localStorage.setItem(`uniformpass_pickup_${id}`, cancelToken)
      // Remember this seller's details for next time (account memory).
      supabase.from('seller_profiles').upsert({
        user_id: userId,
        name: form.name.trim(),
        contact_info: form.contact.trim(),
        town: form.town.trim(),
        updated_at: new Date().toISOString(),
      }).then(() => {})
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
          payout: form.payout_choice,
        }),
      }).catch(() => {})
      router.push(`/pickup/${id}?token=${cancelToken}&new=1`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Please enter your name.')
    if (!form.contact.trim()) return setError('Please enter a phone or email so we can reach you.')
    if (!form.school_id) return setError('Please pick the school these are from.')
    if (form.school_id === 'other' && !form.custom_school.trim()) return setError('Please type the school name.')
    if (!form.town.trim()) return setError('Please enter your town so we can arrange pickup.')
    if (!form.item_summary.trim()) return setError('Tap a pile size, or tell us what you have.')
    if (!user) { setShowAccount(true); return }  // deferred account creation
    doSubmit(user.id)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* The Auto Sell promise, one line. */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white px-6 py-10 sm:px-10 sm:py-14 mb-8 text-center">
        <p className="text-[11px] font-extrabold tracking-[0.18em] text-emerald-200 uppercase">Auto Sell · Free pickup</p>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none mt-4">
          You do nothing.
        </h1>
        <p className="text-lg sm:text-xl text-emerald-50 mt-4">
          We pick up your pile, sell it, and send you half.
        </p>
      </div>

      {/* Bag → pickup → money */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 px-2 py-5 sm:p-5 flex flex-col items-center text-center gap-2">
            <div className="text-5xl">{s.icon}</div>
            <p className="font-extrabold text-gray-900 leading-tight text-[15px] sm:text-base">{s.title}</p>
            <p className="text-[13px] text-gray-500 leading-snug">{s.body}</p>
          </div>
        ))}
      </div>

      {/* Form: finishable one-handed, thumb only */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-xl font-extrabold text-gray-900">Get your free pickup</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
              <input type="text" placeholder="Maria R." value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone or email *</label>
              <input type="text" placeholder="(201) 555-0134" value={form.contact} onChange={e => set('contact', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
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
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">How much is there? *</label>
            <div className="grid grid-cols-2 gap-2">
              {PILE_SIZES.map(chip => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => pickPile(chip)}
                  className={`py-3.5 px-3 rounded-xl border-2 text-[15px] font-bold transition-colors ${
                    pile === chip.label
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What&apos;s in the pile? <span className="text-gray-400 font-normal">(optional... rough is fine)</span>
            </label>
            <textarea rows={2} placeholder="e.g. SJR polos and dress pants, a few gym shirts, one blazer"
              value={form.item_summary} onChange={e => set('item_summary', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          <details className="group rounded-lg border border-gray-300">
            <summary className="flex items-center justify-between cursor-pointer list-none px-3 py-2.5 text-sm font-medium text-gray-600">
              <span>Anything else? <span className="text-gray-400 font-normal">(pickup times, condition notes...)</span></span>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
                className="w-4 h-4 text-gray-400 shrink-0 transition-transform group-open:rotate-180" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
              </svg>
            </summary>
            <div className="px-3 pb-3">
              <textarea rows={2} placeholder="Best times for pickup, condition notes, etc."
                value={form.notes} onChange={e => set('notes', e.target.value)}
                className="w-full rounded-lg border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
          </details>

          {/* Donate the 50% cut (default) or take it */}
          <div>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'donate', label: 'Donate it 💚' },
                { value: 'keep', label: 'Pay me' },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('payout_choice', opt.value)}
                  className={`py-3 px-3 rounded-xl border-2 text-[15px] font-bold transition-colors ${
                    form.payout_choice === opt.value
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {form.payout_choice === 'donate'
                ? 'Support the startup!'
                : 'You keep 50% of what it sells for.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <button type="submit" disabled={submitting}
          className="w-full bg-emerald-600 text-white font-extrabold py-4 rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-colors text-xl">
          {submitting ? 'Sending...' : 'Get my free pickup'}
        </button>
        <p className="text-center text-sm text-gray-500">
          You&apos;re paid within a few days of each sale, not when everything sells.
        </p>
        <p className="text-center text-xs text-gray-400">
          No obligation. We&apos;ll confirm the details before we come by.
        </p>
      </form>

      {showAccount && (
        <InlineAccountStep
          onClose={() => setShowAccount(false)}
          onCreated={uid => { setShowAccount(false); doSubmit(uid) }}
          heading="Almost done... create your account"
          blurb="Your request is filled in and waiting. Create a free account to send it and track your pickup. 10 seconds, no email to check."
          cta="Create account & send"
        />
      )}
    </div>
  )
}
