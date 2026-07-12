# SPEC — My Listings rework (account-based) + owner pickup management

**For:** Sol (Codex), autonomous build. **Author:** Claude/Opus. **Effort: high.**
**Repo:** this project (`school-uniform-resale`, Next.js 14 App Router + Supabase). Branch `main`.

---

## GOAL

Turn `/my-listings` from a **device-localStorage** page into an **account-based dashboard** for the
logged-in user. It must show BOTH:
1. The user's **listings** (posts they created), with cross-device manage/quick-actions.
2. The user's **pickup requests** (consignment drop-offs), which they can **edit and cancel**.

Owner edits to a pickup request must be visible to the operator in `/admin` (they already will be,
because admin reads the same rows via service role — just don't break that).

## HARD CONSTRAINTS (read before touching anything)

- **`pickup_requests` has NO public read** (RLS is insert-only for PUBLIC). The anon/browser Supabase
  client CANNOT `select` from it. All reads/edits of a user's pickups MUST go through a **new server
  route using the service role**, and that route MUST verify the caller owns the rows via their
  Supabase JWT (never trust a client-supplied user_id).
- **`listings` IS publicly readable** — the browser client may `select('*').eq('user_id', user.id)`
  directly. Do that for listings; do NOT route listings reads through the server.
- **DO NOT run git. DO NOT push. DO NOT deploy.** Push auto-deploys to prod. Just edit files.
- **DO NOT touch:** `app/new/page.tsx`, `app/sell-for-me/page.tsx`, `components/AuthProvider.tsx`,
  `app/api/pickups/notify/route.ts`, `app/api/contact/route.ts`, the DB schema/migrations, or any
  RLS policy. No new Supabase columns are needed — all fields already exist.
- Match the existing code style (Tailwind classes, indigo accent, rounded-full buttons, the card look
  already in `my-listings/page.tsx` and `pickup/[id]/page.tsx`). No new deps.

## FACTS YOU NEED (already verified — don't re-investigate)

- Auth hook: `import { useAuth } from '@/components/AuthProvider'` → `const { user, loading } = useAuth()`.
  `user` is `@supabase/supabase-js` `User | null`; `user.id` is the uid stored in `listings.user_id`
  and `pickup_requests.user_id`.
- Browser client: `import { supabase } from '@/lib/supabase'`. Get the JWT for server calls via
  `const { data: { session } } = await supabase.auth.getSession()` → `session.access_token`.
- `listings` row: has `user_id: string | null`, `status: 'available'|'pending'|'sold'|'draft'`,
  `photos: string[]`, `item_type`, `school_name`, `price`, `created_at`. Type in `lib/supabase.ts`.
- `pickup_requests` row (type in `lib/supabase.ts` is slightly stale — extend it): columns include
  `id, name, contact, school_id, school_name, town, item_summary, est_items, notes, user_id,
  cancel_token, status, created_at`. Status union in the DB includes `'cancelled'` (used by
  `app/api/pickups/cancel/route.ts`) — add `'cancelled'` to the `PickupRequest['status']` type union,
  and add `user_id: string | null` and `cancel_token: string` to the type.
- Locked pickup statuses (pile already handled — NOT editable/cancellable by the owner):
  `const LOCKED = ['picked_up', 'listed', 'done', 'cancelled']`. (Match the pattern in
  `app/api/pickups/cancel/route.ts`, which uses `['picked_up','listed','done']` for cancel; here also
  treat `cancelled` as non-editable.)
- Service-role client pattern (copy from `app/api/pickups/cancel/route.ts` `admin()` helper):
  `createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })`.
- Existing listing management route: `app/api/listings/manage/route.ts` — POST with
  `{ action:'load'|'update'|'delete', listingId, token, updates }`, verified by a secret token from
  `listing_tokens`. Keep this working unchanged; you only ADD an auth path (below).

---

## BUILD

### 1. New server route — `app/api/my/pickups/route.ts`

POST, JSON body `{ action, ... }`. Auth: read `Authorization: Bearer <jwt>` header. Verify with the
service client: `const { data: { user } } = await db.auth.getUser(jwt)`. If no `user` → 401.
Use `user.id` as the ONLY user scope (ignore any client-supplied id).

- `action: 'list'` → return `{ requests: [...] }` = `pickup_requests` where `user_id = user.id`,
  ordered `created_at` desc. Select the display fields (`id, item_summary, school_name, town,
  est_items, notes, status, created_at`). Do NOT return `cancel_token` or `contact`.
- `action: 'update'` → body `{ id, updates }`. Allow ONLY these editable fields:
  `item_summary` (non-empty string), `notes` (string|null), `est_items` (number|null). Reject/ignore
  anything else. Update the row WHERE `id = id AND user_id = user.id AND status NOT IN LOCKED`. If no
  row matched (wrong owner or locked) → 409 with a friendly error. Return `{ ok: true }`.
- `action: 'cancel'` → body `{ id }`. Set `status = 'cancelled'` WHERE `id AND user_id = user.id AND
  status NOT IN LOCKED`. If already cancelled → `{ ok:true }`. If locked → 409 friendly error.
- Missing/invalid JWT → 401. Missing service key → 500 (same message pattern as cancel route).

### 2. Extend `app/api/listings/manage/route.ts` — add an authenticated-owner path

Keep the token path 100% intact. ADDITION: if the request has an `Authorization: Bearer <jwt>` header
AND no valid token match, authorize when the JWT's `user.id === listing.user_id`. Concretely: after
the existing token lookup fails, if a Bearer JWT is present, verify it with the service client, load
the listing, and if `listing.user_id === user.id`, treat as authorized (proceed to load/update/delete
exactly as the token path does). This lets account owners manage their listings on ANY device.
Do not change the `EDITABLE`/`ENUMS`/`cleanUpdates` logic.

### 3. Rewrite `app/my-listings/page.tsx`

Client component. Use `useAuth()`.
- `loading` → keep the existing spinner.
- **No user** → a sign-in prompt: heading "Sign in to see your stuff", one line, and a button linking
  to `/signin` (check `app/signin/page.tsx` — if it reads a `redirect`/`next` query param, pass
  `?redirect=/my-listings`; if not, plain `/signin`). Keep the 👕 empty-state visual language.
- **User present** → fetch in parallel:
  - listings: `supabase.from('listings').select('*').eq('user_id', user.id).order('created_at',{ascending:false})`.
  - pickups: `POST /api/my/pickups {action:'list'}` with the Bearer header.
- Render two sections with clear headings: **"Your listings"** and **"Your pickup requests"**. If a
  section is empty, show a short empty line (listings empty → keep the "Post a listing" CTA; pickups
  empty → "No pickup requests yet." + a link to `/sell-for-me`).
- **Listing card** (reuse the current card markup): photo, item_type, status pill, school, price. Actions:
  - "Manage" link to `/listing/${id}/manage` — if a localStorage `uniformpass_manage_${id}` token
    exists, append `?token=${token}` (same-device full editor). Otherwise link without token (the
    manage page still needs the token today — see note below).
  - Inline quick actions that work cross-device via the extended manage route (send Bearer JWT, no
    token): a **"Mark sold"/"Mark available"** toggle (`action:'update', updates:{status}`) and a
    **"Delete"** (`action:'delete'`) with a `confirm()`. On success, update local state.
- **Pickup card** (mirror the `pickup/[id]/page.tsx` styling): item_summary, school/town, status badge
  (reuse a STATUS_LABEL map like the pickup page), submitted date. If status is editable (not in
  LOCKED): an **"Edit"** control (inline fields for item_summary + est_items + notes → `action:'update'`)
  and a **"Cancel request"** button (`action:'cancel'`, with `confirm()`). Locked/cancelled → show the
  status only, no actions (mirror the pickup page's "already being handled" copy).
- Remove the "Saved on this device only" footer; replace with nothing or a neutral line. Drop the
  localStorage-scan-as-primary logic (localStorage is now only the optional token lookup for the
  same-device Manage link).

> Note on the manage PAGE: `app/listing/[id]/manage/page.tsx` currently requires `?token=`. You do NOT
> need to rewrite that page. Cross-device management is delivered by the inline quick actions on
> My Listings (Mark sold / Delete via the authed route). Full-editor cross-device is out of scope.

### 4. Verify admin still sees edits

No code change expected. Just confirm `/admin` pickups tab reads `item_summary`/`notes` from the row
(it does, via `/api/pickup-requests`). If it doesn't display `notes`, leave admin alone — not in scope.

---

## ACCEPTANCE CRITERIA

- [ ] `npx tsc --noEmit` clean. `npm run build` succeeds.
- [ ] Logged-out `/my-listings` shows a sign-in prompt, not a crash and not the old device list.
- [ ] Logged-in `/my-listings` lists the user's own listings (by user_id) and their own pickup requests.
- [ ] A user can Mark-sold/Delete their listing from `/my-listings` on a device WITHOUT the localStorage
      token (authed route), and CANNOT affect a listing whose `user_id` differs.
- [ ] A user can edit (item_summary/est_items/notes) and cancel a NON-locked pickup; a locked one shows
      status only. The route rejects edits to pickups the caller doesn't own (verified by JWT, 409/401).
- [ ] `/api/my/pickups` never returns `cancel_token` or `contact`. Requires a valid Bearer JWT.
- [ ] Existing token-based `/listing/[id]/manage` flow still works unchanged.
- [ ] No git operations performed; no schema/RLS/migration changes; listed do-not-touch files untouched.

## TEST COMMAND

```
npx tsc --noEmit && npm run build
```

## OUTPUT

Append a short summary of what you changed (files + one line each) to
`docs/specs/my-listings-rework-SUMMARY.md`. Do not run git.
