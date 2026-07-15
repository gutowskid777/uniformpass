STATUS: complete

# Persona: Sue — PTA connector, the distribution multiplier

## 1. Who she is

Sue, 52, PTA volunteer at Bergen Catholic. Controls the school newsletter and a 400-parent Facebook group. She is not shopping — she is deciding whether to spend her own credibility.

**Success, in her words:** *"I can post this in two minutes, and it makes ME look like the parent who found something genuinely useful and safe for Bergen Catholic families — not like I fell for some random startup's ad."*

She is the highest-leverage user in the product (one post from her ≈ hundreds of buyers/sellers), and nothing in the current build is built for her specifically — every screen assumes the visitor is already a buyer or seller, not a gatekeeper deciding whether to open the door for 400 people at once.

---

## 2. The ideal journey

Designed from scratch, constrained only by the locked model (no payments, no shipping, meet locally, Auto Sell = the moat).

**Step 1 — Cold landing: pass the 5-second legitimacy check.**
One job: prove in one glance this isn't spam/a scraper/a scam before she reads a single feature. A real name or face ("Started by [name], a Bergen County mom, after her own kids outgrew their SJR uniforms"), a way to reach an actual person (not just a contact form), and plain language about what it does. She is not evaluating the product yet — she's evaluating *whether this could embarrass her.*

**Step 2 — See it dressed as "ours."**
One job: prove local relevance and let her preview exactly what a Bergen Catholic parent will land on. A scarlet-and-gold Bergen Catholic view (or at minimum a URL that filters straight to Bergen Catholic listings), so she isn't handing her 400 families a generic, unbranded, multi-school grid that could be showing Don Bosco polos when someone clicks.

**Step 3 — Get a ready-made post, see the real preview.**
One job: remove all authorship friction. A pre-written, Bergen-Catholic-scoped message ("Bergen Catholic families... a spot to buy/sell used BC uniforms locally, no fees, meet up in person") plus the *actual* link-preview card that will render in the Facebook group or newsletter email — so she never has to trust it sight-unseen. This step should feel like it was built *for the person doing the sharing*, not repurposed from a buyer/seller flow.

**Step 4 — Reassurance for the liability question she's actually asking.**
One job: answer "am I on the hook for this, and is the school associated with it in a way that could bite anyone?" A one-line disclaimer that this is an independent, parent-run service, not affiliated with or endorsed by the school, no fees change hands through the site, all payment is in person. This is the line a PTA volunteer needs before she'll paste something into an official newsletter, not just a Facebook post.

**Step 5 — One tap, done, no account.**
One job: she is never asked to sign up, log in, or fill out a form. Copy button → paste into Facebook/newsletter → close tab. Anything that requires her to create an account to distribute the flyer is a step she will not take.

**Step 6 (optional, not required for v1) — A reason to come back and post again.**
One job: some lightweight signal that it's working for her school specifically ("12 Bergen Catholic families have used this"), so the next time the PTA newsletter goes out, she has an easy, true reason to mention it again instead of wondering if she over-promoted a dud.

---

## 3. Where the current build diverges

**No school-scoped share link exists — the "for us" promise is unbuildable today.**
`lib/shareMessages.ts:6-11` (`buyMessage`/`sellMessage`) is written to take a `SchoolTheme` and produce a Bergen-Catholic-scoped message ending in `scopedUrl(theme.code)`, which resolves to `/s/bc` (`lib/schoolTheme.ts:102-108`). But every call site that renders `SharePanel` passes `theme={null}` — `app/flyer/page.tsx:31` and `app/listing/[id]/page.tsx:76` — so that branch is dead in production. Worse, `/s/[code]` itself was archived on 2026-07-11 (`docs/archive/school-sections-2026-07-11/`) and no longer exists as a route, so even a wired-up theme would send Sue's 400 families to a 404. Current behavior: the only shareable message Sue can generate says generic "school" language and links to the bare `uniformpass.shop` homepage. Correct behavior: a live `?school=<bergen-catholic-id>` (or restored `/s/bc`) link, generated and copy-ready from the flyer/share screen, that filters straight to Bergen Catholic listings. Why: Sue's entire pitch to her group is "this is *our* school's thing," not "here's a general marketplace that happens to include us" — without a scoped link, she's asking 400 people to wade through Don Bosco and SJR listings to find their own, which reads as generic and unvetted, not community-built.

