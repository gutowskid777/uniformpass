# UniformPass — Ideal Information Architecture & Sitemap
Synthesis of 13 persona×situation journeys into one recommended site structure.
Design spec only. No code. Respects fixed model: web app, no accounts, no in-app payments, no shipping, off-platform cash/Venmo, secret manage-link ownership, concierge consignment as the moat.

---

## 0. The five structural moves (read this first)

Every persona pushed the IA in the same handful of directions. The recommendation collapses to five moves:

1. **School is the spine, not a filter.** Give every school a real, deep-linkable home at `/s/[slug]` (the "School Hub"). Nine of thirteen journeys assume they land pre-scoped to their school; the homepage becomes a *router into a hub*, not a browse-everything grid. Filters live *inside* a hub, in the URL, shareable.
2. **Elevate the moat globally, demote it locally.** "Sell it for me" (concierge) becomes a first-class, always-visible nav item and one arm of a 3-way fork (Buy / Sell yourself / Sell it for me) — including on mobile, where it is currently hidden. On surfaces with a specific competing intent (a listing page, a fast single-item flow) it shrinks to a one-tap escape hatch.
3. **Trust is ambient, not a gate.** No trust wall ever blocks an action. Safe-meetup, "how it works," verified-badge, and community-proof render as *inline, collapsed, contextual modules placed exactly where the fear spikes* (directly above Contact), backed by persistent linkable pages (`/safety`, `/how-it-works`, `/about`) for anyone vetting before they browse. This is how buyer-speed and buyer-trust coexist.
4. **Every dead end becomes a captured lead.** School-not-listed, listed-but-empty, and filtered-to-zero each render a *distinct* purpose-built state whose primary action is notify/waitlist (writes to the expansion queue) with a sell-side nudge alongside — never a bare "0 results."
5. **No accounts ≠ no recovery.** The manage token stays the ownership artifact, but contact capture at post time becomes mandatory and doubles as a recovery key. A self-serve `/recover` (magic manage-links) becomes the primary recovery path; the contact form is demoted to last-resort floor.

---

## 1. Recommended navigation model

### Design principle
The nav must serve a **cold, mobile, school-specific, low-patience** median visitor while keeping the three revenue/growth actions (browse, self-sell, consign) one tap away and never implying an account exists.

### 1.1 Desktop header (sticky, all pages)

| Slot | Label | Target | Notes |
|---|---|---|---|
| Left | Logo | `/` (router) | If a school is in context, logo still goes to router; school switcher holds scope. |
| Context | **School switcher** | type-ahead | Shows current school name+crest when scoped (`/s/[slug]`); click opens the type-ahead to switch. This replaces the buried 44-item `<select>`. |
| Primary | **Browse** | current `/s/[slug]` (or router if unscoped) | Goes to the *scoped* hub, not a global grid. |
| Primary | **Sell** ▾ | menu: List an item / Sell a big lot / Give it away free | Dropdown so the self-serve variants don't crowd the bar. |
| Primary (emphasized) | **Sell it for me** | `/sell-for-me` | Visually distinct (filled/pill). The moat gets its own slot, never nested under "Sell." |
| Right | **My Listings** | `/my-listings` | Badge-counted from localStorage token count. |

Utility links (How it works, Safety, About) live in a lightweight secondary position (under a "?" menu or slim top strip) and are repeated in the footer — persistent but not competing with the primary actions.

### 1.2 Mobile navigation (the current model is broken here)

**Problem in current build:** "Browse" and "Sell it for me" are *hidden on mobile*. Since the median visitor is cold + mobile and the moat is consignment, hiding both is the single worst IA defect. Fix:

- **Sticky bottom tab bar (thumb zone, 4 tabs):** `Browse` · `Sell` · `Sell for me` · `My Listings`. Bottom placement is mandated by the one-handed pickup-line persona (top 40% of screen is glance-only). Icons + short labels, 48×48pt targets.
- **Sticky top bar (≤56px):** school name/crest + switcher on the left; on hub pages, a single filter-summary chip row ("Boys · Size 14 · ✕"). Never holds a primary action.
- **Sell tab** opens the 3-way fork sheet (List one / Big lot / Give away free) with "Sell it for me" already promoted to its own bottom tab, so the moat is reachable in one tap regardless.
- Utility/trust links live in a "More/Menu" affordance and the footer.

