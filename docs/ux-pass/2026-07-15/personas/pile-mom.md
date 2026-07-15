STATUS: complete

# Persona journey: Maria — mom with a pile, wants zero work

## 1. Who she is

Maria, 44, Montvale. Two boys just outgrew their St. Joseph Regional uniforms — blazers, polos, khakis, gym gear filling a closet. She has ~10 minutes, near-zero patience for a chore, and would rather donate the whole pile than photograph 14 items. She's the Auto Sell / moat persona. She heard about this from another mom at pickup.

**Success, in her words:** *"Someone takes this pile off my hands today and I never have to think about it again — I don't even care if I see the money."*

The job of every screen she touches is to prove that promise true, one step at a time, and never ask her to do anything a listing-seller would do (photograph, price, describe, wait for a buyer).

## 2. The ideal journey

**Step 0 — she hears the pitch, in person, at pickup.**
Job: the other mom's sentence *is* the product pitch ("there's a site, you tell them what you have, they come get it"). Whatever Maria taps next must not contradict that sentence in its first five words.

**Step 1 — she taps a link/QR and lands on a page that says exactly what she was just told.**
Job: confirm the promise instantly. Headline: *"Give us your pile. We'll take it from here."* One CTA, no search box, no browsing, no marketplace framing. If she arrived from a general link, this is the very first thing on the page — not the third thing after a hero and a search bar.

**Step 2 — one short form: name, contact, school, town, pile size (tap a chip).**
Job: capture only what's needed to schedule a pickup. No item count, no photos, no pricing, no condition grading. A tap on "A closet-full" should be sufficient — no free-text required to submit.

