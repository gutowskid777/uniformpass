# UniformPass — Per-Page Specs (Ideal Site)
For every page in the ideal inventory: one job · above-the-fold priority (top→down) · single primary CTA · secondary actions · trust/clarity elements · mobile notes. Buildable, opinionated.

Global rules that apply to every page (stated once):
- **No account, ever.** No login/signup prompt, no "create account to continue," no cart/checkout vocabulary, no price-with-tax/shipping totals.
- **No dark patterns.** No fake urgency, no "3 viewing now," no countdown timers except the donor Claim window (which is real).
- **School context is sticky** once established (URL scope + localStorage), shown in the header on every scoped page.
- **One high-contrast primary action per screen;** everything else is visually subordinate (text link / icon / secondary button).

---

## 1. `/` — Router Homepage
**One job:** Get a cold, context-free visitor to their school in one action, while proving in 3 seconds that this is real and covers *their* school.

**Above the fold (top→down):**
1. Headline naming category + mechanism: "Buy & sell your kid's uniforms. No fees to browse, no shipping."
2. One-line subhead / trust line: "Meet locally, pay cash or Venmo. We never touch your money. No account needed."
3. **School type-ahead** (the hero control) with placeholder "Start typing your school…" and "No account needed" microcopy beneath.
4. 3-way fork cards, equal weight: **Browse listings · Sell an item · Sell it for me (we do the work)**.
5. Trust strip: live-school count ("Live at 44 NJ & NY schools — growing monthly"), "Started by a local parent," real-uniform photo (not stock).

**Primary CTA:** The school type-ahead itself ("Find your school"). No generic "Get Started."

**Secondary:** the 3 fork cards; footer trust links.

**Trust/clarity:** real uniform imagery + school crests as the visual anchor; human origin line; explicit no-money-through-platform line; no login wall (provable by the browsable fork).

**Mobile:** single no-scroll fold — headline, subhead, type-ahead, fork cards stacked. Type-ahead opens a full-height sheet with recent/nearby + keyboard. Bottom tab bar present. If the inbound link is school-tagged, **skip this page** and land on `/s/[slug]` directly.

---

## 2. `/s/[school-slug]` — School Hub (the spine)
**One job:** Be a specific school's home base — instantly confirm "this is for MY school," show live inventory, and offer buy/sell/consign without a school-selection step.

**Above the fold (top→down):**
1. School header: crest + name + "Parent-run marketplace for [School] families" + live count ("212 items").
2. Buy/Sell/Consign fork (Browse primary weight; Sell + Sell-it-for-me equally visible siblings).
3. Filter + sort bar: School (locked to this hub, tap to switch), Category, Gender, Size, Condition + first-class **Free** and **Lots** chips; sort control (Price ↑ default option, Newest, Relevance).
4. Optional slim category-tile strip (Uniforms / Sports / Spirit / Alumni with counts) for browsers — collapsible, never blocks the grid.
5. Results grid of listing cards (photo 3:4, price/size/condition/Verified/Lot/Free badges, city).

**Primary CTA:** implicit — tap a listing card. (Browsing is the action; no competing button.)

**Secondary:** switch school; open Sell fork; "Sell it for me" band mid-grid; notify-me on current filter.

**Trust/clarity:** crest confirms relevance; "no account / free to browse / meet locally" microline; Verified + seller-type visible on cards; freshness ("listed 2 days ago"); slim "how it works" strip (Browse → Contact → Meet & pay).

**Empty/edge states (server-detected, distinct from each other):**
- *School not seeded* (arrived at a slug with no school): render the **not-listed panel** — echo the query, "Notify me when [school] joins" + waitlist counter + "invite your school" share + "browse nearby live schools" chips + route to `/sell-for-me`.
- *Listed but zero active listings (cold start):* dedicated empty state — "[School] just joined — no listings yet," dual equal CTAs **Notify me when something's posted** + **Be the first to sell (free pickup)**, waitlist counter, nearby-live chips.
- *Filtered to zero:* "No matches for these filters" with "clear filters" + notify-me on this filter — never conflated with the two above.

