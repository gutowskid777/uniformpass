# UniformPass — Seller "Disappear" + Donor UX Study
Design study, not a bug hunt. Ideal journeys designed from scratch within fixed constraints: no accounts, no in-app payments, no shipping, off-platform meetup, concierge consignment as the moat.

---

## Seller — "Just Make It Disappear"
**Goal:** Get the pile physically out of the house with zero effort. Doesn't care about maximizing price, doesn't want to itemize, photograph, or negotiate anything.
**Mental state / constraints:** Overwhelmed, guilt-driven, has been meaning to do this for months (kid outgrew everything, closet is a wall of Cambridge grey). Any screen that asks them to sort, price, or describe items individually reads as "more work than just donating it to Goodwill" and causes abandonment. Trigger moment is usually a decluttering weekend, a school swap reminder, or a sibling hand-me-down that didn't fit. This is the persona the whole product is built around — concierge consignment is the differentiated moat, not a secondary option.
**Ideal entry point:** A single, unmissable "Get it out of my house" CTA on the homepage — not nested under "Sell" as one of several options. Reinforced via school-distributed flyer/QR code and email blast that deep-links straight to the concierge intake, bypassing the general marketplace entirely.
**Ideal click-path (numbered, ≤7 steps):**
1. Land on homepage or deep-linked "Sell it for me" page.
2. Tap the single CTA: "Get it out of my house."
3. Enter minimal identifying info: name, phone or email, school, neighborhood/zip. No account created.
4. Pick a pickup window from a simple time-slot calendar (or submit 2-3 preferred days if no slots fit).
5. Optional, skippable: snap 1-2 photos of the whole pile and give a rough count ("2 bags, sizes 6-14") — never per-item entry.
6. Confirm request — see confirmation screen: "We'll pick up on [date]. You'll get paid automatically for whatever sells — nothing else for you to do."
7. (No further action required.) Concierge team picks up, sorts, photographs, lists, and sells; seller receives a payout notification via text/email link when items sell.
**The ONE primary CTA per key screen:** Homepage → "Get it out of my house." Intake screen → "Schedule my pickup." Pile-details screen → "Confirm pickup." Confirmation screen → no action needed; optional "Track my payout" link.
**Trust / clarity reinforcement points:** The 50% split stated plainly before any commitment ("You keep 50% of whatever sells — paid automatically, no chasing buyers"); explicit "no sorting required, just bag it" copy next to the photo step; pickup logistics spelled out (who shows up, when, how they'll be notified) so there's no day-of uncertainty; a payout-tracking link (no login) so the seller can verify money is actually materializing without having to ask; a visible impact/volume stat ("X pounds of uniforms resold instead of landfilled this year") tying the low-effort act to something bigger.
**Components this journey demands (esp. effortless-handoff CTA, free/donate flow, anti-waste framing):** A dedicated concierge intake flow entirely separate from the item-by-item listing flow; pickup scheduling widget with time-slot selection and no login; optional whole-pile photo + rough-quantity tagging instead of granular per-item fields; automated SMS/email pickup confirmations and day-of reminders; a no-account payout ledger accessible via a magic link sent after each sale; a reusable anti-waste/impact-stat banner shown at intake and on the confirmation screen.
**Friction to eliminate:** Any requirement to itemize, price, or photograph individual pieces; any account or password creation; any direct negotiation with buyers; ambiguity about whether/when payout actually happens; being forced to know exact sizes/categories off the top of their head before they can submit the request.
**Top 3 non-negotiables:**
1. Zero itemization — one intake form covers the entire pile, not per-item entry.
2. Pickup gets scheduled inside the same flow — no follow-up call, email, or second visit required to lock in a time.
3. Automatic 50% payout with a no-login tracking link — the seller must never have to wonder or ask if they got paid.

---

## Donor — Wants to Give It Away Free
**Goal:** Get items into the hands of a family that needs them, quickly and with dignity — no money, no haggling, no back-and-forth about "are you sure you don't want something for it?"
**Mental state / constraints:** Charitable, values-driven, and specifically does NOT want the transaction to feel like a sale. Wants confidence the item goes to someone who needs it rather than sitting unclaimed or triggering a pile-on of interested strangers. May be the same person as the "disappear" seller who simply prefers giving over getting paid — the two paths should feel like a fork of the same low-effort flow, not a different product.
**Ideal entry point:** The same homepage decision point as the seller flow, with "Give it away free" presented as equally prominent as "Sell it" and "Let us handle it" — a three-way fork, not a buried checkbox on a pricing screen.
**Ideal click-path (numbered, ≤7 steps):**
1. Land on homepage, tap "Give it away free."
2. Choose method: "List it myself" (fast, self-serve) or "Have UniformPass pick it up and donate it for me" (same concierge pickup lane as the disappear flow, tagged as donation).
3. If self-listing: quick entry — photo(s), size, category. Price field is pre-set to "Free" and the pricing/negotiation UI never appears.
4. Confirm — listing goes live immediately (no review queue) with a "Free — first come, first served" badge.
5. First matching family taps "Claim this" (not "Contact seller" — a deliberately different, lower-friction verb) which reserves the item for a short window (e.g., 2 hours) so the donor isn't fielding five simultaneous strangers.
6. Donor gets a single notification: "Maria claimed your blazer — here's how to reach her."
7. Off-platform handoff, identical logistics to a sale, just $0 changes hands.
**The ONE primary CTA per key screen:** Homepage → "Give it away free." Method-choice screen → "List it myself" / "Let us handle pickup." Self-list item screen → "Post it free." Live listing → no seller action; claim notification → "View claim details."
**Trust / clarity reinforcement points:** The "Free" badge and framing removes any pricing ambiguity — free listings never show a "make an offer" affordance; the claim window is shown explicitly so the donor knows exactly what's happening and isn't left managing multiple interested families; a post-handoff impact message ("This blazer saves a St. Joe's family about $60 — thank you") delivers the emotional payoff immediately; if routed through concierge, confirmation that the item is going into a vetted giveaway pool (school referral, not "anyone off the internet") reassures both dignity and safety.
**Components this journey demands (esp. effortless-handoff CTA, free/donate flow, anti-waste framing):** A $0/Free toggle that structurally removes all negotiation UI (no "make offer" button ever renders on a free listing); a "Claim" reservation mechanic with a visible countdown timer to prevent pile-ons; a donation-routing option folded into the same concierge pickup lane as "Sell it for me," differentiated only by a backend tag; a reusable anti-waste/impact-messaging module (landfill-diversion stat, dollar value saved) surfaced at listing and at handoff confirmation; claim-event notifications via SMS/email with no login required.
**Friction to eliminate:** Any hint of expected payment or a "suggested donation" nudge — the experience must feel unconditionally free; multiple strangers reaching out for the same item at once; any review/approval delay before a free listing goes live, since delay kills the goodwill impulse; long condition write-ups or justification fields that make the donor feel like they need to "sell" the item's value.
**Top 3 non-negotiables:**
1. Free listings skip price and negotiation UI entirely — "Claim" replaces "Contact/Make Offer" as the core verb.
2. A single-claim reservation window prevents pile-ons and gives the donor exactly one point of contact at a time.
3. Free listings publish instantly with no review queue — donation urgency and goodwill don't survive a delay.
