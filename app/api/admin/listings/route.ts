import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Admin listing mutations (status / verified / delete). All go through the service role
// after a SERVER-SIDE password check — the anon key can no longer update or delete listings
// directly (the public UPDATE/DELETE RLS policies were dropped). The password is server-only
// (ADMIN_PASSWORD), so it never ships in the client bundle.

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

const STATUS = ['available', 'pending', 'sold', 'draft', 'inactive']

export async function POST(req: Request) {
  if (!ADMIN_PASSWORD || req.headers.get('x-admin-password') !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const db = admin()
  if (!db) return NextResponse.json({ error: 'Server not configured — set SUPABASE_SERVICE_ROLE_KEY.' }, { status: 500 })

  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }
  const { action, id, status, is_verified } = body || {}

  // Cheap credential check used by the login screen — validates the password only.
  if (action === 'verify') return NextResponse.json({ ok: true })

  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })

  if (action === 'status') {
    if (!STATUS.includes(status)) return NextResponse.json({ error: 'bad status' }, { status: 400 })
    const { error } = await db.from('listings').update({ status }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'verified') {
    const { error } = await db.from('listings').update({ is_verified: Boolean(is_verified) }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'delete') {
    const { data: l } = await db.from('listings').select('photos').eq('id', id).single()
    const photos: string[] = l?.photos || []
    if (photos.length) {
      const paths = photos.map((u: string) => u.split('/uniform-photos/')[1] || '').filter(Boolean)
      if (paths.length) await db.storage.from('uniform-photos').remove(paths)
    }
    const { error } = await db.from('listings').delete().eq('id', id) // cascade removes the token row
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}