**Mobile:** sticky top bar (crest + switcher + filter-summary chip row). Filters open as a bottom sheet with instant-apply chips (no Apply button). 2-column photo-first grid, price/size/condition as high-contrast overlays readable through glare. Bottom tab bar. Filter/sort state persists across back-navigation.

---

## 3. `/schools` — Live-School Directory
**One job:** Show which schools are live (and let a visitor add theirs) — SEO landing for "[school] uniform resale," and the target of "nearby live schools" fallbacks.

**Above the fold:** search/type-ahead → list of live schools grouped by state/proximity, each with live count; prominent "Don't see your school? Add it" waitlist entry.

**Primary CTA:** tap a school → its `/s/[slug]` hub.
**Secondary:** waitlist a missing school; link to `/sell-for-me`.
**Trust/clarity:** real count of live schools as scale/social proof; no-spam line on the waitlist field.
**Mobile:** single search field + alpha/proximity list; sticky search on scroll.

---

## 4. `/listing/[id]` — Listing Detail / Self-Contained Deep-Link
**One job:** Let a buyer (often arriving cold via a forwarded link) verify the item + legitimacy and contact the seller in one tap — with safety reassurance exactly where the fear spikes.

**Above the fold (top→down):**
1. Compact brand strip (for deep-link visitors): "UniformPass — buy/sell used uniforms directly with other [School] parents. No account needed." + school crest next to the item.
2. Photo gallery (first photo shows price/size overlay); price, item title, size, gender, condition, category, Lot/Free/Verified/Sold badges.
3. Seller framing: first name + last initial + general area ("Meets near SJR gym") + seller-type tag ("[School] parent" / "Sold by UniformPass").
4. Freshness/status: "Posted 2 days ago · Still available" (or SOLD banner).
5. **Safe-meetup & payment module** (collapsed 2–3 lines) directly above the CTA.
6. **Contact Seller** CTA.
7. Details table (below fold) + "More from [School]" rail.

**Primary CTA:** **Contact Seller** → opens the contact-channel chooser + preview step (text / email / Venmo, equal), then deep-links to the buyer's native app with a prefilled message. Free listings show **Claim this** instead (reservation mechanic).

**Secondary:** Share (native share sheet / copy link); Save (icon, secondary); "See more from [School]"; expand safety module; conditional **Manage this listing** button if a matching token is in localStorage; **Lost your manage link?** link beside it.

**Trust/clarity:** Verified inline micro-explainer on first sight ("physically inspected by a UniformPass volunteer before listing"); seller-type disclosure; safety module names the real scam pattern (no deposits) + privacy promise (number never shown as text); no payment/cart vocabulary; sold items redirect to similar + hub, never 404.

**Mobile:** opens as a slide-up sheet from the grid (preserves scroll) OR full page for deep links. Sticky footer holds the Contact CTA (reachable without scrolling the sheet). Contact degrades gracefully to a copyable handle if the deep-link app is unreachable. Everything decision-critical is above the fold.

---

## 5. `/listing/[id]/manage?token=` — Owner Console
**One job:** Let the seller flip status or edit in under 10 seconds, from any entry point, with visible confirmation — no account.

**Above the fold (top→down):**
1. The listing exactly as buyers see it (thumbnail + title) so there's no ambiguity which item this is.
2. Current status badge (Live / Sold / Pending) + "last updated" timestamp.
3. **Mark as Sold** (or **Relist** if already Sold) — single primary button, no modal for the common case.
4. Inline-editable fields (price, size, condition, details, comments; photos + school not editable per current constraint — call this out).
5. Performance panel: view count + days listed + one contextual staleness nudge ("Listed 10 days, no contact — consider −$5 or another photo").

