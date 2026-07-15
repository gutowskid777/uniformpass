STATUS: complete

# 02 — Per-page specs
Per page: its ONE job · above the fold · the SINGLE primary CTA · mobile notes.
Breakpoint reality: `sm:` = 640px. The launch audience is below it, on 390px, arriving by QR and group text.

---

## `/` — Browse

**ONE job:** route intent. Get you to your school's grid, or into one of the two doors.

**Above the fold (cold state):**
1. H1 — **"Turn uniforms into cash."** The *verbatim* string from the OG card
   (`app/api/og/route.tsx:82-84`) and the flyer (`app/api/flyer-image/route.tsx:110-115`).
2. Subhead — "Or find your school's uniforms for a fraction of the store." (bridges H1 → the finder)
3. The school finder (unchanged input, `BrowseExperience.tsx:200-210`) — **primary CTA**
4. The two-door module, equal weight: **We sell it for you (keep 50%)** / **List it yourself (keep 100%)**
5. Trust strapline — "No fees · No shipping · Meet locally" (`:228-230`, keep)

**SINGLE primary CTA:** the school finder.

Why the finder and not a door: it is the one action all six personas take. The doors answer "I have stuff" —
a second-order intent held by two of six. Making them the primary CTA would ask Rob and Dana to make a
decision they don't have. They're a *decision module*, not a CTA, and they sit below the finder.

**The four changes:**

- **H1 must echo the card.** *Current:* "Stop buying uniforms new." (`BrowseExperience.tsx:193-195`) — a pure
  buyer pitch with no cash or sell language, while **both** channels that lead here open with "Turn uniforms
  into cash" and lead with Auto Sell. Three agents found this independently. *Why:* message match is the whole
  of a 5-second test. Maria was told by a friend "they just come get it," taps, and reads a headline about
  buying — a beat of "wrong page?" she has no invested interest to spend resolving. The flyer is in circulation
  right now; this mismatch is live.

- **Two doors at equal weight.** *Current:* `ConsignmentBand` (`:238-260`) is a full emerald module with its
  own headline and filled CTA; the DIY path's only homepage presence is a nav pill (`layout.tsx:50-55`).
  *Why:* Jen is the persona who converts on DIY — she rejects the 50% cut on principle — and the homepage
  pitches the 50% option hard and the 100% option not at all. It steers its best-fit seller toward the door
  she'll refuse, and tells everyone else the platform mainly wants a cut. (This is also the visible structural
  change the "epic redesign" never delivered — one banner becoming two doors is legible at a glance.)

- **The hero needs a scoped state.** *Current:* `?school=` filters the grid (`:23,64`) but the page still opens
  on the generic indigo hero; Rob has to scroll past a pitch for a product he's already inside.
  *Correct:* when `?school=` is present on load, the hero collapses to a compact bar — "Don Bosco Prep ·
  Ramsey, NJ [✕ all schools]" — and the page opens at `#browse`. `pick()` already scrolls to `#browse`
  (`:187`); a deep link should do the same. *Why:* a flyer taped in the DBP lobby has already told you the
  school with 100% certainty. Re-asking is throwing away a free, perfect signal. This is a filter state, **not**
  a revival of `/s/[code]` — no themed hero, no monogram, no second site.

- **Delete the filter-bar school `<select>`** (`:117-120`). Second widget on the same `schoolId` state. Replace
  with a dismissible chip by the `Fresh from {schoolName}` heading (`:100-102`).

**Mobile:** the finder is the first-focused element — keep it. The two-door module must be two stacked full-width
cards below 640px, not a squeezed 2-col. Filter bar already collapses behind `▼ Filters` (`:106-113`) — good,
leave it.

---

## `/listing/[id]` — One item

**ONE job:** get a stranger to trust this listing enough to text the seller.

**Above the fold (mobile):** photo (compact, not full-height) · price · item · school · **Contact [Seller]**.

**SINGLE primary CTA:** Contact the seller.

