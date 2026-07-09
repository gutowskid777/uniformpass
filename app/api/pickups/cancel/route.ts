import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Lets a submitter view + cancel their own pickup request via a secret cancel_token.
// pickup_requests has no public read, so all access goes through the service role here.

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

// Statuses where the pile is already handled — no longer cancellable by the submitter.
const LOCKED = ['picked_up', 'listed', 'done']

export async function POST(req: Request) {
  const db = admin()
  if (!db) return NextResponse.json({ error: 'Server not configured — set SUPABASE_SERVICE_ROLE_KEY.' }, { status: 500 })

  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }
  const { action, id, token } = body || {}
  if (!id || !token) return NextResponse.json({ error: 'missing request or token' }, { status: 400 })

  const { data: reqRow } = await db
    .from('pickup_requests')
    .select('id, status, item_summary, school_name, created_at')
    .eq('id', id)
    .eq('cancel_token', token)
    .maybeSingle()
  if (!reqRow) return NextResponse.json({ error: 'This link is invalid or expired.' }, { status: 403 })

  if (action === 'load') {
    return NextResponse.json({ request: reqRow, cancellable: !LOCKED.includes(reqRow.status) })
  }

  if (action === 'cancel') {
    if (reqRow.status === 'cancelled') return NextResponse.json({ ok: true, status: 'cancelled' })
    if (LOCKED.includes(reqRow.status)) {
      return NextResponse.json({ error: 'This pickup is already being handled — contact us to sort it out.' }, { status: 409 })
    }
    const { error } = await db.from('pickup_requests').update({ status: 'cancelled' }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, status: 'cancelled' })
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}
