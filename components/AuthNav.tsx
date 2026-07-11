'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'

export default function AuthNav() {
  const { user, loading } = useAuth()
  if (loading) return null

  if (!user) {
    return (
      <Link href="/signin" className="text-sm text-gray-600 hover:text-gray-900">
        Sign in
      </Link>
    )
  }

  return (
    <button
      onClick={() => supabase.auth.signOut()}
      className="text-sm text-gray-600 hover:text-gray-900"
      title={user.email || ''}
    >
      Sign out
    </button>
  )
}
