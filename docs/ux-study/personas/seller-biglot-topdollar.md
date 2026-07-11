# UniformPass — Seller UX Study: Big Lot & Top Dollar
Design study, not a bug hunt. Ideal journeys from scratch, built against the fixed business model:
web app, no accounts, no in-app payments, no shipping, off-platform meetup/payment, lot-flag listings,
no-login manage links, concierge consignment ("Sell it for me," 50% cut) as the moat, NJ prep-school
parent launch audience.

---

## Seller — A Big Lot
**Goal:** Offload an entire outgrown wardrobe (15-40+ pieces spanning multiple sizes/kids) for fair
total value, in one sitting, without becoming a part-time reseller.

**Mental state / constraints:** Overwhelmed, time-poor, first-time user in most cases. Genuinely
undecided between three paths (one lot listing, many single listings, hand off to consignment) and
doesn't know the tradeoffs of any of them. Will abandon if the platform assumes she already knows
which path she wants. Photographing and describing 30 items one-by-one is the failure mode to design
away from — if the flow feels like it's heading there, she leaves and it goes to a garage-sale pile.

**Ideal entry point:** A dedicated "Got a big pile?" entry distinct from the generic "Sell an item"
CTA — surfaced on the homepage, in the nav, and as the top option on the Sell landing page. This is
also the natural landing page for PTA/school-flyer marketing links, since "big lot" sellers are
disproportionately the ones a school newsletter blurb is trying to activate.

**Ideal click-path (numbered, ≤7 steps):**
1. Land on Sell page → sees the Decision Aid front and center: "How much do you have, and how much
   time do you want to spend?" (two quick inputs: item count slider/stepper, time-willingness toggle).
2. Decision Aid returns a recommendation plus a persistent tradeoff table (all three paths shown side
   by side: est. total payout, time required, effort required) — she can accept the recommendation or
   pick a different path herself.
3. Selects "Lot listing" (or Consignment — see branch note below) → enters the Lot Builder.
4. Bulk photo step: drag/drop or multi-select up to ~20 photos at once; lightweight tagging lets her
   cluster photos into groups ("these 6 = size 8 polos," "these 4 = size 10 skorts") without opening
   any per-item form.
5. Structured lot details: one form with a repeatable row (size + item type + qty + condition) instead
   of repeated full listing forms, plus school(s), category mix, one lot price (or price range), and
   contact method.
6. Review screen: shows the lot exactly as buyers will see it (title, price, photo grid, size/qty
   table) — she confirms or edits before it's live.
7. Confirmation: manage link is generated and pushed at her three ways (on-screen with copy button,
   optional email-to-self, "add to home screen" prompt) plus a cross-sell nudge: "3 items didn't fit
   the lot theme — list those separately or fold them in?"

*Branch: if she selects Consignment at step 3 instead, steps 4-7 are replaced by a short intake form
(rough item count, category mix, pickup/drop-off preference, contact info) that ends in "we'll reach
out within 48 hours" — no photo or pricing work required from her at all, which is the entire point of
the consignment path.*

**The ONE primary CTA per key screen:**
- Sell landing / Decision Aid: **"Get my recommendation"**
- Recommendation result: **"Continue with [Lot listing / Consignment]"**
- Lot Builder — photos: **"Add photos"**
- Lot Builder — details: **"Review my lot"**
- Review: **"Post my lot"**
- Confirmation: **"Save my manage link"**

**Trust / clarity reinforcement points:**
- The tradeoff table stays honest and visible at every step of the lot path — e.g., "Lots typically
  sell for less per piece than singles, but take 1 listing instead of 12–20." No path is dressed up as
  strictly better; she's trusted to weigh time vs money herself.
- A live buyer-facing preview renders as she builds the lot, so she's never guessing how the size/qty
  table or mixed photos will actually look to a buyer.