- **The CTA is 2-3 screens below the fold on mobile.** *Current:* `grid-cols-1 md:grid-cols-2`
  (`:89`) stacks the gallery above the details column below 768px. The `aspect-[3/4]` hero photo alone is
  ~520px tall at 390px, and the contact block (`:186-212`) sits after price, tags, the facts table, and the
  comments box. *Correct:* sticky bottom contact bar (above `BottomNav`), or a compact price+CTA directly
  under the title before the full gallery. *Why:* the desktop 2-col layout hands the CTA top-of-viewport
  visibility for free; stacking takes it away and replaces it with nothing — on the device 100% of the launch
  audience uses. The one action that converts a browse into a sale is behind a wall of photo.

- **`← Back to listings` throws away his school.** *Current:* a hardcoded `<Link href="/">` (`:70-72`). Rob
  filters to Don Bosco, opens a wrong-size blazer, taps back, and lands on the unfiltered homepage — he
  re-types "bosco." *Correct:* carry the filter (`/?school=${school_id}`) or `router.back()`. *Why:* this is
  the brief's own corner-✕ failure — a nav control that silently discards context teaches a cold, untrusting
  visitor that the app doesn't remember what he told it. That reads as broken, not merely annoying.

- **The no-contact fallback points at a channel that doesn't exist.** *Current:* `:206-210` — *"Check the
  comments above, or reach out through your school community."* There is no comments/messaging system; the
  locked model is direct contact, full stop. *Correct:* make contact required to post `available` (see `/new`)
  and replace this state with a real fallback — a mailto to the operator who can forward the inquiry. *Why:*
  browse → listing → contact is the *entire* money path. A listing with no contact hasn't lost a feature, it's
  lost the only mechanism this product has for a stranger to reach a seller — and the copy shrugs at him.

- **Cut the `School` row** (`:169`) — verbatim echo of the eyebrow at `:126`.

- **Add "Report this listing"** — a small link to `/contact` with pre-filled context. *Why:* trust in a
  no-payment, no-messaging marketplace rests entirely on the belief that misbehavior has consequences. Cash
  changes hands off-platform with no record. Even an unglamorous report link signals someone is watching; its
  absence signals the opposite.

**Mobile:** the header row (`:69-87`) holds Back + Share pill + Manage pill with no `flex-wrap` — ~430px of
content in ~358px. Stack it below `sm` or shorten "Manage your listing" → "Manage". This is the screen a seller
lands on most often.

---

## `/sell-for-me` — Auto Sell (the moat)

**ONE job:** make Maria believe "you do nothing" is literally true, and take her request in under 90 seconds.

**Above the fold:** the emerald hero — **"You do nothing."** (`:166-174`). It's correct. Don't touch it.

**SINGLE primary CTA:** Get my free pickup.

- **Name the human.** *Current:* the page asks strangers to "Leave it by your door at a set time" (`:11-15`)
  for a completely unnamed "we" — no operator name, no face, nothing, here or on the confirmation. *Correct:*
  one line by the steps: "[Name] does the pickups herself — a [town] parent." *Why:* trust must scale with the
  ask. A cash meetup in a parking lot is a known social script; inviting someone to your home to collect your
  belongings is not. The product puts a safety module in front of the *smaller* ask
  (`listing/[id]/page.tsx:190-196`) and nothing in front of the *bigger* one.

- **Bound the promise.** *Current:* "We'll reach out to schedule a time before pickup." (`:306`) — today? this
  week? Pickup status is moved by hand in admin (`admin/page.tsx:129-140`); nothing drives a follow-up.
  *Correct:* "We'll text you within 2 days to set a pickup time." *Why:* "zero work" includes zero mental
  overhead. An unbounded promise hands her back the exact background worry ("did that actually go through?")
  she came here to get rid of.

- **Kill "Support the startup!"** (`:286`). *Correct:* "Goes to families in need." *Why:* Sue's currency with
  her 400-parent group is "I found something useful for our community," not "I'm promoting someone's business."
  One word reveals a profit motive at the precise moment trust is being tested.

- **Show the math when donating.** *Current:* the payout line is hidden entirely when Donate is selected
  (`:300-304`). *Correct:* keep the number, change the verb — "Half of every sale goes to families in need."
  *Why:* a donor is making a gift; a gift you can't size isn't a decision, it's a shrug.

- **Add one `<details>`: "What if it doesn't sell?"** — reuse the pattern already at `:248-261`.

