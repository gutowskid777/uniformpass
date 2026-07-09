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
| `app/listing/[id]/page.tsx` | Listing detail — Contact block (tel/mailto/venmo) + Verified badge + owner "Manage" button |
| `app/listing/[id]/manage/page.tsx` | **Seller self-serve** — edit fields / change status / delete via secret token |
| `app/sell-for-me/page.tsx` | **Consignment intake** — "how it works" + pickup-request form → `pickup_requests` |
| `app/api/pickup-requests/route.ts` | **Server route** — GET/PATCH pickup requests via service role (PII stays off the public key) |
| `app/api/listings/manage/route.ts` | **Server route** — token-verified load/update/delete for seller self-management |
| `app/opengraph-image.tsx`, `app/icon.svg` | Link-preview thumbnail + hanger favicon |
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
- New `listing_tokens` table (listing_id PK → listings, token uuid). RLS: **insert-only for PUBLIC, no SELECT** — secret manage tokens readable only via service role. `on delete cascade` from listings.
- **RLS rule for this project:** insert policies must target `PUBLIC` (`with check (true)`), NOT `to anon` — the REST role doesn't match `anon`-scoped policies here (the working listings policy is PUBLIC).

### Self-serve management (no accounts)
Sellers get a secret manage link at post time (`/listing/[id]/manage?token=…`); token also saved to localStorage so the public page shows a "Manage your listing" button on the same device. All edit/delete actions go through `/api/listings/manage` which verifies the token with the service role. Photos + school aren't editable there (delete + repost to change).

### PostgREST gotcha (documented so we don't re-debug it)
Insert-only tables work with `supabase-js .insert()` (sends `Prefer: return=minimal`). Do **NOT** chain `.select()` on a pickup_requests insert — that forces a read-back which RLS blocks, throwing a misleading "violates row-level security policy" error.

## What's Next (Dylan's actions)

1. **🔴 ROTATE `SUPABASE_SERVICE_ROLE_KEY`** — it's SET in Vercel and working (manage + pickup routes verified live), BUT Dylan screenshotted it into a chat = possible leak. Regenerate in Supabase → Settings → API, then update Vercel env + `.env.local`. Service role = full DB access, so do this soon.
2. **Admin password** — currently `uniform2026` via `NEXT_PUBLIC_ADMIN_PASSWORD`. Change for mom in `.env.local` + Vercel.
3. **Domain** — register `uniformpass.com` before heavy marketing (currently live at uniformpass.vercel.app).
4. **Seed inventory** — list Dylan's donation stock, flag it Verified in admin.

## Live
Production: **https://uniformpass.vercel.app** (auto-deploys on push to main). GitHub: gutowskid777/uniformpass. Vercel project `uniformpass` (prj_k78oaKd4rdiHJHX9nhlOAPIsRBUu, team_RdQ4Fy1VqvfIWjtMSJIACSAH).

## Brand

Name: **UniformPass**. NJ-focused to start. School list hardcoded in DB.
