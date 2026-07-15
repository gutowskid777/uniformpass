STATUS: complete

# 03 — Shared components

What should exist across pages, and which current components merge or die.
Rule applied throughout: **one job, one place.** Every "duplicate affordance" finding in this run
(clutter #1-3, mobile #2, and the two school pickers) is the same error wearing different clothes.

---

## Components that should exist

### 1. `AccountField` — replaces `InlineAccountStep` (the modal)
**The single highest-value component change in the run.** Both seller personas quit at the modal it replaces.

| | |
|---|---|
| **Used by** | `/new`, `/sell-for-me` |
| **Renders** | Logged-out only. Inline, as the last card of the form, above the submit button. Email input + password (pre-filled with a generated value) + a "Set my own" toggle + "Forgot your password?" → `/reset-password`. |
| **Never** | Pops up. Interrupts. Appears after a button press. |

*Current (why it's wrong):* `components/InlineAccountStep.tsx` is a `fixed inset-0` modal fired by
`if (!user) { setShowAccount(true); return }` at `app/new/page.tsx:201-209` and
`app/sell-for-me/page.tsx:159` — i.e. **after** the user presses Post/Get my free pickup. Maria (`pile-mom`)
quits at the password field (`:76-79`) because she's asked to author a credential for a site she'll never
reopen, at the instant "You do nothing" promised she was finished. Jen (`diy-seller`) quits because a wall
appeared after she pressed Post, and FB's Post button posts.

*Correct:* the account is the last **field** of a form she's already filling. Maria types one field (email) and
submits — no authored credential. Jen taps "Set my own" and controls it, because she's coming back.

*WHY:* the locked model requires an account to post. It never required a **gate**. Deferred signup was built
precisely to remove the gate from the *start* of the form — implementing it as a modal recreated the gate at
the *end*, at the one moment the user's model says "done." Every persona in this run tolerated fields and quit
at gates. Same component, same rule, opposite personas, one screen.

*Mobile carry-over:* the modal it replaces has no `overflow-y-auto` and `autoFocus`es the email field
(`:62-63, 73-74`), so on short phones the keyboard can bury the submit button with no way to scroll to it —
stranding a completed form. An inline field inherits the page's scroll and the bug dies with the modal.

---

### 2. `EmptyState` — one component, **three** states
Four agents landed here independently (gaps #2, group-text D3, bargain-dad #4, first-touch #1). For a
launch-day marketplace with almost no inventory, **the empty state is the product** — most first visits end here.

*Current (why it's wrong):* two states do the job of three, and the best CTA is unreachable.
`activeFilters` (`BrowseExperience.tsx:77`) counts `schoolId` as just another filter, so picking a school via
the hero — the product's *primary intended flow* (`pick()`, `:184-188`) — always makes `hasFilters` true.
Therefore `"Or be the first to sell →"` (`:328-331`), gated on `!hasFilters`, **can never render once a school
is selected.** At the exact moment a newcomer picks her school and finds it empty, the product hides its best
next step and offers "Or clear the filters" — which, with only a school selected, does nothing useful.

| State | Trigger | Headline | Primary CTA | Secondary |
|---|---|---|---|---|
| **A · School not in our list** | hero query, `searchSchools()` returns `[]` | "No match for '{query}' yet." | Notify me when it's added | Browse all schools |
| **B · Cold-start school** | `schoolId` set, 0 listings, **no other filters** | "No one's listed from {School} yet." | **Auto Sell — get a free pickup** | Be the first to sell · Notify me |
| **C · Filtered to zero** | `schoolId` + ≥1 other filter, 0 results | "No matches for these filters at {School}." | **Clear filters** (school stays) | — |

*WHY:* three different intents need three different next actions. "My school isn't here" wants a promise it'll
be added. "My school is empty" wants to be told she can be first — **or better, that Auto Sell works for her
today with zero dependency on anyone else already using the app.** "I over-filtered" wants a smaller haystack.
Serving the wrong CTA wastes the highest-intent visitor the product will ever get: a parent who just typed her
exact school name.

**State A does not exist at all today.** `:211` gates the dropdown on `results.length > 0`, so a zero-match
query renders *nothing* — no message, no capture, no pointer to the working `<select>` below. Verified live:
typing "Ridgewood" produces silence. This is the worst dead end in the product because it captures **no lead**,
and it's on the one action the hero explicitly instructs a first-time visitor to take. A search box that goes
quiet on failure doesn't read as "no results" — it reads as "did I do it wrong?" or "my school isn't welcome
here."

**Why Auto Sell is state B's primary CTA:** it's the one thing that works on an empty marketplace. Dana
(`group-text`) types her Park Ridge school — added the day before this audit with zero inventory — and gets
"Nothing here yet" plus a request for her email. She will not forward a ghost town to 30 people; the social
cost of "the thing I sent everyone was empty" outweighs the goodwill. Auto Sell converts that same dead grid
into a live offer.

**And fix the promise the copy makes.** *Current:* "You're on the list." (`:296-298`) is backed by
`/api/contact`, which inserts a row and best-effort emails the operator. **No code path fires when a matching
listing is later posted.** *Correct:* either build match-and-notify, or say what's true — "We'll keep an eye
out and text you" — and collect a phone number. *WHY:* Rob has a hard 3-week deadline. The gap between "the app
implies this is handled" and "it's actually a manual maybe" is the difference between him trusting the wait and
opening Facebook Marketplace as backup — which is the exact behavior this product exists to intercept.

---

### 3. `TrustLine` — the operator, named, in two places
**Renders:** global footer + `/sell-for-me` beside the pickup steps.
**Content:** "Run by [Name], a [town] parent — [contact]."

*Current (why it's wrong):* the footer (`layout.tsx:61-71`) is the only persistent trust surface in the product
and it ends on "© 2026 UniformPass. All rights reserved." **That line is Sue's quit point** — she scans for a
human, finds a copyright notice, and leaves before ever reaching the flyer, the share message, or the real OG
preview, all of which are good and all of which she never sees.

*WHY:* she isn't vetting features, she's vetting whether this could embarrass her in front of 400 families.
"All rights reserved" is the exact pattern she's trained to filter out from years of moderating a group full of
scraper apps. **This is the PARKED "About the founder" item** (`context.md:19`) — and a *page* genuinely is hard
(bio, photo, story). A sentence isn't a page. Answer her where she asked: at the footer.

Second instance, `/sell-for-me`: the riskiest ask in the product ("leave it by your door") is made by an unnamed
"we," while the *safer* public meetup gets a whole safety module. See `SafetyNote` below.

---

### 4. `SafetyNote` — generalize the block that already exists
`app/listing/[id]/page.tsx:190-196` ("Meeting up, the safe way") is well-built and correctly placed — right
where the fear spikes. **Extract it and give Auto Sell its own variant** ("Who's coming: [Name]. Text her
anytime to change the time. Nothing is taken until you say so.").
*WHY:* trust must scale with the size of the ask. Today the product reassures people exactly where they already
feel safe (a public parking lot) and leaves them alone exactly where they'd naturally hesitate (a stranger at
their house). That's trust built backwards.

---

### 5. `ContactChooser` — extract from the listing page, add to `/seller/[id]`
`ContactAction` (`listing/[id]/page.tsx:201`) already renders the masked tel/mailto/venmo chooser well. Two gaps:
- **`/seller/[id]` has no contact affordance at all** — a buyer who wants to ask "anything else in a 14?" must
  open an arbitrary listing and use that item's block, even though the intent that brought her there was about
  the *seller*, not one item.
- **It logs nothing.** A contact-reveal tap should increment a count (count only, no message content — this
  stays inside the locked model) so Kate's "did anyone reach out?" becomes answerable at all. Today no code
  path could ever answer it.

---

### 6. `SharePanel` — keep, wire the `theme` it was built for, and surface it
The component is right. Its `theme` prop is dead everywhere.

- **Every call site passes `theme={null}`** (`app/flyer/page.tsx:31`, `app/listing/[id]/page.tsx:76`), so
  `buyMessage`/`sellMessage` (`lib/shareMessages.ts:6-20`) can only emit generic "school" copy pointing at the
  bare homepage. And `scopedUrl()` (`lib/schoolTheme.ts:102-108`) resolves to `/s/{code}` — **deleted on
  2026-07-11**. So the branch is dead today and 404s the day anyone wires it up. **Repoint at
  `/?school={dbId}`** — that ships Sue's scoped link and defuses the landmine in one edit.
- **The real-OG-preview block (`:106-116`) is the best thing in the product for Sue** — "the exact preview the
  group will see." The `theme={null}` bug means she only ever sees the generic indigo card, never hers. Fixing
  `theme` is what lets the one component designed around her verification instinct actually verify anything.
- **Surface it in the homepage hero** (a small tertiary button beside the finder), not only in the footer.
  *WHY:* Dana lands on `/` and the impulse to reforward peaks in the first "oh, that's clever" second — before
  she's scrolled past strangers' used clothes. A footer link assumes she read the whole page; a
  curious-not-shopping visitor won't. **Do not add a 5th nav tab** — a hero button is visible in the first fold,
  which is strictly better than a tab she'd have to interpret, and the nav stays at four.

*Explicit keep:* the native-share + copy-message pair (`:144-155`) is not a duplicate — native only renders when
`navigator.share` exists (`:144`). Progressive fallback. Leave it.

---

### 7. `SchoolChip` — replaces the filter-bar school `<select>`
One dismissible chip beside the `Fresh from {schoolName}` heading (`BrowseExperience.tsx:100-102`).

*Current (why it's wrong):* the hero finder (`:200-226`) and the filter-bar `<select>` (`:117-120`) are two
independent, permanently-visible widgets writing the identical `schoolId` state. A parent who typed "Bosco"
scrolls down and meets a second, dumber picker already pointed at her answer — is that a second filter, or an
echo? There's no way to tell without testing it. *WHY:* a filter dimension gets exactly one input. Two force
the user to reconcile them mentally ("did clearing this also clear my search?") and waste filter-bar space
re-asking a question the hero already answered — on the page every QR scan and every cold visitor lands on
first.

**This chip is also Rob's "exit."** It's the labeled way out of a scoped view — per the brief's gold standard,
a labeled "✕ all schools" chip reads as *navigate up*; a bare corner ✕ reads as *dismiss*.

---

### 8. `VerifiedBadge` — the explanation must not live in a `title` attribute
*Current (why it's wrong):* the badge's entire meaning sits in `title="..."` (`VerifiedBadge.tsx:9`).
`title` fires on `:hover`. **Hover does not exist on touch.** The bottom nav was added *specifically* because
the launch audience is on phones (`context.md:109`) — and that same audience sees "✓ Verified" with no way,
ever, to learn what it verifies.

*Correct:* put a compact explainer inline next to the badge on the detail page ("✓ Verified — we picked it up
and checked it ourselves"), so **no interaction is required at all.**

*WHY:* a trust badge whose meaning requires an interaction pattern that doesn't exist on your users' device
isn't a degraded signal — it's a decorative checkmark. Its whole job is separating operator inventory from a
stranger's listing; if the differentiating text is unreachable, it says only "some listings have a checkmark,"
which reads arbitrary rather than trustworthy.

**Also drop the card ring** (`BrowseExperience.tsx:352-354`): `ring-2 ring-indigo-500/70` is a second,
*unlabeled* signal duplicating a labeled one, with no legend anywhere. On a first scan a highlighted border
reads as "featured/promoted," not "quality-checked." One signal, labeled. (first-touch #5)

---

## Current components: verdicts

| Component | Verdict | Why |
|---|---|---|
| `InlineAccountStep` | **KILL** → `AccountField` | It's a modal. Both seller personas quit here. See #1. |
| `SharePanel` | **KEEP** + wire `theme` + surface in hero | Right component, dead prop, buried entry point. |
| `VerifiedBadge` | **KEEP** + kill the `title` + kill the ring | Meaning is unreachable on 100% of the audience's devices. |
| `BrowseExperience` `EmptyState` | **KEEP** + split into 3 states | It's the product on launch day. See #2. |
| `BrowseExperience` filter-bar school `<select>` | **CUT** → `SchoolChip` | Second widget, same state. |
| `BrowseExperience` `ConsignmentBand` | **MERGE** → the two-door module | Auto Sell gets a banner; DIY gets a nav pill. Jen converts on DIY. |
| `BottomNav` | **KEEP** as 4 tabs | Don't add Share. But relabel — see below. |
| `+ Sell` header pill (`layout.tsx:50-55`) | **CUT on mobile** | Its two siblings are `hidden sm:inline-flex`; it isn't. Found by two agents. |
| `SchoolPicker` | **KEEP** | Used by the forms; distinct job from the browse finder (pick vs. filter). |
| `MonogramPatch` | **KILL** | Orphan from the archived per-school sections. Dead weight. |
| `STATUS_LABEL` (duplicated verbatim in `my-listings:10-18` + `pickup/[id]:9-17`) | **MERGE** → one export | Dies with `/pickup/[id]`. See 01. |
| `AuthProvider` / `AuthNav` / `PrintButton` | **KEEP** | Doing their jobs. |

---

## Two chrome fixes that touch every page

**1. Relabel the nav — "Auto Sell" and "Sell" differ by one word.**
*Current:* `BottomNav.tsx:6-11` reads Browse 🔍 / **Auto Sell** 🚗 / **Sell** ➕ / My Listings 📋, and the
desktop header repeats the pair (`layout.tsx:43-55`). These are structurally opposite actions — one you do
nothing for, one is a full form — distinguished by one word and an emoji. *Correct:* **"We Sell It"** vs.
**"Sell It Myself."** *WHY:* icons carry no meaning for a first-timer (a car doesn't say "we drive to your
house"; a plus doesn't say "list it yourself"), so the label does all the work — and the nav is the *first*
place many mobile users meet these terms, before any explainer exists. Two near-identical labels force a guess
at the exact decision point the product depends on. This also does double duty as Jen's fix: "Sell It Myself"
names the 100% door in permanent chrome.

**2. Reserve clearance under the footer, not under `<main>`.**
*Current:* `<main className="min-h-screen pb-16 sm:pb-0">` (`layout.tsx:59`) pads the space *between* main and
the footer. `BottomNav` is `fixed bottom-0` (`:16`) — outside document flow — so **nothing reserves space after
`</footer>`**. Scroll to the true bottom of any page and the nav sits on top of the footer's tail: "Contact us"
(`:68`) and the copyright. *Correct:* bottom padding ≥ the nav's rendered height + `env(safe-area-inset-bottom)`
after the last element (or on `<body>`). *WHY:* `position: fixed` is relative to the viewport, not the document.
And this isn't cosmetic — the footer link is **the only mobile path to `/contact`** anywhere in the app; the nav
doesn't carry it and the header doesn't either. It's a genuine dead end when covered. It's also where `TrustLine`
is about to live (#3) — the line answering Sue's question would ship under a nav bar.
