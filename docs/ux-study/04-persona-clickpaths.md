# UniformPass — Consolidated Ideal Click-Paths
One clean, deduplicated ideal path per persona/situation, drawn from the 13 reports and reconciled to the recommended IA (`01-ideal-ia-sitemap.md`). Reference list for building and QA. Routes match the ideal inventory. Every path assumes: no account, no login, off-platform payment.

---

## BUYERS

### B1 · Knows school + size (decisive, ≤1 min)
- Land on `/s/[slug]` via school-scoped link (or `/` → type-ahead → hub).
- Set Category + Gender + Size in one filter bar (no forced sequence).
- Scan grid — sorted relevance/price; size + price visible on the card (no tap-in to rule out).
- Tap the matching card → `/listing/[id]`.
- Review photos, condition (plain words), price, seller name/area, Verified badge.
- Tap **Contact Seller** → channel chooser → native SMS/email/Venmo, prefilled with item ref.
- Send; arrange meetup off-platform.

### B2 · Just browsing (low-intent, discovery)
- Land on `/s/[slug]` (link encodes school) — hero shows crest + live count + one-line trust statement.
- Scroll the category-tile strip (Uniforms/Sports/Spirit/Alumni) with counts — no filters forced.
- Tap a category → grid of cards.
- Tap an item → detail; scroll "More from [school]" rail to keep browsing without backing out.
- Tap **Contact Seller** on something interesting → no-login channel sheet.
- Exit past a passive "Got uniforms to sell? We'll do it for you →" consignment band (primes next visit).

### B3 · Hyper price-sensitive (cheapest/free, fast)
- Land on `/s/[slug]`, go straight to the filter/sort bar (sticky).
- Set Category + Gender + Size via chips; tap first-class **Free** and **Lots** chips.
- Results render **price-ascending by default**, Free items pinned in a strip on top.
- Scan dense list view (price bold/large) to compare without opening each.
- Tap 2–3 candidates; back button returns to the **exact same filtered/sorted state**.
- For a Lot, expand "View Lot Contents" → per-item price breakdown ("$25 for 6 = $4.17/item").
- Tap **Contact Seller** on the winner with a prefilled "still available?" message.

### B4 · Needs it by Monday (urgent)
- Land on `/s/[slug]`; apply Category + Size + Gender and toggle **Available now** (sort=newest, surfaces responsiveness).
- Scan grid — each card shows "listed X hrs ago," "responds fast," and city/distance without opening.
- Tap a fresh + nearby listing → detail confirms last-active, location, price.
- Tap **Message Seller** → native app, prefilled urgent template ("need it by Monday — meet today/tomorrow?").
- No reply in window → back button preserves filters → message a 2nd/3rd seller.
- If nothing matches → **Notify me the moment a match is listed** (email/phone on the saved filter, no account).

### B5 · Mobile, one-handed, in the pickup line
- Open home-screen PWA icon → lands on saved school + saved size/category filters (**0 taps** for returning user).
- Thumb-scroll the 2-column photo grid (native gesture).
- Tap a filter chip if needed → feed re-sorts instantly, sheet auto-collapses.
- Tap a card → slide-up sheet (not full-page nav): photo, price, condition, size, seller, Verified.
- Tap **Message Seller** (sticky footer in the sheet) → prefilled template in native app, or **Save** (secondary heart) for later.
- Swipe sheet down → back to feed. Target: <20s. No-match → **Notify me when this size is listed**.

### B6 · First-timer, unsure it's legit
- Land on `/s/[slug]` → school name confirmed + one-line "what this is" (no accounts/no on-site payment/meet directly) + visible "How it works."
- Skim the 3-icon How-it-works strip (Browse → Contact → Meet & pay) without leaving the page.
- Browse grid (school-filtered); cards show price/size/condition + Verified.
- Tap an item → detail; seller-type disclosed (parent vs "Sold by UniformPass"); restated one-line safety note near the CTA.
- If still unsure → tap persistent **About / Who runs this** → human page (names, NJ, school count, Verified explained).
- Tap **Contact Seller** → preview modal explains exactly what happens next (opens email/text, no account) → **Send Message**.
- Confirmation reinforces safety framing + "Keep Browsing."

