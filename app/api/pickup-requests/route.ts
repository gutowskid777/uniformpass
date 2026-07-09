import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// PII (phones, contact info, towns) lives in pickup_requests, which is insert-only for
// the public anon key. Reads/updates go through this server route using the service role
// key so nothing sensitive is exposed in the client bundle.

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

function authorized(req: Request) {
  return Boolean(ADMIN_PASSWORD) && req.headers.get('x-admin-password') === ADMIN_PASSWORD
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const db = admin()
  if (!db) return NextResponse.json({ error: 'Server not configured — set SUPABASE_SERVICE_ROLE_KEY.' }, { status: 500 })

  const { data, error } = await db
    .from('pickup_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ requests: data })
}

export async function PATCH(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const db = admin()
  if (!db) return NextResponse.json({ error: 'Server not configured — set SUPABASE_SERVICE_ROLE_KEY.' }, { status: 500 })

  const { id, status } = await req.json()
  const allowed = ['new', 'scheduled', 'picked_up', 'listed', 'done', 'declined', 'cancelled']
  if (!id || !allowed.includes(status)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const { error } = await db.from('pickup_requests').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
