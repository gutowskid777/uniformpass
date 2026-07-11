# UniformPass — Fable 5 CREATIVE DESIGN Brief
# STATUS: ACTIVE — build target for a Fable 5 session, 2026-07-12.
# PAIRS WITH: uniformpass-conversion-fable-brief-2026-07-11.md (the STRATEGY: 4 levers).
# THIS FILE = the DESIGN LAYER that strategy brief leaves open: concrete layout, interaction,
# copy, the per-school share asset, the arrival moment, one bonus delight. Build ON the live app.

## The one job (design version)
A parent taps a link Dylan texted or dropped in a school group. In 3 seconds, on a phone, cold,
they must feel: **real. local. MY school. safe. easy.** Then get pulled into ONE tap. Every screen
below is engineered for that first-3-seconds-on-a-390px-phone moment. We are not redesigning a
marketplace... we are designing the conversion of a warm link click.

---

## LOCKED — do not re-open (design + product)
- No shipping, no in-app payments. Buyers contact sellers off-platform, meet up, cash/Venmo.
- Moat = concierge consignment (`/sell-for-me`, keep 50%, zero effort). Never demote it.
- Posting stays OPEN. Browsing + sharing require NO sign-in. Do NOT add a browse/share gate.
- Don't touch deploy / DNS / env. Don't touch the parallel accounts build (see "Hands off" below).
- BIG text / numbers / visuals over walls of small copy. Concise, human copy. No AI slop, no persona/slang.
- Diverge BOLDLY. Token tweaks read as "nothing changed." Make visible, layout-level moves.
- Readability floor: min sizes (see scale), no overlapping text, nothing hidden in corners, ONE brand mark.
- Punctuation in all user-facing copy: use "..." or a period. NEVER an em-dash. (Applies to every quoted string below.)
- Mobile-first. Design the 390px phone first; desktop is the widen-up. QA at 390px before shipping.

---

## 0. DESIGN SYSTEM UPGRADE (the foundation — build this first, all 4 levers ride on it)

Today the app is "generic SaaS indigo": one indigo→violet gradient, everything indigo, a browse-everything
grid. It reads like a startup, not a local NJ school thing. The bold move for THIS audience (families of
3 all-boys Catholic prep schools with fierce school pride) is to **make the SCHOOL the hero.** School color,
school monogram, school name in huge type. Identity, not a filter.

### 0.1 Per-school theming (the core new primitive)
Add a hardcoded front-end `SCHOOL_THEME` map keyed by a short code, for the 3 beachhead schools only
(no DB migration needed this week). Each theme = `{ primary, accent (gold), ink, wash, monogram, shortName, town }`.
When a link arrives scoped to a school, the hero, OG card, and grow-in accents re-dress to that theme.

- **St. Joseph Regional** (Montvale) — code `sjr`, monogram **"SJR"**, Green Knights → deep green + gold.
- **Don Bosco Prep** (Ramsey) — code `dbp`, monogram **"DBP"**, Ironmen → dark green + white/silver.
- **Bergen Catholic** (Oradell) — code `bc`, monogram **"BC"**, Crusaders → maroon/crimson + gold.
- **DECISION FOR DYLAN (flag it):** exact hexes are load-bearing and I'm not certain of them. Ship with
  placeholders and let Dylan confirm. **Real risk:** SJR and Don Bosco are BOTH green... differentiate hard
  via shade + gold-vs-silver accent + the monogram, or the two beachhead links will feel identical.

### 0.2 The Monogram Patch (the per-school identity unit)
A designed rounded-2xl "varsity patch": 2–3 school initials, weight 900, on the school's color, with a thin
inner ring. **Do NOT use the schools' real crests/logos** — trademark risk + we don't have the assets. The
monogram is ownable, legit, and reads as school pride instantly. Sizes: 72px in hero, 40px in nav/cards, 180px in OG.