### 1.3 Footer (all pages)

```
UniformPass — Skip the $80 uniform. No fees, no shipping.  |  Free to browse · No account · Meet locally
────────────────────────────────────────────────────────────
Product              For Sellers            Trust & Help
• How it works       • Sell an item         • Safety & meetup guide
• Browse schools     • Sell it for me       • About / who we are
• (school switcher)  • My Listings          • Contact us
                     • Recover a manage link
```

Rationale: the skeptic and first-timer both proactively look for About/Safety *before* acting; these must be reachably persistent, not inline-only. Sellers who cleared browser data need a visible "Recover a manage link" entry that isn't the contact form.

---

## 2. Full page / route inventory (keep · add · change · remove)

Legend: **KEEP** = exists, minor/no change · **CHANGE** = exists, restructure · **ADD** = new surface a journey demands · **REMOVE/FOLD** = eliminated or absorbed.

| # | Route | Status | One-line purpose |
|---|---|---|---|
| 1 | `/` | **CHANGE** | Cold-visitor router: school type-ahead + 3-way fork + trust strip above the fold. Stops being a browse-everything grid. |
| 2 | `/s/[school-slug]` | **ADD** (canonical) | The School Hub — every school's deep-linkable home base: crest, live count, buy/sell/consign fork, filter+sort bar, results grid, purpose-built cold-start empty state. |
| 3 | `/schools` | **ADD** | Directory of live schools (proximity/alpha) + inline waitlist for un-listed schools; SEO surface for "[school] uniform resale" queries; target of "browse nearby live schools" fallback chips. |
| 4 | `/listing/[id]` | **CHANGE** | Self-contained listing detail that doubles as a deep-link mini-landing: gallery, facts, seller-type + Verified explainer, **safe-meetup module above CTA**, contact-channel chooser, freshness/sold state, "more from [school]", share. |
| 5 | `/listing/[id]/manage?token=` | **CHANGE** | Single-screen owner console: one-tap mark-sold/relist, inline edit, performance panel (views/days-listed + staleness nudge), lost-link entry; invalid token → `/recover` (not just contact). |
| 6 | `/sell` | **ADD** | Sell landing = the fork + Decision Aid (List one / Big lot / Sell it for me / Give away free) with honest tradeoff table. Absorbs the "where do I start selling" decision. |
| 7 | `/sell/new` | **CHANGE** (was `/new`) | Camera-first, chip/stepper self-serve listing wizard with inline pricing guidance and selling-tips; one-field-per-screen mode for the non-technical persona; consignment escape hatch on the hard (photo) step. |
| 8 | `/sell/lot` | **ADD** | Lot Builder: bulk multi-photo + photo-grouping + repeatable size/qty/condition rows + live buyer-facing lot preview. Never degrades to N single forms. |
| 9 | `/sell/free` | **ADD** (or mode of `/sell/new`) | Donor flow: price locked to Free, all negotiation UI removed, "Claim" reservation mechanic, instant publish (no review queue). |
| 10 | `/sell-for-me` | **CHANGE** | Concierge intake + pitch: how-it-works, 50% math + worked example, "who's coming to my house" trust module, range-picker + photo-a-pile intake, redundant secret-link delivery. Accepts `?school_id=` / freeform "other" school. |
| 11 | `/pickup/[id]?token=` | **CHANGE** | Consignor status page: 6-stage tracker with **stage-aware cancel-eligibility annotation**, manifest recap, payout ledger, one-tap self-serve cancel (no guilt gate), resend-link. |
| 12 | `/my-listings` | **KEEP+** | Device-local (localStorage) listing manager; empty state routes to `/recover`; "saved on this device only" explainer. |
| 13 | `/recover` | **ADD** | Account-less manage-link recovery: enter contact info → neutral response → magic manage-links emailed/texted; contact-form fallback demoted beneath it. |
| 14 | `/how-it-works` | **ADD** | Plain-language model page (Browse → Contact seller → Meet & pay in person; no fees/no accounts/no payments). Linkable; also rendered as inline strips. |
| 15 | `/safety` | **ADD** | Full "Safe meetup & payment guide" — the expanded version of the inline module (public place, daytime, pay-on-pickup, no-deposit scam pattern, privacy). |
| 16 | `/about` | **ADD** | Who we are: named humans, NJ roots, live-school count, how Verified works, the concierge model — human, not legalese. The skeptic/first-timer's one-click legitimacy check. |
| 17 | `/contact` | **KEEP** | Operator-assisted fallback for buyers/sellers/consignors; demoted (last resort), never removed. |
| 18 | `/admin` | **CHANGE** | Operator triage: unified "Needs You" priority feed (new pickups first), pickup pipeline (list, not kanban), one-tap status bumper, Verify toggle, moderation with reason codes, canned replies; mobile-first + push/SMS. |

