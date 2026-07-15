STATUS: complete

# 05 — Gap + change list
The ideal (01-04) diffed against live code, line by line, 2026-07-15. Every item below was
re-Read from disk today — no upstream claim was taken on trust.

---

## Reconciliation (the staleness pass)

Upstream docs 01-04 were written against live code the same day, so most items survived. Four did not.
**Re-checked: 41 items · VALID 37 · OBSOLETE 4 · DONE 0-new** (the DONE column is empty because the
prior study's shipped items — bottom nav, OG cards, plain contact, URL-persisted filters, drafts,
donate, admin hardening, one-page flyer, 3:4 photos, seller link — were already excluded upstream).

### OBSOLETE — do not route these to a build

| Item | Source | Why it's dead |
|---|---|---|
| **"KILL `MonogramPatch` — orphan from the archived per-school sections. Dead weight."** | `03:199` | **Provably wrong. It is load-bearing.** `MonogramPatch` is imported and rendered by `app/api/og/route.tsx:5,153` and `app/api/og/listing/route.tsx:5,81,91`. Deleting it breaks the per-listing OG cards and the school-scoped OG card — i.e. the exact distribution surface Dana and Sue run on. It survived the `/s/[code]` archive *because* the OG renderers kept using it. Leave it. |
| **"`ContactChooser` — extract the **masked** tel/mailto/venmo chooser"** | `03:117-118` | The mask was **deliberately removed** on 2026-07-13 (commit `fbc17d0`, "show seller contact plainly on listings (drop cosmetic mask)"). `ContactAction` (`listing/[id]/page.tsx:238-269`) now prints the real number via `formatContact()` on purpose. The *description* is stale — do not re-add masking. (The "`/seller/[id]` has no contact affordance" half of that item is VALID and appears below as H7.) |
| **"`/my-listings` action row is non-wrapping — add `flex-wrap`"** | `02:235-237` | Not reproducible. The card is already `flex-wrap sm:flex-nowrap` (`my-listings/page.tsx:246`) and the action div is `w-full sm:w-auto` (`:263`) — at 390px it already drops to its own full-width line with ~340px for three ~85px buttons. Nothing to fix. |
| Any revival of per-school hubs / themed heroes / `/s/[code]` | prior study | Killed by Dylan 2026-07-11, archived. 01 correctly refuses to re-litigate. **The scoped-URL work below is a filter state on `/`, not a hub** — keep it that way. |

### One item that reverses a shipped decision — needs Dylan's call
**`capture="environment"` on `/new`** (`new/page.tsx:347`) was shipped *deliberately* as "H10:
camera-first photo capture" (commit `e509650`). 02 now says drop it, and the reason is real (on many
Android browsers `capture` launches the camera and skips the library, so a parent who already
photographed the pile can't select those photos). Both positions are defensible — this is a reversal,
not a bug fix, so it's flagged rather than ranked. See H14.

### The ground truth that reorders everything
Live DB, queried today: **2 available listings · 1 of 45 schools has any stock · 4 pickup requests.**

That single fact sets the ranking. **44 of 45 schools render an empty grid**, so the empty state is not
an edge case — it is the product for ~98% of school-scoped visits. And Auto Sell already has 4 real
requests against browse's ~zero: the moat works, the marketplace doesn't have inventory yet. So intake
and distribution outrank browse polish, and every dead end must offer Auto Sell — the one thing that
works on an empty marketplace.

---

## Ranking formula

`impact on core journeys × reach across personas ÷ effort`, with two explicit project multipliers:

- **×3 cold-mobile discovery** — the audience arrives by QR/group-text on a 390px phone. Anything on
  `/`, the OG card, or the flyer carries this.
- **×3 Auto Sell moat** — the only thing FB Marketplace cannot do. Anything that drives, protects, or
  earns trust for a pickup request carries this.
- **×1** everything else.

Items carrying both multipliers occupy the whole CRITICAL tier.

---

# CRITICAL

### C1 · Split `EmptyState` into three states, with Auto Sell as the cold-start CTA
*(cold-mobile ×3 · moat ×3 — the highest-scoring item in the run)*

