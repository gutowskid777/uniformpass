STATUS: complete

# First-Touch Lens — UniformPass UX Pass, 2026-07-15
Scope: the 5-second test on `/`, the OG card, the flyer, `/sell-for-me`. Verified live at
https://uniformpass.shop with Chrome (desktop + true mobile-width screenshots) and by reading
the actual source.

## Top 3

1. **The hero search box — the one thing the page tells you to do — fails completely silently
   for any school it doesn't recognize.** Type a real school name it doesn't have an alias for
   and nothing happens: no dropdown, no "not listed," no suggestion to try the working filter
   below. Verified live (typed "Ridgewood," a real NJ town/school, got nothing). This is the
   single interactive element the hero prompts you to use, and it can dead-end a first-time
   visitor with zero acknowledgment.
2. **`/flyer` opens with an instruction to forward the page before the visitor has seen what
   "this" is.** The first thing on screen is "Forward to anyone you know who's looking to buy
   or sell uniforms" plus Save/Print/Share buttons — the actual pitch (the flyer image itself)
   only appears after that, requiring a scroll on mobile. Verified live at mobile width.
3. **The homepage headline never mentions selling for cash — but that's the exact promise on
   both channels that lead here.** The flyer and the OG card both open with "Turn uniforms into
   cash" and lead with Auto Sell. The homepage headline is "Stop buying uniforms new," a
   pure-buyer pitch with no cash/sell language at all. Anyone who scans the QR code or clicks a
   shared link because of the cash hook lands on a page that doesn't echo it.

---

## CRITICAL

### 1. Hero school search: zero results = zero feedback, on the page's only prompted action
**File:** `components/BrowseExperience.tsx:200-226` (input + conditional dropdown),
`lib/schoolSearch.ts:41-53` (matcher)