**Removed/folded:** the generic "browse every school's inventory in one grid" concept as the *homepage default* is folded into `/schools` (directory) + `/s/[slug]` (scoped browsing). No persona wants an unscoped mega-grid as the front door.

**Not a page (cross-cutting), but IA-critical:** OpenGraph share cards per listing and per school hub (real item/crest photo, price, school name) — the "true first screen" for the FB/text discovery personas; and the notify/waitlist capture (a component + `school_requests` table), rendered inline in three empty states, not a standalone page.

---

## 3. Primary-flows map (canonical entry → goal)

### BUY  — goal: contact a seller off-platform
`FB/text link → OG card → /s/[slug] (or / → pick school → /s/[slug])` → set category/gender/size/condition via chips (URL-persisted) → scan grid (price·size·condition·Verified visible on card) → tap card → `/listing/[id]` → read collapsed safe-meetup module → **Contact Seller** → channel chooser (text/email/Venmo, equal) → native app, prefilled message. *Dead-end branches:* no match → notify-me on saved filter; sold item → redirect to similar + school hub.

### SELL (self-serve) — goal: live listing + un-losable manage link
`/ fork or Sell tab → /sell (Decision Aid)` → "List one item" → `/sell/new` (camera → confirm chips → confirm suggested price → phone) → **Post it** → manage link auto-SMS + on-device save + "add to home screen" → optional Share to school FB group. *Fork:* Big lot → `/sell/lot`; Free → `/sell/free` ("Claim" model).

