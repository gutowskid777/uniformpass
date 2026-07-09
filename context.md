# School Uniform Resale Platform — Context
# Last updated: 2026-07-08

## What It Is

"UniformPass" — a web app for NJ private school parents to buy/sell used uniforms. Built as a gift for Dylan's mom, who identified the problem: uniforms go instantly on FB Marketplace, tons of waste, no school-specific search. Mom is the intended operator.

**Locked model (2026-07-08):**
- **No shipping, no in-app payments.** Buyers contact sellers directly (contact shown on the listing) and meet up to pay cash/Venmo. The platform never touches money — same trust model as FB Marketplace, scoped to uniforms.
- **The moat = concierge consignment.** `/sell-for-me` lets anyone request a pickup of a pile of uniforms/spirit wear. Dylan/mom picks it up, lists it, sells it, and pays the owner 50% of profit. Requests land in the admin "Pickup requests" tab. Operator-listed inventory can be flagged **"Verified by UniformPass"** (badge on cards + detail).
- **Beachhead:** 3-school NJ cluster — St. Joseph Regional (Montvale), Don Bosco Prep (Ramsey), Bergen Catholic (Oradell). All already seeded (44 schools total in DB).
- **Long-term (deferred):** general spirit wear for any school, college merch resale, party/one-off wear.

## Stack

- Next.js 14 (App Router) + Tailwind + TypeScript
- Supabase (Postgres + Storage) — YC credits applied
- Vercel (free tier, not yet deployed)
- No auth in MVP: sellers include contact info in listing, buyers reach out directly

## Key Files

| File | Purpose |
|---|---|
| `app/page.tsx` | Browse — hero + consignment band + filterable grid; Verified badge on cards |
| `app/new/page.tsx` | Create listing form — now collects seller contact (method + info) |
| `app/listing/[id]/page.tsx` | Listing detail — shows Contact block (tel/mailto/venmo link) + Verified badge |
| `app/sell-for-me/page.tsx` | **Consignment intake** — "how it works" + pickup-request form → `pickup_requests` |
| `app/api/pickup-requests/route.ts` | **Server route** — GET/PATCH pickup requests via service role (PII stays off the public key) |
| `app/admin/page.tsx` | Admin panel — Listings / Pickup-requests tabs; per-listing Verified toggle |
| `app/layout.tsx` | Root layout — "UniformPass" branding, sticky header, footer |
| `app/globals.css` | Tailwind base styles |
| `lib/supabase.ts` | Supabase client + type definitions (59 lines) |
| `.env.local` | Supabase URL + anon key (DO NOT COMMIT) |

## Supabase

- Project: created via MCP during 2026-06-08 session
- Schema: migration applied — `schools`, `listings`, `listing_photos` tables + storage bucket
- Credentials: in `.env.local`

## PRD

`/Users/dylan/Claude/Cowork/Dylan-AI-OS/school-uniform-resale/docs/school-uniform-resale-prd.md`

Scope summary: listing create, browse/filter by school/category/gender/size/condition, detail page, admin panel. Out of scope for MVP: in-app payments, seller accounts, concierge pickup, books/gear, charity lots.

## Current Status (2026-07-08)

Consignment + contact build complete. `npm run build` passes (8 routes). Local smoke test: all pages 200, consignment form insert verified against live DB (201), PII read-back correctly blocked, API auth returns 401/500 as designed. **Deploy status: confirm — projects.json said not-yet-deployed but memory notes auto-deploy-on-push.**

### DB changes applied (Supabase migrations)
- `listings.is_verified boolean default false` (Verified-by-UniformPass badge)
- Dropped restrictive `contact_method` check so sellers can pick text/email/venmo/other
- New `pickup_requests` table (name, contact, school, town, item_summary, est_items, notes, status). RLS: **insert-only for PUBLIC, no SELECT** (PII protected). Admin reads via service role.

### PostgREST gotcha (documented so we don't re-debug it)
Insert-only tables work with `supabase-js .insert()` (sends `Prefer: return=minimal`). Do **NOT** chain `.select()` on a pickup_requests insert — that forces a read-back which RLS blocks, throwing a misleading "violates row-level security policy" error.

## What's Next (Dylan's actions)

1. **Set `SUPABASE_SERVICE_ROLE_KEY`** — required for the admin Pickup-requests tab. Get from Supabase → Project Settings → API → service_role secret. Add to `.env.local` (placeholder already there) AND Vercel env vars. Until set, the tab shows "Server not configured."
2. **Admin password** — currently `uniform2026` via `NEXT_PUBLIC_ADMIN_PASSWORD`. Change for mom in `.env.local` + Vercel.
3. **Deploy + domain** — confirm Vercel deploy; register `uniformpass.com`.
4. **Seed inventory** — list Dylan's donation stock, flag it Verified in admin.

## Brand

Name: **UniformPass**. NJ-focused to start. School list hardcoded in DB.