**Primary CTA:** **Mark as Sold** (Live state) / **Relist** (Sold state).
**Secondary:** Edit fields (inline save); Delete (destructive, one confirm); share; "Lost your manage link?" → `/recover`.
**Trust/clarity:** every mutation gets an immediate unmissable toast ("Marked as sold — buyers now see this as unavailable"); status change propagates everywhere (grid, detail, disables Contact) — state that plainly; invalid/expired token → route to `/recover` with a one-line explainer, not a dead "contact us."
**Mobile:** zero typing for common actions (sold/relist/price-bump via stepper); single-screen, no sub-navigation; big tap targets.

---

## 6. `/sell` — Sell Landing (fork + Decision Aid)
**One job:** Route a seller to the right path (single / lot / concierge / free) with an honest tradeoff before they commit effort.

**Above the fold (top→down):**
1. Plain headline: "Sell your uniforms — your way."
2. **Decision Aid**: two quick inputs (how many items? how much time?) → recommendation.
3. Persistent 3-(or 4-)way tradeoff table: List singles / One lot / Sell it for me [/ Give away free] — est. payout, time, effort, side by side.
4. The fork cards themselves as the fallback for anyone who skips the aid.

**Primary CTA:** **Get my recommendation** (Decision Aid) — but each fork card is independently tappable.
**Secondary:** direct links to `/sell/new`, `/sell/lot`, `/sell-for-me`, `/sell/free`.
**Trust/clarity:** no path dressed as strictly best ("lots sell for less per piece but are 1 listing not 20"); concierge 50% + timeline stated before any effort; "no account — your link is your key" line.
**Mobile:** fork cards stack; Decision Aid inputs are a slider + toggle (no keypad); tradeoff table becomes a swipeable/stacked 3-card compare.

---

## 7. `/sell/new` — Self-Serve Listing Wizard
**One job:** Get one item listed in under 2 minutes, thumb-only, with (near) zero typing — while passively giving optimizers pricing confidence.

**Above the fold / step order:**
1. School (pre-filled from referral/last-used; else one-tap scrollable picker) + "No account needed — we'll text you your link" line.
2. **Camera-first capture** (opens camera, not file picker): auto-crop/brighten, up to 4 photos, 1 required. Example thumbnail + "Doesn't need to be perfect."
3. Confirm AI-suggested attribute chips (category, size best-guess, brand if tag visible) — tap to accept, tap to change; **inline pricing card** appears once school+category+size set ("Blazers like this at [School] sold for $38–$46, based on 12 sales").
4. Confirm price via ±$5 stepper pre-filled with the suggested number; **selling-tips checklist** live beside the uploader (passive, never gates).
5. Phone number (only typed field; numeric keypad; "Never shown publicly — only to text you updates").
6. Auto-generated listing card preview (title auto-built; the non-technical variant skips this review screen).
7. Post → success: live listing, manage link auto-SMS + on-device save + "Add to Home Screen" + "Share to [School] Facebook group."