### CONSIGN (the moat) — goal: pickup scheduled, paid 50%
`Homepage fork / "Sell it for me" nav / school-empty-state / flyer QR → /sell-for-me` (see 50% math + who's-coming trust before form) → low-bar intake (range picker, optional photo-a-pile) → **Submit** → confirmation with secret link delivered ≥2 channels → `/pickup/[id]` status tracker → scheduled → picked up → listed → sold → payout ledger. *Branch:* cancel (self-serve, pre-pickup) or donate (backend-tagged giveaway).

### MANAGE — goal: accurate status (mark sold / edit / relist)
`Header "My Listings" | "Manage" button on the item's own page (token in localStorage) | saved manage link | /recover` → `/listing/[id]/manage` → one-tap **Mark as Sold** / **Relist** / inline edit → instant, everywhere-propagated confirmation. *Lost link:* `/recover` → contact info → magic links → localStorage re-hydrated.

### OPERATE — goal: pipeline moving, revenue first
`Push notification (deep-link to the item) → /admin` → **Handle Next** (top of "Needs You" feed: new pickups first) → Schedule Pickup → Mark Picked Up → Mark Listed (auto-drafts listing) → moderate new listings (Approve/Reject) → Verify toggle → canned-reply messages.

---

## 4. ASCII sitemap tree

```
UniformPass
│
├─ /                              Router homepage — school type-ahead + 3-way fork + trust strip
│   └─ (OG share card: collage of real listings)
│
├─ /schools                       Live-school directory + waitlist for un-listed  [ADD]
│
├─ /s/[school-slug]               SCHOOL HUB — the spine  [ADD, canonical]
│   │   • crest + live count + community line
│   │   • buy / sell / consign fork
│   │   • filter+sort bar (URL-persisted, shareable)
│   │   • results grid  ─┐
│   │   • empty states:  ├─ not-listed (waitlist)  |  listed-but-empty cold-start (notify + sell)  |  filtered-to-zero (notify)
│   │   • (OG card: crest + sample items)
│   │
│   └─ /listing/[id]              LISTING DETAIL / self-contained deep-link  [CHANGE]
│       │   • gallery · facts · seller-type + Verified explainer
│       │   • SAFE-MEETUP MODULE (collapsed) ▸ above Contact
│       │   • Contact Seller → channel chooser (text/email/Venmo)
│       │   • freshness/sold state · share · "more from [school]"
│       │
│       └─ /manage?token=         OWNER CONSOLE  [CHANGE]
│               • mark sold / relist / inline edit
│               • performance panel (views · days · staleness nudge)
│               • "Lost your manage link?" → /recover
│
├─ /sell                          SELL LANDING — fork + Decision Aid  [ADD]
│   ├─ /sell/new                  Self-serve wizard (camera-first, chips, inline pricing)  [CHANGE, was /new]
│   ├─ /sell/lot                  Lot Builder (bulk photos, size/qty rows, live preview)  [ADD]
│   └─ /sell/free                 Donor flow ("Claim", instant publish, no price UI)  [ADD]
│
├─ /sell-for-me                   CONCIERGE intake + pitch (the moat)  [CHANGE]
│   └─ /pickup/[id]?token=        Consignor status tracker + cancel + payout ledger  [CHANGE]
│
├─ /my-listings                   Device-local listings (localStorage)  [KEEP+]
├─ /recover                       Account-less manage-link recovery  [ADD]
│
├─ /how-it-works                  Model explainer (browse → contact → meet & pay)  [ADD]
├─ /safety                        Safe meetup & payment guide (full)  [ADD]
├─ /about                         Who we are · NJ · school count · Verified · concierge  [ADD]
├─ /contact                       Operator-assisted fallback (demoted)  [KEEP]
│
└─ /admin                         OPERATOR triage: Needs-You feed · pipeline · verify · moderation  [CHANGE]
```

---

## 5. Conflicts resolved (the tradeoffs, stated)

| Tension | Personas in conflict | Resolution | What we trade |
|---|---|---|---|
| School-first hub vs generic homepage | browsing/first-timer/skeptic/discovery want school-scoped landing; cold homepage visitor needs a minimal entry | Homepage = router with school type-ahead as the single primary action; `/s/[slug]` is canonical and deep-links skip the router | A shareable "browse everything" mega-grid; acceptable — no persona asked for it |
| Buyer speed vs trust-building | fast-path/pickup-line want ≤2-tap contact; first-timer/skeptic want proof | Trust is inline, collapsed, contextual (safe-meetup above Contact; Verified explainer on first sight) + linkable pages; never a blocking step | Guaranteed exposure of trust copy to fast buyers who skip it — mitigated by placing it in their unavoidable path (the Contact step) |
| Minimal fields vs pricing guidance | one-item/non-technical want zero typing; top-dollar wants comps | Single flow: chip/stepper defaults satisfy speed; pricing card + selling-tips render *passively alongside*, never gate a step | Comps for the optimizer are "aside," not a dedicated tool page |
| Curated browse vs filter list | just-browsing wants category tiles; price-sensitive wants immediate sortable list | Hub shows a slim category-tile strip *and* an always-present filter/sort bar + grid; price-ascending + Free/Lots chips are first-class; list/grid toggle | A fully curated editorial homepage; we keep it light |
| Consignment prominence vs single-seller focus | disappear/big-lot need concierge front-and-center; one-item finds it noise | First-class nav slot + homepage fork + empty-state CTA globally; shrinks to a one-tap link on listing/single-item surfaces | Some nav real estate spent on the moat — intentional |
| No accounts vs ownership recovery | lost-link/new-device need to prove ownership | Mandatory contact capture (reused field) as recovery key; `/recover` magic-links; neutral anti-enumeration response; contact form demoted | A tiny bit of friction at post time (already collected) for durable recovery |
| Free vs sale | donor wants no-money, no-haggle | Free is a fork of the sell flow; "Claim" reservation replaces "Contact"; price/negotiation UI structurally removed; instant publish | Slight flow duplication — justified by the distinct verb and mechanic |

The consolidated per-page specs are in `02-per-page-specs.md`, reusable components in `03-shared-components.md`, and the deduplicated per-persona click-paths in `04-persona-clickpaths.md`.
</content>
</invoke>
