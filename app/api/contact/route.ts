import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Contact-us backend. Every message is CAPTURED in the DB (service role) so nothing is ever
// lost, then a best-effort email notification is sent via Resend if RESEND_API_KEY is set.

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD
const CONTACT_TO = process.env.CONTACT_EMAIL_TO || 'gutowskidylan@gmail.com'
const CONTACT_FROM = process.env.CONTACT_EMAIL_FROM || 'UniformPass <onboarding@resend.dev>'

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

export async function POST(req: Request) {
  let body
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }
  const { name, email, message, website } = body || {}

  // Honeypot: real users never fill the hidden "website" field. Silently accept + drop bots.
  if (website) return NextResponse.json({ ok: true })
  if (!message || !message.trim()) return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 })

  const db = admin()
  let captured = false
  if (db) {
    const { error } = await db.from('contact_messages').insert({
      name: (name || '').trim() || null,
      email: (email || '').trim() || null,
      message: message.trim(),
    })
    captured = !error
  }

  // Best-effort email notification (activates once RESEND_API_KEY is set).
  const key = process.env.RESEND_API_KEY
  let emailed = false
  if (key) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: CONTACT_FROM,
          to: CONTACT_TO,
          reply_to: (email || '').trim() || undefined,
          subject: `New UniformPass message${name ? ` from ${name}` : ''}`,
          text: `From: ${name || 'Anonymous'} <${email || 'no email given'}>\n\n${message.trim()}`,
        }),
      })
      emailed = res.ok
    } catch { /* email is best-effort — the DB already has it */ }
  }

  if (!captured && !emailed) {
    return NextResponse.json({ error: 'Contact is not set up yet.' }, { status: 500 })
  }
  return NextResponse.json({ ok: true, captured, emailed })
}

// Admin: list contact messages (service role, password-gated).
export async function GET(req: Request) {
  if (!ADMIN_PASSWORD || req.headers.get('x-admin-password') !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const db = admin()
  if (!db) return NextResponse.json({ error: 'Server not configured — set SUPABASE_SERVICE_ROLE_KEY.' }, { status: 500 })
  const { data, error } = await db.from('contact_messages').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ messages: data })
}
