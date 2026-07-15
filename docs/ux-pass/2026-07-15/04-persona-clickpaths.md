STATUS: complete

# 04 — Persona click-paths through the ideal product

Six personas, step by step. Each path ends where the persona's own definition of success ends — not where the
product wants a conversion. **Every path names the element that killed them in the current build and the exact
thing that catches them now.**

The proof this is one product and not six: the same six components carry all six paths.

---

## 1. Maria — the pile, zero work (`pile-mom`)
*"Someone takes this pile off my hands today and I never think about it again."* · ~10 min, no patience.

| # | Action | What she sees | Component |
|---|---|---|---|
| 0 | Another mom at pickup: "there's a site, you tell them what you have, they come get it." | — | — |
| 1 | Taps the forwarded link → `/` | H1 **"Turn uniforms into cash."** — the first five words don't contradict her friend. Two doors below it. | Two-door hero |
| 2 | Taps **We sell it for you** | `/sell-for-me` — **"You do nothing."** · *"[Name] does the pickups herself — a Montvale parent."* | `TrustLine` |
| 3 | Name · contact · school · town · taps **"A closet-full"** · taps **Donate it 💚** | *"Half of every sale goes to families in need."* — the number, not a hidden line | — |
| 4 | Scrolls past the account field: types **email only**, leaves the generated password | No modal. No credential to invent. | **`AccountField`** |
| 5 | Taps **Get my free pickup** — and is done | `/my-listings?new=pickup` · *"Got it. We'll text you within 2 days to set a pickup time."* | — |
| 6 | Closes the tab | No bookmark instruction. Her stuff lives at My Listings; she just saw where. | — |

**Total authored input: 4 fields + 3 taps.** Nothing after the button she believed was the last one.

**Old quit point:** `InlineAccountStep.tsx:76-79` — the password field, fired by `sell-for-me/page.tsx:159` the
instant she tapped "Get my free pickup." She'd spent her 90 seconds and was asked to invent a credential for a
site she'll never reopen, at the exact moment "You do nothing" promised completion.
**What catches her:** the account is a field she scrolls past, not a gate she hits. The password is pre-filled —
she confirms rather than authors. Step 5 keeps the button's promise.

**Also fixed on her path:** the landing headline now matches her friend's pitch (step 1); "we'll reach out" is
now bounded (step 5); the "bookmark this page" instruction (`pickup/[id]:94`) dies with the route.

---

## 2. Jen — DIY seller, keeps 100% (`diy-seller`)
*"Three items in under two minutes each, my price, a buyer from my school texting me tonight — less hassle than
Facebook."* · Skeptical. Running one question in the background: *why not just post this on FB?*

| # | Action | What she sees | Component |
|---|---|---|---|
| 1 | Lands on `/` | Two doors, equal weight. **List it yourself · keep 100%** is a door, not a nav pill. | Two-door hero |
| 2 | Taps **List it yourself** | `/new` — photo picker first. Camera *or* library (no `capture` lock). | — |
| 3 | Shoots 2 photos, picks **Bergen Catholic** | City/state never asked — derived from the school | — |
| 4 | One screen: item · size · condition · **price** | Asterisks only on fields that actually block. Blank price is **blocked**, not silently "Free." | — |
| 5 | Contact: phone (prefilled from `seller_profiles`) | — | — |
| 6 | Account field, inline, above the button: taps **"Set my own"**, types a password she'll remember | She's a repeat seller. She gets control — no interruption. | **`AccountField`** |
| 7 | Taps **Post listing** — and it *posts* | `/listing/[id]?new=1` — the live card, exactly as buyers see it | — |
| 8 | Taps **Share to your school's group** | Real OG preview, Bergen-Catholic-scoped link (`/?school=<bc-id>`) | `SharePanel` |
| 9 | Taps **Post another** | Straight back to step 4. School, contact, account pre-locked. | — |
| 10 | Items #2 and #3: description · size · condition · price. ~45s each. | — | — |

**Old quit point:** the same modal, from the other side — `new/page.tsx:201-209` intercepting her Post button.
The account was never the problem; **the ambush was.** FB's Post button posts.
**What catches her:** step 6 puts the account in front of the button instead of behind it, and step 7's button
does what it says. Then step 9 turns a one-off transaction into the three-item batch she actually came to do —
instead of dropping her on an edit form (`new/page.tsx:194` → `/manage`) with no next action.

**The Maria/Jen resolution, visible:** steps 4-6 are the *same component* on both paths. Maria confirms a
generated password; Jen taps "Set my own." Zero-work and full-control are the same screen with one toggle.

---

## 3. Rob — bargain hunter, cold from a QR (`bargain-dad`)
*"Tell me in 30 seconds whether a size-16 Don Bosco blazer exists and for how much."* · Standing in the DBP
lobby, cell data, ~90 seconds, zero trust.

