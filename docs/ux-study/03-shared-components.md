# UniformPass — Shared Components
The reusable components the journeys demand. For each: purpose · where used · key states/props · behavior. The **School Search Type-Ahead** is worked in full as the reference example; the rest are specified to the same buildable standard.

Design constants: no accounts; mobile-first, one-handed, glare-resistant; 44×44pt min tap targets (48×48 for filter chips); every mutating action gets a visible confirmation; trust content is inline + collapsed, never a gate.

---

## 0. Component index
1. School Search Type-Ahead ⭐ (worked example)
2. Filter & Sort System
3. Listing Card
4. Safe-Meetup & Payment Module
5. Verified-Badge Explainer
6. Consignment CTA Band
7. Status Tracker (consignor + operator-facing)
8. Notify / Waitlist Capture
9. Manage-Link Delivery & Recovery
10. Contact-Channel Chooser + Preview
11. Buy/Sell/Consign Fork
12. Pricing-Guidance & Selling-Tips (seller inline)
13. Empty-State System
14. OpenGraph Share Card

---

## 1. ⭐ School Search Type-Ahead  (fully worked reference)

**Purpose.** The front door to the entire product. Converts a school name (or nickname, abbreviation, misspelling) into a scoped `/s/[slug]` hub, and — critically — converts a *miss* into a captured waitlist lead instead of a dead end. School selection is the single most important interaction in the IA; a `<select>` of 44 alphabetical options fails cold mobile visitors and cannot scale to "all schools/colleges."

**Where used.**
- `/` homepage hero (primary control).
- Header school-switcher on every scoped page.
- `/schools` directory search.
- `/sell/new`, `/sell-for-me` school field (with freeform "other" fallback that writes to the expansion queue).
- Any "switch school" affordance.

**Props.**
| Prop | Type | Purpose |
|---|---|---|
| `mode` | `"navigate" \| "select"` | navigate = route to hub on pick; select = set a form field. |
| `scopedSchool` | `School?` | pre-selected school (switcher shows it as current). |
| `allowOther` | `boolean` | show "Can't find your school?" → capture demand (sell/waitlist contexts). |
| `recent` | `School[]` | from localStorage, shown before typing. |
| `nearby` | `School[]` | geo/state-ranked, shown before typing (no permission prompt; IP/state coarse only). |
| `onPick(school)` / `onOther(query)` | callbacks | resolve to hub/field, or open waitlist capture. |

**Data requirements.** Each school row needs `id, slug, name, crest, city, state, activeListingCount`, and an **`aliases[]`** field (nicknames "St. Joe's"→St. Joseph Regional; abbreviations "SJR", "DB", "BC"; common misspellings). Matching is fuzzy over `name + aliases`.

**States.**
- *Idle (empty, unfocused):* placeholder "Start typing your school…", "No account needed" microcopy beneath.
- *Focused, empty:* dropdown shows **Recent** (localStorage) then **Nearby** (state/proximity) as one-tap chips/rows — so returning + local users often never type.
- *Typing:* debounced (~150ms) fuzzy match over name+aliases, ranked by (exact alias/prefix hit > fuzzy score) then proximity/state; each result shows crest + name + city + live-count. Matched substring highlighted.
- *No match:* an **inline "not found" panel** (never a separate page) that echoes the exact query — "We don't have '[query]' yet" — with primary action **Notify me when [school] joins** (expands the Notify/Waitlist micro-form inline, school-name auto-attached) and a live per-school waitlist counter ("3 other [School] families are waiting"). Secondary: "Invite your school" share + "Browse nearby live schools" chips. In `allowOther` form contexts, the "other" value is accepted as freeform and flagged for the expansion queue so the seller/consignor is never blocked.
- *Selected:* collapses to the chosen school (crest + name), routes (navigate) or fills the field (select).

**Keyboard behavior (desktop).** `↓/↑` move highlight, `Enter` selects highlighted (or top result), `Esc` closes, `Tab` accepts top result. ARIA `combobox` + `listbox`; `aria-activedescendant` tracks highlight; results are focusable and screen-reader labeled ("St. Joseph Regional, Montvale NJ, 212 items").

