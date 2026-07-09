'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.message.trim()) return setError('Please enter a message.')
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Something went wrong.')
      setDone(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Message sent!</h1>
        <p className="text-gray-500 mb-8">Thanks for reaching out. We&apos;ll get back to you soon.</p>
        <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors">Back to marketplace</Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Contact us</h1>
        <p className="text-gray-500 text-lg mt-2">
          Questions, or need help taking down a listing? Send us a note and we&apos;ll sort it out.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your name <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your email <span className="text-gray-400 font-normal">(so we can reply)</span></label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
          <textarea rows={5} required value={form.message} onChange={e => set('message', e.target.value)}
            placeholder="e.g. Please take down my listing for the navy blazer, size 16."
            className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        {/* Honeypot: hidden from users, catches bots */}
        <input type="text" tabIndex={-1} autoComplete="off" value={form.website}
          onChange={e => set('website', e.target.value)}
          className="hidden" aria-hidden="true" />

        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

        <button type="submit" disabled={submitting}
          className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors text-lg">
          {submitting ? 'Sending...' : 'Send message'}
        </button>
      </form>
    </div>
  )
}