| # | Action | What he sees | Component |
|---|---|---|---|
| 1 | Scans the QR taped in the DBP lobby → `/?school=<dbp-id>` | Page **opens at the grid**. Compact bar: "Don Bosco Prep · Ramsey, NJ [✕ all schools]". No hero pitch to scroll past. | Scoped hero state |
| 2 | Taps **▼ Filters** → Size 16 | Grid narrows | — |
| 3a | **Found it** → taps a card | `/listing/[id]` — photo, price, **Text [Seller]** visible without scrolling | Sticky contact CTA |
| 4a | Taps **Text Dylan** | Native SMS opens, pre-addressed. Done. | `ContactChooser` |
| 3b | **Wrong size** → taps **← Back** | Returns to `/?school=<dbp-id>`, still filtered. Never re-types "bosco." | — |
| 3c | **Nothing there** (the likely case today) | *"No one's listed from Don Bosco Prep yet."* → primary CTA: **Auto Sell** · secondary: Be the first to sell · *"We'll keep an eye out and text you"* + phone field | `EmptyState` **state B** |

**Old quit point:** `EmptyState` on the filtered Don Bosco view. He does all the work — scan, find his school,
filter — and gets "Nothing here yet" plus an email box backed by `/api/contact`, which **has no code path that
fires when a matching listing is posted.** He has a 3-week deadline; he buys the $180 store blazer.
**What catches him:** step 1 spends zero of his 90 seconds on find-my-school (the flyer's physical location
already told us with 100% certainty — `SITE_URL` at `schoolTheme.ts:23` currently throws that away). Step 3b
never makes him redo work. Step 3c stops promising a system that doesn't exist and collects the channel a
standing man on a phone actually checks.

**The honest limit:** he may still leave — the inventory genuinely isn't there yet. But state B converts him
from "dead shell, closes tab" into a lead with a real, human promise, and it offers him the one thing that works
on an empty marketplace. That's the most this product can truthfully do for him in week one, and **truthfully**
is the operative word.

---

## 4. Sue — PTA connector, the distribution multiplier (`connector`)
*"I can post this in two minutes and it makes ME look like the parent who found something useful — not like I
fell for a startup's ad."* · One post ≈ hundreds of users. Not shopping. Deciding whether to spend credibility.

| # | Action | What she sees | Component |
|---|---|---|---|
| 1 | Lands on `/` cold | Two doors, plain language, no marketing gloss | Two-door hero |
| 2 | **Scrolls straight to the footer** — looking for a human | *"Run by [Name], a Bergen County parent — [contact]."* Not "© All rights reserved." | **`TrustLine`** |
| 3 | Taps **Share** in the hero | `/flyer` — **the artwork first.** She sees the pitch before being told to forward it. | `SharePanel` |
| 4 | Picks **Bergen Catholic** in the scope picker | Message + link rewrite to `/?school=<bc-id>`; the **real OG preview** re-renders scarlet-and-gold | `SharePanel` + live `theme` |
| 5 | Reads the liability line | *"An independent, parent-run service. Not affiliated with or endorsed by the school. No money changes hands through the site."* | — |
| 6 | Taps **Copy message + link** → pastes into the 400-parent group | Never signed up. Never logged in. | — |

**Old quit point:** the footer — `layout.tsx:61-71` — at step 2. She scans for a name, finds "© 2026 UniformPass.
All rights reserved," and leaves. **She never reaches steps 3-5, all of which are already well-built.** The
product's best work for her is behind the one line that convinces her to go.
**What catches her:** one sentence, at the exact place she looked. This is the PARKED "About the founder" item —
and a *page* is genuinely hard. A sentence isn't a page.

**Also fixed on her path:** step 4 is currently impossible — every `SharePanel` call site passes `theme={null}`,
and `scopedUrl()` points at `/s/{code}`, **deleted 2026-07-11**. Today she can only hand 400 Bergen Catholic
families a generic link into a multi-school grid. Step 5's disclaimer is what a PTA volunteer needs before
pasting into an *official newsletter*. And "Support the startup!" (`sell-for-me:286`) is gone — the one word
that converts a neighbor into a vendor at the moment trust is tested.

---

## 5. Dana — the group text (`group-text`)
*"I get what this is without thinking, it looks like real parents at real schools use it, and I might forward
it."* · Zero intent. Half-watching TV. **She is a distribution node, not a user** — no signup, no listing, no
purchase is on the table. If it doesn't earn a forward, it gets nothing.