**Mobile behavior.** Tapping opens a **full-height sheet** (not a cramped inline dropdown) with a large input, big 48px result rows, Recent/Nearby chips above the fold, and a persistent "Can't find your school?" row pinned at the bottom of the sheet. No horizontal scroll. Instant filter as they type; no submit button.

**Empty / no-match is the money state.** A zero-match search must **always** resolve into a captured lead (contact + school name → `school_requests`, which doubles as the operator's expansion-priority queue) and must offer a live secondary path (invite-share or route into `/sell-for-me`). The query text persists and is echoed end-to-end (search → waitlist → confirmation) with zero re-entry.

**Deep-link parity.** A direct `/s/[unknown-slug]` from an external search engine resolves to this same not-found panel state (server-side), so SEO traffic to an unseeded school also converts to a waitlist lead rather than a 404.

---

## 2. Filter & Sort System
**Purpose.** Let a task-locked buyer narrow to their exact item fast, and a browser explore loosely — without forcing a sequence.
**Where used.** `/s/[slug]` hub (and its list/grid results).
**Props/controls.** Category, Gender, Size, Condition (multi-select); first-class **Free** and **Lots** quick chips (never nested in a price slider); Sort (Price ↑ [default option], Newest, Relevance); optional distance/radius; list/grid view toggle.
**States.** Default (school-scoped, no filters) · active (chips reflect selections, filter-summary row shows them) · filtered-to-zero (distinct empty state → notify-me on this filter) · Available-now/urgent mode (sort=newest + "responds fast"/last-active surfaced).
**Behavior.** All filters live in the **URL query string** → shareable/bookmarkable, and **persist across back-navigation** (the parallel-outreach and compare-then-back journeys depend on this). Instant-apply on mobile (bottom sheet, no Apply button, sheet auto-collapses). Free items surface in a pinned strip regardless of sort. Sold/reserved items flagged or suppressed in near-real time.

---

## 3. Listing Card
**Purpose.** Carry every decision-critical fact so a buyer can rule items in/out *without opening them*.
**Where used.** Hub results grid, "More from [school]" rail, `/schools`, My Listings (owner variant).
**Props.** `photo (3:4), price, item, size, gender, condition, school, city, badges[], sellerType, freshness, isLot, isFree, isVerified, status`.
**States.** Default · Free (bright distinct "FREE" tag, not "$0") · Lot (distinct badge so a bundle price isn't mistaken for single) · Verified (badge on the card, not only detail) · Sold/Reserved (greyed + ribbon, Contact suppressed) · "responds fast"/fresh (urgent mode).
**Behavior.** Price + size as high-contrast overlay on the first photo (readable through glare); condition in plain words ("Like new/Good/Worn"); seller first name + general area on the card; tap opens detail as a slide-up sheet on mobile (preserves scroll). Owner variant swaps the tap action for "Manage."

---

## 4. Safe-Meetup & Payment Module
**Purpose.** Neutralize the skeptic's specific fears (pre-payment scams, unsafe meetup, number leaking) at the exact moment they spike.
**Where used.** `/listing/[id]` directly above Contact (collapsed 2–3 lines); repeated in the contact preview step; full version = `/safety` page.
**States.** Collapsed (default, 2–3 lines: "Meet in a public place, daytime · Pay on pickup, never a deposit · Your number stays private") · Expanded ("See safety tips" → specifics: safe-exchange lots, no-deposit red flag named, privacy promise) · Full-page.
**Behavior.** Collapsed inline by default (present but not alarming); one-time expand, never re-rendered as a full block on every screen (repetition itself reads as alarming). Specific + local + non-alarmist copy, not legal boilerplate.

---

## 5. Verified-Badge Explainer
**Purpose.** Make the platform's core trust signal / moat self-explanatory on first sight.
**Where used.** Listing cards, listing detail (inline micro-explainer on first appearance), operator Verify toggle, `/about`.
**States.** Badge (icon) · first-sight micro-explainer (tooltip/tap-expand: "Verified = a UniformPass volunteer physically inspected this item before listing — condition confirmed") · operator toggle (optimistic, badge appears instantly).
**Behavior.** Never requires opening a listing to learn what Verified means; explainer fires inline on first encounter per session; operator side updates with no spinner.

---

## 6. Consignment CTA Band
**Purpose.** Keep the moat one tap away everywhere, framed as opportunity, sized to context.
**Where used.** Homepage fork (full), hub (mid-grid band "Got a pile? We'll sell it for you → 50% cut"), listing detail (small "Have uniforms to sell? →" link), sell flows (escape-hatch link), school cold-start empty state (equal-weight sell CTA), flyer/QR deep-link target.
**States/props.** `variant: hero | band | inline-link | empty-state`; carries school context forward (`?school_id=`).
**Behavior.** Prominent where selling intent is plausible (homepage, hub, empty state); demoted to a one-tap link where a competing intent owns the screen (listing, single-item flow). Always states the 50% + "we do the work" in one line.

---

## 7. Status Tracker
**Purpose.** Give the account-less consignor (and the operator) a single source of truth for where a pile/pickup is.
**Where used.** `/pickup/[id]` (consignor); `/admin` pipeline (operator).
**Stages.** Received → Scheduled → Picked up → Listed → Sold/Done (+ Declined/Cancelled terminal).
**Props/states.** `stage, timestamps[], cancelEligible (stage-aware), manifest?, payoutLedger?`.
**Behavior (consignor side).** Carries **cancel-eligibility metadata visibly** at each stage ("cancel free until pickup" as ambient text); reveals manifest recap once received; reveals payout ledger once selling (item · price · 50% · running total); resend-link by contact info; post-pickup non-cancellable stage surfaces "contact us about this item" instead of a dead "can't cancel."
**Behavior (operator side).** Same stages rendered as a single-column list grouped by stage (collapsible, not kanban); each card advances via one primary CTA; live age chip (New→yellow 24h→red 48h).

---

## 8. Notify / Waitlist Capture
**Purpose.** Turn every dead end (school not listed, school empty, filter zero-result) into a captured demand signal + the operator's expansion queue.
**Where used.** Type-ahead no-match panel; hub cold-start empty state; filtered-to-zero state; urgent buyer no-match; `/schools`.
**Props.** `context: not-listed | cold-start | filter-zero`, `schoolId? | freeformSchool`, `savedFilter?`.
**States.** Single-field inline micro-form (email or phone; school/filter auto-attached — nothing to retype) · confirmation ("You're on the list for [School]" + live waitlist counter) · already-submitted.
**Behavior.** No account; writes to `school_requests` (freeform name for not-listed, `school_id` for cold-start) with optional `saved_filter`. Explicit no-spam line ("One email, when your school goes live. Nothing else."). Confirmation offers a live secondary action (invite-share or route to `/sell-for-me`). The counter doubles as social proof to the next visitor of the same query.

---

## 9. Manage-Link Delivery & Recovery
**Purpose.** Uphold ownership without accounts — deliver the token un-losably, and re-derive access when it's lost.
**Where used.** All post-listing confirmations (`/sell/new`, `/sell/lot`, `/sell/free`), `/sell-for-me` confirmation, `/pickup/[id]`, `/my-listings` empty state, `/recover`, and the "Lost your manage link?" affordance on `/listing/[id]`.
**States.** *Delivery:* on-screen with copy button + auto-SMS + optional email + "Add to Home Screen" prompt + silent localStorage save (redundant by design). *Recovery:* single contact-info field → **neutral response** ("if we found listings, we've sent the links") → magic manage-links (one digest per contact, each labeled with item + thumbnail) → on click-through, silent localStorage re-hydration.
**Behavior.** Contact capture at post time is **mandatory** (reuses the buyer-contact field) and is the recovery key. Recovery links are scoped to manage access only (not a session/login), time-limited, rate-limited, enumeration-safe. Contact form is the demoted floor for un-captured/changed contact info — retained, never primary.

---

## 10. Contact-Channel Chooser + Preview
**Purpose.** Let the buyer reach the seller off-platform in one tap while protecting privacy and previewing exactly what happens.
**Where used.** `/listing/[id]` Contact Seller; skeptic + first-timer + fast-path all route through it.
**States.** Channel chooser (text `sms:` / email `mailto:` / Venmo note — **equal** first-class options, email never a fallback) · preview ("here's what opens; your number isn't shared unless you text; meet in a public place, pay on pickup") · fallback (copyable handle if the deep-link app is unreachable). Free listings swap to **Claim** with a reservation window.
**Behavior.** Opens the buyer's native app with a prefilled, item-referenced message ("Is the [item] still available? Saw it on UniformPass"; urgent variant adds "need it by Monday — meet today/tomorrow?"). No raw phone number rendered as page text for either party. Confirmation screen restates safety framing once. Seller-side mirror: seller chooses which channels to expose at listing time (can list email-only) with a "here's what buyers see" preview.

---

## 11. Buy/Sell/Consign Fork
**Purpose.** Present the three (four with Free) top-level intents as equal, un-nested choices at every decision point.
**Where used.** Homepage, hub, `/sell` landing, non-technical seller's first screen, cold-start empty state (buy vs sell equal weight).
**Props.** `variant: three-card | two-button (self vs concierge) | empty-state-dual`; `schoolContext`.
**States/behavior.** Three equal-weight cards (Browse / Sell an item / Sell it for me); the non-technical seller's first screen is a two-button fork (self vs concierge) *before* any field; the donor adds a fourth (Give away free). "Sell it for me" is never a checkbox buried in a pricing screen. Carries school context into whichever path is chosen.

---

## 12. Pricing-Guidance & Selling-Tips (seller inline)
**Purpose.** Give effort-driven sellers pricing confidence and quality nudges *without* slowing the minimal-field seller — resolving the "minimal vs guidance" tension by making guidance passive.
**Where used.** `/sell/new` (price + photo steps), `/sell/lot`, manage-page performance panel.
**States.** Pricing card (appears once school+category+size set: "Similar items sold for $X–$Y, based on N sales" — **cites sample size**) · selling-tips checklist (live, tied to actual form state: photo count, tag photo present, description length; framed as reasons: "photo of the size tag → contacted 3× faster") · listing-quality line (one specific next action: "add 1 more photo to reach Great") · staleness nudge (manage page: "listed 10 days, no contact — consider −$5").
**Behavior.** Always an aside, **never a blocking step**; suggested price pre-fills a ±$5 stepper with manual override; a bare number with no basis is never shown. On the manage page this is the *only* feedback loop (no accounts/notifications), so it must actively surface views + days-listed.

---

## 13. Empty-State System
**Purpose.** Three structurally different "nothing here" moments must never share one generic message.
**Where used.** Hub + type-ahead.
**Variants.**
| Variant | Trigger | Primary action | Secondary |
|---|---|---|---|
| Not-listed | school absent from catalog | Notify me when [school] joins (waitlist) | Invite-share · nearby live chips · route to `/sell-for-me` |
| Cold-start | school present, 0 active listings (server-detected) | Notify me when something's posted **+** Be the first to sell (free pickup) — equal weight | Nearby live chips |
| Filtered-to-zero | active listings exist, filters exclude all | Clear filters | Notify me on this filter |
**Behavior.** Server-side detection distinguishes cold-start from filtered-to-zero *before* the buyer touches filters. Never "0 results, adjust filters" for a genuine cold start. Every variant carries school context into any sell/consign hand-off (zero re-entry).

---

## 14. OpenGraph Share Card
**Purpose.** The "true first screen" for FB-group/text discovery — does half the convincing before the tap.
**Where used.** Every `/listing/[id]` and `/s/[slug]` (and the homepage) generate OG metadata.
**Props/states.** Listing card: real item photo + price + school name + wordmark. School hub card: crest + sample-listing collage + live count. Homepage: collage of real listings.
**Behavior.** Always real uniforms / real crests, never generic marketplace stock art (this is what survives the skeptical-parent 3-second sniff test). School-specific when the share originates from a school context. Legible enough that a viewer knows what they're clicking before they click.
</content>
