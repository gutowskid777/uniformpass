# School Uniform Resale Platform — Context
# Last updated: 2026-06-09

## What It Is

"UniformPass" — a web app for NJ private school parents to buy/sell used uniforms. Built as a gift for Dylan's mom, who identified the problem: uniforms go instantly on FB Marketplace, tons of waste, no school-specific search. Mom is the intended operator.

## Stack

- Next.js 14 (App Router) + Tailwind + TypeScript
- Supabase (Postgres + Storage) — YC credits applied
- Vercel (free tier, not yet deployed)
- No auth in MVP: sellers include contact info in listing, buyers reach out directly

## Key Files

| File | Purpose |
|---|---|
| `app/page.tsx` | Browse page — filterable grid of listings (217 lines) |
| `app/new/page.tsx` | Create listing form — school, category, gender, size, condition, price, photos (377 lines) |
| `app/listing/[id]/page.tsx` | Listing detail — full info + contact button (191 lines) |
| `app/admin/page.tsx` | Admin panel — password-protected, view all / mark sold / delete (241 lines) |
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

## Current Status

All 5 core pages written. npm installed. Supabase live. **Not yet deployed to Vercel.**

## Known Issues / What's Next

1. **Vercel deploy** — not done. Run `vercel --prod` from the project folder. Add env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) in Vercel dashboard.
2. **Admin password** — hardcoded. Dylan needs to decide what password mom should use and wire it in (it's in `admin/page.tsx`, find the password check logic).
3. **Photo upload** — Supabase Storage bucket created, but verify upload permissions are set correctly (public read, authenticated write — or anonymous write for MVP since there's no auth).
4. **`api/` folder** — exists but contents unclear. Check what routes are there.
5. **Open PRD questions**: domain name (uniformpass.com?), sold listing visibility (hidden vs. greyed out).

## Brand

Name: **UniformPass**. NJ-focused to start. School list hardcoded in DB.