**Primary CTA per step:** Take Photo → Looks Right → Use This Price → Continue → Post It → Share.
**Secondary:** consignment escape hatch as a low-key link on the photo step ("This part's tricky — let us do it instead" → `/sell-for-me`, carrying progress); manual price override; add/reorder photos.
**Trust/clarity:** pricing guidance cites sample size; tips are reasons not orders ("photo of the size tag → contacted 3× faster"); manage-link purpose explained plainly at generation ("this is the only way to edit or mark sold — no password").
**Mobile:** one-field-per-screen wizard with a soft progress bar (the non-technical persona's default); chip/stepper inputs, never blank text except phone; camera auto-enhancement invisible.

---

## 8. `/sell/lot` — Lot Builder
**One job:** List 15–40+ mixed items as one structured lot without ever becoming per-item data entry.

**Above the fold / step order:**
1. Bulk photo step: multi-select/drag up to ~20 photos at once; lightweight tagging to cluster photos into groups ("these 6 = size 8 polos").
2. Structured lot details: one repeatable row (size + item type + qty + condition) — not N listing forms; school(s), category mix, one lot price or range, contact method.
3. Live buyer-facing lot preview (title, price, photo grid, size/qty table) — updates as she builds.
4. Review → Post → confirmation with un-losable manage link + cross-sell ("3 photos didn't fit a group — list separately or fold in?").

**Primary CTA per step:** Add Photos → Review My Lot → Post My Lot → Save My Manage Link.
**Secondary:** switch to Consignment mid-flow (Decision Aid re-entry); switch to singles.
**Trust/clarity:** honest tradeoff persists ("1 listing vs 12–20"); structured size data (not free-text "sizes 6–12 mixed"); per-item value math shown to buyers on the resulting listing.
**Mobile:** bulk uploader tolerant of camera roll multi-select; row entry is chip/stepper; preview is a stacked card.

---

## 9. `/sell/free` — Donor Flow (or mode of `/sell/new`)
**One job:** Give an item away with dignity, no haggling, one point of contact — a fork of the sell flow, not a separate product.

**Above the fold / step order:**
1. Method choice: "List it myself" vs "Have UniformPass pick up & donate for me" (routes to concierge, backend-tagged donation).
2. Self-list: quick photo(s) + size + category; **price locked to Free** — no price field, no "make offer" UI ever renders.
3. Publish instantly (no review queue) with a bright "Free — first come, first served" badge.
4. On claim: donor gets a single notification ("Maria claimed your blazer — here's how to reach her").

**Primary CTA:** Give it away free → Post it free.
**Secondary:** route to concierge donation; view claim details.
**Trust/clarity:** "Claim" replaces "Contact/Make Offer"; visible claim reservation window (real countdown) prevents pile-ons; post-handoff impact line ("saves a family ~$60").
**Mobile:** same camera-first minimal path; claim countdown visible on the live listing.

---

## 10. `/sell-for-me` — Concierge Intake + Pitch (the moat)
**One job:** Convert a time-poor / overwhelmed owner into a scheduled pickup by proving the payout + who's-coming trust *before* the form, then taking the whole burden off them.

**Above the fold (top→down):**
1. Hero: "Got a pile? We'll sell it for you." + "How it works" 3-step visual (Request pickup → We handle everything → You get paid).
2. **Payout math in plain numbers** + worked example ("A $10 jersey nets you $5") — not fine print.
3. **"Who's coming to my house" trust module** (real name/photo or vetting description, branded bag/vehicle) — the #1 trust blocker, shown pre-form.
4. Payout timing ("paid within 3 business days of each sale, not held until everything sells") + insurance/record line ("we photograph everything at pickup").
5. Intake form.

**Intake form fields (low-bar):** name, phone/email, school (type-ahead + freeform "other"), town/zip, **range picker** ("A few / A bag / Several bags / A whole closet" — never a count field), optional **photo-a-pile** upload ("one photo, however it looks"), optional notes ("skip if unsure"). Pre-fills `?school_id=` when arriving from an empty hub.

**Primary CTA:** **Request a pickup** → **Submit — we'll take it from here.**
**Secondary:** "Give it away instead (donate)"; save/bookmark the page; jump to `/how-it-works`.
**Trust/clarity:** reassurance copy repeated at the range picker ("you don't need to count, sort, or know sizes — we handle that"); 50% + timeline before commitment; "no login, just a private link only you have"; confirmation delivers the secret link on-screen + email (+ optional SMS) redundantly.
**Mobile:** single-scroll form; range picker as big tap chips; photo-a-pile is camera-first, no cropping; secret-link confirmation with a copy button + "add to home screen."

---

## 11. `/pickup/[id]?token=` — Consignor Status Tracker
**One job:** Let the consignor see exactly where their pile is, cancel cleanly while eligible, and watch money materialize — all from a secret link, no account.

**Above the fold (top→down):**
1. Current stage, prominent: Received → Scheduled → Picked up → Listed → Sold/Done (or Declined/Cancelled), with per-stage timestamp + plain-language subtext.
2. **Stage-aware cancel-eligibility annotation** ("You can cancel free anytime before pickup") as ambient text, not hidden behind a click.
3. "What happens next, and when" for the current stage.
4. Manifest recap once received ("Here's what we found") — turns their uncertainty into a concrete list.
5. Payout ledger once items sell (item · sold price · your 50% · running total).

**Primary CTA (stage-dependent):** pre-pickup → **Manage my request** (edit/cancel); post-listing → **View payout**.
**Secondary:** Cancel my request (one tap + one lightweight confirm, no guilt gate, no reason field); resend my status link (by contact info); Contact us (post-pickup non-cancellable fallback → "request items back").
**Trust/clarity:** cancellation cutoff tied to a real milestone (pickup), stated proactively; no retention dark patterns; post-cancel terminal screen confirms nothing further happens + "submit a new request" path back; payout timing restated.
**Mobile:** vertical stage tracker; big Manage/Cancel targets; ledger as stacked rows.

---

## 12. `/my-listings` — Device-Local Listing Manager
**One job:** Surface everything this device has posted so the seller manages without hunting the public grid.

**Above the fold:** compact list — thumbnail + status badge (Live/Sold/Pending) + last-updated per row; sold items deprioritized, not hidden; header badge counts live listings.

**Primary CTA:** tap a row → its manage screen.
**Secondary:** "Saved on this device only" explainer; empty state → **Recover a manage link** (`/recover`) + "Sell an item."
**Trust/clarity:** plainly states this is device-local (localStorage), so a cleared browser/new phone won't show listings — with the recover path right there.
**Mobile:** single-column tappable rows, zero typing.

---

## 13. `/recover` — Account-Less Manage-Link Recovery
**One job:** Get a seller who lost their link (or switched devices) back to their manage screen via contact info alone — self-serve, privacy-safe.

**Above the fold (top→down):**
1. One-line why-this-exists: "We don't use accounts or passwords — so we text/email your manage link to the contact you gave when you posted."
2. Single field: phone or email used at post time.
3. Submit.

**Primary CTA:** **Send me my manage links.**
**Secondary (after submit):** "Try again" / "Contact us instead" (fallback for un-captured contact info).
**Trust/clarity:** **neutral response regardless of match** ("If we found listings tied to that contact, we've sent the links") to prevent enumeration; delivered links name + thumbnail each item (not a bare phishing-looking URL); links are scoped to manage access only (not a login); rate-limited; on click-through, silently re-hydrate localStorage so the new device becomes a home device.
**Mobile:** one field, numeric/email keypad; confirmation is informational (no CTA needed).

---

## 14. `/how-it-works` — Model Explainer
**One job:** In plain language, make the no-money/no-account/off-platform model legible as a deliberate feature.
**Above the fold:** 3-step strip (Browse → Contact seller directly → Meet & pay in person) with icons; one line each on "no fees," "no account," "we never touch payment"; a parallel 3-step for sellers (List or hand off → Buyer contacts you → Meet & get paid).
**Primary CTA:** **Find your school** (back into the funnel).
**Secondary:** links to `/safety`, `/about`, `/sell-for-me`.
**Trust/clarity:** frames constraints as privacy/simplicity, not limitations; no legalese.
**Mobile:** vertical step cards; single scroll.

---

## 15. `/safety` — Safe Meetup & Payment Guide
**One job:** Be the full, linkable version of the inline safety module for anyone vetting the platform before acting.
**Above the fold (top→down):**
1. Safe-meetup specifics: public well-lit place, school pickup circle / coffee shop / police-station "safe exchange" lot, daytime, bring another adult.
2. Payment safety: pay when you see the item; cash/Venmo/Zelle at pickup is normal; **deposit/pre-payment requests are the #1 scam** ; UniformPass never asks for payment.
3. Privacy: your number is never shown publicly; you choose text/email/Venmo; seller sees only what you send.
4. Community mechanism: closed, school/PTO-distributed link; seller tagged "[School] parent"; Verified = volunteer-inspected.
**Primary CTA:** back to browsing / find your school.
**Secondary:** link to `/about`, `/contact`.
**Trust/clarity:** specific + local + non-alarmist (reads like advice from another parent, not a legal disclaimer).
**Mobile:** scannable sections with anchor jumps.

---

## 16. `/about` — Who We Are
**One job:** Answer "who's behind this and is it legit" in one human page, one click from anywhere.
**Above the fold:** named founder(s) + photo, NJ roots, live-school count as scale proof, one-paragraph origin story.
**Below:** how Verified works; the concierge "Sell it for me" model in plain English; participating schools; optional real parent testimonial (no fake counters).
**Primary CTA:** **Find your school** / **Browse [nearest live school]**.
**Secondary:** `/how-it-works`, `/safety`, `/contact`.
**Trust/clarity:** real humans over corporate boilerplate; no Terms-of-Service-as-trust-content.
**Mobile:** single scroll, founder photo first.

---

## 17. `/contact` — Operator-Assisted Fallback
**One job:** A human backstop for buyers/sellers/consignors whose self-serve path genuinely can't resolve — demoted, never removed.
**Above the fold:** name, email/phone, message; a category hint ("Lost a manage link? Try [Recover] first"). Pre-fill identifying details when arriving from a failed recovery/invalid token.
**Primary CTA:** **Send message.**
**Secondary:** links to `/recover`, `/safety`, `/how-it-works`.
**Trust/clarity:** sets expectation of human response time; routes into `/admin` Messages queue.
**Mobile:** three fields, minimal.

---

## 18. `/admin` — Operator Triage Console
**One job:** Tell the (non-technical, phone-bound) operator "what needs me right now," revenue-first, and let her act in the fewest taps.

**Above the fold (top→down):**
1. **"Needs You" unified feed**, strictly ordered: (1) brand-new pickup requests, (2) stalled pipeline items (scheduled-for-today; picked-up-but-unlisted 48h+), (3) listings pending moderation, (4) unread messages. Each pickup card carries a live age chip (New 4h → yellow 24h → red 48h).
2. **Handle Next** — jumps straight to the top-priority item across all queues.
3. Combined count badge (home-screen icon + tab) summing the whole feed.

**Views:** Needs-You feed · Pickup pipeline (single-column list grouped by stage, collapsible — **not** a drag-and-drop kanban) · Moderation (Approve/Reject with reason-code picker) · Messages (canned-reply picker + custom).

**Primary CTA (context-dependent):** Handle Next · Schedule Pickup (preset slots Today/Tomorrow/Weekend/Custom) · Mark Picked Up · Mark Listed (auto-drafts the listing from request photos/info) · Approve · Reply.
**Secondary (visually distinct, one confirm):** Reject / Decline / Delete — destructive actions get exactly one confirm; routine forward actions (approve/schedule/verify/advance) are instant, confirm-free.
**Trust/clarity:** **Verify toggle** with optimistic UI (badge appears instantly — she is the human face of the Verified badge); plain-language stages everywhere ("Picked Up," never "stage_2"); scheduling auto-messages the seller.
**Alerting:** immediate push (PWA web push, SMS fallback) the instant a new pickup lands — never batched; low-urgency items roll into two digest pushes/day (9am/5pm: "3 things need you: 1 pickup, 2 listings").
**Mobile-first:** deep-link straight from notification to the exact item (no menu hunting); 48×48pt targets; stay signed in on trusted device (short PIN, not full password, on timeout); no typing for scheduling (tap presets).
</content>