**Mobile:** the 3-step grid (`:177-185`) is `grid-cols-3` at all widths — three 5xl emoji plus two lines of copy
each, at 390px. Verify it doesn't crush; stack to a row of 3 icons with the copy below if it does. The form is
already thumb-finishable (chips, not selects) — that's the best-built form in the product.

---

## `/new` — List it yourself

**ONE job:** get Jen's item live in under two minutes, and her next two in 45 seconds each.

**Above the fold:** photo picker first. *Why:* it mirrors FB Marketplace muscle memory exactly (photo before
anything) and gets the one asset she can't type from memory before she's asked to think.

**SINGLE primary CTA:** Post listing.

- **The account is a field, not a gate.** *Current:* `handleSubmit` (`:201-209`) intercepts with
  `if (!user) { setShowAccount(true); return }` — a modal fires *after* she pressed Post. See 01 for the full
  resolution. *Correct:* email + generated-password render inline above the submit button for logged-out users.
  *Why:* FB's Post button posts. Breaking that promise at the instant of "I'm done, right?" is where both
  seller personas quit.

- **Price is a lie.** *Current:* `:359` renders `Price ($) *` — but `validate()` (`:135-144`) never checks it,
  and `buildPayload` does `Number(form.price) || 0` (`:122`), which renders as **"Free"** in large bold on both
  the card (`BrowseExperience.tsx:384`) and the detail page (`:133`). *Correct:* block submit on empty price;
  make free an explicit checkbox. *Why:* Jen is *the* persona who wants 100%. She speed-runs the form trusting
  the asterisk to catch her, and her Bergen Catholic blazer goes live advertised free to the whole school. A
  false-required asterisk is worse than none — it's a promise the form breaks silently.

- **Two more false asterisks train her to ignore the real one.** `Category *` (`:245`) and `Gender *` (`:255`)
  both have working defaults (`:32-33`) and are never gated. *Correct:* drop the asterisks. *Why:* two false
  alarms teach her every asterisk is decorative — which is exactly what let Price through.

- **Require ≥1 photo to post `available`.** *Current:* `validate()` has no photo check. *Why:* the grid is a
  Poshmark-style photo wall (`BrowseExperience.tsx:154-156`); a gray "No photo" box isn't at a slight
  disadvantage, it's invisible. The photo *is* the listing to a scrolling buyer.

- **City + State are already known.** *Current:* a free-text City and a 51-option `US_STATES` `<select>`
  (`:366-381`, `lib/supabase.ts:84-90`), both gated at `:140-141` — two fields after she picked a school whose
  row already carries `city`/`state` (`lib/supabase.ts:11-13`). *Correct:* derive from the school; expose an
  override only for "other." *Why:* re-asking a question the app answered for itself two fields ago is the
  "this app doesn't know what it's doing" signal that sends a Facebook-fluent seller back to Facebook. A
  3-school beachhead should never render a 51-state dropdown.

- **Success → `/listing/[id]?new=1`,** with Share + **Post another** (school, contact, account pre-locked).
  *Current:* `:194` routes to the manage/edit form.

- **Trim the closing caption** (`:449-451`) to **"Free to post."** — the rest restates the two buttons directly
  above it and the contact card's own intro at `:414-417`.

**Mobile:** photo-delete `✕` is 20×20px (`:331-334`) — well under the 44px floor, on the screen where a mis-tap
deletes the photo she just took. Pad the hit area to ≥44px. Drop `capture="environment"` (`:347`): on many
Android browsers it launches the camera and skips the library entirely, so a seller who already photographed
the uniform can't select it.

---

## `/my-listings` — Your stuff

**ONE job:** answer Kate's four questions — did anything sell, did anyone reach out, when's my pickup, where's
my money — in five seconds, with no text to the operator.

**Above the fold:**
1. A one-line summary: *"1 sold · $18 earned · pickup scheduled Thu · 1 draft unfinished."*
2. The draft banner, if any — *"You have an unfinished listing: [item] — finish it."*
3. Then the lists.

