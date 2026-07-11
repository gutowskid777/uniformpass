## Skeptic — Worried about strangers / scams / payment safety
**Goal:** Get (or give) a fair-condition uniform item without being scammed on payment, without meeting someone genuinely unsafe, and without broadcasting personal contact info to strangers on the internet — while still completing the transaction, not just backing out of it.

**Mental state / constraints:** Guarded by default. This is the parent who reads "meet a stranger from the internet" and mentally files it next to Craigslist horror stories and Venmo scam headlines, not next to "school bake sale." They are not naive about the school-community framing either — they will ask "how do I actually know this seller is a St. Joe's parent and not just someone who found the link?" They have specific, answerable fears, not vague anxiety: (1) getting talked into a deposit or Zelle-to-a-stranger before ever meeting, (2) meeting someone in an unsafe location, (3) their phone number ending up in a stranger's contacts / getting spam-texted afterward, (4) their kid's school being identifiable to a random person off the internet who isn't actually a parent there. They will read a safety module if it's short, concrete, and placed exactly where the fear spikes (the moment before contact) — they will NOT read a general FAQ or Trust & Safety page proactively; that page exists to be linkable, not to be a required stop. If reassurance isn't visible at the exact contact moment, they abandon rather than proceed on faith.

**Ideal entry point:** Same school-scoped landing page as every other persona (`uniformpass.com/st-joseph-regional`) — but for this persona, the entry point that actually converts skepticism into trust is the **first item detail page they open**, because that's where "meet a stranger" and "send payment" stop being abstract and become a real decision with a real name attached. The landing page's job is to plant the community claim ("parent-run marketplace for St. Joe's families") early; the item detail page's job is to prove it's operationally safe.

