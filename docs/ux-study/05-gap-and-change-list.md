# UniformPass — Gap & Change List
Diff of the **ideal design** (`01`–`04`) against the **current build** (`app/`, `lib/supabase.ts`). Prioritized, buildable, honest on effort.

---

## How this is prioritized

Rank = **impact on the launch audience's core journeys × reach across personas ÷ build effort**, with two multipliers on top:

- **Cold-mobile discovery ranks highest.** The launch audience is NJ prep-school parents arriving *cold, on a phone, from a Facebook link*. Anything that breaks or dead-ends that exact path (mobile nav, the OG card that IS the first screen, the school-scoped landing, the empty-school state) is weighted above everything else.
- **The consignment moat ranks second-highest.** "Sell it for me" is the defensible offering. Anything that hides it or fails to earn trust before the intake form is treated as near-critical even when the page technically works.

Effort is **S** (hours, front-end only), **M** (a day-ish, may touch data/routing), **L** (multi-day, new spine/infra). Items that need a **new DB column/table** or **new delivery infra (email/SMS)** are flagged explicitly — most changes reuse existing columns.

Three tiers: **CRITICAL** (breaks a core launch journey), **HIGH** (materially lifts conversion/trust for a named persona), **NICE-TO-HAVE** (real but the stage/model doesn't justify it yet).

---

## CRITICAL

### C1 · Unhide Browse + "Sell it for me" on mobile
| | |
|---|---|
| **Change** | Remove `hidden sm:block` from the Browse and "Sell it for me" nav links; add a sticky bottom tab bar (Browse · Sell · Sell for me · My Listings) for the thumb zone. |
| **Current state** | `app/layout.tsx` lines 24–29: both `/` (Browse) and `/sell-for-me` links carry `hidden sm:block`, so on mobile only "My Listings" and "+ Sell" (→`/new`) render. The moat and the browse entry are **invisible on the exact device the launch audience uses.** |
| **Persona pain** | DX1 (cold mobile FB arrival) can't find Browse; **every consignor (C1/C2/C3) can't reach the moat** — the highest-value action is hidden precisely on mobile. |
| **Implementation** | Front-end only, `layout.tsx`. Drop the two `hidden sm:block` classes = 5-minute fix. Bottom tab bar = a small client component rendered in the layout. No data changes. **Single highest leverage-to-effort win in the whole list.** |
| **Effort** | **S** |

### C2 · School type-ahead + per-school hubs `/s/[slug]` (ship together)
| | |
|---|---|
| **Change** | Replace the 44-item native `<select>` with a fuzzy type-ahead (name + aliases/nicknames), and make every school a deep-linkable hub at `/s/[slug]` that lands pre-scoped (crest, live count, buy/sell/consign fork, filter bar, results). Homepage `/` becomes a router into a hub, not a browse-everything grid. |
| **Current state** | `app/page.tsx` L116–119: school is `<select><option>All Schools</option>{schools.map…}</select>` — alphabetical, no text search, no aliases, no proximity. Homepage IS the global grid. There are **no per-school pages at all**; `School` type in `lib/supabase.ts` (L8–13) has only `id/name/city/state` — no `slug`, `crest`, `aliases[]`, or `activeListingCount`. |
| **Persona pain** | DX1 (cold arrival can't type "SJR" → St. Joseph Regional); B1/B2/B3/B5 (9 of 13 journeys assume they land already scoped to their school); B7 (a miss must convert, not scroll 44 options). |
| **Implementation** | **New DB:** add `slug`, `crest`, `aliases text[]`, and a computed/`activeListingCount` to `schools`. **New route:** `app/s/[slug]/page.tsx` (server-fetch school by slug → renders hub; unknown slug → not-found panel, not 404). New `SchoolTypeAhead` component (shared per `03`). This is the **spine** — type-ahead is useless without slugs, hubs are useless without the type-ahead to reach them, so they are one unit of work. |
| **Effort** | **L** |

### C3 · Empty-state system + notify/waitlist capture
| | |
|---|---|
| **Change** | Replace the single generic "No listings found" with three distinct server-detected states — **not-listed** (waitlist for the school), **cold-start** (school live, 0 listings → notify + "be the first to sell"), **filtered-to-zero** (clear filters + notify on this filter) — each capturing a lead. |
| **Current state** | `app/page.tsx` L150–156: one branch, "No listings found" + "Try adjusting your filters" / "Be the first to post," CTA → `/new`. No waitlist, no notify, no distinction between "your school isn't here" and "no matches." **At launch nearly every school is empty, so cold-start is the *default* state** — and it currently reads as a bounce. |
| **Persona pain** | B7 (school not listed — no capture, dead end), B8 (cold-start school — no "notify me / be first" path), B4 (urgent buyer, filter-zero — no "notify when a match lists"). Every dead end should become the operator's expansion queue. |
| **Implementation** | **New DB:** `school_requests` table (`email_or_phone`, `school_id` nullable, `freeform_school`, `saved_filter jsonb`, `created_at`). New `NotifyWaitlist` + `EmptyState` components (per `03` §8, §13). Server-side must distinguish cold-start (school exists, count 0) from filtered-to-zero (count>0, filters exclude) *before* the buyer touches filters. Renders inside the C2 hub. |
| **Effort** | **M** |

### C4 · Per-listing + per-hub OpenGraph share cards
| | |
|---|---|
| **Change** | Generate real OG metadata per `/listing/[id]` (item photo + price + school + wordmark) and per `/s/[slug]` (crest + sample collage + live count). This is the literal first screen in a Facebook post. |
| **Current state** | `app/layout.tsx` L8–12: one global static `metadata` for the whole app; no per-route OG. `app/listing/[id]/page.tsx` is a **client component** that fetches on the browser, so a shared link currently previews as generic site chrome — failing the skeptical-parent 3-second sniff test. |
| **Persona pain** | DX1 / DX2 (cold FB/text discovery — the OG card does half the convincing before the tap; without it the link looks like stock-photo spam to a wary NJ parent). |
| **Implementation** | Add `generateMetadata()` (server) to `app/listing/[id]/page.tsx` and `app/s/[slug]/page.tsx` — requires splitting a server wrapper from the current client component (fetch listing/school server-side for the tags). Optionally a dynamic OG image route later; static-from-photo is enough to ship. No new columns (uses existing `photos`, `price`, `school_name`). |
| **Effort** | **M** |

### C5 · "Sell it for me" trust module + worked payout math + payout timing
| | |
|---|---|
| **Change** | Add, *above the intake form*, a "who's coming to my house" trust module (named human / vetting description, branded bag) and payout in plain numbers with a worked example ("a $10 jersey nets you $5") + payout timing ("paid within 3 business days of each sale, not held until everything sells"). |
| **Current state** | `app/sell-for-me/page.tsx`: has a hero, a 3-step strip, and a one-line "keep 50% of the profit." **Missing entirely:** the who's-coming trust module (the persona's #1 blocker), a worked payout example, and payout-timing language. |
| **Persona pain** | C1/C2 (time-poor / unsure owner won't let a stranger to the door on a one-line pitch); this is the single biggest conversion lever on the moat for a *cold, skeptical* launch audience. |
| **Implementation** | Front-end only, `sell-for-me/page.tsx` — static copy + one trust card component above the existing `<form>`. No data changes. High leverage for the effort. |
| **Effort** | **S–M** |

### C6 · Make contact capture mandatory at post time (recovery foundation)
| | |
|---|---|
| **Change** | Make `contact_info` a required field on `/new` (and reframe it as "we'll use this to text you your manage link"), so every listing has a recovery key. |
| **Current state** | `app/new/page.tsx` L107–116 `validate()` never checks contact; L372–374 microcopy literally says "Leave blank to only be reachable through the comments." `buildPayload` writes `contact_info: … || null`. A listing with no contact **cannot be recovered** if the localStorage token is lost. |
| **Persona pain** | S7 (lost link / new device) — recovery (`/recover`, HIGH item H5) is structurally impossible for any listing posted without contact; this cheap change is the prerequisite. |
| **Implementation** | Front-end validation + copy change in `new/page.tsx`; no schema change (column exists, nullable is fine). Trivially cheap, and it's irreversible-enabling for the whole recovery story — do it before H5. |
| **Effort** | **S** |

---

## HIGH

### H1 · Safe-meetup & payment module on listing detail
| | |
|---|---|
| **Change** | Add a collapsed 2–3 line safe-meetup/payment module directly **above** the Contact CTA ("Meet in public, daytime · Pay on pickup, never a deposit · Your number stays private"), expandable to specifics. |
| **Current state** | `app/listing/[id]/page.tsx` L178–193: Contact block has a one-line "payment is cash/Venmo in person" note but **no safety module, no no-deposit scam warning, no privacy promise**, and it sits inside the contact box rather than above the decision. |
| **Persona pain** | K1 (skeptic — fears scams/unsafe meetup) and B6 (first-timer) — a large share of cold FB arrivals; the fear spikes exactly at the Contact step. |
| **Implementation** | Front-end only; `SafeMeetupModule` component (per `03` §4) rendered above the Contact CTA. Full version becomes the `/safety` page (H6). No data. |
| **Effort** | **S** |

### H2 · Contact-channel chooser + preview (stop rendering raw phone as text)
| | |
|---|---|
| **Change** | Route Contact through a chooser/preview (text / email / Venmo equal) that opens the native app prefilled, and **stop printing the seller's raw phone/email as page text.** |
| **Current state** | `app/listing/[id]/page.tsx` L200–223 `ContactAction` prints `listing.contact_info` verbatim as visible text and wraps it in a single deep-link — no preview of what happens, and the number is exposed on the page (contradicts the ideal privacy promise). |
| **Persona pain** | K1 (skeptic — wants email as an equal option so a number never leaves their phone; wants to know what the tap does before doing it), B6 (first-timer needs the "here's what opens, no account" reassurance). |
| **Implementation** | Front-end; `ContactChannelChooser` (per `03` §10) — a preview step + `sms:`/`mailto:`/`venmo` deep links, copyable-handle fallback. Reuses existing `contact_method`/`contact_info`. |
| **Effort** | **S–M** |

### H3 · Sort control + first-class Free / Lots chips
| | |
|---|---|
| **Change** | Add a sort control (Price ↑, Newest, Relevance) and dedicated **Free** and **Lots** quick chips to the filter bar; pin Free items. |
| **Current state** | `app/page.tsx` L27–44: query is hardcoded `order('created_at', { ascending:false })` — **no sort UI at all**; there is no Free or Lots chip (lot is only surfaceable via… nothing; free only via price filter which doesn't exist). |
| **Persona pain** | B3 (hyper price-sensitive — wants price-ascending default + Free/Lots as one tap), B2 (browser wants Lots visible). |
| **Implementation** | Front-end + query change; belongs in the C2 hub filter bar but can also drop onto the current browse grid. `is_lot`/`price` columns already exist. |
| **Effort** | **S–M** |

### H4 · Filters live in the URL + persist across back-navigation
| | |
|---|---|
| **Change** | Move filter/sort state into the URL query string so it's shareable, bookmarkable, and preserved when a buyer taps into a listing and hits back. |
| **Current state** | `app/page.tsx` L14–19: all filters are `useState` only — not in the URL, lost on back-navigation, not shareable. |
| **Persona pain** | B3/B4 (parallel outreach — messages 2–3 sellers, back button must return to the exact filtered state), B5 (one-handed pickup-line flow). |
| **Implementation** | Front-end (`useSearchParams`/`router.replace`); pairs with C2/H3. No data. |
| **Effort** | **M** |

### H5 · `/recover` — account-less magic manage-link recovery
| | |
|---|---|
| **Change** | New `/recover`: enter the phone/email used at post time → neutral anti-enumeration response → magic manage-links delivered, re-hydrating localStorage on click. |
| **Current state** | No `/recover` route. `app/listing/[id]/manage/page.tsx` L147–157 and `app/my-listings/page.tsx` L83–86 both send a lost-link user to `/contact` (a human queue) as the *only* path. |
| **Persona pain** | S7 (lost link / new device — currently a manual email to the operator for every recovery). |
| **Implementation** | New route + **delivery infra** (email and/or SMS send — the one genuinely new dependency; flag for Resend/Twilio). Depends on **C6** (contact must be captured to key recovery). Reuses `contact_info` + `listing_tokens`. |
| **Effort** | **M–L** |

### H6 · Trust pages (`/how-it-works`, `/safety`, `/about`) + fix footer
| | |
|---|---|
| **Change** | Add the three linkable trust pages and populate the footer with them + "Recover a manage link." |
| **Current state** | None of the three routes exist. `app/layout.tsx` L43–50 footer has only a Contact link and a copyright line — no How-it-works, Safety, About, or Recover. |
| **Persona pain** | B6 (first-timer) and K1 (skeptic) proactively look for About/Safety *before* acting; a cold NJ parent vetting an unfamiliar FB link needs a one-click legitimacy check. |
| **Implementation** | Mostly static pages (some content reused from H1's module and C5's pitch) + footer edit. Low complexity, high legitimacy payoff. |
| **Effort** | **M** |

### H7 · Invalid manage token → `/recover` (not `/contact`)
| | |
|---|---|
| **Change** | Point the invalid/lost-token states at `/recover` with a one-line explainer, demoting the contact form to fallback. |
| **Current state** | `app/listing/[id]/manage/page.tsx` L147–157 invalid-token screen CTA is `/contact` only; `my-listings` empty/help copy also points at `/contact`. |
| **Persona pain** | S7 — self-serve recovery instead of a human round-trip. |
| **Implementation** | Front-end link changes; depends on H5 existing. |
| **Effort** | **S** |

### H8 · `/schools` directory
| | |
|---|---|
| **Change** | Add a live-school directory (search + alpha/proximity list with live counts) that doubles as the SEO surface for "[school] uniform resale" and the target of "nearby live schools" fallbacks. |
| **Current state** | No `/schools` route; the only school affordance is the homepage `<select>`. |
| **Persona pain** | B7 (school not listed — needs a "browse nearby live schools" escape and a place to be captured), plus SEO reach for the "expanding to all schools" goal. |
| **Implementation** | New route reusing the C2 type-ahead + school list + `activeListingCount`. Depends on C2 (slugs/hubs). |
| **Effort** | **M** |

### H9 · Visual 6-stage status tracker on `/pickup` + stage-aware cancel copy
| | |
|---|---|
| **Change** | Replace the single status badge with a vertical stage tracker (Received → Scheduled → Picked up → Listed → Sold/Done) and surface cancel-eligibility as ambient text ("cancel free until pickup"). |
| **Current state** | `app/pickup/[id]/page.tsx` L98–125: one status pill + a conditional cancel button. Cancel-eligibility works (from the API) but there's **no stage visual, no "what happens next," no ambient eligibility line.** |
| **Persona pain** | C1/C3 (consignor — the moat customer; wants to *see* where their pile is and know cancel rules without clicking). |
| **Implementation** | Front-end `StatusTracker` (per `03` §7) driven by the existing `status` enum + `created_at`. No new data for the tracker itself (manifest/ledger are separate NICE items). |
| **Effort** | **M** |

### H10 · Camera-first capture on `/sell/new`
| | |
|---|---|
| **Change** | Open the camera (not a file picker) as the first meaningful step, with an example thumbnail + "doesn't need to be perfect." |
| **Current state** | `app/new/page.tsx` L273–295: a form-order photo section using a file input (`accept="image/*" multiple`, no `capture`), placed below item fields, not camera-first. |
| **Persona pain** | S1 (fast one-item seller) and S5 (non-technical parent — the giant-camera-button, low-typing path). |
| **Implementation** | Front-end; add `capture="environment"` and reorder the step. Cheap; a full one-field-per-screen wizard is a larger later effort. |
| **Effort** | **S** |

### H11 · "More from [school]" rail + deep-link brand strip + share on listing detail
| | |
|---|---|
| **Change** | Add a "More from [School]" rail, a compact "what is UniformPass" brand strip for deep-link visitors, a native share/copy-link button, and redirect sold items to similar + hub. |
| **Current state** | `app/listing/[id]/page.tsx`: no rail, no brand strip, no share button; a sold listing shows a banner but there's no "see similar." A missing listing `router.replace('/')` (L31–34) rather than routing to the hub. |
| **Persona pain** | DX2 (deep-link arrival — needs the one-line "what is this" + a path deeper without a homepage detour), B2 (browser — keeps going via the rail). |
| **Implementation** | Front-end; extra query for same-school listings (reuses `school_id`). Pairs with C2 (hub is the redirect target). |
| **Effort** | **M** |

---

## NICE-TO-HAVE

### N1 · Admin "Needs You" feed + Handle Next + age chips + canned replies
| | |
|---|---|
| **Change** | Reorder `/admin` into a single revenue-first "Needs You" feed (new pickups → stalled pipeline → moderation → messages), add a Handle Next button, live age chips, and canned message replies. |
| **Current state** | `app/admin/page.tsx`: three separate tabbed views; pickups already badge "new" (L216–220) and status advances via a `<select>` dropdown (L351–355). Works, but it's a manual scan, not a prioritized feed; no age chips, no canned replies, no push/SMS. |
| **Persona pain** | O1 (operator triaging on her phone). Real, but the operator is a *known* internal user (Dylan / a parent-admin), not the cold launch audience — so it ranks below anything the public touches. |
| **Implementation** | Front-end reorg + a derived-priority sort; push/SMS alerting is separate infra. |
| **Effort** | **M–L** |

### N2 · Manage-page performance panel (views · days listed) + staleness nudge
| | |
|---|---|
| **Change** | Show view count + days-listed and a contextual staleness nudge on the owner console. |
| **Current state** | `app/listing/[id]/manage/page.tsx`: no performance panel; the ideal's "only feedback loop without accounts" is absent. |
| **Persona pain** | S4 (optimizer), S6 (manager). |
| **Implementation** | **New DB:** a `views` counter (increment on detail load) + derive days from `created_at`. Low value at launch (little traffic to measure). |
| **Effort** | **M** |

### N3 · Lot Builder `/sell/lot`
| | |
|---|---|
| **Change** | Structured bulk-lot flow (multi-photo, size/qty/condition rows, live preview) instead of the `is_lot` checkbox. |
| **Current state** | Lots exist only as a checkbox in `/new` (L221–241) that sets `size:'Multiple sizes'` and pushes detail into free-text comments — degraded, not structured. |
| **Persona pain** | S2 (big-lot seller). **But** the consignment moat is the intended answer for "a pile" — self-serve lot building partly *competes* with the moat, so defer until self-serve supply is proven worth the build. |
| **Implementation** | New route + repeatable-row UI; possibly a lot-items sub-table. |
| **Effort** | **L** |

### N4 · Donor flow `/sell/free` with "Claim" mechanic
| | |
|---|---|
| **Change** | Price-locked-to-Free flow with a "Claim" reservation window replacing Contact/offer UI. |
| **Current state** | Free is only `price:0` in `/new`; no Claim mechanic, no reservation. |
| **Persona pain** | D1 (donor). Lower frequency at launch. |
| **Implementation** | New route/mode + a claim/reservation field on the listing. |
| **Effort** | **M** |

### N5 · `/sell` landing with Decision Aid
| | |
|---|---|
| **Change** | A sell landing that routes single/lot/concierge/free with an honest tradeoff table. |
| **Current state** | No `/sell`; the header "+ Sell" goes straight to `/new`. The fork can currently live on the homepage instead. |
| **Persona pain** | S2/S5 (choosing a path). Deferrable — the homepage fork + always-visible "Sell it for me" covers most of it. |
| **Implementation** | New static-ish route. |
| **Effort** | **M** |

### N6 · Inline pricing guidance from comps
| | |
|---|---|
| **Change** | Show "similar sold for $X–$Y based on N sales" beside price/photo steps. |
| **Current state** | `/new` price field is a bare number input (L301–307), no guidance. |
| **Persona pain** | S4 (top-dollar optimizer). **Honest blocker:** needs sales-history density that won't exist at launch; a range built on n<5 is misleading. Build once there's data. |
| **Implementation** | Aggregate query over sold listings; **needs data volume, not just code.** |
| **Effort** | **M** |

### N7 · sell-for-me range-picker chips + photo-a-pile upload
| | |
|---|---|
| **Change** | Replace the numeric "how many items" field with range chips (A few / A bag / Several bags / A closet) and add an optional one-photo-a-pile upload; accept `?school_id=` prefill from empty hubs. |
| **Current state** | `app/sell-for-me/page.tsx` L147–151 uses a numeric `est_items` count field; no photo upload; no `school_id` prefill param. |
| **Persona pain** | C2 (unsure-what-they-have — a count field is exactly the friction they can't answer). |
| **Implementation** | Front-end chips + Supabase storage upload (pattern already exists in `/new`). Pairs with C3 (empty hub → prefill). |
| **Effort** | **S–M** |

### N8 · Manifest recap + payout ledger on `/pickup`
| | |
|---|---|
| **Change** | Show a "here's what we found" manifest once received and an itemized payout ledger once selling. |
| **Current state** | `/pickup` shows only the seller's own `item_summary`; no operator-entered manifest, no per-item payout. |
| **Persona pain** | C1/C2 (closing the uncertainty loop + watching money materialize). |
| **Implementation** | **New DB:** manifest/payout line-item table + operator entry UI in admin. Meaningful backend. |
| **Effort** | **M** |

### N9 · PWA / add-to-home-screen + saved-school landing
| | |
|---|---|
| **Change** | Installable PWA that reopens to the saved school + saved filters (0-tap return). |
| **Current state** | No manifest/service worker; no saved-school persistence beyond ad-hoc localStorage. |
| **Persona pain** | B5 (returning one-handed pickup-line buyer). Lower priority pre-retention. |
| **Implementation** | Manifest + SW + localStorage school memory. |
| **Effort** | **M** |

### N10 · Verified-badge inline explainer
| | |
|---|---|
| **Change** | First-sight tap/tooltip explainer on the Verified badge ("a volunteer physically inspected this before listing"). |
| **Current state** | `listing/[id]` L118–122 and the card render the badge with no explainer of what it means. |
| **Persona pain** | K1/B6 (trust) — the moat's core signal is currently unexplained. |
| **Implementation** | Front-end tooltip component. |
| **Effort** | **S** |

---

## Top 5 to do first

1. **C1 — Unhide mobile nav (S).** Five-minute class removal that fixes the single worst IA defect for the exact device the launch audience uses; nothing else matters if cold-mobile visitors can't see Browse or the moat.
2. **C2 — School type-ahead + `/s/[slug]` hubs (L).** The spine of the whole IA; 9 of 13 journeys assume a school-scoped landing. **Ship as one unit** — the type-ahead needs `slug`/`aliases` and the hubs are its only destination; splitting them ships two half-features.
3. **C3 — Empty-state + notify/waitlist (M).** At launch nearly every school is empty, so cold-start is the *default* screen; this converts the default bounce into captured demand + the operator's expansion queue. **Renders inside the C2 hub**, so sequence it right after (the `school_requests` table + waitlist component can be built in parallel with C2).
4. **C4 — Per-listing OG share cards (M).** The actual first screen for cold Facebook traffic; independent of C2/C3, so build it in parallel — it's what makes the shared link survive a skeptical parent's 3-second glance.
5. **C5 — sell-for-me trust module + payout math (S–M).** Front-end-only copy/card work that directly lifts the moat's conversion for a cold, skeptical audience; the highest-value non-structural change and it unblocks nothing, so it can slot in anytime.

**Dependency notes:** C6 (make contact mandatory, S) should land before H5 (`/recover`) since recovery is keyed on captured contact. H3/H4 (sort, URL filters) fold naturally into the C2 hub build. H8 (`/schools`) and H11 (same-school rail / sold-redirect) depend on C2's slugs/hubs existing.

---

## Explicitly deferred — do NOT build yet

- **Full accounts / login / passwords** — violates the fixed model; no persona asked for it, and the manage-token + `/recover` path already delivers ownership without the friction, support burden, or churn of accounts.
- **In-app messaging / chat** — the model is off-platform contact (SMS/email/Venmo). Building a message system adds moderation, notification, and liability surface for zero added value over the native deep-link.
- **In-app payments / checkout / escrow** — explicitly off-platform cash/Venmo in person. Money movement triggers KYC/regulatory/fraud cost and breaks the "we never touch your money" trust line that the audience is being sold.
- **Self-serve Lot Builder (N3) at launch** — the consignment moat is the intended answer for "a pile"; a polished self-serve lot flow partly competes with the revenue offering. Defer until self-serve supply is proven.
- **Inline comps pricing (N6)** — needs sales-history density that doesn't exist at launch; a range built on n<5 misleads sellers. Revisit once volume exists.
- **Ratings / reviews / seller profiles** — implies persistent identity/accounts and invites the "is this seller legit" rabbit hole; the "[School] parent" + Verified framing covers trust at this stage.
- **Native mobile app / app-store presence** — a PWA (N9) covers the returning-user case; no persona needs an install.
- **Shipping / fulfillment / logistics** — the model is local meetup only; any shipping feature contradicts the core promise ("no shipping").