- The manage link's purpose is explained in plain language the moment it's generated ("this is the
  only way to edit or mark this sold — no account, no password, just this link") because there is no
  recovery path if she loses it.
- Consignment branch states the 50% cut and rough timeline up front, before she commits any effort —
  no surprise economics after she's already photographed anything.

**Components this journey demands (esp. lot builder, pricing guidance, selling-tips, decision aid):**
- Decision Aid component: 2-input quiz + always-visible 3-way tradeoff table (Lot / Singles /
  Consignment), reusable from both the Sell landing and mid-flow ("actually, let me reconsider").
- Lot Builder: bulk multi-photo uploader with lightweight photo-to-group tagging, plus a repeatable
  size/qty/condition row entry table (not N copies of the single-item form).
- Lot preview card (buyer-facing render, live-updating).
- Consignment intake mini-form (separate, much shorter than the lot builder).
- Manage-link delivery component (copy button + optional email + persistent on-device save), shared
  with the top-dollar single-listing flow.

**Friction to eliminate:**
- No path where a big-lot seller is funneled into 15-20 individual listing forms by default.
- No re-uploading or re-selecting photos per item — one bulk upload, then group.
- No forced account/login at any point.
- No ambiguity about what buyers will see for a lot (size breakdown must be structured data, not a
  seller typing "sizes 6-12 mixed" into a free-text box that buyers then have to decode).
- No single point of failure on the manage link — it must be recoverable in at least two ways without
  needing a login.

**Top 3 non-negotiables:**
1. The lot-vs-singles-vs-consignment decision aid must show real, honest tradeoffs (payout, time,
   effort) before she commits — this is the single highest-leverage screen for a big-lot seller and
   can't be a marketing nudge toward whichever path is cheapest for the business to support.
2. The lot builder must never degrade into per-item forms — bulk photos + structured multi-size entry
   is the whole value proposition of choosing "lot" over "singles."
3. The manage link must be un-losable: multiple delivery/save mechanisms, because there is no account
   recovery and a lost link means an un-editable, un-sellable listing forever.

---

## Seller — Wants Top Dollar
**Goal:** Sell a small set of items (1-5) for the best achievable price, with confidence she isn't
underpricing, and sell reasonably fast.

**Mental state / constraints:** Motivated and willing to put in effort — good photos, full
description — but wants that effort validated with data, not just told to "add more photos." The
core anxiety is calibration: "am I asking too little or pricing myself out?" She is not overwhelmed by
volume (that's the big-lot persona); the friction here is uncertainty, not throughput. She'll compare
against Facebook Marketplace and thrift-store pricing mentally, so guidance needs to feel like real
comps, not generic advice.

**Ideal entry point:** The standard "List an item" single-listing flow — but the design requirement is
that pricing guidance and selling-tips surface *inline, at the moment of relevant input* (school+size
selection, photo upload, price entry), not as a separate help page she has to seek out.

**Ideal click-path (numbered, ≤7 steps):**
1. Land on Sell page → selects "List one item."
2. Enters school, category, gender, type, size, condition. As soon as school + category + size are
   set, an inline pricing-guidance card appears alongside the form: "Similar items sold for $X-$Y
   (based on N recent sales)."
3. Uploads photos. A live selling-tips checklist sits next to the uploader ("3+ photos sell ~2x
   faster," "add a photo of the tag/size label," lighting tip) with real-time progress, not a static
   article link.
4. Sets price. The pricing-guidance card is now anchored right next to the price field with a
   suggested range pre-highlighted, plus a simple framing: lower in the range sells faster, higher
   holds out for more.
5. Reviews a listing-quality summary ("Listing strength: Good — add 1 more photo to reach Great")
   before publishing — one actionable line, not a vague score.
6. Publishes → confirmation screen with manage link (same un-losable delivery pattern as the lot flow)
   plus a light "boost" nudge (share-to-school-group link; a free "freshly listed" placement flag even
   pre-monetization, to seed the habit of using it).
7. Returns later via manage link → sees a simple performance signal (view count, days listed) with a
   contextual nudge if it's stale ("been listed 10 days, no contact yet — consider lowering by $5 or
   adding a photo").

**The ONE primary CTA per key screen:**
- Sell landing: **"List one item"**
- Details step: **"Continue"** (pricing guidance is a passive aside, never a blocking step)
- Photos step: **"Continue"** (selling-tips checklist visible, not gating)
- Price step: **"Use suggested price"** (with manual override always available)
- Review step: **"Publish listing"**
- Confirmation: **"Share my listing"**
- Manage page (return visit): **"Update price"** or **"Mark as sold"**

**Trust / clarity reinforcement points:**
- Pricing guidance must cite its basis ("based on 12 similar sold listings") — a bare number with no
  sample size reads as made up and undermines the whole feature for a price-sensitive seller.
- Selling tips are framed with a reason, not just an instruction: "listings with a photo of the size
  tag get contacted 3x faster" beats "add more photos."
- The listing-quality meter gives one specific next action, never a vague "improve your listing."
- Framing throughout should read as "help you not leave money on the table," never as the platform
  extracting value — this matters more here than in the lot flow because top-dollar sellers are
  actively optimizing and will notice if guidance feels self-serving.
- The manage page becomes the ongoing feedback loop (views, staleness nudge) that substitutes for the
  in-app messaging/notifications this platform deliberately doesn't have.

**Components this journey demands (esp. lot builder, pricing guidance, selling-tips, decision aid):**
- Pricing guidance / comps widget: inline, contextual to school + category + size + condition, cites
  sample size, appears progressively as fields are filled (not gated behind a separate lookup).
- Selling-tips checklist: real-time, tied to actual form state (photo count, contact info present,
  description length) rather than static copy.
- Listing-quality meter: single-line, single-action summary derived from the checklist, shown right
  before publish.
- Share/boost nudge component: post-publish share prompt, with a slot reserved for future paid
  "featured/verified" placement without redesigning the flow later.
- Manage-page performance panel: view count + days-listed + one contextual nudge, reusing the same
  manage-link infrastructure as the lot flow.

**Friction to eliminate:**
- No separate "check comps" page she has to navigate away to and lose her place.
- No pricing guidance that only appears after publish (too late to act on).
- No generic, non-actionable "improve your listing!" messaging.
- No dead end after publishing — without accounts or notifications, the manage page must actively
  surface performance so effort-driven sellers get a feedback loop at all.

**Top 3 non-negotiables:**
1. Pricing guidance is inline at the price field with a cited sample size — decorative or delayed
   guidance defeats the entire "wants top dollar" motivation.
2. Selling-tips/listing-quality feedback is real-time during creation, tied to actual listing state,
   not a static help article.
3. The manage link doubles as a lightweight performance dashboard (views, staleness), because it's the
   only feedback mechanism available in an accounts-free, messaging-free product.
