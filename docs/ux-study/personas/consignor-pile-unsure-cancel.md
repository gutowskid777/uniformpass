# UniformPass — Consignment Hero Journey UX Study
Author: UX/IA design pass · No-accounts web app · Concierge consignment ("Sell it for me") is the moat.

Scope note: this document designs the ideal experience from scratch, not a review of the current site. All three situations below funnel through one shared spine — landing/pitch → intake → secret-link status page — but each situation stresses a different part of that spine. Design notes at the end of each section call out what's shared vs. situation-specific.

---

## Consignor — Huge Pile
**Goal:** Hand off bags of uniforms/spirit wear with the least possible effort, and walk away confident they will actually get paid their 50% cut without having to chase anyone.
**Mental state / constraints:** Time-poor, slightly skeptical ("who is this random company and why should I let a stranger into my garage/trunk?"). Motivated by decluttering + money, in that order for some, reversed for others. Will abandon if the form feels like work, or if payout mechanics feel vague or shady. Physically constrained — may have 5-10 bags, needs to know if there's a size/count cap and how pickup logistics actually work (porch? in-person handoff? scheduled window?).
**Ideal entry point:** A dedicated `/sell` landing page reachable from the homepage nav ("Sell your uniforms") and from any product page ("Have uniforms to sell? →"). Should also be shareable/bookmarkable since parents forward these links to each other.
**Ideal click-path (numbered, ≤7 steps):**
1. Land on `/sell` — read "How it works" (3-step visual: Request pickup → We handle everything → You get paid) and payout math above the fold.
2. Tap primary CTA "Request a pickup."
3. Fill low-bar intake form (name, contact, school, town, rough item summary/count, notes) — single scroll, no login.
4. Submit → land on confirmation screen with secret status-link (auto-copied/emailed/texted) and a plain-English "what happens next, and when."
5. (Async, days later) Get a text/email nudge when status flips to "scheduled" with pickup window.
6. (Async) Pickup happens — status flips to "picked up," then "listed," then "sold" as it happens.
7. Get paid — payout notification with itemized breakdown, delivered to the same contact method, link to status page shows running total.
**The ONE primary CTA per key screen:** Landing → "Request a pickup." Intake form → "Submit pickup request." Confirmation → "View my status page" (secondary: "Save this link"). Status page (early states) → "Manage my request" (edit/cancel). Status page (late states) → "View payout" once items start selling.
**Trust / clarity reinforcement points (payout, who we are, handling your stuff):**
- Landing page states the 50/50 split in plain numbers with a worked example ("A $10 jersey nets you $5") — not buried in fine print.
- "Who's coming to my house" module: real name/photo of the pickup partner or a description of the vetting process (background-checked, badge, branded bag/vehicle), shown before they submit — this is the #1 trust blocker for a stranger-in-my-garage scenario.
- No-account model explained proactively: "No login, no app — just a private link only you have." This reframes the lack of accounts as a feature, not a missing feature.
- Payout timing stated up front ("Paid out within 3 business days of each sale, not held until everything sells") to kill the "will I ever see this money" anxiety.
- Insurance/liability line: what happens if something gets lost or damaged in transit — even a one-line "We photograph everything at pickup so there's a record" builds confidence.
**Components this journey demands (esp. how-it-works, low-bar intake, photo-a-pile, status tracker, cancel):**
- How-it-works module (3-4 step visual, scannable in <10 sec).
- Payout calculator/example widget (static or lightly interactive: "estimate your take" slider by rough item count).
- Low-bar intake form (see Situation 2 for full spec — same form serves both).
- Secret-link generation + delivery (email AND SMS option, since some parents strongly prefer text).
- Status tracker (5-stage horizontal/vertical progress: Received → Scheduled → Picked up → Listed → Sold/Done) with per-stage timestamp and plain-language subtext.
- Payout ledger view nested in status page once items start selling (running list: item, sold price, your 50%, running total).
**Friction to eliminate:** No account creation. No requirement to count/list every item individually. No requirement to be present for measurement/inspection before submitting — that all happens at pickup. No ambiguity about "did this actually submit" — confirmation screen must be unmissable and the link must be delivered redundantly (on-screen + email + optional SMS) so it's never lost.
**Top 3 non-negotiables:**
1. The 50% payout math and pickup logistics must be visible and concrete BEFORE the user starts filling out the form — trust has to be earned pre-commitment, not after.
2. The secret status link must be delivered through at least two channels automatically (shown on-screen + emailed, SMS optional) — losing this link with no account recovery path is the single biggest failure mode.
3. Pickup scheduling flexibility (a real window, not "someone will call you") must be part of the post-submit flow, communicated proactively via status updates, not something the owner has to check for.

---

