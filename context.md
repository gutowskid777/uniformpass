# School Uniform Resale Platform — Context
# Last updated: 2026-07-14 (chat-5 batch — committed to main, NOT yet pushed/deployed)

## 2026-07-14 session (chat "Uniform5") — drafts, donate, drop NJ framing
**Committed to `main` (e577f45), NOT pushed** — awaiting Dylan's review on localhost, then deploy.
- **Drafts:** `/new` now has a "Save as draft" button (light validation: school + item only). Saving a draft writes `status='draft'`, stores the manage token, and routes to `/my-listings?saved=draft` (temporary "Draft saved" toast). Manage page has a **Draft** status tab + amber "this is a draft" banner. My Listings shows a Draft badge + green **"Post it"** button (→ available). Browse + `/seller/[id]` already filter `status='available'`, so drafts stay private. DB `status` CHECK already allowed 'draft'.
- **Auto Sell donate option:** seller can donate their 50% cut instead of keeping it. New column **`pickup_requests.payout_choice`** (`text NOT NULL default 'keep'`, CHECK keep|donate) — migration APPLIED to prod. Choice captured on `/sell-for-me`, sent to the operator email (`/api/pickups/notify`), shown on the admin pickup card + the seller's `/pickup/[id]` confirmation. Rationale (Dylan): offer donate "while gaining traction."
- **Auto Sell 3 steps:** step 1 body → "Leave it by your door at a set time."; step 2 "A local parent comes to you." → **"We come to you."** (dropped "parent"); step 3 unchanged.
- **Dropped NJ/"jersey" framing** (NY-border Bergen families + expansion): "Meet up locally in NJ" → **"Meet locally"** in footer, browse hero, paper flyer trust row, flyer-image + OG cards. Also removed **"No account to browse"** from the footer, and dropped the **"Free"** payment option from `PAYMENT_OPTIONS`. Kept factual town labels (Montvale/Ramsey/Oradell, NJ) in `lib/schoolTheme.ts`.
- **Flyer:** added instruction line on `/flyer`: "Forward to anyone you know who's looking to buy or sell uniforms."
- **Schools:** added **Our Lady of Mercy Academy — Park Ridge, NJ** (id a38cff17…) as a 2nd entry alongside the existing Newfield, NJ one (two real OLM academies in NJ; picker disambiguates by town). Dylan said "Park Ridge NY" but Park Ridge is Bergen County NJ — confirmed NJ with him.
- **"See what else a seller is selling":** already works — the link is on every listing detail with a `user_id`. The 2 listings where it DIDN'T show are old seed/demo posts with `user_id = null` (no owner to group by). All account-posted listings have it. Open option: attach/remove those 2 seeds.
- Build passes (`next build` green); dev-server smoke-tested 200s on /, /new, /sell-for-me, /flyer, /my-listings.

