import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { STALE_LISTING_DAYS } from '@/lib/supabase'

// Weekly nudge: email each seller whose ACTIVE listings have gone stale (not
// posted or confirmed in STALE_LISTING_DAYS), asking them to confirm or mark
// sold. Keeps the marketplace honest so buyers don't chase gone items.
// Fired by Vercel Cron (see vercel.json); guarded by CRON_SECRET.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FROM = process.env.PICKUP_EMAIL_FROM || 'UniformPass <no-reply@uniformpass.shop>'
const SITE = 'https://uniformpass.shop'

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization') || ''
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const db = admin()
  const resendKey = process.env.RESEND_API_KEY
  if (!db || !resendKey) {
    return NextResponse.json({ ok: false, reason: 'not configured' }, { status: 200 })
  }

  const cutoff = new Date(Date.now() - STALE_LISTING_DAYS * 86_400_000).toISOString()

  const { data: stale, error } = await db
    .from('listings')
    .select('id, item_type, user_id, created_at, bumped_at')
    .eq('status', 'available')
    .not('user_id', 'is', null)
    .or(`and(bumped_at.is.null,created_at.lt.${cutoff}),bumped_at.lt.${cutoff}`)

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 200 })
  if (!stale?.length) return NextResponse.json({ ok: true, sellers: 0, listings: 0 })

  // Group stale listings by seller.
  const bySeller = new Map<string, string[]>()
  for (const l of stale) {
    const items = bySeller.get(l.user_id!) || []
    items.push(l.item_type)
    bySeller.set(l.user_id!, items)
  }

  let sent = 0
  for (const [userId, items] of Array.from(bySeller.entries())) {
    const { data: userRes } = await db.auth.admin.getUserById(userId)
    const email = userRes?.user?.email
    if (!email) continue

    const list = items.slice(0, 10).map((i: string) => `  • ${i}`).join('\n')
    const more = items.length > 10 ? `\n  ...and ${items.length - 10} more` : ''
    const n = items.length
    const text =
      `Quick check on your UniformPass ${n === 1 ? 'listing' : 'listings'}:\n\n${list}${more}\n\n` +
      `${n === 1 ? 'Is it' : 'Are they'} still available? Open My Listings to confirm ${n === 1 ? 'it' : 'them'} ` +
      `or mark ${n === 1 ? 'it' : 'them'} sold in one tap:\n${SITE}/my-listings\n\n` +
      `Keeping this current means buyers only reach out about things you still have.\n\n— UniformPass`

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: email,
          subject: n === 1 ? 'Is your uniform listing still available?' : `Are your ${n} listings still available?`,
          text,
        }),
      })
      if (res.ok) sent++
    } catch {
      // best-effort: one bad send never aborts the run
    }
  }

  return NextResponse.json({ ok: true, sellers: bySeller.size, emailed: sent, listings: stale.length })
}
