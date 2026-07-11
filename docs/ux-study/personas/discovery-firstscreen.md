# UniformPass — Discovery First-Screen UX Study

Design study, not a bug audit. Ideal-state design for the two cold-discovery situations that matter most given the GTM (NJ prep-school parent Facebook groups, class group texts, word of mouth). Business model is fixed: no accounts, no in-app payments, no shipping, off-platform cash/Venmo handoff, concierge consignment ("Sell it for me," 50% cut) as the moat.

---

## Discovery — Cold Homepage Landing (Facebook Group Link / Text / Word of Mouth)

**Goal:** A cold mobile visitor who clicked a bare link (no context beyond "someone posted this in the SJR parents group") understands in ~3 seconds what UniformPass is, confirms it covers their kid's school, sees their three options (buy / sell / hand off a pile via concierge), and trusts it enough to tap once — landing on "pick my school" as the single conversion action.

**Mental state / constraints:** Mid-scroll in a Facebook group or a group text, one thumb, low patience, zero brand familiarity. Actively suspicious of "yet another marketplace app," especially one that talks about cash/Venmo handoffs with strangers. Not going to create an account or download anything to find out more. Will bounce in under 3 seconds if the page reads as generic or irrelevant to their specific school.

**Ideal entry point:** The OpenGraph share card is the true "first screen" — it does half the convincing before the tap even happens. The actual landing page is a single, no-scroll-required fold: headline, subhead, school picker, trust line. No hero carousel, no marketing video, no "learn more" scroll wall.

**Ideal click-path (numbered, ≤7 steps):**
1. Sees the OG card in the FB group post or text thread — real uniform photo, plain-English headline, school name if the link is school-specific — and taps.
2. Lands on homepage: headline + one-line subhead + prominent school picker (typeahead, not a 200-item dropdown) above the fold.
3. Types or taps their school (e.g., "SJR" autocompletes to "St. Joseph Regional").
4. Lands on that School Hub page — this becomes their "home base," pre-filtered to only their school's listings.
5. Sees the buy / sell / consign fork as three equal-weight cards: "Browse listings," "List an item," "Sell it for me (we do the work)."
6. Taps "Browse" → grid of real listings with photos, sizes, prices — or taps "Sell it for me" → concierge intake starts.
7. Taps a listing → item detail page → "Contact Seller" reveals the off-platform handoff (text/Venmo), no account required.

**The ONE primary CTA per key screen:** Homepage: "Find Your School" (the picker itself, not a generic "Get Started"). School Hub: "Browse Listings" (primary) with "Sell / Consign" as an equally visible but secondary sibling, not competing for the same click. Listing card: "Contact Seller."

**The 3-second comprehension test (what the screen must convey instantly):** A headline that names the category and the mechanism in one line — e.g. "Buy and sell your kid's old uniforms. No shipping, no fees to browse." Paired with a real photo of an actual uniform item (blazer, polo, kilt), not generic stock marketplace art. A recognizable school crest or name visible without scrolling, so a skeptical parent in a specific school's group instantly registers "this is for us, this is real" rather than "this is some random app."

**Trust / clarity reinforcement points:**
- School crests/names as the primary visual trust anchor — curated-for-real-schools beats generic-resale-app every time.
- A one-line human origin story ("Started by a [local] parent/student") near the fold — kills the "corporate scraper app" read.
- No login wall to browse — the fact that you *can* look around with zero commitment is itself the proof this isn't a bait-and-switch.
- Explicit, plainly worded line near the fork: "Meet locally, pay however you want — cash or Venmo. We never touch your money." Said proactively, not buried in an FAQ, because the off-platform-payment model is exactly the thing that reads as scammy if unexplained.
- Real listing counts and real item photos (condition visible), not placeholder inventory.

**Components this journey demands (hero, school-picker hook, buy/sell/consign fork, OpenGraph share card, self-contained deep-link pages):**
- Hero: headline + subhead, no scroll required to reach the school picker.
- School-picker hook: typeahead/chip search, front and center, "no account needed" microcopy directly under it. If the referring link is already school-tagged, pre-fill/skip this step entirely.
- Buy/sell/consign fork: three cards of equal visual weight directly below or beside the school picker, not nested in a menu.
- OpenGraph share card: real item photo (or, for the generic homepage link, a collage of real listings), headline matching the on-page headline, school name/crest if the share originated from a school-specific context.
- Trust strip: schools served, "free to browse," one-line concierge explainer, one-line payment-off-platform disclosure.

**Friction to eliminate:** No signup/login before browsing anything. No forced app install. No location-permission prompt. No multi-step onboarding wizard before reaching the school picker. No long unsorted school dropdown — must be predictive/typeahead, and should auto-fill or skip entirely if the referral link already encodes the school.