### B7 · School not listed
- Land on `/` (or `/schools`); school type-ahead is the first, most prominent action.
- Type the school; type-ahead fuzzy-matches aliases/nicknames, ranks by proximity.
- No match → inline "not found" panel echoes the exact query ("We don't have '[query]' yet") — never a separate dead page.
- Tap **Notify me when [school] joins** → single-field micro-form (email/phone; school auto-attached) → submit.
- Confirmation: "You're on the list for [School]" + live waitlist counter ("3 families waiting") + no-spam line.
- Take a live secondary action: **Invite your school** (prefilled share) or route into `/sell-for-me` (freeform school accepted) — plus a persistent "browse nearby live schools" chip as an escape hatch.

### B8 · School listed but empty (cold start)
- Type-ahead / deep-link into `/s/[slug]`; server detects **zero active listings** before any filter touch.
- Renders a dedicated cold-start state ("[School] just joined — no listings yet," concierge model explained in one line).
- Two equal CTAs: **Notify me when something's posted** (single-field, school pre-attached → confirmation + waitlist count) **or** **Be the first to sell — request a free pickup** (routes to `/sell-for-me?school_id=` pre-filled).
- Permanent fallback: "Browse nearby schools with listings" chips.

---

## SELLERS (self-serve)

### S1 · One item (fast, low-typing)
- Tap **Sell** → `/sell/new` (school pre-filled from referral/last-used; else one-tap picker).
- Camera opens immediately → snap the item (auto-crop/brighten), up to 3 more → "Use these."
- Confirm AI-suggested chips (category, size, brand) — tap to accept/change; inline pricing card appears.
- Confirm price via ±$5 stepper (pre-filled from comps).
- Enter phone (only typed field) — doubles as interest-notify + manage-link delivery.
- Review the auto-built listing card → **Post It**.
- Success: listing live, manage link auto-texted + saved on-device, + one-tap "Share to [School] Facebook group."

### S2 · Big lot (offload a wardrobe)
- Land on `/sell` → **Decision Aid** (item count + time-willingness) → recommendation + honest 3-way tradeoff table.
- Choose "Lot listing" → `/sell/lot` (Lot Builder).
- Bulk-upload ~20 photos at once; lightly tag into groups ("these 6 = size 8 polos").
- Fill structured lot details: repeatable size + type + qty + condition rows, school(s), one lot price, contact.
- Review the live buyer-facing preview (title, price, photo grid, size/qty table) → **Post my lot**.
- Confirmation: un-losable manage link (copy + email + add-to-home) + cross-sell ("3 didn't fit — list separately?").
- *Branch:* pick Consignment at the fork → short intake, "we'll reach out within 48h," zero photo/pricing work.

### S3 · Make it disappear (zero effort)
- Land on homepage or deep-linked `/sell-for-me` → tap the single **"Get it out of my house."**
- Enter minimal info: name, phone/email, school, neighborhood/zip (no account).
- Pick a pickup window from a slot calendar (or submit 2–3 preferred days).
- Optional/skippable: snap 1–2 whole-pile photos + rough count ("2 bags, sizes 6–14") — never per-item.
- **Confirm pickup** → "We'll pick up on [date]. You get paid automatically for whatever sells."
- Done — no further action; payout arrives via a no-login tracking link when items sell.

### S4 · Wants top dollar (1–5 items, optimizing)
- Land on `/sell` → **List one item** → `/sell/new`.
- Enter school/category/gender/type/size/condition → inline pricing card appears once school+category+size set ("sold for $X–$Y, based on N sales").
- Upload photos → live selling-tips checklist alongside ("add a photo of the size tag," lighting) with real-time progress.
- Set price → guidance card anchored at the price field, suggested range pre-highlighted (lower=faster, higher=holds out).
- Review listing-quality line ("Good — add 1 more photo to reach Great") → **Publish**.
- Confirmation: un-losable manage link + share/boost nudge.
- Return via manage link → performance signal (views, days listed) + staleness nudge if stale.

