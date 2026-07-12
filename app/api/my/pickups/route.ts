import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

const LOCKED = ['picked_up', 'listed', 'done', 'cancelled']

export async function POST(req: Request) {
  const db = admin()
  if (!db) return NextResponse.json({ error: 'Server not configured — set SUPABASE_SERVICE_ROLE_KEY.' }, { status: 500 })

  const authorization = req.headers.get('authorization') || ''
  const jwt = authorization.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!jwt) return NextResponse.json({ error: 'Please sign in to manage your pickup requests.' }, { status: 401 })

  const { data: { user }, error: authError } = await db.auth.getUser(jwt)
  if (authError || !user) return NextResponse.json({ error: 'Please sign in to manage your pickup requests.' }, { status: 401 })

  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }
  const { action, id, updates } = body || {}

  if (action === 'list') {
    const { data, error } = await db
      .from('pickup_requests')
      .select('id, item_summary, school_name, town, est_items, notes, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ requests: data || [] })
  }

  if (action === 'update') {
    if (!id || !updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return NextResponse.json({ error: 'missing request or updates' }, { status: 400 })
    }

    const clean: Record<string, string | number | null> = {}
    if ('item_summary' in updates) {
      if (typeof updates.item_summary !== 'string' || !updates.item_summary.trim()) {
        return NextResponse.json({ error: 'Please describe the items in your pickup request.' }, { status: 400 })
      }
      clean.item_summary = updates.item_summary.trim()
    }
    if ('notes' in updates) {
      if (updates.notes !== null && typeof updates.notes !== 'string') {
        return NextResponse.json({ error: 'Notes must be text.' }, { status: 400 })
      }
      clean.notes = updates.notes
    }
    if ('est_items' in updates) {
      if (updates.est_items !== null && (typeof updates.est_items !== 'number' || !Number.isFinite(updates.est_items))) {
        return NextResponse.json({ error: 'Estimated items must be a number.' }, { status: 400 })
      }
      clean.est_items = updates.est_items
    }
    if (Object.keys(clean).length === 0) {
      return NextResponse.json({ error: 'nothing to update' }, { status: 400 })
    }

    const { data, error } = await db
      .from('pickup_requests')
      .update(clean)
      .eq('id', id)
      .eq('user_id', user.id)
      .not('status', 'in', `(${LOCKED.join(',')})`)
      .select('id')
      .maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) {
      return NextResponse.json({ error: 'This pickup request cannot be edited because it is already being handled.' }, { status: 409 })
    }
    return NextResponse.json({ ok: true })
  }

  if (action === 'cancel') {
    if (!id) return NextResponse.json({ error: 'missing request' }, { status: 400 })

    const { data, error } = await db
      .from('pickup_requests')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('user_id', user.id)
      .not('status', 'in', `(${LOCKED.join(',')})`)
      .select('id')
      .maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (data) return NextResponse.json({ ok: true })

    const { data: existing, error: lookupError } = await db
      .from('pickup_requests')
      .select('status')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    if (lookupError) return NextResponse.json({ error: lookupError.message }, { status: 500 })
    if (existing?.status === 'cancelled') return NextResponse.json({ ok: true })
    return NextResponse.json({ error: 'This pickup is already being handled... contact us to sort it out.' }, { status: 409 })
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}
