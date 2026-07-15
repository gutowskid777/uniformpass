'use client'

import Link from 'next/link'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { supabase } from '@/lib/supabase'

const WORDS = [
  'Maple', 'River', 'Sunny', 'Blazer', 'Cedar', 'Harbor', 'Quiet', 'Ridge',
  'Willow', 'Meadow', 'Copper', 'Lantern', 'Autumn', 'Brook', 'Falcon', 'Garden',
]

const makePassword = () => {
  const pick = () => WORDS[Math.floor(Math.random() * WORDS.length)]
  let a = pick(), b = pick()
  while (b === a) b = pick()
  return `${a}${b}${Math.floor(Math.random() * 90) + 10}`
}

export type AccountFieldHandle = {
  ensureAccount: () => Promise<string | null>
}

// The account is a field, not a gate: it renders as the last card of the form and the parent's
// submit button drives it. Parent calls ensureAccount() and gets a user id back, or null when
// the field is showing its own error.
const AccountField = forwardRef<AccountFieldHandle, { blurb?: string }>(function AccountField({ blurb }, ref) {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [custom, setCustom] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<React.ReactNode>('')

  const isSignup = mode === 'signup'

  useEffect(() => { setPassword(makePassword()) }, [])

  const setOwn = () => { setCustom(true); setPassword(''); setError('') }

  const toSignin = () => { setMode('signin'); setCustom(true); setPassword(''); setError('') }

  const ensureAccount = async (): Promise<string | null> => {
    setError('')
    const em = email.trim()
    if (!em) { setError('Please enter your email.'); return null }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return null }
    setLoading(true)
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({ email: em, password })
        if (error) {
          if (/registered|already/i.test(error.message)) {
            setMode('signin'); setCustom(true); setPassword('')
            setError('You already have an account... enter your password to finish.')
          } else setError(error.message)
          return null
        }
        if (!data.session || !data.user) {
          setError(<>Account created, but sign-in needs email confirmation to be off.{' '}
            <Link href="/contact" className="font-semibold underline">Tell us</Link> and we&apos;ll fix it.</>)
          return null
        }
        return data.user.id
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email: em, password })
      if (error) {
        setError(/invalid login/i.test(error.message) ? 'Wrong email or password.' : error.message)
        return null
      }
      if (!data.user) { setError('Sign-in failed. Try again.'); return null }
      return data.user.id
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({ ensureAccount }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div>
        <h2 className="font-semibold text-gray-800">{isSignup ? 'Your account' : 'Sign in to finish'}</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {isSignup
            ? (blurb || 'So you can edit or delete this later. No email to check.')
            : 'You already have an account here. Enter your password to finish.'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input type="email" placeholder="you@email.com" autoComplete="email"
          value={email} onChange={e => setEmail(e.target.value)}
          className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          {isSignup && !custom && (
            <button type="button" onClick={setOwn} className="text-xs font-semibold text-indigo-700 hover:underline">
              Set my own
            </button>
          )}
          {!isSignup && (
            <Link href="/reset-password" className="text-xs font-semibold text-indigo-700 hover:underline">
              Forgot your password?
            </Link>
          )}
        </div>
        <input type={custom && !isSignup ? 'password' : 'text'}
          readOnly={isSignup && !custom}
          placeholder={isSignup ? 'Create a password (6+ characters)' : 'Your password'}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          value={password} onChange={e => setPassword(e.target.value)}
          className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 read-only:bg-gray-50 read-only:text-gray-600" />
        {isSignup && !custom && (
          <p className="text-xs text-gray-400 mt-1">We made this one for you. Write it down if you like.</p>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">{error}</div>}

      {isSignup ? (
        <p className="text-xs text-gray-400">
          Already have an account?{' '}
          <button type="button" onClick={toSignin} className="font-semibold text-indigo-700 hover:underline">Sign in</button>
        </p>
      ) : (
        <p className="text-xs text-gray-400">
          New here?{' '}
          <button type="button" onClick={() => { setMode('signup'); setCustom(false); setPassword(makePassword()); setError('') }}
            className="font-semibold text-indigo-700 hover:underline">Create an account</button>
        </p>
      )}

      {loading && <p className="text-xs text-gray-400">Creating your account…</p>}
    </div>
  )
})

export default AccountField