**Current behavior:** The hero's only field is captioned `Find your school... try "SJR" or
"Bosco"` (`BrowseExperience.tsx:207`). `searchSchools()` filters the 44-school list by
name/acronym/alias and returns `[]` on no match. The dropdown only renders when
`results.length > 0` (`:211`), so on zero matches literally nothing changes on screen — no
empty state, no "we don't have your school yet," no pointer to the always-reliable "All
Schools" `<select>` two sections below. Confirmed live: typing "Ridgewood" into
uniformpass.shop's hero box produces no dropdown, no message, cursor just sits in the box with
the typed text (screenshot taken at 1524×806 and 468×644).

**Why it's wrong:** This is the one action the page explicitly instructs a brand-new visitor to
take (it's the biggest, first-focused, only-white element on a dark hero, with example text
telling you to type). A blank non-response reads as "broken" or "my school isn't here, this
isn't for me" — not "try the dropdown instead." For any parent whose school isn't one of the
seeded 44 (most of the country, and plenty of NJ schools too), the 5-second test fails at the
very first interaction, with no signal of why.

**Correct behavior:** On zero matches, show an inline state under the input — e.g. "No match
for '{query}' yet — [browse all schools] or [tell us your school]" — reusing the same
notify/waitlist pattern already built for the empty results grid
(`BrowseExperience.tsx:264-334`, the `EmptyState` component). At minimum, point to the working
`<select>` filter that already has full, reliable coverage.

**Why (mental model):** A search box that goes quiet on failure doesn't read as "no results" to
a first-time user — it reads as "nothing happened, did I do it right?" Every other empty state
in this same codebase (browse grid, filtered-to-zero) already converts to a captured lead; the
hero search — the highest-traffic, first-touch instance of "type your school" — is the one
place that pattern was skipped.

---

### 2. `/flyer` leads with "forward this," not with the pitch
**File:** `app/flyer/page.tsx:16-40`

**Current behavior:** Page order, top to bottom: (1) "Forward to anyone you know who's looking
to buy or sell uniforms." (`:18-20`), (2) Save image / Print / Share buttons (`:22-32`), (3) the
actual flyer artwork — the only place the value prop, the two doors, and the URL live
(`:34-40`). Verified live at mobile width: the instruction + 3 buttons fill the entire first
screen; the flyer image (with "Turn uniforms into cash," Auto Sell, Buy and sell) doesn't start
until below that.

**Why it's wrong:** `robots: { index: false }` (`:8`) and the app's own share flow
(`lib/shareMessages.ts:9,11,19` — every paste-ready message links to `/` or `/sell-for-me`, not
`/flyer`) confirm this page is meant as an operator tool for grabbing the artwork, not the
thing a stranger clicks. But it's still a live, un-gated URL reachable from the footer
("share the flyer," `app/layout.tsx:65`) and easy to paste directly instead of the image. Anyone
who lands here cold sees an instruction addressed to a distributor ("forward this") before
they've been shown what "this" is. It presumes context the visitor doesn't have yet.

**Correct behavior:** Lead with the flyer artwork (the actual pitch), and either move the
"forward to anyone..." line below it or reword it for a first-time reader (e.g. drop it
entirely from the visible page and keep it as alt text / a caption under the actions, since the
buttons' purpose is already self-evident from their labels).

**Why (mental model):** First-touch copy has to work for the least-informed reader who could
plausibly land there, not just the audience it was written for (Dylan's mom, priming her to
spread it). An instruction to "forward" before showing the thing being forwarded breaks the
5-second test's basic requirement: understand what this is before being asked to act on it.

---

## HIGH

### 3. Homepage hero doesn't say the thing that got people here
**File:** `components/BrowseExperience.tsx:193-198` (hero copy) vs.
`app/api/flyer-image/route.tsx:110-115` and `app/api/og/route.tsx:82-84` (what leads here)

**Current behavior:** The flyer's headline is "Turn uniforms into cash." with Auto Sell as the
first, highlighted door ("We pick up your pile. You get cash."). The generic OG card (what
renders when the bare site link is pasted anywhere — `app/api/og/route.tsx:82-84`) says the
identical thing. The homepage hero these both point to says only: "Stop buying uniforms new." /
"Buy and sell used uniforms with families at your school." — no mention of cash, selling, or
pickup anywhere in the H1 or subhead (`BrowseExperience.tsx:193-198`). The Auto Sell band with
matching cash language is one scroll-section down (`:98`, `ConsignmentBand` at `:238-260`) —
present on the same screen at common mobile heights (confirmed live), but not part of the
headline moment.

**Why it's wrong:** Message match is the core of a 5-second test for anyone arriving from an ad,
flyer, or shared link: the landing page's first words should echo the words that got the click.
Right now a seller-intent parent who scanned the QR code or clicked a pasted link because of
"turn uniforms into cash" lands on a headline about buying — a beat of "did I land on the wrong
page?" before they scroll down and find the promise they were sold. This is live right now,
while the operator is actively handing out that exact flyer.

**Correct behavior:** Either rotate/pair the hero headline to acknowledge both intents in one
line (e.g. a strapline under the H1: "Sell your outgrown pile for cash, or shop your school's
uniforms used"), or make the Auto Sell band visually continuous with the hero (same gradient
band, no visual break) so the cash promise reads as part of the same first screen, not a
separate section below it.

**Why (mental model):** A visitor's confidence that they're in the right place comes from
recognizing their own words reflected back at them in the first two seconds. Splitting "why I
clicked" (cash) from "what I'm shown" (buying) into two different visual bands adds a
comprehension tax exactly at the moment first-touch trust is being built.

---

### 4. "Auto Sell" and "Sell" sit next to each other with no differentiating language
**File:** `components/BottomNav.tsx:6-11`, `app/layout.tsx:43-55`

**Current behavior:** The mobile bottom nav (the primary nav for the launch audience, per
`context.md`'s 2026-07-13 mobile-nav fix) reads, left to right: Browse 🔍 / **Auto Sell** 🚗 /
**Sell** ➕ / My Listings 📋 (`BottomNav.tsx:6-11`). The desktop header repeats the same pair:
"Auto Sell" then, separately, a blue "+ Sell" button (`app/layout.tsx:43-55`). Verified live —
both screenshots confirm the two labels sit adjacent with only single-word icons, no subtext,
distinguishing them.

**Why it's wrong:** "Auto Sell" (→ concierge pickup, `/sell-for-me`) and "Sell" (→ list an item
yourself, `/new`) are two structurally different actions — one you do nothing for, one you fill
out a full listing form for — but the labels differ by one word, with no other cue in the nav
itself. A first-time user deciding "I have a pile to get rid of, which do I tap?" has to already
know what "Auto Sell" means before the label disambiguates anything; the nav is the first place
many mobile users will see these terms, with no explainer attached (that only exists once you're
already on `/sell-for-me` or the homepage's Auto Sell band).

**Correct behavior:** Differentiate the labels themselves, not just the icons — e.g. "We Sell It"
vs. "List an Item," or "Auto Sell" vs. "Sell It Myself" — so the nav is legible on its own
without requiring the visitor to have already read the homepage copy.

**Why (mental model):** Icons alone don't carry meaning for a first-time user (a car 🚗 doesn't
obviously mean "we drive to your house," a plus ➕ doesn't obviously mean "list it yourself");
the label is doing all the work, and two near-identical labels next to each other force a guess
at the exact decision point ("what do I do next") that this lens is testing.

---

## NICE-TO-HAVE

### 5. The "Verified" ring on cards is a second, unlabeled signal next to the labeled badge
**File:** `components/BrowseExperience.tsx:352-354` (card ring) vs.
`components/VerifiedBadge.tsx:6-15` (labeled badge)

**Current behavior:** A verified listing gets two separate visual treatments: a small
"✓ Verified" chip in the card's bottom-right corner (labeled, has a hover explainer) AND a
`ring-2 ring-indigo-500/70` border around the entire card (`:352-354`) — unlabeled, no tooltip,
no legend anywhere on the page tying "cards with a colored outline" to "verified."

**Why it's wrong:** On a first scan of the grid, a highlighted border with no attached text most
commonly reads as "featured/promoted" or is invisible noise, not "operator quality-checked this
one." The one piece of text that would explain it (the badge chip) is small and easy to miss at
grid-card size on a phone, so the ring is effectively doing unlabeled double duty.

**Correct behavior:** Either drop the ring and let the labeled badge alone carry the signal, or
keep the ring but only if the badge itself is guaranteed visible at grid density (not
competing with condition/lot tags in the same corner cluster).

**Why (mental model):** Every visual signal on a first-scan grid needs to be
self-explanatory or paired with text the first time a new user sees it; a second, silent
signal duplicating a labeled one adds visual complexity without adding comprehension.