**Top 3 non-negotiables:**
1. Browsing requires zero account creation, zero login — provable in the first tap.
2. School selection is the single, unmissable primary action on the first screen and takes one tap or a few keystrokes, not a menu dive.
3. The OG card and hero visual show real uniforms and real school identity, not generic marketplace stock art — this is what survives the 3-second sniff test inside a skeptical parent Facebook group.

---

## Discovery — Deep Link to a Specific Listing or School

**Goal:** Someone forwards one specific link — "look, an SJR blazer for $20" — in a text or FB comment. The recipient has never seen the UniformPass homepage and may not even register it's a marketplace at all. This single page must fully explain the product, confirm relevance to their school, and let them act — with zero assumption of prior context.

**Mental state / constraints:** Even less patience than the homepage visitor, because they were sent one link with one specific ask ("is this the blazer you need?"). Opening mid-text-thread, one-handed, possibly wary of tapping an unfamiliar link from a group text. Not going to detour to a homepage to "learn more about the site" — if this page doesn't answer "what is this and how do I get it," they close the tab.

**Ideal entry point:** The listing (or school hub) page itself, functioning as a fully self-contained mini-landing-page — item facts, a compact brand explainer, trust signals, and the action, all visible without a deep scroll. No dependency on having seen any other page.

**Ideal click-path (numbered, ≤7 steps):**
1. Taps the shared listing link — the OG card already shows the item photo, price, school name, and "on UniformPass" branding, so context is set before the tap.
2. Lands directly on the Listing Detail page: item photo, title, price, size, condition, and school tag all visible immediately, no scroll needed.
3. Sees a compact "What is UniformPass?" one-liner near the item info (e.g., "Buy/sell used uniforms directly with other [School] parents — no account needed") so brand context registers without navigating anywhere else.
4. Confirms fit/relevance at a glance — school crest, size, grade level clearly tagged next to the photo.
5. Taps the single primary CTA: "Contact Seller."
6. Contact method (text/Venmo) reveals or opens as a pre-filled message — off-platform handoff begins immediately.
7. (Optional, secondary path) Taps "See more from [School]" to keep browsing without ever needing the homepage.

**The ONE primary CTA per key screen:** Listing Detail: "Contact Seller" (or "I'll take it") — the explainer strip, the school link, and "browse more" are all visually subordinate to this one action.

**The 3-second comprehension test (what the screen must convey instantly):** Above the fold, in one glance: a real item photo, the price, the school name/crest, size/condition — plus a single-line site descriptor confirming this is a peer-to-peer listing tied to a specific school ("UniformPass — buy/sell used uniforms directly with other [School] parents"), not a scam link or an unrelated app. A visitor with zero prior context must be able to answer "what is this, is it for my school, how do I get it" without scrolling.

**Trust / clarity reinforcement points:**
- School crest/name placed directly next to the item, confirming relevance before anything else does.
- Seller identity framed safely — "Parent at [School]," not a bare phone number with no context.
- The off-platform payment disclaimer sits right next to the CTA, not in a footer: "Pay the seller directly — cash or Venmo. We don't process payments." This is the moment the visitor needs it, not three clicks later.
- "Free to browse, no account needed" reassurance directly under or beside the CTA, killing signup hesitation at the exact decision point.
- A freshness/status indicator ("Posted 2 days ago · Still available") to defuse dead-link anxiety on a page they arrived at with no other signal of currency.

**Components this journey demands (hero, school-picker hook, buy/sell/consign fork, OpenGraph share card, self-contained deep-link pages):**
- Self-contained listing page: item image, price, school tag, condition, seller framing, and the compact "what is this site" strip bundled into one above-the-fold unit.
- OpenGraph share card: item photo, price, school name, and the UniformPass wordmark — the card itself should be legible enough that a viewer knows what they're clicking before they click.
- Persistent, singular "Contact Seller" CTA — never competing with secondary actions for the top visual slot.
- Lightweight "browse more from this school" secondary path so the deep-link can convert into a full browsing session without a homepage detour.
- Buy/sell/consign fork present but demoted — small nav link or footer entry, since a listing-page visitor already has a specific intent and shouldn't be distracted from it.

**Friction to eliminate:** No forced homepage detour to understand what the site is. No login/account required to view contact info or item details. No ambiguity about how to actually claim the item — the contact method must be one tap away, never buried under a "view details" toggle. No dead ends if the item already sold — the page should redirect to similar items or the school hub, never a blank page or 404.

**Top 3 non-negotiables:**
1. The page fully explains the product (what UniformPass is, how the off-platform handoff works) without requiring a visit to the homepage.
2. School identity and item legitimacy — real photo, real price, real condition — are verifiable in the first glance, above the fold.
3. Getting the item is exactly one tap from landing ("Contact Seller"), with the cash/Venmo mechanism disclosed right at that CTA, not hidden in a policy or FAQ page.