### S5 · Non-technical parent (needs hand-holding)
- Tap **"Sell an item"** → first screen is the fork: **"I'll do it myself (~2 min)"** vs **"Sell it for me (we do everything)"** — equal weight, before any field.
- Self-serve: single-purpose photo screen — example thumbnail + giant camera button + "Doesn't need to be perfect" + a quiet "This part's tricky — let us do it instead" escape.
- Plain-language confirmation card ("Looks like a Lawrenceville blazer, size 16 — is that right?") → "Yes, that's right" / "Let me fix it" (tap-chips, never blank text).
- Price shown as one number + reassurance ("you don't have to figure this out") → **Use this price**.
- Phone number (only typed input) + "we never share this."
- **Post my item** (no separate review screen) → warm success + **Add to Home Screen** + "change your mind? just reply to our text."

### S6 · Edit / mark sold / relist
- Enter via header **My Listings** (badge-counted), or the **Manage** button injected on the item's own public page (localStorage token match), or a saved manage link.
- See a compact list of this device's listings (status badge + thumbnail); sold deprioritized, not hidden.
- Tap the target row → its manage screen (status/price/details on one screen).
- Tap **Mark as Sold** (single button, no modal) → instant inline confirmation; propagates everywhere (grid/detail/Contact disabled).
- *Relist:* tap **Relist** on a Sold item → back to Live with fresh recency timestamp.
- *Edit:* tap Edit → change field inline → **Save** → change reflected immediately.

### S7 · Lost link / new device
- Tap **"Lost your manage link?"** from the listing page or footer/`/recover`.
- Enter the contact info used at post time (phone or email) — single field.
- Submit → **neutral** confirmation ("If we found listings tied to that contact, we've sent the links") — same message for zero/one/many (anti-enumeration).
- Receive email/SMS with manage link(s), each labeled by item + photo.
- Tap the link on the new device → lands on that listing's manage screen; token re-hydrates localStorage so **My Listings works here going forward**.
- *No contact captured at post time:* screen offers the Contact-form fallback, pre-filled with what they can provide (school, item, approx date) for operator verification.

---

## CONSIGNORS (the moat)

### C1 · Huge pile (hand it off, get paid)
- Land on `/sell-for-me` → read How-it-works (Request → We handle everything → You get paid) + **50% math with worked example** above the fold.
- Read the "who's coming to my house" trust module + payout timing ("paid within 3 business days of each sale") before committing.
- Tap **Request a pickup** → low-bar intake (name, contact, school, town, rough item summary, notes) — single scroll, no login.
- **Submit** → confirmation with secret status-link (auto-copied + emailed + optional SMS) + plain "what happens next, and when."
- (Async) status flips Scheduled (with window) → Picked up → Listed → Sold, each pushed to their contact.
- Get paid — payout notification + `/pickup/[id]` ledger shows running total.

### C2 · Unsure what they have
- Land on `/sell-for-me` → reassurance baked into the pitch ("Don't know what you have? Neither do most people — that's what we're for").
- Tap **Request a pickup** → intake form: plain-text name/contact/school/town; "what do you have" uses a **range picker** (A few / A bag / Several bags / A whole closet) — not a count field — plus optional **photo-a-pile** ("one photo, however it looks").
- Optional notes labeled "skip if unsure."
- **Submit — we'll take it from here** → confirmation restates "we'll sort sizes/condition and confirm anything unclear at pickup."
- Later: `/pickup/[id]` shows a **"here's what we found" manifest recap** once received — closes the uncertainty loop.
- Continue tracking to sold/paid.

### C3 · Wants to cancel later
- Open the secret status link (email/SMS/bookmark) any time post-submission.
- See current stage + a plain-language **cancel-eligibility line** ("You can cancel free anytime before pickup") as ambient text.
- Tap **Manage my request** → eligibility stated explicitly before any action (no guilt language).
- If eligible: tap **Cancel my request** → single lightweight confirm → done; immediate confirmation that nothing further happens, no charge/obligation.
- If not eligible (post-pickup): status page surfaces the closest action ("request specific items back" / "contact us") — never a dead-end.
- *Lost link:* use "resend my status link" (keyed to contact info) to get back in.