| # | Action | What she sees | Component |
|---|---|---|---|
| 0 | The unfurled card in the thread | "Turn uniforms into cash." + two doors — most of the 30 people never tap; the card must land alone | `/api/og` |
| 1 | Taps → `/` | **The same headline, verbatim.** Same two doors. Zero doubt she's in the right place. | Two-door hero |
| 2 | Types her own school (Park Ridge) — the one question she has: *is this real for me?* | | |
| 2a | *If it matches, 0 listings:* | *"No one's listed from Our Lady of Mercy yet."* → **Auto Sell** as the primary CTA — something that works today | `EmptyState` **state B** |
| 2b | *If no match:* | *"No match for 'Park Ridge' yet — [notify me] · [browse all schools]"* — never silence | `EmptyState` **state A** |
| 3 | Taps into a listing to confirm with her own eyes | No login. No email ask. She's vetting, not shopping. | — |
| 4 | Taps **Share** — right there in the hero, where she already is | Same card, ready-to-paste line | `SharePanel` |
| 5 | Forwards to her sister's group. Leaves. Never signs up. | **That's the win.** | — |

**Old quit point:** step 2. The biggest, most obvious element on the page is the school finder; she uses it; it
returns "Nothing here yet" and **an ask for her personal email.** Her bar for forwarding is "does this feel
alive," and the app answers "no, and give me your contact info." She won't forward a ghost town to 30 people —
the social cost of "the thing I sent everyone was empty" outweighs the goodwill.
**What catches her:** 2a swaps a dead grid for a live offer. 2b replaces literal silence with an answer. Step 4
puts Share where the impulse actually peaks — the first "oh, that's clever" second — instead of in a footer she'd
have to scroll past strangers' used clothes to reach.

**Her whole path asks nothing of her.** Steps 1-5 involve no account, no email, no form. That's deliberate: her
ceiling is *impression + maybe-forward*, and any ask overshoots it.

---

## 6. Kate — returning seller (`returning`)
*"Did anything sell, did anyone reach out, when's my pickup, do I have money coming."* · 4 listings + 1 pickup +
1 draft, 9 days ago. Five minutes on her phone.

| # | Action | What she sees | Component |
|---|---|---|---|
| 0 | **A text arrives:** "Your pickup is scheduled for Thursday." | She didn't have to remember. The product told her. | Seller notification |
| 1 | Taps → `/my-listings`, session persists | **One line, above everything:** *"1 sold · $18 earned · pickup scheduled Thu · 1 draft unfinished."* All four answers, zero clicks. | Status summary |
| 2 | Sees the draft banner | *"You have an unfinished listing: navy blazer — finish it"* — a task, not a row in her inventory | Draft banner |
| 3 | Scans her 4 listings | Each card: live/sold + **"3 people tapped to contact you"** | Contact-tap count |
| 4 | Taps her pickup | 5-stage tracker: Requested → **Scheduled (Thu)** → Picked up → Listed → Sold | Pickup tracker |
| 5 | Taps a thumbnail under "Listed" | The live listing the operator created from her pile — she watches it like a buyer | `listing_id` link |
| 6 | Reads the ledger | *"$18 earned · paid via Venmo Jul 12"* — a number and a date, not a policy | Money ledger |
| 7 | Closes the tab. Doesn't text the operator. | | |

**Old quit point:** a complete screen with nothing to tell her. She scrolls to "Your pickup requests," reads the
`dl` block (`my-listings:332-338`) — Items, School, Town, Estimate, Submitted — and the list **stops there.** No
sale price, no paid state, no link to what was listed, no ETA. She texts the operator directly: the exact
behavior the self-serve page exists to prevent.
**What catches her:** four missing *capabilities*, not four missing UI elements — `listing_id` on
`pickup_requests`, a contact-tap counter, payout fields, and seller-side notifications. Her report is the one in
this run that is mostly **schema**, and that's the finding: the page can't answer her because the data to answer
her doesn't exist.

**Step 0 is the highest-leverage line in this file.** A "returning to check" persona *only exists because the
product is silent.* Every other fix on her path makes the checking better; step 0 means she doesn't have to
check at all.

---

## What the six paths share

Every path runs through the same six components — that's the test that this is one product, not eleven
wish-lists:

| Component | Serves |
|---|---|
| **Two-door hero** | Maria (1), Jen (1), Sue (1), Dana (1) — 4 of 6 land here first |
| **`AccountField`** | Maria (4), Jen (6) — **both** seller personas' old quit point, resolved by one toggle |
| **`EmptyState` A/B/C** | Rob (3c), Dana (2a, 2b) — the two cold, low-trust visitors; **the product on launch day** |
| **`SharePanel` + live `theme`** | Sue (3-6), Dana (4), Jen (8) — the entire distribution loop |
| **`TrustLine`** | Sue (2), Maria (2) — the ask-scaling problem, both directions |
| **`/my-listings`** | Kate (1-6), Maria (5) — one canonical home for a seller's stuff |

**Two of six personas (Sue, Dana) never transact, and both paths are designed to end without an account.** They
are the growth loop. The current build treats every visitor as a buyer or a seller — all four nav tabs assume it
— which is why the two highest-leverage users in the run both quit before doing anything.