- **Change** — Three empty states with three different CTAs; a cold-start school leads with Auto Sell, and a zero-match school search stops being silent.
- **Current state** — `components/BrowseExperience.tsx:77` counts `schoolId` as just another filter (`activeFilters = [schoolId, category, gender, size, condition].filter(Boolean).length`), which feeds `hasFilters` at `:152`. So picking a school via the hero — the product's *primary intended flow* (`pick()`, `:184-188`) — always makes `hasFilters` true, which means **`"Or be the first to sell →"` (`:328-331`) is gated on `!hasFilters` and can never render once a school is selected.** The product hides its best next step at the exact moment a parent types her school and finds it empty, and offers "Or clear the filters" (`:323-326`) instead — which, with only a school selected, just throws her school away. Separately, `:211` gates the dropdown on `results.length > 0`, so a school that isn't in the 45 renders **literally nothing** — no message, no capture. Verified live upstream by typing "Ridgewood." And Auto Sell — the one offer that works with zero inventory — is absent from all of it. **With 44/45 schools empty, this is what nearly every school-scoped visitor sees.**
- **Persona pain** — Rob (3c: does all the work, gets a dead grid + an email box, buys the $180 store blazer), Dana (2a/2b: won't forward a ghost town to 30 people), Maria and Sue collaterally (the empty grid is the first impression of a product they were told works).
- **Implementation** — Track `schoolId` separately from `otherFilters` in `BrowseExperience`. Three states: **A** (hero query, `searchSchools()` → `[]`) render an inline "No match for '{query}' yet" row inside the dropdown box with a notify-me capture — never silence; **B** (`schoolId` set, 0 listings, no other filters) "No one's listed from {School} yet." → primary CTA **Auto Sell — get a free pickup**, secondary "Be the first to sell" + notify; **C** (`schoolId` + ≥1 other filter, 0 results) "No matches for these filters at {School}." → **Clear filters** keeping the school. Also fix the promise: `"You're on the list."` (`:296-298`) is backed by `/api/contact`, and **no code path fires when a matching listing is posted** — either build match-and-notify or say what's true ("We'll keep an eye out and text you") and take a phone number.
- **Effort** — M

### C2 · Homepage H1 must echo the flyer/OG card verbatim, and the two doors get equal weight
*(cold-mobile ×3 · moat ×3)*

- **Change** — H1 → **"Turn uniforms into cash."**, with two equal doors (We sell it for you / List it yourself) below the finder.
- **Current state** — `BrowseExperience.tsx:193-195` reads **"Stop buying uniforms new."** — a pure buyer pitch with no cash or sell language. Both channels that lead here open with the opposite: `app/api/og/route.tsx:82-84` and `app/api/flyer-image/route.tsx:110-112` both render **"Turn uniforms into cash."** and both lead with Auto Sell. Three agents found this independently. The flyer is in circulation *right now*, so the mismatch is live on every scan. Meanwhile `ConsignmentBand` (`:238-260`) is a full emerald module with a filled CTA, and the DIY path's only homepage presence is a nav pill (`layout.tsx:50-55`) — the page pitches the 50% option hard and the 100% option not at all.
- **Persona pain** — Maria (told "they just come get it," lands on a headline about buying — a beat of "wrong page?" she has no invested interest to spend), Dana (the card and the page must match verbatim or she doubts the link), Jen (converts on DIY, gets steered toward the door she refuses on principle), Sue.
- **Implementation** — Swap the H1 string; subhead → "Or find your school's uniforms for a fraction of the store." Replace `ConsignmentBand` with a two-door module: emerald **We sell it for you · keep 50%** → `/sell-for-me`, indigo **List it yourself · keep 100%** → `/new`. Two stacked full-width cards below 640px, 2-col above. The finder stays the single primary CTA and stays above the doors — it's the one action all six personas take; the doors are a decision module, not a CTA.
- **Effort** — M
- **Note** — one banner becoming two doors is the *visible* structural change the "epic redesign" never delivered. Legible at a glance, which is the bar.

### C3 · The account becomes a field, not a gate — `AccountField` replaces `InlineAccountStep`
*(moat ×3 — it gates the pickup request itself)*

- **Change** — Email + generated password render inline as the last card of the form, above the submit button. Nothing pops up.
- **Current state** — `components/InlineAccountStep.tsx` is a `fixed inset-0` modal (`:62`) fired by `if (!user) { setShowAccount(true); return }` at `app/new/page.tsx:207` and `app/sell-for-me/page.tsx:159` — i.e. **after** the user presses Post / Get my free pickup. The password field (`:76-79`) asks Maria to author a credential for a site she'll never reopen at the instant "You do nothing" promised she was finished; Jen quits because a wall appeared after she pressed Post, and FB's Post button posts. The modal also has no `overflow-y-auto` and `autoFocus`es email (`:74`), so on a short phone the keyboard can bury the submit button with no way to scroll — stranding a completed form. **This is both seller personas' quit point, and it sits directly on the moat's intake path.**
- **Persona pain** — Maria (4) and Jen (6) — the only convergence in the run where one component change serves two opposite personas.
- **Implementation** — New `components/AccountField.tsx`, rendered logged-out only, as the last form card: email input + password pre-filled with a generated value + a "Set my own" toggle + "Forgot your password?" → `/reset-password` (H10). Maria types one field and submits; Jen taps "Set my own." Keep `signUp`/`signInWithPassword` logic and the existing-account fallback; move them inline. The locked model requires an account to post — it never required a *gate*. Deferred signup was built to remove the gate from the *start* of the form; implementing it as a modal recreated it at the *end*. The modal's scroll bug dies with the modal.
- **Effort** — M

### C4 · `TrustLine` — name the human, in the footer and on `/sell-for-me`
*(moat ×3 — the riskiest ask in the product is made by nobody)*

- **Change** — One sentence: "Run by [Name], a Bergen County parent — [contact]" in the global footer, and "[Name] does the pickups herself" beside the Auto Sell steps.
- **Current state** — The footer (`app/layout.tsx:61-71`) is the only persistent trust surface in the product and it ends on **"© 2026 UniformPass. All rights reserved."** (`:70`). That line is Sue's quit point — she scans for a human, finds a copyright notice, and leaves before ever reaching the flyer, the share message, or the real OG preview, all of which are well-built and none of which she sees. Meanwhile `/sell-for-me` asks strangers to "Leave it by your door at a set time" (`:11-15`) for a completely unnamed "we" — no name, no face, nothing, here or on the confirmation — while the *lower*-risk public meetup gets a dedicated safety module (`listing/[id]/page.tsx:190-196`). **Trust is built backwards: the product reassures people where they already feel safe and leaves them alone where they'd naturally hesitate.**
- **Persona pain** — Sue (2 — she's the distribution multiplier; one post ≈ hundreds of users, and she quits at line 70 of `layout.tsx`), Maria (2 — someone is coming to her house).
- **Implementation** — Two string edits: one `<p>` in the footer above the copyright, one line by the `STEPS` grid on `/sell-for-me`. Optionally extract `SafetyNote` from `listing/[id]/page.tsx:190-196` and give Auto Sell a variant ("Who's coming: [Name]. Text her anytime to change the time. Nothing is taken until you say so."). **This is the PARKED "About the founder" item** (`context.md:19`, "later bc that's hard") — and a *page* genuinely is hard: bio, photo, story. **A sentence isn't a page.** Answer her where she asked.
- **Effort** — S

### C5 · Require price + photo + contact before a listing can go `available`
*(protects the only inventory that exists — 2 listings)*

- **Change** — Block `available` on empty price, zero photos, and blank contact. Make "free" an explicit checkbox. Apply the same gate to the draft "Post it" button.
- **Current state** — Three holes on one path:
  1. **Price is a lie.** `new/page.tsx:359` renders `Price ($) *`, but `validate()` (`:135-144`) never checks it and `buildPayload` does `price: Number(form.price) || 0` (`:122`) — which renders as **"Free"** in large bold on the card (`BrowseExperience.tsx:384`) and the detail page (`:133`). A false-required asterisk is worse than none: it's a promise the form breaks silently. Two *more* false asterisks — `Category *` (`:245`) and `Gender *` (`:255`), both with working defaults at `:32-33`, neither ever gated — train Jen that every asterisk is decorative, which is exactly what lets Price through.
  2. **No photo check** anywhere in `validate()`. The grid is a Poshmark-style photo wall (`BrowseExperience.tsx:154-156`); a gray "No photo" box isn't at a slight disadvantage, it's invisible.
  3. **Contact is optional and the copy invites skipping it** — `new/page.tsx:430`: *"Leave blank to only be reachable through the comments."* **There is no comments channel.** The buyer then hits `listing/[id]/page.tsx:206-210`: *"Check the comments above, or reach out through your school community"* — pointing at a channel that doesn't exist, on the *entire* money path. And `/my-listings:265-270` "Post it" fires a bare status PATCH; `cleanUpdates()` (`api/listings/manage/route.ts:24-37`) has no completeness rule, and a draft only ever required school + item (`new/page.tsx:213-221`) — **one tap can put a $0, photo-less, contact-less listing on the public grid.**
- **Persona pain** — Jen (4 — *the* persona who wants 100%; she speed-runs the form trusting the asterisk and her blazer goes live free to the whole school), Rob and Dana (a broken listing is 1 of the 2 things they can see — it makes the whole marketplace look half-built), Kate (her draft is one tap from going live broken).
- **Implementation** — Add to `validate()`: price non-empty (or `is_free` checked), `photoFiles.length > 0`, `contact_info` non-blank. Drop the asterisks on Category/Gender. Delete the "leave blank" sentence at `:430`. Route `/my-listings` "Post it" through the same rule — inline-block with "Finish your listing to post it: add a price/photo/contact" or send to `/manage` with the fields highlighted. Keep drafts exempt. Replace the `:206-210` fallback with a real one (mailto the operator to forward the inquiry) for the legacy listings already in that state.
- **Effort** — S (validation) + S (Post it gate)

### C6 · Repoint `scopedUrl()` at `/?school={dbId}` — defuse a live 404 landmine
*(cold-mobile ×3 — and the fix *is* the feature)*

- **Change** — `scopedUrl()` returns `/?school={dbId}` instead of `/s/{code}`.
- **Current state** — `lib/schoolTheme.ts:102-108` builds `${SITE_URL}/s/${code}`. **That route was deleted on 2026-07-11** — confirmed today: `app/s/` does not exist. `buyMessage`/`sellMessage` (`lib/shareMessages.ts:9,17`) call it the moment anyone passes a real `theme` to `SharePanel`. It's dead only because every call site passes `theme={null}` (`app/flyer/page.tsx:31`, `app/listing/[id]/page.tsx:76`) — verified, those are the only two. **It is a loaded gun: the day anyone wires up the school-scoped share link Sue needs, it silently 404s 400 Bergen Catholic families.**
- **Persona pain** — Sue (4), Dana, Jen (8) — the entire distribution loop.
- **Implementation** — One function. `scopedUrl(code)` → `${SITE_URL}/?school=${SCHOOL_THEMES[code].dbId}` (the live filtered-browse URL the hero's own picker already writes at `BrowseExperience.tsx:93`). Repointing *also ships the feature* — the scoped link is the thing Sue came for. Pairs with H6. **This is a filter state, not a revival of `/s/[code]`** — no themed hero, no second site.
- **Effort** — S

### C7 · Verify `RESEND_API_KEY` in Vercel prod — the moat may be failing silently
*(moat ×3 · operator action, not a code change)*

- **Change** — Confirm the key is set in production. If it isn't, set it.
- **Current state** — `app/api/pickups/notify/route.ts:14-15`: `if (!key) return NextResponse.json({ ok: false, emailed: false })`. `/sell-for-me:129-142` calls it with `.catch(() => {})` and **never inspects the body**. So the request saves, the seller sees "Got it! We'll be in touch" (`pickup/[id]:93`), and **the operator may never learn it exists** unless she happens to open `/admin`. `context.md:105` lists this key as **UNCONFIRMED**. There are already **4 real pickup requests in the DB.**
- **Persona pain** — Maria (5 — her whole premise is offloading mental overhead; a request that vanishes is the worst possible outcome for the moat), the operator.
- **Implementation** — Dylan/operator: check `RESEND_API_KEY` in the Vercel prod env. I did not read the prod env myself — a UX audit isn't a reason to dump production secrets configuration. Then, in code: have `/sell-for-me` inspect `{ emailed }` and fall back to a visible admin badge; sort `new` pickups to the top of `/admin` with an unread count so email is a convenience, not a single point of failure.
- **Effort** — S (+ operator check first)

---

# HIGH

### H1 · Sticky contact CTA on the listing page (mobile)
- **Change** — Contact the seller visible without scrolling on a phone.
- **Current state** — `listing/[id]/page.tsx:89` is `grid-cols-1 md:grid-cols-2`, so below 768px the gallery stacks *above* the details column. The `aspect-[3/4]` hero photo (`:92`) alone is ~520px at 390px wide, and the contact block (`:186-212`) sits after price, tags, the facts table, and comments — 2-3 screens down. The desktop 2-col layout hands the CTA top-of-viewport visibility for free; stacking takes it away and replaces it with nothing, on the device 100% of the launch audience uses.
- **Persona pain** — Rob (3a — 90 seconds, standing in a lobby), every buyer.
- **Implementation** — Sticky bottom contact bar above `BottomNav`, or a compact price + CTA directly under the title before the full gallery.
- **Effort** — M

### H2 · `← Back to listings` must carry the school
- **Change** — Back returns to the filtered grid.
- **Current state** — `listing/[id]/page.tsx:70-72` is a hardcoded `<Link href="/">`. Rob filters to Don Bosco, opens a wrong-size blazer, taps back, lands on the unfiltered homepage, and re-types "bosco."
- **Persona pain** — Rob (3b).
- **Implementation** — `/?school=${listing.school_id}` or `router.back()`. **This is the brief's own corner-✕ failure**: a nav control that silently discards context teaches a cold, untrusting visitor that the app doesn't remember what he told it. That reads as broken, not merely annoying.
- **Effort** — S

### H3 · Scoped hero state — `?school=` collapses the hero and opens at the grid
- **Change** — A deep link with `?school=` opens on the grid under a compact school bar, not the generic pitch.
- **Current state** — `?school=` already filters (`BrowseExperience.tsx:23,64`) but the page still opens on the full indigo hero, so Rob scrolls past a pitch for a product he's already inside. `pick()` scrolls to `#browse` (`:187`) — a deep link should do the same.
- **Persona pain** — Rob (1), Dana (1), Sue's recipients.
- **Implementation** — When `?school=` is present on load, collapse the hero to a bar — "Don Bosco Prep · Ramsey, NJ [✕ all schools]" — and scroll to `#browse`. A flyer taped in the DBP lobby already told us the school with 100% certainty; re-asking throws away a free, perfect signal. **Filter state, not a hub** — no themed hero, no monogram.
- **Effort** — M

### H4 · Post success → the live listing, not the edit form
- **Change** — Success routes to `/listing/[id]?new=1` with **Share it** + **Post another**.
- **Current state** — `new/page.tsx:194` routes a successful post to `/listing/${id}/manage?token=…&new=1` — an **edit form** whose only success messaging is a static banner (`manage/page.tsx:213-219`) with no next action. Jen has three items to post and the app hands her a settings screen at the single highest-motivation instant a seller ever has.
- **Persona pain** — Jen (7, 9).
- **Implementation** — Change the push target; add a success bar on `/listing/[id]` when `?new=1` carrying Share (SharePanel already there at `:74-79`) + Post another (back to `/new` with school/contact/account pre-locked). `/manage` stays reachable from `/my-listings` and the listing's own Manage pill (`:80-85`). Showing her the live card proves the post worked; Share puts the value prop in her hand at peak motivation; Post another turns a one-off into the three-item batch she came to do.
- **Effort** — M

### H5 · `VerifiedBadge` — the meaning can't live in a `title` attribute
- **Change** — Inline explainer text next to the badge; drop the `title`; drop the card ring.
- **Current state** — `components/VerifiedBadge.tsx:9` puts the badge's entire meaning in `title="Operator-listed and quality-checked…"`. **`title` fires on `:hover`. Hover does not exist on touch.** The bottom nav was added *specifically* because the launch audience is on phones (`context.md:109`) — and that same audience sees "✓ Verified" with no way, ever, to learn what it verifies. Separately `BrowseExperience.tsx:352-354` adds `ring-2 ring-indigo-500/70` — a second, *unlabeled* signal duplicating a labeled one, with no legend anywhere; on a first scan a highlighted border reads as "featured/promoted," not "quality-checked."
- **Persona pain** — Rob, Dana (every cold visitor on a phone) — and the operator, whose Auto Sell inventory is the thing being verified.
- **Implementation** — On the detail page render "✓ Verified — we picked it up and checked it ourselves" inline, so **no interaction is required at all**. Remove `title` and `cursor-help`. Remove the ring; one signal, labeled.
- **Effort** — S

### H6 · `/flyer` — artwork first, add the scope picker, add the liability line
- **Change** — Lead with the flyer image; add a school picker that scopes the link + copy; add a disclaimer.
- **Current state** — Order is (1) "Forward to anyone you know…" (`flyer/page.tsx:18-20`), (2) Save/Print/Share (`:22-32`), (3) the artwork (`:34-40`). At mobile width the instruction and three buttons fill the entire first screen — **it tells you to forward a thing you haven't seen.** And `SharePanel` gets `theme={null}` (`:31`), so `buyMessage`/`sellMessage` can only emit generic "school" copy pointing at the bare homepage, and the real-OG-preview block (`SharePanel.tsx:108-116`) — "the exact preview the group will see," the best-designed thing in the product for Sue — can only ever show her the generic indigo card, never hers.
- **Persona pain** — Sue (3-5), Dana (4).
- **Implementation** — Reorder: artwork → picker → message + preview → Save/Print/Share (sticky or directly under the image). Add a school `<select>` that sets `theme` from `SCHOOL_THEMES`; pass it to `SharePanel`. Depends on **C6** or the scoped links 404. Add: *"An independent, parent-run service. Not affiliated with or endorsed by the school. No money changes hands through the site."* — the line a PTA volunteer needs before pasting into an official newsletter. She's not evaluating features, she's evaluating whether she'll be blamed.
- **Effort** — M

### H7 · `/seller/[id]` — the thinnest page in the product
- **Change** — Add "Selling since [date]" and one contact affordance.
- **Current state** — `app/seller/[id]/page.tsx` renders a name (`:33`), a count (`:34-38`), and a grid (`:48-64`). Nothing else. It has **less trust information than the single listing that linked here** (`listing/[id]/page.tsx:214-219`), which at least carries "Posted [date]" and a contact block. No member-since, no verified indicator, and **no way to contact anyone** — a buyer who wants to ask "anything else in a 14?" must open an arbitrary listing and use *that* one's contact block.
- **Persona pain** — Rob, any buyer deciding whether to text a stranger about a cash meetup.
- **Implementation** — `MIN(created_at)` across the listings the query already fetches → "Selling since March." One `ContactAction` sourced from any listing's `contact_info`. A page whose entire reason to exist is "look at more from this person before you decide to trust them" should be the most trust-dense page in the product; it's the least.
- **Effort** — S

### H8 · Relabel the nav — "Auto Sell" and "Sell" differ by one word
- **Change** — **"We Sell It"** vs. **"Sell It Myself."**
- **Current state** — `BottomNav.tsx:6-11` reads Browse 🔍 / **Auto Sell** 🚗 / **Sell** ➕ / My Listings 📋; the desktop header repeats the pair (`layout.tsx:43-55`). These are structurally opposite actions — one you do nothing for, one is a full form — distinguished by one word and an emoji. Icons carry no meaning for a first-timer: a car doesn't say "we drive to your house," a plus doesn't say "list it yourself."
- **Persona pain** — Maria, Jen, Dana — the nav is the *first* place many mobile users meet these terms, before any explainer exists.
- **Implementation** — Two label strings in `BottomNav.tsx` + the header. Stay at 4 tabs. Doubles as Jen's fix: "Sell It Myself" names the 100% door in permanent chrome.
- **Effort** — S

### H9 · Reserve footer clearance under `BottomNav`
- **Change** — Bottom padding after the footer, not after `<main>`.
- **Current state** — `layout.tsx:59` is `<main className="min-h-screen pb-16 sm:pb-0">` — that pads the space *between* main and the footer. `BottomNav` is `fixed bottom-0` (`BottomNav.tsx:16`), outside document flow, so **nothing reserves space after `</footer>`** (`layout.tsx:61-71`). Scroll to the true bottom of any page and the nav sits on top of the footer's tail: "Contact us" (`:68`) and the copyright. `position: fixed` is relative to the viewport, not the document.
- **Persona pain** — Sue (the footer is where she looks for a human — and where `TrustLine`/C4 is about to live), anyone needing `/contact` on a phone.
- **Implementation** — `pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-0` on `<body>` (or after the footer); revert `main` to `min-h-screen`. Not cosmetic: the footer link is **the only mobile path to `/contact`** anywhere in the app — the nav doesn't carry it and neither does the header.
- **Effort** — S

### H10 · Ship `/reset-password` + "Forgot your password?"
- **Change** — A reset route, linked from `/signin` and the inline account field.
- **Current state** — **There is no reset path anywhere in `app/`** — grepped today: no `resetPasswordForEmail`, no reset route, no "forgot" string. When `InlineAccountStep` detects an existing account it says "You already have an account... enter your password to finish" (`:36-41`) with no recovery link — a seller with a completed listing in memory and a forgotten password has **no way forward but abandoning the submission.** Not hypothetical: Dylan's own accounts needed a manual SQL reset (`context.md:107`).
- **Persona pain** — Kate, Jen, Maria — every non-first-time poster must pass this step. Unlike a confusing label, "wrong password, no recovery" is a full stop: the user cannot self-serve past it.
- **Implementation** — `supabase.auth.resetPasswordForEmail` → `/reset-password`. **The original deferral ("needs email") is stale** — Resend is verified and delivering to the launch audience's Gmail/Yahoo/iCloud (`context.md`, 2026-07-11). The known `.edu`/Safe-Links problem doesn't apply to this audience.
- **Effort** — M

### H11 · `/sell-for-me` copy — bound the promise, kill "startup," show the donate math
- **Change** — Three string edits on the moat's own page.
- **Current state** — (a) `:306` "We'll reach out to schedule a time before pickup." — today? this week? Pickup status is moved by hand in admin (`admin/page.tsx:129-140`); nothing drives a follow-up. (b) `:286` **"Support the startup!"** — Sue reads "startup" as "someone's business is soliciting my community's donated goods" at the exact moment she's deciding whether to spend her credibility. **It's the one word on the site that converts a neighbor into a vendor.** (c) `:300-304` hides the payout line entirely when Donate is selected — a donor still deserves to know the 50% math she's donating.
- **Persona pain** — Maria (an unbounded promise hands back the exact background worry she came to offload), Sue.
- **Implementation** — (a) → "We'll text you within 2 days to set a pickup time." (b) → "Goes to families in need." (c) keep the number, change the verb → "Half of every sale goes to families in need." A gift you can't size isn't a decision, it's a shrug.
- **Effort** — S

### H12 · Delete the duplicates
- **Change** — Four cuts, each a duplicate affordance or a contradicted headline.
- **Current state** —
  | Element | Why |
  |---|---|
  | `+ Sell` header pill (`layout.tsx:50-55`) | Its two siblings (`:43`, `:46`) are `hidden sm:inline-flex`; it isn't. So at 390px it renders in the sticky header at the same time `BottomNav.tsx:9` renders "➕ Sell" — same word, same `/new`, in fixed chrome at both ends of the screen. Reads as a bug, not emphasis. **Add `hidden sm:inline-flex`.** |
  | School `<select>` (`BrowseExperience.tsx:117-120`) | A second, dumber widget writing the same `schoolId` state as the hero finder (`:90-94`). A parent who typed "Bosco" scrolls down and meets a picker already pointed at her answer — second filter, or echo? A filter dimension gets exactly one input. Replace with a dismissible chip by the `Fresh from {school}` heading (`:100-102`) — **which is also Rob's labeled "✕ all schools" exit.** |
  | `School` row (`listing/[id]/page.tsx:169`) | Verbatim echo of the eyebrow at `:126`, inches above. One padded row primes users to skim the rows that matter (Payment, Posted). |
  | `/contact` headline (`contact/page.tsx:49`) | "or need help taking down a listing?" — Dylan cut this from the footer on 2026-07-14 because sellers self-serve; it survived as the page's **headline**, advertising the slow path for a job the product solves in two taps. Keep it only at `manage/page.tsx:204`, shown to someone who's already proven they can't self-serve. |
- **Persona pain** — Rob and Dana (clutter on the cold-arrival page), Kate, every mobile user.
- **Implementation** — One class, one component swap, two deletions.
- **Effort** — S (chip: M)

### H13 · Kill `/pickup/[id]` → `/my-listings?new=pickup`
- **Change** — Delete the route; route submission to the page that owns her stuff.
- **Current state** — `app/pickup/[id]/page.tsx` and the pickup block on `/my-listings:283-359` render the *same fields* from two data paths (token vs. session), neither links to the other, and `STATUS_LABEL` is duplicated verbatim (`pickup/[id]:9-17`, `my-listings:10-18`). `/pickup/[id]:94` still says *"Bookmark this page to check status or cancel"* — copy from the pre-account era that the account model made obsolete on 2026-07-11.
- **Persona pain** — Maria (6), Kate (1).
- **Implementation** — `sell-for-me:143` pushes `/my-listings?new=pickup` with a confirmation banner — **exactly the pattern the draft flow already uses** (`/my-listings?saved=draft`, handled at `my-listings:37-44`). Merge `STATUS_LABEL` to one export. Accounts are required for pickups now, so the token surface protects nothing — it just splits the truth in two, and landing on `/my-listings` teaches Maria where to look next time instead of asking her to bookmark a URL the product already tracks.
- **Effort** — M

### H14 · `/new` — derive city/state from the school; reconsider `capture="environment"`
- **Change** — Stop asking two questions the app already answered; unlock the photo library.
- **Current state** — (a) `new/page.tsx:366-381` renders a free-text City and a **51-option `US_STATES` `<select>`** (`lib/supabase.ts:84-90`), both gated at `:140-141` — two fields *after* she picked a school whose row already carries `city`/`state` (`lib/supabase.ts:11-13`). A 3-school beachhead should never render a 51-state dropdown. (b) `:347` `capture="environment"` — **this reverses shipped commit `e509650` ("H10: camera-first photo capture"), so it's Dylan's call**, but on many Android browsers `capture` launches the camera and skips the library entirely, so a seller who already photographed the uniform can't select it.
- **Persona pain** — Jen (3 — re-asking a question the app answered two fields ago is the "this app doesn't know what it's doing" signal that sends a Facebook-fluent seller back to Facebook).
- **Implementation** — (a) derive from the picked school; expose an override only for `school_id === 'other'`. (b) drop the `capture` attribute — parents photograph a pile then list later, so library access matters more than camera-first.
- **Effort** — S

### H15 · Mobile: photo-delete hit area; Auto Sell 3-step grid; listing header wrap
- **Change** — Three 390px fixes.
- **Current state** — (a) `new/page.tsx:331-334` — photo-delete `✕` is `w-5 h-5` = **20×20px**, well under the 44px floor, on the screen where a mis-tap deletes the photo she just took. (b) `sell-for-me:177-185` is `grid-cols-3` at *all* widths — three `text-5xl` emoji plus two lines of copy each, at 390px. (c) `listing/[id]/page.tsx:69-87` holds Back + Share pill + Manage pill with no `flex-wrap` — ~430px of content in ~358px, and "Manage your listing" (`:83`) is the longest label. This is the screen a seller lands on most often.
- **Persona pain** — Jen, Maria, Kate.
- **Implementation** — (a) pad the hit area to ≥44px (keep the visual dot small). (b) verify at 390px; stack to a row of 3 icons with copy below if it crushes. (c) add `flex-wrap`, or shorten to "Manage".
- **Effort** — S

---

# NICE-TO-HAVE

### N1 · "What if it doesn't sell?" — one `<details>` on `/sell-for-me`
`sell-for-me/page.tsx:164-320` never answers it. Do items come back? Get donated? When? Reuse the
`<details>` pattern already on that page at `:248-261`. **This is where the simplicity pivot cut too
far** — progressive disclosure means the answer is behind a tap, not deleted; cutting it just moves the
uncertainty into the parent's head at the moment she's deciding whether to hand over her kid's things.
Persona: Maria. **Effort: S**

### N2 · "Report this listing"
No report path exists anywhere (`listing/[id]`, `seller/[id]`, footer — all checked). Add a small link
to `/contact` with pre-filled context, and name reporting in `/contact`'s copy. Trust in a no-payment,
no-messaging marketplace rests entirely on the belief that misbehavior has consequences — cash changes
hands off-platform with no record. Even an unglamorous report link signals someone is watching; its
absence signals the opposite. Persona: Rob, any buyer. **Effort: S**

### N3 · `InlineAccountStep` / `AccountField`: "Ping the operator" → a `/contact` link
`InlineAccountStep.tsx:42-45` is prose, not a link. It fires if Supabase's project-wide
email-confirmation toggle is ever flipped **for Orbit's benefit** — shared infra, zero blast-radius
containment. One-line fix, matching the pattern every other dead end in this codebase already uses.
Carry it into `AccountField` (C3). **Effort: S**

### N4 · Kate's four questions are schema, not UI
The one report in this run that is mostly **database**. `/my-listings` can't answer her because the data
to answer her doesn't exist:
- **`listing_id` on `pickup_requests`** (`lib/supabase.ts:50-65` has no such column) — nothing connects a
  pickup to the listings created from it, so the card can only print the status word "Listed for sale."
  A label says a fact occurred; a link lets her *see* it.
- **Contact-tap count** — the contact block is a bare `tel:`/`mailto:` anchor
  (`listing/[id]/page.tsx:198-201`) with no event logged. **No code path could ever answer "did anyone
  reach out?"** Log a count only — no message content — so it stays inside the locked model.
- **Payout fields** (`sale_price`/`amount_paid`/`paid_at`) — `/pickup/[id]:110` renders the same
  sentence whether the pickup is an hour or three weeks old. "Where's my money" is literally why she
  came back, and the product can only restate a policy she already read.
- **5-stage tracker** — Requested → Scheduled → Picked up → Listed → Sold. `STATUS_LABEL` (`:10-18`) is
  one word; someone checking in after 9 days wants to know how much is *left*.
- **Seller notifications** ("Your pickup is scheduled for Thursday") — **the highest-leverage line in
  04.** A "returning to check" persona *only exists because the product is silent.* Every other fix on
  her path makes the checking better; this one means she doesn't have to check.

Deferred not because it's unimportant but because it's L effort against 4 pickup requests — the
operator can text 4 people by hand today. Revisit at ~20. **Effort: L**

### N5 · `/my-listings`: summary line + draft as a task
A one-line summary above everything (*"1 sold · $18 earned · pickup scheduled Thu · 1 draft
unfinished"*) answers all four of Kate's questions with zero clicks. And the draft (`:240-244`,
`:264-270`) renders inline with her live listings, distinguished by an amber badge — **a thing she must
act on is styled identically to things she's done with.** Promote it to a banner above the list.
Mostly blocked on N4 for the money half. **Effort: M**

### N6 · Free-text item search
`BrowseExperience.tsx:165-234` scopes the only text box to finding a *school*; the filter bar (`:116-137`)
is five `<select>`s with no keyword input. A parent who wants "navy blazer size 16" has to guess-and-check
across five dropdowns. Filters narrow a list you're willing to browse; search jumps to a thing you already
have in mind — and search is the core interaction of the named competitor. Low today (2 listings), rises
fast with inventory. **Effort: M**

### N7 · Favorites + proximity sort
No save affordance on `ListingCard` (`:338-395`); no distance signal or sort despite "meet locally" being
the whole value prop (`:388-391` prints town as static text). Both are real, both are premature at 2
listings. **Effort: M**

### N8 · Trim `/new`'s closing caption
`:449-451` restates the two buttons directly above it and the contact card's own intro at `:414-417`.
→ **"Free to post."** **Effort: S**

---

## What I did not touch, and why

- **Forced accounts** — Dylan's explicit override of the 07-10 study. C3 changes the *mechanism* (field,
  not gate), never the rule.
- **Per-school hubs / `/s/[code]`** — killed 2026-07-11. C6 and H3 are URL filter state on `/`, not a hub.
- **The `/sell-for-me` hero** (`:166-174`, "You do nothing.") — it's correct. Don't touch it.
- **The native-share + copy-message pair** (`SharePanel.tsx:144-155`) — not a duplicate; native only
  renders when `navigator.share` exists (`:144`). Progressive fallback. Leave it.
- **The pile-size chips** (`sell-for-me:219-237`) — the best-built form control in the product.