**Followup polish (same session, commits db55aca + later):**
- Auto Sell: pile chips relabeled ("A few items / A grocery bag / Several bags / A closet-full" — killed the "a few"/"a few bags" overlap). Donate now **defaults to Donate**, **green heart** (was yellow), no "Your 50% cut" header; donate sub-line is Dylan's call: **"Support the startup!"** (short beats the long mission line — makes taking 50% feel like the awkward move). Green heart in admin + `/pickup` too. "Anything else?" is now a bordered dropdown w/ chevron, not underlined text.
- **Paper flyer** (`/flyer/print`) rebuilt to mirror the digital flyer: bold indigo gradient hero + two doors (Auto Sell gold-highlighted / Buy-and-sell) + white QR card, tear-off tabs kept. `print-color-adjust: exact` already set so the gradient prints.
- **Listing detail photo** now `aspect-[3/4]` (was 1:1 square) — matches the grid cards + portrait phone photos, so tops/bottoms aren't cropped. Upload still only compresses (no crop); a full crop/preview step was offered and parked.
- **"About the founder/team" section: PARKED** (Dylan: "later bc that's hard").
- **localhost gotcha:** `.env.local` `SUPABASE_SERVICE_ROLE_KEY` is BLANK → every service-role route (my/pickups, listings/manage, "Post it", pickups) 500s locally. Prod (Vercel) has it. Paste the key locally to test those flows.
- **Flyer merged to ONE page** (Dylan: paper looked identical to digital by design → collapse). `/flyer` now shows the image with **Save image / Print / Share**; **Print outputs the image itself** (print CSS in `app/flyer/flyer.css`). Deleted `/flyer/print`, `FlyerTabs`, `FlyerScale`. `PrintButton` now takes `className`/`label`.
- More Auto Sell + footer copy: keep-line → "You receive 50% of every sale... bonus cash for outgrown uniforms" (Dylan: "receive" not "keep" — it's found money, not theirs to keep); payout line trimmed to "paid within a few days of each sale" and **hidden when Donate is selected**; pickup line → "We'll reach out to schedule a time before pickup. Cancel anytime."; footer drops "need to take down a listing?" (sellers self-serve) → just Contact us.
- **Still not pushed** — Dylan reviewing on localhost; awaiting his go to deploy.

## 2026-07-11 FABLE session — flyer + share engine + simplicity pivot (merged to main)
- **Shipped:** digital flyer `/flyer` (`/api/flyer-image`, 1080x1350, QR decode-verified) + paper `/flyer/print` (letter, tear tabs) · SharePanel (native share + paste messages + real OG preview) · per-listing OG cards (`app/listing/[id]/layout.tsx` + `/api/og/listing`) · site OG thumbnail matches flyer ("Outgrown uniforms are money." + Auto Sell / Buy-and-sell doors) · consignment renamed **Auto Sell** (band on homepage, nav, mobile tab) · sell-for-me reskin (do-nothing hero, pile-size chips; account/submit flow untouched) · masked contact chooser + safe-meetup lines on listing detail · header pill polish · Inter fonts bundled for all satori renders (`lib/ogFonts.ts`).
- **Removed by Dylan's call:** per-school sections (`/s/[code]`, themed heroes, monogram tiles) → archived with restore notes in `docs/archive/school-sections-2026-07-11/`; "You save $X" price-slash (no invented retail anchors). School colors confirmed + kept in `lib/schoolTheme.ts` (SJR #00563F/#C5A253 · DBP #6D1A36/#FFF · BC #C8102E/#FFB81C); listing OG still uses them.
- **INCIDENT (resolved):** Supabase legacy API keys got disabled during Dylan's key rotation → prod data-dead + Vercel builds failing ("Invalid supabaseUrl"). Dylan re-enabled legacy keys; Claude re-set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel (production+preview, live-tested against DB). Gotcha: `vercel env pull` REDACTS encrypted values to ""... never trust it for inspection.
- **Deliberate migration still owed:** move BOTH apps (UniformPass + Orbit, shared Supabase) to new-style publishable/secret keys in one sitting, then disable legacy for good. Service-role key rotation task still open.

## What It Is

"UniformPass" — a web app for NJ private school parents to buy/sell used uniforms. Built as a gift for Dylan's mom, who identified the problem: uniforms go instantly on FB Marketplace, tons of waste, no school-specific search. Mom is the intended operator.

**Locked model (2026-07-08):**
- **No shipping, no in-app payments.** Buyers contact sellers directly (contact shown on the listing) and meet up to pay cash/Venmo. The platform never touches money — same trust model as FB Marketplace, scoped to uniforms.
- **The moat = concierge consignment.** `/sell-for-me` lets anyone request a pickup of a pile of uniforms/spirit wear. Dylan/mom picks it up, lists it, sells it, and pays the owner 50% of profit. Requests land in the admin "Pickup requests" tab. Operator-listed inventory can be flagged **"Verified by UniformPass"** (badge on cards + detail).
- **Beachhead:** 3-school NJ cluster — St. Joseph Regional (Montvale), Don Bosco Prep (Ramsey), Bergen Catholic (Oradell). All already seeded (44 schools total in DB).
- **Long-term (deferred):** general spirit wear for any school, college merch resale, party/one-off wear.
- **GTM angle, parked (bk-73):** if it gains momentum, pitch/market it as a way to find VINTAGE school stuff (old spirit wear, retro gear) — catchier/more shareable hook than "buy/sell used uniforms." Not a v1 feature, just a future positioning angle.

## Stack

- Next.js 14 (App Router) + Tailwind + TypeScript
- Supabase (Postgres + Storage + **Auth**) — **project SHARED with the Orbit project** (same `auth.users` pool). Project id `cfqornklplyvdgiuptgj`.
- Vercel — **LIVE in prod, auto-deploys on push to `main`**
- **Auth: accounts now REQUIRED to post** (see 2026-07-11 session below). Buyers still browse + contact sellers with no account.

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

## 2026-07-11 Session — accounts, domain, email, enforcement

**Domain (DONE, live):** `uniformpass.shop` bought at Namecheap, added in Vercel, **Valid + SSL, serving prod.** DNS: `A @ 76.76.21.21`, `CNAME www → cname.vercel-dns.com`. (Namecheap default parking records had to be removed — they were causing `ENOTFOUND`.) `uniformpass.vercel.app` still works too.

**Email (DONE):** Resend domain `uniformpass.shop` **verified** (DKIM/SPF/DMARC + `send` MX at Namecheap; Mail Settings switched to Custom MX). Supabase Auth SMTP → host `smtp.resend.com`, sender `no-reply@uniformpass.shop`, name UniformPass. Supabase Auth URL config → Site URL `https://uniformpass.shop`, redirect `https://uniformpass.shop/**`. **Verified delivering to external domains** (Gmail lands clean, one-click works). **Known issue:** strict `.edu` Microsoft/Office365 tenants (e.g. Cornell) quarantine the mail AND Safe-Links pre-scan burns the one-time magic-link token → user's own click 403s. NOT the launch audience (personal Gmail/Yahoo/iCloud), so not a blocker — but it's why we're dropping magic links (below).

**Accounts (built earlier, being changed):** magic-link auth exists (AuthProvider + /signin + AuthNav). `listings` + `pickup_requests` carry nullable `user_id`. Seller profiles at `/seller/[id]`.

**DECISIONS locked this session (Dylan):**
1. **Auth → email + PASSWORD**, not magic link. Signup logs in immediately, no email in the critical path (kills the "email never came" failure + the Microsoft Safe-Links problem). Email confirmation: **OFF for now** (Dylan is fine without it) — but it's a **project-wide Supabase toggle SHARED WITH ORBIT**; confirm Orbit doesn't need confirmation before flipping. Password reset (needs email) deferred.
2. **Login is REQUIRED to post — via SEAMLESS deferred account creation, NOT an upfront gate.** The user fills the whole form first; only on submit does an `InlineAccountStep` modal ask for email+password (form + photos stay in memory, so nothing is re-entered), then the post completes with the new/existing user's id. RLS on `listings` + `pickup_requests` INSERT → require `auth.uid() = user_id` (replaces the current PUBLIC `with check (true)` insert policies). This OVERRIDES the UX study's "don't build accounts" rec — Dylan's explicit call.
3. **Drop `/recover`** (study idea) — accounts make it obsolete.

**SHIPPED 2026-07-11 (pushed to prod):**
- ✅ Email + password auth (`/signin` rewritten; `signUp`/`signInWithPassword`) + `InlineAccountStep` deferred-signup modal.
- ✅ Seamless forced-login on `/new` + `/sell-for-me` (fill first → account on submit → post).
- ✅ `seller_profiles` table (user_id, name, contact_method, contact_info, city, state, town) — saved on post, prefilled on every form after.
- ✅ Town REQUIRED on `/sell-for-me`.
- ✅ School fuzzy search (`lib/schoolSearch.ts`): saint↔st, acronyms (sjr/aha/iha/bc/dbp/shp/pc), nicknames (bosco/seton/angels).
- ✅ Pickup request → emails operator (`/api/pickups/notify`, Resend).

**STILL TO DO:** — both core items now DONE (2026-07-11/13)
- ✅ **RLS owner-insert backstop DONE** — migration `require_auth_owner_insert` applied: `listings` + `pickup_requests` INSERT are now `to authenticated with check (auth.uid() = user_id)` (replaced the PUBLIC `with check(true)` policies). `listing_tokens` PUBLIC insert kept. **Verified live in Chrome** — logged-in post works with RLS on (SJR + Academy of Holy Angels test posts), school aliases + profile prefill both confirmed working.
- ✅ **My Listings rework DONE** — commit `e7ad4b4`: `/my-listings` is account-based (queries `listings` + `pickup_requests` by `user_id`), owner can edit/cancel pickups, `/admin` reads `pickup_requests` so owner edits are visible operator-side.
- **DEPENDENCIES/flags:** email-confirmation is OFF in Supabase (confirmed — deferred signup auto-logins). `RESEND_API_KEY` in Vercel env still UNCONFIRMED — pickup/contact emails fail silently without it.
- **NOT yet verified:** brand-new signup → post path (identical insert with a fresh session; high confidence, worth one smoke-test).
- **Dev cleanup:** during live testing, Dylan's own auth accounts got password `123456` set via SQL (magic-link accounts had no known password). Two throwaway "TEST…" listings were marked **Sold** (not deleted) — hard-delete when convenient. `djg323`'s seller_profile holds test data ("Test"/Montvale) — overwritten on next real post.

**SHIPPED this session:** C1 mobile bottom-nav (`components/BottomNav.tsx` + `layout.tsx`) — Browse/Sell-for-me were `hidden sm:block`, so the consignment moat was invisible on phones (the launch audience's device). Now a 4-tab thumb bar `<sm`.

## UX / IA Study (docs/ux-study/, 2026-07-10)
Ground-up UX redesign: 13 persona sims → one ideal IA → diffed vs. current code → prioritized CRITICAL/HIGH/NICE change list. Headline moves: school-as-spine (`/s/[slug]` hubs + type-ahead), elevate the moat, ambient trust modules, convert dead-ends to lead capture. Top-5 buildable: C1 (mobile nav ✅ done) · C2 (school type-ahead + hubs) · C3 (empty-state → waitlist) · C4 (per-listing OG cards) · C5 (sell-for-me trust + payout math). See `05-gap-and-change-list.md` for the full ranked list. Note: study argues AGAINST forced accounts — Dylan overrode (decision #2 above).

## Current Status (2026-07-08)

Consignment + contact build complete. `npm run build` passes (8 routes). Local smoke test: all pages 200, consignment form insert verified against live DB (201), PII read-back correctly blocked, API auth returns 401/500 as designed. **Deploy status: confirm — projects.json said not-yet-deployed but memory notes auto-deploy-on-push.**

### DB changes applied (Supabase migrations)
- `listings.is_verified boolean default false` (Verified-by-UniformPass badge)
- Dropped restrictive `contact_method` check so sellers can pick text/email/venmo/other
- New `pickup_requests` table (name, contact, school, town, item_summary, est_items, notes, status). RLS: **insert-only for PUBLIC, no SELECT** (PII protected). Admin reads via service role.
- New `listing_tokens` table (listing_id PK → listings, token uuid). RLS: **insert-only for PUBLIC, no SELECT** — secret manage tokens readable only via service role. `on delete cascade` from listings.
- **RLS rule for this project:** insert policies must target `PUBLIC` (`with check (true)`), NOT `to anon` — the REST role doesn't match `anon`-scoped policies here (the working listings policy is PUBLIC).

### Self-serve management (no accounts) — being superseded by accounts (2026-07-11)
Sellers get a secret manage link at post time (`/listing/[id]/manage?token=…`); token also saved to localStorage so the public page shows a "Manage your listing" button on the same device. All edit/delete actions go through `/api/listings/manage` which verifies the token with the service role. Photos + school aren't editable there (delete + repost to change).

### PostgREST gotcha (documented so we don't re-debug it)
Insert-only tables work with `supabase-js .insert()` (sends `Prefer: return=minimal`). Do **NOT** chain `.select()` on a pickup_requests insert — that forces a read-back which RLS blocks, throwing a misleading "violates row-level security policy" error.

## What's Next (Dylan's actions)

1. ✅ **`SUPABASE_SERVICE_ROLE_KEY` ROTATED** (Dylan, an earlier chat — the old screenshotted key is dead; the live Vercel key works, verified today via the service-role routes). No action needed.
2. ✅ **Admin auth HARDENED (2026-07-13)** — admin listing writes (status / verified / delete) now go through service-role route **`/api/admin/listings`** with a **server-side** password check; the public `listings` `UPDATE`/`DELETE` RLS policies were **dropped** (anon key can no longer mutate listings — closes the "anyone can delete/fake-verify via devtools" hole). Password moved to **server-only `ADMIN_PASSWORD`** (`NEXT_PUBLIC_ADMIN_PASSWORD` removed from Vercel + bundle) so it's no longer readable in the client. Value kept as the existing admin password per Dylan — safe now that it's server-side only, not exposed. Login verifies against the server, not a bundled string.
3. ~~**Domain**~~ — ✅ DONE: `uniformpass.shop` live + SSL (see 2026-07-11 session).
4. **Seed inventory** — list Dylan's donation stock, flag it Verified in admin.

## Live
Production: **https://uniformpass.shop** (primary, SSL) + **https://uniformpass.vercel.app** (both auto-deploy on push to main). GitHub: gutowskid777/uniformpass. Vercel project `uniformpass` (prj_k78oaKd4rdiHJHX9nhlOAPIsRBUu, team_RdQ4Fy1VqvfIWjtMSJIACSAH). Supabase project `cfqornklplyvdgiuptgj` (shared w/ Orbit).

## Brand

Name: **UniformPass**. NJ-focused to start. School list hardcoded in DB.
