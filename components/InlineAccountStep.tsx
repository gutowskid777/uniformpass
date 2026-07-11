'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

// Deferred account creation: the user fills the whole form first, and only when they
// submit do we ask for an account — their in-memory form + photos stay put, and we
// finish the post the moment the account exists. No email in the path (password auth).
export default function InlineAccountStep({
  onCreated, onClose, heading = 'Almost done... create your account', blurb, cta = 'Create account & finish',
}: {
  onCreated: (userId: string) => void
  onClose: () => void
  heading?: string
  blurb?: string
  cta?: string
}) {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isSignup = mode === 'signup'

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const em = email.trim()
    if (!em) return setError('Please enter your email.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({ email: em, password })
        if (error) {
          if (/registered|already/i.test(error.message)) {
            setMode('signin'); setError('You already have an account... enter your password to finish.')
          } else setError(error.message)
          return
        }
        if (!data.session || !data.user) {
          setError('Account created, but sign-in needs email confirmation to be off. Ping the operator.')
          return
        }
        onCreated(data.user.id)
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: em, password })
        if (error) {
          setError(/invalid login/i.test(error.message) ? 'Wrong email or password.' : error.message)
          return
        }
        if (!data.user) { setError('Sign-in failed. Try again.'); return }
        onCreated(data.user.id)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-xl font-bold text-gray-900">{isSignup ? heading : 'Sign in to finish'}</h2>
          <button type="button" onClick={onClose} aria-label="Close"
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none -mt-1">×</button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {blurb || 'Everything you entered is saved and waiting. Create a free account to finish. 10 seconds, no email to check.'}
        </p>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com" autoComplete="email" autoFocus
            className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder={isSignup ? 'Create a password (6+ characters)' : 'Your password'}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {loading ? 'Please wait…' : isSignup ? cta : `Sign in & ${cta.replace(/^.*?& /, '')}`}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          {isSignup ? 'Already have an account?' : 'New here?'}{' '}
          <button type="button" onClick={() => { setMode(isSignup ? 'signin' : 'signup'); setError('') }}
            className="font-semibold text-indigo-700 hover:underline">
            {isSignup ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  )
}