### 0.3 Type scale (push it — big is the brand)
- Hero display: 34–44px mobile / up to 64px desktop, weight 800–900, tight tracking, max 2 lines.
- Big proof numbers ($80, 50%, live counts, "You save $65"): 40–72px, weight 900. These are the visuals.
- Section header: 24–28px/800. Body: 16–17px. Micro-label (uppercase eyebrow only): 11–12px.
- Floor: nothing meaningful below 13px. No text over a busy image without a scrim.

### 0.4 Motion
Subtle only. Scoped arrival = one <300ms color-wash settle so it feels "tuned to you," not templated.
Respect `prefers-reduced-motion` (no motion path must never hide content).

---

## LEVER 1 — LINK → ARRIVAL (highest leverage: the hero)

**Problem today:** the shared link lands on a generic hero ("Skip the $80 uniform / Buy and sell uniforms
in your school community") over a global grid of every school's stuff. Nothing says MINE. Fails the sniff test.

**Bold move: a school-aware hero that re-dresses to the arriving school and pre-scopes the grid below it.**
The link Dylan shares carries the school (cheapest path: `/?school=sjr`; bolder path if time: `/s/sjr`).
On arrival everything above the fold answers real/local/mine/safe/easy with zero scroll.

### Scoped hero — 390px layout, top → bottom
1. **Full-bleed school color band.** Monogram patch (72px) top-left, school name + town beside it ("St. Joseph
   Regional · Montvale, NJ"). This alone = MINE + LOCAL in one glance.
2. **Giant headline**, 2 lines max: **"The St. Joseph Regional uniform exchange."** (weight 900). Supporting
   line under it: **"Skip the $80 uniform. Buy and sell with SJR families near you."**
3. **Live proof number, huge, in the gold accent:** **"18 SJR uniforms listed right now."** Big number = real
   + active. (If low/zero → the cold-start variant in Lever 4, never a dead grid.)
4. **Two stacked full-width thumb buttons, nothing else competing:** primary **"Shop SJR uniforms"**,
   secondary **"Sell your pile, keep 50%"**. 48px+ targets.
5. **Slim trust ribbon**, one row: **"No fees · No shipping · Meet up local · Verified by UniformPass."**
6. **Immediately below: the grid, already filtered to SJR.** First scroll = MY school's inventory, no filter step.

### Unscoped hero (homepage / link with no school)
Don't dump the 44-item `<select>`. Lead with **"Find your school"** as the single hero action: one big search
field (type-ahead: "SJR", "Bosco", "Bergen" all resolve), and the **3 beachhead schools as big tappable monogram
tiles** right below it. Bold, one decision, no wall of options.

**Interaction/delight:** the color-wash settle-in (0.3) on scoped arrival.

**DONE =** given a school link, a first-timer on a 390px phone in 3 seconds and zero scroll sees their school
name + monogram, a real live count, and ONE obvious next tap... and the grid below is already their school's stuff.

---

## LEVER 2 — THE SHAREABLE ASSET (the distribution engine)

Two artifacts: the **link preview** (what shows when Dylan pastes the URL) and the **in-app share action +
copy-paste message** (what Dylan actually sends). Both must look like a real local thing, not spam.

### 2A. Per-school OG / link-preview card (1200×630, via `next/og`, keyed to school code)
Today: one static generic indigo gradient card for the whole app. Bold replacement, per school:
- Background = the SCHOOL'S color wash (not generic indigo). Big **monogram patch** (180px).
- Headline huge: **"St. Joseph Regional · Uniform Exchange."**
- Hook line: **"Skip the $80 uniform. Buy and sell with SJR families near you."**
- Proof chip: **"Verified by UniformPass · Montvale, NJ"** (+ the live count if the edge route can fetch it).
- UniformPass wordmark small, one corner. ONE brand mark, never doubled.
- A wary NJ parent sees THEIR school's name + colors in the preview = legit, before they even tap.

**Also design the per-LISTING OG** (item photo left, big price + school + wordmark right) so sharing a specific
deal previews the actual jersey and "$15 · SJR". Structural note: `/listing/[id]` is a client component, so this
needs a server metadata wrapper split... FLAG as the one structural touch. If time-boxed, the per-school hero
OG alone already wins the week; do listing OG only if the split is clean.

### 2B. In-app "Share to my school" + the paste-ready message
- Prominent **Share** button on the school hero and on listing detail. Tap → native share sheet
  (`navigator.share`) prefilled with the message + scoped link; fallback = **"Copy message + link"** button.
- **THE DELIGHT (Lever 2's bonus): a share-preview.** When Dylan hits Share, show him the actual OG card he is
  about to post. Seeing the legit preview = confidence to post = more posts. This is the growth flywheel's spark.
- **Paste-ready messages** (Dylan drops these in a WhatsApp/FB parent group... human, first-person, no slop, no
  em-dashes). Ship a BUY and a SELL variant per school. SJR examples:
  - BUY: `SJR families... found this instead of paying full price for uniforms. It's a spot to buy and sell used SJR uniforms locally. No fees, no shipping, you just meet up. Worth a look before the next growth spurt. [link]`
  - SELL: `If you've got a pile of outgrown SJR uniforms, this service picks them up, sells them for you, and you keep 50%. Zero effort on your end. Beats the donation bin. [link]`

**DONE =** Dylan can one-tap share a scoped link whose preview shows his school's colors + name + monogram +
hook, and copy a ready-to-paste human message he'd be proud to post. He sees the preview before he posts.

---

## LEVER 3 — /sell-for-me DEAD-SIMPLE (the supply pipe / the moat)

**Today:** hero + 3-step strip + a 7-field form. Missing the "who's coming to my house" trust and the worked
payout math. The numeric "how many items" field is friction a busy parent can't answer one-handed.

**Bold move: lead with the money as a giant visual, prove who's coming, then a form you finish with your thumb.**

### 390px layout, top → bottom
1. **Money hero, huge.** Giant **"50%"** + **"$0 effort"** as the visual. Headline: **"You keep 50%. You do
   nothing."** Worked example in big type: **"A bag of 20 uniforms is about $60 back in your pocket."**
   (Mark the math tunable... it's illustrative, Dylan sets the real numbers.)
2. **3-step strip** (keep the You-gather / We-pick-up / You-keep-50% flow, bigger icons, tighter copy).
3. **The "who's coming to my house" trust card** ABOVE the form (the #1 blocker to letting a stranger to the
   door). A warm human: the operator's name + face, **"A local parent picks it up. Verified by UniformPass."**
   + an NJ-roots line. Load-bearing... make it feel like a person, not a brand block.
4. **Form cut to the bone.** Minimum fields: school (PREFILLED if arriving scoped, via `?school_id=`), town,
   contact, and pile size. Everything else optional/collapsed.
   - **Replace the numeric count with big tappable range chips:** **"A few · A grocery bag · A few bags · A
     closet-full."** One tap, no typing.
   - **Optional "snap a photo of the pile"** — camera-first, **"doesn't need to be neat."** Kills the
     "I don't know what I have" barrier.
5. **One giant primary button: "Get my free pickup."** Under it, one line: **"You're paid within a few days of
   each sale, not when everything sells."**

**Interaction:** the pile-size chips + prefilled school mean a scoped-link consignor can finish in ~3 taps.

**DONE =** a busy parent completes a pickup request one-handed in under 30 seconds, never types a number,
understands "50% and I do nothing," and has seen WHO is coming to their door before they submit.

---

## LEVER 4 — TRUST POLISH (the conversion floor)

A no-account marketplace must LOOK legit fast. Four moves, in priority:

1. **Kill the dead-empty state (highest — at launch most schools are near-empty, so this is the DEFAULT screen a
   shared link shows).** A bare "No listings found 🔍" reads as a dead site. Redesign the school cold-start into
   an ACTIVE, on-brand moment: **"SJR uniforms are just getting started here."** + big **"Be the first to sell"**
   + **"Notify me when SJR uniforms are listed"** (captures email/phone → waitlist / operator's expansion queue).
   Show the consignment offer here too. NEVER a bounce.
2. **Verified-by-UniformPass, explained + elevated.** The moat's signal is currently unexplained. Add a
   first-sight explainer (inline strip or tap): **"Verified means a real person inspected it and listed it."**
   Make Verified items visually distinct in the grid (stronger badge / subtle ring) so legitimacy reads at a glance.
3. **Safe-meetup module ABOVE the Contact CTA** on listing detail (collapsed, 3 lines, where fear spikes):
   **"Meet in public, in daylight. Pay on pickup, never a deposit. Your number stays private."**
4. **Stop printing raw phone numbers as page text.** Route Contact through a chooser (Text / Email / Venmo,
   equal) that opens the native app prefilled; show a masked preview, not the bare number. Privacy = trust.
- Plus a slim persistent trust ribbon (hero + footer): **"No fees · No shipping · No account to browse · Meet up
  local · NJ-based."**

**DONE =** a skeptical cold-link parent, within the first two screens, sees what Verified means, never hits a
dead/empty grid, sees safety + privacy language before contacting, and never sees a raw phone number dumped as text.

---

## BONUS DELIGHT (one headline delight, ship it): the "You save $X" price-slash

Make the core hook ("skip the $80") KINETIC and universal. On every listing card and detail, show the retail
price struck through and the used price big, with a green savings chip:

  ~~$80~~  **$15**   →   green chip **"You save $65"**

- Retail comes from a small per-category constant map (no seller input). Big, emotional, on-brand, and it fires
  at the exact decision moment on every card... directly lifting buy conversion from the shared-link traffic.
- (Lever 2's share-preview is the second delight, folded into that lever. This price-slash is THE headline one.)

---

## Buildable path (order for max conversion THIS week; Fable picks run mechanics)
1. **Design system + `SCHOOL_THEME` + Monogram patch** (0) — everything rides on it.
2. **Lever 1 scoped hero via `/?school=<code>`** — cheapest route to a school-aware arrival, no new route/DB.
   (`/s/[slug]` is the bolder version if there's time... don't block the week on it.)
3. **Lever 2A per-school OG** + **2B share button + paste messages + share-preview** — the distribution engine.
4. **Lever 4 cold-start empty state + Verified explainer** — so an empty school link doesn't read dead.
5. **Lever 3 sell-for-me re-skin** (money hero + who's-coming card + range chips) — the moat's conversion.
6. **Bonus price-slash** + Lever 4 safety module / contact chooser as polish.

## Hands off (parallel accounts build — do NOT clobber)
- The deferred-account modal (`components/InlineAccountStep.tsx`) on `/sell-for-me` and `/new`, the forced-login-
  on-submit flow, `seller_profiles` prefill, and school fuzzy search (`lib/schoolSearch.ts`) are a PARALLEL build.
  Lever 3 only RE-SKINS the pitch + trims visible fields... it must not remove/alter the account step, the
  submit flow, or the profile prefill. FLAG anything that touches them.
- Do not gate browsing or sharing behind sign-in. Do not flip RLS/enforcement. Do not touch `/admin`, deploy, DNS.

## Global QA checklist (run before shipping)
- [ ] 390px: every hero passes real/local/mine/safe/easy in 3 seconds, zero horizontal scroll.
- [ ] No text below 13px (except 11–12px uppercase eyebrows). No overlapping text. No text on image without scrim.
- [ ] Exactly ONE UniformPass brand mark per screen. Monogram ≠ real school crest.
- [ ] Zero em-dashes in any user-facing string. "..." or "." only.
- [ ] Every empty/zero state is a capture moment, never a bare "no results".
- [ ] Scoped link → hero re-dressed to that school + grid pre-filtered to that school.
- [ ] Share button produces a correct scoped link + a preview of the real per-school OG card.
- [ ] `prefers-reduced-motion` honored; no content hidden behind motion.

## Report back (per lever): files touched · the before→after of the conversion moment · the share
## message + OG asset Dylan can post · any open decision needing Dylan's taste (school hexes first).
