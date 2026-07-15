STATUS: complete

# Conversion lens — UniformPass UX pass, 2026-07-15

Walked every money action in the current code: browse → listing → contact seller;
`/new` post flow incl. the deferred `InlineAccountStep` signup; `/sell-for-me` pickup
request incl. keep-vs-donate. This lens only — no design/copy/IA opinions outside
where they directly gate a money action.

## Top 3

1. **"Post it" on a draft flips status to live with zero completeness check** — a
   draft only ever required school + item name, so one tap can put a $0, photo-less,
   contact-less listing into the public grid, permanently unsellable and dragging
   down trust in every other listing next to it. (`app/my-listings/page.tsx:264-270`,
   `app/api/listings/manage/route.ts:24-37`)
2. **Contact info is optional on `/new`, and the copy actively tells sellers to skip
   it** — but there is no actual "reach out through the comments" channel (no
   messaging system, per the locked model), so any listing posted without contact
   info is a guaranteed dead end for every interested buyer. (`app/new/page.tsx:135-144`,
   `:429-431`; dead-end shown at `app/listing/[id]/page.tsx:206-210`)
3. **No password-reset path anywhere in the app** — when the deferred signup step
   detects an existing account, it just says "enter your password to finish" with
   no recovery link. A seller who forgot their password (a real risk — Dylan's own
   test accounts needed a manual SQL password reset per `context.md`) is stuck
   mid-post with literally no way to complete the sale. (`components/InlineAccountStep.tsx:36-41`,
   confirmed absent: no `/forgot-password` or reset route in `app/`)

---

## CRITICAL

### 1. Draft → "Post it" ships incomplete listings live, no gate
**Element:** the green **"Post it"** button on `/my-listings` (`app/my-listings/page.tsx:264-270`),
which calls `listingAction(listing, 'update', 'available')` → a bare status PATCH
through `/api/listings/manage` (`route.ts:79-95`).

**Current behavior (why it's wrong):** a draft is created with just school + item
description (`app/new/page.tsx:213-221`, `saveDraft()`). Price, photos, location,
and contact info are all optional at draft time. "Post it" does nothing but change
`status: 'draft' → 'available'` — `cleanUpdates()` in the API route has no
completeness rule (`route.ts:24-37`). The result: a listing can go fully live on
the public browse grid showing **"Free"** (price defaults to `0`), a generic
gray "No photo" placeholder, and a dead-end contact block ("This seller hasn't
listed contact info"). Nothing warns the seller this happened — the button just
says "Posting…" then "Post it" disappears.

**Correct behavior:** "Post it" should route through the same validation as the
main post flow (price > 0 or explicit "free" confirmation, ≥1 photo, contact info
present) before flipping status — either inline-blocking with "Finish your listing
to post it: add a price/photo/contact" or routing to `/listing/[id]/manage` with
those fields highlighted.

**WHY:** the moment a listing goes live is the moment it starts trying to convert
browsers into buyers. A listing that's structurally incapable of converting (free
by accident, invisible in a photo grid, uncontactable) doesn't just fail
silently — it's live real estate on the browse page (which real users are hitting
via the flyer right now) that makes the whole marketplace look half-built. This is
the seller-side equivalent of a broken checkout page, except no error ever
surfaces.

### 2. Contact info is optional, and skipping it is a dead end with no fallback channel
**Element:** the "How buyers reach you" field on `/new` (`app/new/page.tsx:410-431`),
whose own helper text reads: *"This will be shown publicly on your listing. Leave
blank to only be reachable through the comments."* `validate()` (`:135-144`) never
requires it.