---

## DONOR

### D1 · Give it away free
- Land on homepage → tap **"Give it away free"** (equal-weight fork arm, not a buried checkbox).
- Choose method: **List it myself** or **Have UniformPass pick it up & donate** (same concierge lane, donation-tagged).
- Self-list: quick photo(s) + size + category; **price locked to Free** — no price/negotiation UI ever renders.
- **Post it free** → live immediately (no review queue) with a "Free — first come, first served" badge.
- First family taps **Claim this** → reserves the item for a short window (e.g., 2h) → donor gets one notification ("Maria claimed your blazer — here's how to reach her").
- Off-platform handoff, $0 changes hands; optional post-handoff impact line.

---

## OPERATOR

### O1 · Mom/admin triaging on her phone
- Push notification: "New pickup request — Sarah M., 3 items. Tap to schedule." → deep-links straight to that request.
- Skim photos/summary + contact → tap **Schedule Pickup** → pick a preset slot (Today/Tomorrow/Weekend/Custom); app auto-messages the seller; card self-moves to Scheduled.
- Later, home-screen badge "2 need you" → open **Triage Dashboard** → **Needs You** feed (new pickups first).
- Tap a pending listing → glance at photos → **Approve** (or Reject, smaller secondary + reason code).
- On a personally-inspected item → flip **Mark Verified** (optimistic, badge appears instantly).
- Message badge → tap → reply with a canned response or quick custom line.
- (Pipeline advances via one primary CTA per card: Schedule → Mark Picked Up → Mark Listed (auto-drafts listing) → done.)

---

## DISCOVERY (cold entry)

### DX1 · Cold homepage landing (FB group / text / word of mouth)
- See the **OG share card** in the FB post/text (real uniform photo, plain headline, school name if tagged) → tap.
- Land on `/` — headline + one-line subhead + prominent **school picker** (type-ahead) above the fold, no scroll.
- Type/tap the school ("SJR" → St. Joseph Regional) → land on `/s/[slug]` (home base, pre-filtered).
- See the buy/sell/consign fork as three equal cards.
- Tap **Browse** → grid of real listings, or **Sell it for me** → concierge intake.
- Tap a listing → detail → **Contact Seller** reveals the off-platform handoff (text/Venmo), no account.

### DX2 · Deep link to a specific listing/school
- Tap the shared listing link — OG card already shows item photo, price, school, "on UniformPass."
- Land directly on `/listing/[id]` — item photo/title/price/size/condition/school tag all visible, no scroll.
- See a compact "What is UniformPass?" one-liner near the item ("buy/sell used uniforms directly with other [School] parents — no account needed").
- Confirm fit at a glance (crest, size, grade next to photo).
- Tap the single **Contact Seller** → channel (text/Venmo) opens prefilled; off-platform-payment disclaimer sits right at the CTA.
- (Optional) tap **See more from [School]** → into the hub, no homepage detour. If the item already sold → redirect to similar + hub, never a 404.

---

## SKEPTIC

### K1 · Worried about strangers / scams / payment safety
- Land on `/s/[slug]` → header states school name + "Parent-run marketplace for [School] families" (community framing before any product).
- Browse/filter; grid cards carry a "Seller: [School] parent" / "Verified" tag directly on the card.
- Open `/listing/[id]` → seller shown as first name + last initial + general area only (never full name/address/number as text).
- Notice the compact **Safe meetup & payment** module (collapsed 2–3 lines) directly above Contact; expand "See safety tips" if wanted.
- Tap **Contact Seller** → lightweight preview shows exactly what opens, that no number is shared unless they text, and repeats "public place, pay on pickup."
- Pick preferred channel — **email offered as an equal option** so a number never leaves their phone — send prefilled message.
- Confirmation reiterates "public meetup, pay when you see the item" + a persistent **Safety & Meetup Guide** link.
</content>
