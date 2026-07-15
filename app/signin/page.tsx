'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SignInPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const redirect = () =>
    (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('redirect')) || '/'

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const em = email.trim()
    if (!em) return setError('Please enter your email.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email: em, password })
        if (error) {
          // Existing account → nudge to sign in instead of a scary error.
          if (/registered|already/i.test(error.message)) {
            setMode('signin')
            setError('You already have an account... enter your password to sign in.')
          } else setError(error.message)
          return
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: em, password })
        if (error) {
          setError(/invalid login/i.test(error.message) ? 'Wrong email or password.' : error.message)
          return
        }
      }
      router.push(redirect())
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const isSignup = mode === 'signup'

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {isSignup ? 'Create your account' : 'Sign in'}
        </h1>
        <p className="text-gray-500 mt-2">
          {isSignup ? 'Post listings and manage them from any device.' : 'Welcome back.'}
        </p>
      </div>

      <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com" autoComplete="email" autoFocus
            className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            {!isSignup && <Link href="/reset-password" className="text-sm text-indigo-600 hover:underline">Forgot your password?</Link>}
          </div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm">{error}</div>}
        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {loading ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <p className="text-center mt-5 text-sm text-gray-600">
        {isSignup ? 'Already have an account?' : 'New here?'}{' '}
        <button type="button"
          onClick={() => { setMode(isSignup ? 'signin' : 'signup'); setError('') }}
          className="font-semibold text-indigo-700 hover:underline">
          {isSignup ? 'Sign in' : 'Create one'}
        </button>
      </p>
      <p className="text-center mt-6"><Link href="/" className="text-sm text-indigo-600 hover:underline">Back to marketplace</Link></p>
    </div>
  )
}