**SINGLE primary CTA:** varies by state — finish the draft if one exists, else none (this is a status page, and
that's correct).

- **Pickups have no link to what they produced.** *Current:* `PickupRequest` (`lib/supabase.ts:50-65`) has no
  `listing_id`; nothing connects a pickup to the listings created from it. The card just prints the status word
  "Listed for sale." *Correct:* thumbnails linking to each resulting listing. *Why:* "did anything sell" is her
  #1 question. A label says a fact occurred; a link lets her *see* it — which is what "checking on my stuff"
  means.

- **No money ledger.** *Current:* `/pickup/[id]:110` renders the same sentence whether the pickup is an hour or
  three weeks old; there's no `sale_price`/`amount_paid`/`paid_at` anywhere in the schema. *Correct:* once
  `done`, show a dollar amount, a paid/unpaid state, and a date. *Why:* "where's my money" is literally why she
  came back, and the product can only restate a policy she already read on `/sell-for-me`.

- **"Did anyone contact me" is structurally unanswerable.** *Current:* the contact block is a bare
  `tel:`/`mailto:` anchor (`listing/[id]/page.tsx:198-201`) with no event logged. *Correct:* log a contact-reveal
  tap (a count only — no message content, so it stays inside the locked model) and show "3 people tapped to
  contact you." *Why:* it's one of her two named questions and today no code path could ever answer it. That's a
  missing capability, not a missing UI.

- **Status is a word, not a pipeline.** *Current:* one badge from `STATUS_LABEL` (`:10-18`). *Correct:* a
  5-stage tracker — Requested → Scheduled → Picked up → Listed → Sold. *Why:* someone checking in after 9 days
  wants to know how much is *left*; "scheduled" alone doesn't say whether she's near the finish or just past
  the start.

- **The draft is filed as inventory, not as a task.** *Current:* `:240-244, 264-270` renders it inline with her
  live listings, distinguished by an amber badge. *Correct:* a banner above the list. *Why:* a thing she must
  *act on* is styled identically to things she's done with.

- **"Post it" ships a broken listing live with zero checks.** *Current:* `:264-270` fires a bare status PATCH;
  `cleanUpdates()` (`api/listings/manage/route.ts:24-37`) has no completeness rule, and a draft only ever
  required school + item. One tap can put a $0, photo-less, contact-less listing on the public grid. *Correct:*
  route through the same validation as the post flow. *Why:* going live is the moment a listing starts trying to
  convert. A listing structurally incapable of converting doesn't fail quietly — it's live real estate on the
  page real users are hitting from the flyer right now, and it makes the whole marketplace look half-built.

**Mobile:** the action row (`:263-275`) is non-wrapping and near its width budget at 390px with labels like
"Mark available" — add `flex-wrap`. These are tap targets; a self-serve product shouldn't cramp its own
primary actions.

---

## `/seller/[id]` — One person's stuff

**ONE job:** convince a buyer this is a real person worth texting.

**Above the fold:** seller name · "Selling since [date]" · item count · contact affordance · the grid.

**SINGLE primary CTA:** Contact [Seller].

*Current (why it's wrong):* the whole file renders a name, a count, and a grid (`:33-38, 48-64`) — **less trust
information than the single listing that linked here**, which at least has "Posted [date]" and a contact block.
No "member since," no verified indicator, and **no way to contact anyone**. A buyer who wants to ask "anything
else in a 14?" must open an arbitrary listing and use *that* one's contact block. *Correct:* a "Selling since"
line from `MIN(created_at)` (the query already fetches it) and one contact affordance sourced from any of their
listings. *WHY:* a page whose entire reason to exist is "look at more from this person before you decide to
trust them" should be the most trust-dense page in the product. It's currently the thinnest — it answers "what
else do they have" but not the question that sent the buyer here: "is this a real person?"

---

## `/flyer` — The share kit

**ONE job:** hand Sue something she can paste in two minutes without spending credibility she can't get back.

**Above the fold:** the flyer artwork (the pitch) — then the school scope picker, then the copy-ready message
and the real OG preview, then Save / Print.

**SINGLE primary CTA:** Copy message + link.

- **It opens by telling you to forward a thing you haven't seen.** *Current:* order is (1) "Forward to anyone
  you know..." (`:18-20`), (2) Save/Print/Share (`:22-32`), (3) the artwork (`:34-40`). At mobile width the
  instruction and three buttons fill the entire first screen. *Correct:* lead with the artwork. *Why:*
  first-touch copy has to work for the least-informed reader who could plausibly land here — and the footer
  links here from every page. An instruction to act on something before showing what it is fails the 5-second
  test at step one.

- **Add the school scope picker → wire `theme` through.** *Current:* `SharePanel` gets `theme={null}` at
  `:31`, so `buyMessage`/`sellMessage` (`lib/shareMessages.ts:6-20`) can only produce generic "school" copy
  pointing at the bare homepage — and the branch that would scope it resolves to a deleted route. *Correct:*
  pick a school → `?school=<id>` links + scoped copy. *Why:* Sue's entire pitch to her group is "this is *our*
  school's thing." Without a scoped link she's asking 400 Bergen Catholic families to wade through Don Bosco
  listings — which reads generic and unvetted, exactly what she can't afford to post.

- **Add the liability line:** "An independent, parent-run service. Not affiliated with or endorsed by the
  school. No money changes hands through the site." *Why:* this is the line a PTA volunteer needs before
  pasting anything into an *official newsletter* — she's not evaluating features, she's evaluating whether
  she'll be blamed.

- **The real OG preview (`SharePanel.tsx:106-116`) is the best-designed thing in the product for Sue** — "the
  exact preview the group will see." It's neutered by the `theme={null}` bug: she'll only ever see the generic
  indigo card, never hers. Fixing `theme` is what makes it do its job.

**Mobile:** artwork first means the QR is on screen immediately — good. Keep Save/Print/Share as a sticky row
or directly under the image; don't make her scroll past a full 1080×1350 render to find them.

---

## `/contact` — Reach a human

**ONE job:** catch anything the self-serve product can't handle — including reports.

**SINGLE primary CTA:** Send.

- **Cut "or need help taking down a listing?"** from the H1 subtitle (`:49`). Dylan removed this from the
  footer on 2026-07-14 because sellers self-serve via `/my-listings → Manage → Delete`; it survived as this
  page's *headline*. *Why:* once a self-serve path exists, advertising the slow manual path as first-class
  undermines the reason it was built, and generates support tickets for a job already solved in two taps. Keep
  it only at `manage/page.tsx:204`, where it's shown to someone who has already proven they can't self-serve.
- **Add reporting to the copy** and accept a pre-filled subject from the listing page.

---

## `/signin` + `/reset-password` (NEW)

**ONE job:** get a returning seller back into their account.

**SINGLE primary CTA:** Sign in.

*Current (why it's wrong):* there is no reset path anywhere in `app/`. When `InlineAccountStep` detects an
existing account it says "enter your password to finish" (`:36-41`) with no recovery link — a seller with a
completed listing in memory and a forgotten password has *no way forward but abandoning the submission*. This
is not hypothetical: Dylan's own accounts needed a manual SQL reset (`context.md:107`). *Correct:* ship
`/reset-password`, and link "Forgot your password?" from both `/signin` and the inline account field. *WHY:*
this is the one step every non-first-time poster must pass. Unlike a confusing label, "wrong password, no
recovery" is a full stop — the user cannot self-serve past it. The original deferral ("needs email") is stale:
Resend is verified and delivering to the launch audience's Gmail/Yahoo/iCloud.

Also fix `InlineAccountStep.tsx:42-45` — *"Ping the operator"* is prose, not a link. Make it a `/contact` link,
matching the pattern every other dead end in this codebase already uses. It fires if Supabase's project-wide
email-confirmation toggle is ever flipped **for Orbit's benefit** — shared infra, zero blast-radius containment.

---

## `/admin` — Operator

**ONE job:** let the operator see a new pickup request within minutes and move it through the pipeline.

**SINGLE primary CTA:** the oldest un-actioned pickup request.

- **New requests must be impossible to miss** — sort `new` to the top; unread count badge.
- **`RESEND_API_KEY` is unconfirmed in prod** (`context.md:105`). `/api/pickups/notify:14-15` returns
  `{ ok: false, emailed: false }` when the key is absent, and `/sell-for-me:129-142` calls it with
  `.catch(() => {})` and never inspects the body. So the request saves, the seller sees "Got it! We'll be in
  touch," and **the operator may never learn it exists.** *WHY:* Auto Sell's entire pitch is "we handle it" —
  that promise is time-to-response, and this failure is silent on both sides. Verify the key in Vercel prod
  before the flyer push scales. This is the moat failing quietly.