**Ideal click-path (numbered, ≤7 steps):**
1. Land on school landing page → header states school name + "Parent-run marketplace for [School] families" — community framing set before any product is seen.
2. Browse/filter to a specific item; grid cards show price, size, condition, and — for this persona specifically — a small "Seller: [School] parent" or "UniformPass Verified" tag directly on the card, not hidden behind a click.
3. Open item detail page → sees seller identified only as first name + last initial + general pickup area ("Meets near SJR gym"), never full name, address, or phone number displayed as text.
4. Notices a compact "Safe meetup & payment" module inline on the page, collapsed to 2-3 lines by default with a "See safety tips" expand — present but not alarming, positioned directly above the Contact button (not buried below the fold or only in the footer).
5. Taps "Contact Seller" → a lightweight preview step (not a wall) shows exactly what happens next: which contact channel opens (buyer's choice of text/email/Venmo note), that no phone number is shared publicly unless the buyer chooses to text, and a one-line repeat of "meet in a public place, pay on pickup."
6. Buyer picks their preferred contact method (email is offered as an explicit, equal option — not a fallback — so a number never has to leave their phone at all) and sends a pre-filled message.
7. Confirmation screen closes the loop: reiterates "arrange a public meetup, pay when you see the item" and offers a persistent "Safety & meetup guide" link for anyone who wants the fuller version before showing up.

**The ONE primary CTA per key screen:**
- Landing page: "Browse [School] Uniforms" (community line is adjacent, not competing for the CTA).
- Item detail page: "Contact Seller" (with the safety module living directly above it, not competing with it).
- Contact preview step: "Continue to [Text / Email / Venmo]" — buyer's explicit channel choice is the action, not a generic "Send."
- Confirmation screen: "View Safety & Meetup Guide" as the visible secondary action (primary is "Keep Browsing," since the task is done).

**Trust / clarity reinforcement points (be exhaustive — safe-meetup, payment-safety, community angle, privacy):**
- *Community angle, made visible not just claimed:* every listing shows a "[School] parent" or "Verified by UniformPass" seller tag; the About/landing page states the school is a closed, invite-distributed community (link shared via the school/PTO, not publicly indexed) — this is the actual safety mechanism, so it needs to be said explicitly, not implied. Consider a simple, honest stat if true ("127 St. Joe's families have used UniformPass") rather than vague "trusted community" language.
- *Safe-meetup guidance, specific not generic:* "Meet in a public, well-lit place — the school pickup circle, a coffee shop, or a police station parking lot (many NJ towns designate one for exactly this). Daytime is safer than after dark. Bring another adult or your kid if convenient." Concrete, local, non-alarmist — reads as practical advice from another parent, not a legal disclaimer.
- *Payment-safety, specific not generic:* "Pay when you see the item, not before. Cash or Venmo/Zelle at pickup is normal — sending money ahead of a meetup, or to anyone asking for a 'deposit to hold it,' is the #1 red flag. UniformPass never asks for payment and never charges you to browse or message." Names the actual scam pattern (pre-payment/deposit requests) instead of a vague "be careful."
- *Privacy — how much personal info is exposed, stated plainly:* "Your phone number is never shown publicly. You choose whether to contact by text, email, or Venmo note — the seller only sees what you choose to send them." Sellers get the identical promise on their side (see below). This directly answers "is my number going to leak."
- *Verified badge explainer:* one line, inline, first time it appears — "Verified = a UniformPass volunteer physically inspected this item before listing." Reinforces that not every transaction is stranger-to-stranger; some are stranger-to-vetted-operator.
- *No dark patterns:* no fake urgency ("3 people viewing"), no countdown timers — a skeptic reads marketplace-hype tactics as evidence of a scam operation, not a nudge to buy.
- *Real humans behind it:* About page names founders, states NJ basis, lists participating schools — corporate anonymity reads as risk to this persona.

**Where safety content should live (contextual + persistent):**
- *Contextual (primary):* a reusable **"Safe meetup & payment" module**, collapsed to 2-3 lines, placed directly above the "Contact Seller" CTA on every item detail page and repeated (in preview form) inside the contact-channel-choice step right before the message sends. This is the moment the fear is live — content must be here, not just linked from here.
- *Persistent (secondary):* the same module's full version lives as a standalone "Safety & Meetup Guide" page, linked from the site footer on every page and from the post-contact confirmation screen. This is the page a skeptic proactively visits if they're evaluating the platform *before* browsing at all (e.g., arrived via a school Facebook group post and is vetting the link before clicking further) — so it also needs to be reachable from the landing page nav, not just after they've already committed to an item.
- *One-time, not repeated to fatigue:* the expanded safety tips shouldn't re-appear as a full block on every single screen (that itself reads as alarming/repetitive) — collapsed reminder inline, full detail one tap away, every time.

**Components this journey demands (safe-meetup module, payment-safety tips, privacy-preserving contact options, community signal):**
- Reusable "Safe meetup & payment" module component (collapsed/expanded states) — used on item detail page, contact-preview step, and as the full Safety & Meetup Guide page.
- Seller-tag component on listing cards and detail pages: "[School] parent" / "Verified by UniformPass" — community + inspection signal made visible without a click.
- Privacy-preserving contact chooser: buyer selects text (`sms:`) / email (`mailto:`) / Venmo note as equal first-class options at the moment of contact — no channel is the awkward fallback, and no raw phone number is ever rendered as visible text on the page for either party.
- Seller-side privacy controls when listing: seller chooses which contact channel(s) to expose (e.g., can list with email-only, no phone number at all) and is shown their own "here's what buyers will see" preview before publishing — mirrors the buyer-side promise and gives sellers the same minimization option.
- Contact-preview step ("here's what happens when you tap Contact") — prevents the surprise of an unexpected channel or unexpected info disclosure.
- Persistent footer link + landing-page nav link to a standalone Safety & Meetup Guide page.
- Verified badge with inline micro-explainer (tooltip/expand on first appearance).
- About/Who We Are page with named humans, NJ basis, participating-school count as a legitimacy proof point.

**Friction to eliminate:**
- Making the buyer hunt for safety info in a footer FAQ instead of surfacing it at the exact contact moment.
- Forcing phone number as the only contact channel — email/Venmo-note must be equally supported so a number never has to be shared with a stranger.
- Vague, generic safety copy ("be safe when meeting people") that reads as legal boilerplate rather than specific, actionable guidance — specificity is what actually reassures this persona, not disclaimers.
- Any implication (even accidental — a "Pay Now" button, a cart icon, a price total with fees) that UniformPass handles payment; a skeptic will interpret ambiguity here as the platform hiding where their money actually goes.
- Sellers having no way to limit what contact info they expose — a privacy-conscious seller with the same fears as this buyer persona needs the identical minimization option, or the marketplace leaks trust from the supply side.
- A generic, unexplained community claim ("trusted local marketplace") with nothing backing it — this persona will specifically probe for what makes it actually safer than Craigslist, so the school-community mechanism must be spelled out, not asserted.

**Top 3 non-negotiables:**
1. A concrete, specific "Safe meetup & payment" module (public place, daytime, pay-on-pickup, no deposits) is visible inline at the contact step on every item — not buried in a footer link only.
2. Buyers and sellers can both transact using email or Venmo-note instead of a phone number — a raw phone number is never required or displayed as page text unless a user actively chooses to share it.
3. The school-community safety angle is stated explicitly and specifically (closed distribution via school/PTO, seller tagged as "[School] parent," Verified badge explained inline) — never left as an implied or vague "trusted community" claim.
