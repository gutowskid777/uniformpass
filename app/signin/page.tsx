'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Please enter your email.')
    setLoading(true)
    const redirect = new URLSearchParams(window.location.search).get('redirect') || '/'
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}${redirect}` },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">📬</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
        <p className="text-gray-500">
          We sent a sign-in link to <span className="font-medium text-gray-700">{email}</span>. Tap it to finish signing in.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign in</h1>
        <p className="text-gray-500 mt-2">No password — we&apos;ll email you a sign-in link. New here? This creates your account.</p>
      </div>
      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com" autoFocus
            className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">{error}</div>}
        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {loading ? 'Sending…' : 'Email me a sign-in link'}
        </button>
      </form>
      <p className="text-center mt-6"><Link href="/" className="text-sm text-indigo-600 hover:underline">Back to marketplace</Link></p>
    </div>
  )
}