**No "who runs this" anywhere in the app — the exact question she needs answered is unanswerable.**
`app/layout.tsx:61-71` (site-wide footer, the only persistent trust surface) has no operator name, no "about," no "who we are" — just "Contact us" (a form, `app/contact/page.tsx`) and "© 2026 UniformPass. All rights reserved." `context.md:19` confirms this was noticed and explicitly deferred: *"About the founder/team section: PARKED (Dylan: 'later bc that's hard')."* Current behavior: a PTA volunteer scanning for the name of a real, accountable local person finds nothing — just a corporate copyright line. Correct behavior: one sentence, one place (footer or a dedicated `/about`), naming a real person and the local story ("built by a Bergen County mom for local schools"). Why: Sue isn't vetting features, she's vetting *whether she'll be blamed if this goes wrong* — an anonymous "All rights reserved" reads exactly like the scraper apps she's trained to filter out of the group, and she will not risk her name on something she can't attribute to a person.

**The Share tool is buried where only buyers/sellers would find it — not built as a first-class action for her.**
The single entry point to the "give me something to post" flow is a small gray footer line, "Spread the word: share the flyer" (`app/layout.tsx:64-65`), phrased as a request rather than offered as a tool. It's absent from primary nav (`app/layout.tsx:42-56`) and absent from the mobile bottom nav's 4 tabs — Browse / Auto Sell / Sell / My Listings (`components/BottomNav.tsx:6-11`) — all four of which assume the visitor is a buyer or seller. Correct behavior: a "Share" tab or button with equal visual weight to "+ Sell," reachable in one tap from anywhere. Why: the product currently has zero navigation surface built around the *distributor* role — every tab assumes "I want to buy/sell," but Sue's job on the site is neither; she's looking for the thing to hand to other people, and today she has to already know it's hiding in the footer to find it.

**Copy that undercuts the "trustworthy neighbor, not a startup" framing she needs.**
`app/sell-for-me/page.tsx:284-287`: when donate is selected the sub-line reads "Support the startup!" Current behavior: self-identifies the operator as a for-profit venture soliciting free inventory, in the exact spot a skeptical PTA mom would read closely before deciding whether to point her community's donated goods at it. Correct behavior: language consistent with the community-service framing elsewhere on the site (e.g. "Goes to families in need" or similar), never "startup." Why: Sue's currency with her group is "I found something genuinely useful for our community," not "I'm promoting someone's business" — a line that reveals the profit motive at the exact moment trust is being tested reads as a red flag, not a wink.

**The one good trust-building feature that exists is neutered by the theme-null bug above.**
`components/SharePanel.tsx:106-116` — showing the real OG image with the caption "This is the exact preview the group will see when you paste the link" is genuinely the right idea for Sue: it lets her verify the post won't look broken or spammy before she commits her name to it. But because `theme` is always `null` (see divergence 1), the preview she'll always see is the generic indigo "Turn uniforms into cash" card, never a Bergen-Catholic-branded one — so the one piece of the product actually designed around her verification instinct can't do the one job that would matter most to her (proving it's *hers*, not generic).

---

## 4. The single moment she quits

**Screen:** the site-wide footer, first visit (`app/layout.tsx:61-71`), the moment right after she's decided the product idea itself is fine and is now looking for who's behind it.

**Exact reason:** she scans for a name — an "About," a founder, anything that tells her a real, identifiable local person is accountable for what she's about to hand to 400 families — and finds only a "Contact us" form and "© 2026 UniformPass. All rights reserved." That copyright-line phrasing is the same pattern she's trained herself to distrust from years of moderating a Facebook group full of scraper apps and MLM pitches. She never gets to the flyer, the share message, or the real OG preview (all of which are actually good) — she closes the tab here, before Step 1 of her ideal journey is even satisfied, because the product never answers the one question she came to ask: *who is this?*