**Step 3 — she taps submit and is DONE, full stop.**
Job: whatever identity/account mechanics the business needs must not feel like a second form to her. If an account must exist, it should require the least possible authored input (ideally just her email — no password she has to invent and will never remember, since she's never coming back).

**Step 4 — confirmation screen: "Got it. We'll text you to set a pickup time — usually within [N] days."**
Job: give her a concrete, time-bound promise so she doesn't have to wonder if it worked or nag anyone. No instruction to "bookmark this page" — she has ten minutes today and zero interest in a URL to save.

**Step 5 — (off-app) a real text/call arranges a window; she leaves bags by the door; done.**
Job: this is where her actual "work" — carrying bags to the door — happens. Everything before this must have cost her under 90 seconds of typing.

**Step 6 — (optional, low-stakes) she's told when it sold / that her share was donated.**
Job: closes the loop without requiring her to check anything. Not required for her definition of success, but reinforces trust for the next pile.

## 3. Where the current build diverges

**Divergence 1 — the shared link lands her on the general marketplace hero, not the Auto Sell pitch her friend already gave her.**
`lib/schoolTheme.ts:23` — the flyer/share QR (`SITE_URL`) and `app/api/flyer-image/route.tsx:40` both point at the bare homepage `/`. The first thing she reads there is `components/BrowseExperience.tsx:193-195`: *"Stop buying uniforms new." / "Buy and sell used uniforms with families at your school."*, followed immediately by a school search box (`BrowseExperience.tsx:200-226`). This is the opposite framing of what she was told ("they just come get it") — it reads as a listings marketplace, the exact kind of chore she wants to avoid. The Auto Sell band (`BrowseExperience.tsx:238-260`) does render right after the hero, but only after she's already parsed a headline and search box that contradict her friend's pitch — on a real phone viewport that hero (title + subhead + input + trust line, `BrowseExperience.tsx:190-231`) is tall enough that the Auto Sell band is a scroll away, not an instant confirmation. **Fix:** any link shared specifically for word-of-mouth Auto Sell referrals (flyer, "tell a friend" copy, a `?ref=` variant of the QR) should route straight to `/sell-for-me`, whose hero (`app/sell-for-me/page.tsx:166-174`, *"You do nothing."*) is the correct promise-matching landing screen. **Why:** a persona who explicitly "would rather donate than do work" bounces the instant a screen looks like it's going to ask her to do the work she was told she wouldn't have to do — the mismatch between the spoken pitch and the landing page is a trust break, not just a copy nit.

**Divergence 2 — finishing the form isn't finishing the task; she's handed a password to invent.**
`app/sell-for-me/page.tsx:159` (`if (!user) { setShowAccount(true); return }`) gates submission behind `components/InlineAccountStep.tsx`, which requires a password of 6+ characters (`InlineAccountStep.tsx:31,76-79`) before the request is ever sent. She has just finished a form she was told was "free pickup, no work" and, at the exact moment she expects to be done, is asked to author and remember a credential for a site she has no intention of ever revisiting. The blurb (`InlineAccountStep.tsx:70`, *"10 seconds, no email to check"*) undersells it — it's still a second form, with a field (password) that has nothing to do with her task (getting rid of a pile). **Fix:** for the Auto Sell entry point specifically, auto-generate the password rather than asking her to type one (still an account, still password-auth — not a reversion to magic links) — she only types her email, and a small "we saved a password for you, find your account by resetting anytime" note replaces the create-a-password field. **Why:** the account requirement is locked, but *authoring a password* is not required by that lock — for a persona who is done the moment she hits submit, any extra field she has to compose (versus one she just confirms) is the friction that turns "10 seconds" into a bounce.

**Divergence 3 — the confirmation screen tells her to do something the account system already made unnecessary.**
`app/pickup/[id]/page.tsx:94`: *"Bookmark this page to check status or cancel."* This is leftover copy from the pre-account, secret-token era (2026-07-08, per `context.md:125-129`). Since 2026-07-11, pickup requests are tied to her account and already surface on `/my-listings` (`app/my-listings/page.tsx:62-79`, fetching from `/api/my/pickups`), so asking her to manually bookmark a token-bearing URL is redundant busywork the current architecture doesn't need. **Fix:** replace with *"Find this anytime under My Listings — just sign back in with your email."* **Why:** asking a zero-effort persona to perform a manual browser action (bookmark) for state the product already tracks for her signals the product doesn't know its own account model exists — it reads as more fragile/effortful than it is, right when she should be feeling done.

**Divergence 4 — no time-bound promise for what "we'll reach out" means.**
`app/sell-for-me/page.tsx:306`: *"We'll reach out to schedule a time before pickup. Cancel anytime."* — no window (today? this week?). Pickup status changes are entirely manual on the admin side (`app/admin/page.tsx:11,129-140`, `PICKUP_STATUSES` moved by hand `new → scheduled → …`), so there's no system-driven follow-up if the operator is slow. For a persona whose whole point is "I want to hand this off and forget it," an open-ended promise reintroduces the exact anxiety she was trying to eliminate — did it work? did I do it right? **Fix:** commit to a concrete window in the copy (*"We'll text you within 2 days to set a pickup time"*) and hold the operator to it. **Why:** "zero work" includes zero mental overhead — an unbounded promise forces her to hold a background worry ("did this actually happen?") that a bounded one removes entirely.

## 4. The single moment she quits

**The `InlineAccountStep` password field** (`components/InlineAccountStep.tsx:76-79`), triggered the instant she taps "Get my free pickup" on `app/sell-for-me/page.tsx:296-299`.

She has just spent her genuinely-available 90 seconds: name, contact, a tap on "A closet-full," a tap on "Donate it." She hits the big green button expecting to be done — that's the entire promise of the page ("You do nothing"). Instead a modal appears asking her to invent and remember a password for a site she was told requires no work and that she has no intention of ever opening again. This is the one step in the whole flow that asks her to *author* something with no connection to her actual goal (getting rid of the pile), positioned at the exact moment she expected completion. That combination — unexpected extra task + broken "you're done" expectation — is the highest-probability bounce point in the journey, higher than the homepage-framing mismatch in Divergence 1 (which she can shrug off by scrolling) because this one arrives after she's already invested the effort and was told she was finished.