**Current behavior (why it's wrong):** there is no comments-based contact
mechanism anywhere in the product — no messaging, no reply system (confirmed: the
locked model is "buyers contact sellers directly," full stop). So when a buyer
hits a listing with blank `contact_info`, they get: *"This seller hasn't listed
contact info. Check the comments above, or reach out through your school
community"* (`app/listing/[id]/page.tsx:206-210`). "Check the comments" for a
contact method that doesn't exist there, and "reach out through your school
community" is not a channel the product provides — it's a shrug. The copy on
`/new` promises an escape hatch that doesn't exist.

**Correct behavior:** make contact info required to post as `available` (it can
stay optional for drafts), and delete the "leave blank" claim. If Dylan wants a
truly-optional path preserved, the empty state on the listing page needs a real
fallback (e.g., a mailto to the operator who can forward the inquiry) — not a
pointer to a channel that isn't built.

**WHY:** browse → listing → contact is the entire money path in this no-payments,
no-messaging model. A listing with no contact info hasn't lost a *feature* — it's
lost the *only* mechanism this product has for a stranger to reach the seller. The
UI should never invite a seller into that state.

### 3. No password-reset path — a forgotten password is a hard, un-escapable dead end
**Element:** `InlineAccountStep` (`components/InlineAccountStep.tsx`), the modal
that appears after a seller fills out `/new` or `/sell-for-me` and hits submit
without a session.

**Current behavior (why it's wrong):** if `signUp` fails because the email is
already registered, the modal switches to sign-in mode with: *"You already have
an account... enter your password to finish"* (`:36-41`). There is no "forgot
password?" link, and grepping the whole `app/` tree turns up no reset/recovery
route at all — `context.md` confirms this was explicitly deferred
("password reset (needs email) deferred"). A seller who doesn't remember their
password (plausible: password auth was only added 2026-07-11, and per
`context.md` Dylan's own accounts needed a manual SQL password reset because
"magic-link accounts had no known password") is now stuck in a modal with a
fully-completed listing/pickup request sitting in memory and zero way forward
except abandoning the whole submission.

**Correct behavior:** at minimum, a "Forgot your password? Contact us and we'll
help" link inside the modal that routes to `/contact` (already built, already
captures messages) so the seller isn't just staring at a wall. Ideally, ship
password reset before the flyer push scales past friends-and-family.

**WHY:** this is the one step every non-first-time poster must pass through to
complete either money action. Unlike a slow page or a confusing label, "wrong
password, no recovery" is a full stop — the user cannot self-serve their way past
it, and there's no comparable frustration anywhere else in the funnel that just
ends the session outright.

---

## HIGH

### 4. Photos aren't required on the *normal* post flow either — not just drafts
**Element:** `validate()` on `/new` (`app/new/page.tsx:135-144`) — checks school,
item description, size, location, seller name. No check for `photoFiles.length > 0`.

**Current behavior (why it's wrong):** a seller can hit "Post listing" (not just
"Save as draft") with zero photos and go straight live. The grid this listing
lands in (`components/BrowseExperience.tsx:154-156`, `ListingCard` at `:338-395`)
is explicitly Poshmark-style — a 2-5 column photo grid where every other card has
a portrait photo and this one shows a flat gray "No photo" box
(`BrowseExperience.tsx:339, 357-363`). In a visual-first browse grid, a photoless
card isn't a slight disadvantage, it's functionally invisible — buyers scanning by
thumbnail skip straight past it.

**Correct behavior:** require at least one photo to post as `available` (same
carve-out for drafts as above).

**WHY:** in a marketplace with no title/search-ranking mechanism beyond a school
filter, the photo *is* the listing to a scrolling buyer. Letting a live listing
skip it isn't a minor omission — it's posting something with a near-zero chance of
ever being clicked.

### 5. Pickup-request operator email fails completely silently
**Element:** `/api/pickups/notify` (`app/api/pickups/notify/route.ts:14-15`) —
`if (!key) return NextResponse.json({ ok: false, emailed: false })`, called from
`doSubmit()` on `/sell-for-me` (`app/sell-for-me/page.tsx:129-142`) with
`.catch(() => {})` and the response body never inspected.

**Current behavior (why it's wrong):** if `RESEND_API_KEY` isn't set in the
deployed environment (per `context.md`, this was **unconfirmed** as of the last
session), a pickup request is still saved to the DB, but the operator gets zero
signal that a new Auto Sell request exists unless they proactively check
`/admin`. The seller sees the success screen (`/pickup/[id]`, "Got it! We'll be in
touch") regardless — so from the seller's side, everything looks fine, but the
person who's supposed to reach out may never know to.

**Correct behavior:** at minimum, surface this in `/admin` (an unread-count badge
already reads `pickup_requests` directly, so this may already partially cover it —
worth a live check that `RESEND_API_KEY` is actually set in Vercel prod, since
Auto Sell is the stated moat and every dead request is a lost differentiator vs.
FB Marketplace).

**WHY:** Auto Sell's entire pitch is "you do nothing, we handle it" — that promise
depends on the operator actually finding out a request came in promptly. A silent
email failure doesn't break the data path, but it breaks the *time-to-response*
that makes the concierge model feel concierge.

### 6. Blank price silently becomes "Free" — indistinguishable from an intentional free listing
**Element:** `buildPayload()` on `/new` — `price: Number(form.price) || 0`
(`app/new/page.tsx:122`); rendered as `listing.price === 0 ? 'Free' : ...`
(`components/BrowseExperience.tsx:384`, `app/listing/[id]/page.tsx:133`).

**Current behavior (why it's wrong):** there's no way to tell, from the data or
the UI, whether a `$0` listing is a deliberate giveaway or a seller who just
forgot to type a price (very plausible on the required-fields-light draft path,
and even on the main form since price has no minimum-value nudge). A buyer who
shows up expecting a real transaction on what was meant to be a $15 item is a bad
first experience for both sides.

**Correct behavior:** require a price (even just re-affirming "0" with a checkbox
like "This is free" rather than a bare numeric default) before a listing can go
`available`.

**WHY:** price is a core money-action field — get it wrong by accident and the
transaction that was supposed to happen (seller gets paid) doesn't, with no error
anywhere to catch it.

---

## NICE-TO-HAVE

### 7. Signup failure mode assumes a specific Supabase config with no in-UI recovery
**Element:** `InlineAccountStep.tsx:42-45` — *"Account created, but sign-in needs
email confirmation to be off. Ping the operator."*

**Current behavior:** this branch fires if Supabase's project-wide
email-confirmation toggle is ever ON. Per `context.md` this project **shares** its
Supabase instance with Orbit, and the toggle is explicitly called out as
project-wide — so a change made for Orbit's benefit could silently strand every
UniformPass signup here, with "ping the operator" as the only exit (no link, no
contact button, just prose).

**Correct behavior:** turn "ping the operator" into an actual `/contact` link,
same as the other dead-end states in this app already do.

**WHY:** low probability today (confirmed OFF), but it's a shared-infra landmine
with zero blast-radius containment in the UI if it ever trips — and the fix is a
one-line link, matching a pattern (`Contact us` button) already used everywhere
else in this codebase for exactly this kind of dead end.
