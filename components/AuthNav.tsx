'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'

export default function AuthNav() {
  const { user, loading } = useAuth()
  if (loading) return null

  if (!user) {
    return (
      <Link
        href="/signin"
        className="inline-flex items-center h-9 text-sm font-semibold text-gray-700 border border-gray-300 px-4 rounded-full hover:border-indigo-400 hover:text-indigo-700 transition-colors"
      >
        Sign in
      </Link>
    )
  }

  return (
    <button
      onClick={() => supabase.auth.signOut()}
      className="inline-flex items-center h-9 text-sm font-semibold text-indigo-700 bg-indigo-50 px-4 rounded-full hover:bg-indigo-100 transition-colors"
      title={user.email || ''}
    >
      Sign out
    </button>
  )
}
