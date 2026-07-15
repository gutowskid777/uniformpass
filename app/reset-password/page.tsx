'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const linkParams =
  typeof window === 'undefined' ? null : new URLSearchParams(window.location.hash.slice(1))

export default function ResetPasswordPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'request' | 'update'>('request')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState(false)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (linkParams?.get('error')) {
      setError(
        linkParams.get('error_code') === 'otp_expired'
          ? 'That link expired or was already used. Enter your email for a fresh one.'
          : 'That link did not work. Enter your email for a fresh one.'
      )
      history.replaceState(null, '', window.location.pathname)
    } else if (linkParams?.get('type') === 'recovery') {
      setMode('update')
    }
    const { data: sub } = supabase.auth.onAuthStateChange(e => {
      if (e === 'PASSWORD_RECOVERY') setMode('update')
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const em = email.trim()
    if (!em) return setError('Please enter your email.')
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(em, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) {
        setError(
          /rate|seconds|security purposes/i.test(error.message)
            ? 'We just sent one... give it a minute before trying again.'
            : error.message
        )
        return
      }
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        if (/session|expired|jwt|token/i.test(error.message)) {
          setMode('request')
          setPassword('')
          setError('That link expired or was already used. Enter your email for a fresh one.')
        } else setError(error.message)
        return
      }
      setDone(true)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Password updated</h1>
          <p className="text-gray-500 mt-2">You&rsquo;re signed in on this device.</p>
        </div>
        <Link href="/my-listings"
          className="block w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 text-center transition-colors">
          Go to my listings
        </Link>
        <p className="text-center mt-6"><Link href="/" className="text-sm text-indigo-600 hover:underline">Back to marketplace</Link></p>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Check your email</h1>
          <p className="text-gray-500 mt-2">
            If there&rsquo;s an account for {email.trim()}, a reset link is on its way.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-600 space-y-2">
          <p>Open the link on this phone or computer and you can set a new password.</p>
          <p>It expires in an hour. Check your spam folder if it&rsquo;s not there in a couple of minutes.</p>
        </div>
        <p className="text-center mt-5 text-sm text-gray-600">
          Wrong email?{' '}
          <button type="button" onClick={() => { setSent(false); setError('') }}
            className="font-semibold text-indigo-700 hover:underline">
            Try another
          </button>
        </p>
        <p className="text-center mt-6"><Link href="/signin" className="text-sm text-indigo-600 hover:underline">Back to sign in</Link></p>
      </div>
    )
  }

  const isUpdate = mode === 'update'

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {isUpdate ? 'Set a new password' : 'Reset your password'}
        </h1>
        <p className="text-gray-500 mt-2">
          {isUpdate ? "Pick something you'll remember." : "We'll email you a link to set a new one."}
        </p>
      </div>

      <form onSubmit={isUpdate ? savePassword : sendLink} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {isUpdate ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters" autoComplete="new-password" autoFocus
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com" autoComplete="email" autoFocus
              className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        )}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">{error}</div>}
        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {loading ? 'Please wait…' : isUpdate ? 'Save password' : 'Email me a link'}
        </button>
      </form>

      <p className="text-center mt-5 text-sm text-gray-600">
        Remembered it?{' '}
        <Link href="/signin" className="font-semibold text-indigo-700 hover:underline">Sign in</Link>
      </p>
      <p className="text-center mt-6"><Link href="/" className="text-sm text-indigo-600 hover:underline">Back to marketplace</Link></p>
    </div>
  )
}
