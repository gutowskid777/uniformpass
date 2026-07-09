import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Self-serve listing management without accounts. A secret token (from listing_tokens,
// which has no public read) is handed to the seller at post time. Every action here
// verifies that token server-side with the service role before touching the listing.

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

const ENUMS: Record<string, string[]> = {
  status: ['available', 'pending', 'sold', 'draft'],
  condition: ['new', 'good', 'fair'],
  category: ['uniform', 'sport', 'spirit', 'alumni'],
  gender: ['boy', 'girl', 'unisex'],
  contact_method: ['text', 'email', 'venmo', 'other'],
}
const EDITABLE = ['status', 'price', 'item_type', 'size', 'is_lot', 'condition', 'category', 'gender', 'description', 'contact_method', 'contact_info']

function cleanUpdates(raw: Record<string, unknown>) {
  const out: Record<string, unknown> = {}
  for (const key of EDITABLE) {
    if (!(key in raw)) continue
    let val = raw[key]
    if (ENUMS[key] && val != null && !ENUMS[key].includes(String(val))) continue // drop invalid enum
    if (key === 'price') val = Number(val) || 0
    if (key === 'is_lot') val = Boolean(val)
    if ((key === 'description' || key === 'contact_info' || key === 'contact_method') && val === '') val = null
    out[key] = val
  }
  return out
}

export async function POST(req: Request) {
  const db = admin()
  if (!db) return NextResponse.json({ error: 'Server not configured — set SUPABASE_SERVICE_ROLE_KEY.' }, { status: 500 })

  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }
  const { action, listingId, token, updates } = body || {}
  if (!listingId || !token) return NextResponse.json({ error: 'missing listing or token' }, { status: 400 })

  // Verify the token belongs to this listing
  const { data: tok } = await db
    .from('listing_tokens')
    .select('listing_id')
    .eq('listing_id', listingId)
    .eq('token', token)
    .maybeSingle()
  if (!tok) return NextResponse.json({ error: 'This manage link is invalid or expired.' }, { status: 403 })

  if (action === 'load') {
    const { data, error } = await db.from('listings').select('*').eq('id', listingId).single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ listing: data })
  }

  if (action === 'update') {
    const clean = cleanUpdates(updates || {})
    if (Object.keys(clean).length === 0) return NextResponse.json({ error: 'nothing to update' }, { status: 400 })
    const { error } = await db.from('listings').update(clean).eq('id', listingId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'delete') {
    const { data: l } = await db.from('listings').select('photos').eq('id', listingId).single()
    const photos: string[] = l?.photos || []
    if (photos.length) {
      const paths = photos.map(u => u.split('/uniform-photos/')[1] || '').filter(Boolean)
      if (paths.length) await db.storage.from('uniform-photos').remove(paths)
    }
    const { error } = await db.from('listings').delete().eq('id', listingId) // cascade removes the token row
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}
