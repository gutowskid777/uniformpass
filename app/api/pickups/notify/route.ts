import { NextResponse } from 'next/server'

// Best-effort operator notification when a new pickup (consignment) request comes in.
// The request itself is already saved to pickup_requests client-side; this just pings Dylan.

const PICKUP_TO = process.env.PICKUP_EMAIL_TO || process.env.CONTACT_EMAIL_TO || 'gutowskidylan@gmail.com'
const PICKUP_FROM = process.env.PICKUP_EMAIL_FROM || 'UniformPass <no-reply@uniformpass.shop>'

export async function POST(req: Request) {
  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }
  const { name, contact, school, town, item_summary, est_items, notes } = body || {}

  const key = process.env.RESEND_API_KEY
  if (!key) return NextResponse.json({ ok: false, emailed: false })

  const lines = [
    `Name: ${name || '—'}`,
    `Contact: ${contact || '—'}`,
    `School: ${school || '—'}`,
    `Town: ${town || '—'}`,
    `Est. items: ${est_items ?? '—'}`,
    '',
    `What they have:\n${item_summary || '—'}`,
    notes ? `\nNotes:\n${notes}` : '',
  ]

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: PICKUP_FROM,
        to: PICKUP_TO,
        subject: `New pickup request${name ? ` from ${name}` : ''}${school ? ` (${school})` : ''}`,
        text: lines.join('\n'),
      }),
    })
    return NextResponse.json({ ok: res.ok, emailed: res.ok })
  } catch {
    return NextResponse.json({ ok: false, emailed: false })
  }
}