## Consignor — Unsure What They Even Have
**Goal:** Get rid of a messy pile without having to inventory, count, sort, or even fully know what's in it — hand over the ambiguity itself, not just the clothes.
**Mental state / constraints:** Anxious about being "wrong" on a form ("I don't know if it's 15 or 30 items"), worried about looking unprepared, likely to abandon at any field that feels like it demands precision. Closet is disorganized — sizes, conditions, and even school/team affiliation may be mixed or unknown to them (hand-me-downs, multiple kids, multiple schools over years). Needs explicit permission to be vague.
**Ideal entry point:** Same `/sell` landing page, but the intake form itself must actively signal "rough answers are fine" rather than assuming the user reads a disclaimer once — this persona needs reassurance repeated at the point of friction, not just up top.
**Ideal click-path (numbered, ≤7 steps):**
1. Land on `/sell`, see reassurance messaging baked into the pitch itself ("Don't know what you have? Neither do most people — that's what we're for.").
2. Tap "Request a pickup."
3. Reach intake form: name/contact/school/town fields are plain text; the "what do you have" section uses a **range picker** ("A few items / A bag / Several bags / A whole closet") instead of a count field, plus an optional **"photo-a-pile"** upload (snap the pile as-is, no staging/folding required) as an alternative or supplement to typing.
4. Optional free-text notes field explicitly labeled "Anything you do know helps, but skip if unsure" — lowers perceived obligation.
5. Submit — confirmation screen explicitly says "We'll sort, sort out sizes/condition, and confirm anything unclear when we pick up" so the user knows the sorting burden has fully transferred.
6. Status page later shows a "here's what we found" recap once the pile is received/sorted (turns their uncertainty into a concrete manifest they didn't have to produce themselves) — a moment of delight, not just a status flip.
7. Continue tracking toward sold/paid same as huge-pile flow.
**The ONE primary CTA per key screen:** Landing → "Request a pickup" (same). Intake → "Submit — we'll take it from here" (copy reinforces that imprecision is fine, not just "Submit"). Confirmation → "View my status page." Status "received" stage → passive, but if a manifest recap exists, CTA is "See what we found" (satisfying reveal, builds trust in the sorting process).
**Trust / clarity reinforcement points (payout, who we are, handling your stuff):**
- Explicit copy: "You don't need to count, sort, or know sizes — we handle that." Placed both on landing and directly above the intake range-picker, since that's the exact moment of hesitation.
- "We'll sort it" promise reinforced again in the confirmation screen and again in the "received" status stage — repetition matters more for this persona than for the confident huge-pile persona.
- Photo-a-pile framed as *optional and low-effort* ("one photo, however it looks") — explicitly not a staged/flat-lay photo requirement, to avoid recreating the precision anxiety the range picker just removed.
- The "here's what we found" recap after pickup doubles as a trust-building artifact: it shows the owner that sorting genuinely happened and nothing was lost or ignored, without them having to have specified it themselves.
**Components this journey demands (esp. how-it-works, low-bar intake, photo-a-pile, status tracker, cancel):**
- Range-picker input (not numeric stepper) for "roughly how much" — few / a bag / several bags / a whole closet.
- Photo-a-pile uploader: single or multi-photo, mobile-camera-first, no cropping/tagging required, explicit "however it looks" microcopy.
- Reassurance microcopy pattern reused at every friction point (landing, form, confirmation, first status stage) rather than stated once.
- Post-pickup "manifest recap" component on the status page — a lightweight, auto- or manually-generated summary of what was received, shown once the "received" or "picked up" stage completes.
**Friction to eliminate:** Any required numeric or itemized field. Any implication that vague answers will delay or jeopardize the pickup. Any UI pattern (multi-step wizard, per-item rows) that suggests inventory-level detail is expected. Photo upload must not require staging, folding, or multiple angles — one imperfect photo of the pile is a complete submission.
**Top 3 non-negotiables:**
1. No field in the intake form may require a precise count or itemized list — range/fuzzy inputs only, with photo-a-pile as a first-class alternative to typing.
2. Reassurance copy ("we'll sort it," "rough is fine") must appear at the exact point of hesitation (next to the range picker), not just once on the landing page.
3. The post-pickup experience must close the loop on their uncertainty — a manifest recap or equivalent confirmation that sorting actually happened, so the owner isn't left wondering if their vague submission was "enough."

---

## Consignor — Wants to Cancel Later
**Goal:** Be able to check on the request at any time and back out cleanly and without friction or guilt if they change their mind — and know exactly when that door closes.
**Mental state / constraints:** Not yet fully committed at submission time; may be testing the waters or waiting on a spouse/co-parent's buy-in. Anxious about "being a pain" or about irreversible commitments (worried once a stranger has scheduled a pickup, backing out is awkward). Needs the cancel path to be self-serve — will not call/email support to cancel if a form said "email us."
**Ideal entry point:** The secret status-link itself (from any of the three confirmation delivery channels — on-screen, email, SMS). No separate "manage my request" search/login flow is acceptable, since there are no accounts — the link IS the access mechanism, so it must always work and always be easy to relocate.
**Ideal click-path (numbered, ≤7 steps):**
1. Open the secret status link (from email/SMS/bookmark) at any time post-submission.
2. See current stage prominently (Received/Scheduled/Picked up/Listed/Sold) plus a plain-language note of what's still cancellable at this stage.
3. Tap "Manage my request."
4. See explicit cancellation eligibility stated before any action: e.g., "You can cancel free anytime before pickup. Once picked up, items are already in motion and can't be pulled back." No ambiguity, no guilt language.
5. If eligible: tap "Cancel my request," confirm once (single lightweight confirm, not a survey/guilt gate), done.
6. See immediate cancellation confirmation + explicit statement that nothing further will happen and no charge/obligation exists.
7. If NOT eligible (post-pickup): status page instead surfaces the closest equivalent action — e.g., "request specific items back" or a direct contact path — rather than a dead-end "can't cancel" message.
**The ONE primary CTA per key screen:** Status page (pre-pickup) → "Manage my request." Manage screen → "Cancel my request" (or "Update my request" as secondary, not required). Cancel confirm step → "Yes, cancel" (single confirm, no multi-step guilt flow). Post-cancel screen → "Done" / optional "Submit a new request" if they change their mind again. Status page (post-pickup, non-cancellable stage) → "Contact us about this item" as the closest available action.
**Trust / clarity reinforcement points (payout, who we are, handling your stuff):**
- Cancellation policy is stated proactively on the status page at every pre-pickup stage — not something the owner has to hunt for or infer. "You can still cancel free" should be visible ambient text, not hidden behind a click.
- No guilt-trip copy, no retention dark patterns (no "are you sure? you'll lose $X" scare framing, no forced reason-for-leaving survey blocking the cancel action).
- Clear articulation of the cutoff: cancellation eligibility tied to a real, understandable milestone (pickup) rather than a vague or arbitrary time window — this matters more for trust than for the mechanic itself.
- After cancellation, explicit confirmation that no data/items are retained or acted upon further — closes the loop so the owner isn't left wondering if it "really" cancelled.
**Components this journey demands (esp. how-it-works, low-bar intake, photo-a-pile, status tracker, cancel):**
- Status tracker with a persistent, stage-aware "what's still changeable" annotation (not just a progress bar — the bar must carry cancellation-eligibility metadata visibly).
- "Manage my request" panel: edit details (contact info, notes) and cancel, scoped by current stage.
- One-tap cancel with single lightweight confirmation (no multi-screen exit-survey flow).
- Post-cancel terminal state screen, distinct from other statuses, with a path back in ("submit a new request") in case of a later change of heart.
- Fallback "contact us" component for the post-pickup, non-cancellable state, so the flow never dead-ends.
**Friction to eliminate:** No login/search needed to find "my request" — the link is the whole mechanism, so it must be resurfaceable (resend-link option on the landing page keyed to contact info, in case the original link/email/text is lost). No required reason-for-cancelling field. No multi-step "are you sure, are you REALLY sure" gate. No hidden cancellation policy — it must be visible before the user goes looking for it.
**Top 3 non-negotiables:**
1. Cancellation must be one tap plus one confirm — zero required justification, zero retention friction.
2. The eligibility line ("cancel free until pickup") must be stated proactively and persistently on the status page, not discovered only when the user goes looking to cancel.
3. Because there are no accounts, there must be a self-serve way to recover a lost secret link (e.g., "resend my status link" using the original contact info) — otherwise "wants to cancel later" silently becomes "can't reach support and gives up," which is worse than no cancel flow at all.

---

## Cross-cutting design notes (shared spine)
- All three situations share one intake form and one status-tracker component — the differences are entirely in copy emphasis, input type (range vs. count), and which panel (payout ledger vs. manage/cancel) is surfaced first, not in separate flows or separate forms. Building three different forms would fragment trust-building and double the maintenance cost for zero UX gain.
- The secret link is the single hinge the entire no-accounts model depends on: it must be delivered redundantly at submission (on-screen + email + SMS), resurfaceable later (resend-by-contact-info), and must encode enough state (current stage, cancellation eligibility) that the owner never needs to remember anything about their own request.
- Trust-building content (who's coming to pick up, payout math, timing) belongs on the landing page before commitment, and is echoed at the two moments of highest anxiety: the intake form itself (right before submitting) and the first status-page view (right after committing).
