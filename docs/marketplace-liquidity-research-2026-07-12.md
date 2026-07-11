# From Zero to Liquidity: A Research Brief for UniformPass
# Hyperlocal, no-payments, concierge-consignment resale (used private-school uniforms, NJ Catholic schools)
# Created 2026-07-12. Well-sourced. This is the evidence layer beneath the this-week distribution playbook.

**How to read this:** every non-obvious claim carries an inline source URL. Confidence is flagged per claim (STRONG = primary or detailed secondary; WEAK = search-snippet only, could not verify the primary). Strategic recommendations that are *my synthesis, not sourced fact*, are marked **[JUDGMENT]**. The founder's model is: no shipping, no in-app payments, buyers meet sellers to pay cash/Venmo; moat = concierge consignment (operator picks up a pile, sells it, owner keeps 50%); beachhead = 3 NJ Catholic high schools (St. Joseph Regional–Montvale, Don Bosco Prep–Ramsey, Bergen Catholic–Oradell); operator = Dylan's mom.

---

## TL;DR — the five things that matter

1. **Seed supply first, not demand.** ~Two-thirds of failed marketplaces die on the *supply* side, and the best consumer marketplaces stay supply-constrained for most of their life. An empty store converts nobody. Get real piles listed before pushing buyers. (Reforge; Lenny/a16z — see §1.)
2. **Win ONE school completely before touching the second.** Airbnb's own inflection point was a concrete per-market number (300 listings / 100 reviewed). Density inside one dense, pre-connected community (a single school's parents) beats being thin across all three. (andrewchen.com — §1.)
3. **The concierge 50% split is generous by industry standards — that's the wedge, and the margin risk.** White-glove resale (The RealReal) keeps ~80% on cheap items; full-service kids' consignment nets the seller ~40%; a buy-outright shop (Once Upon a Child) pays 10-15% of retail. UniformPass handing the family 50% of the *sale* is seller-friendly — great for acquisition, thin for a single human doing all the labor. Decide *50% of sale* vs *50% of profit* explicitly (§2).
4. **There is a near-exact, real-world proof point.** A Catholic school (Mary of Nazareth HSA) runs a used-uniform sale on a **50/50 family/school split** with a public price list (kilts/jumpers $15, polos $6, PE items $5). This is UniformPass's model, already validated by a parish community. (§4.)
5. **Trust is the whole product, and "same-school parent" is the strongest trust signal you can buy for free.** Facebook Marketplace beat Craigslist purely on identity/trust; a same-school parent is a stronger version of that signal than any rating system. The proven spread channel is the PTA/PTO-linked closed Facebook/WhatsApp group with a school-affiliation gate (§3).

---

## 1. The cold-start / chicken-and-egg problem

### Supply-first vs demand-first — supply wins for this model

- **~Two-thirds of failed marketplaces die on the supply side, not demand.** This is the core reason local marketplaces are told to seed supply first. STRONG (via Reforge summary of a16z; the a16z primary 403'd on fetch, treat exact fraction as approximate). https://www.reforge.com/guides/beat-the-cold-start-problem-in-a-marketplace
- **"The best consumer marketplaces end up supply-constrained because they tap into an incredible amount of demand" — Li Jin (a16z).** Most marketplaces *stay* supply-constrained through most of their history. STRONG. https://www.lennysnewsletter.com/p/how-to-kickstart-and-scale-a-marketplace-911
- **Seed supply first when buyers have "urgent need and limited patience for thin selection."** That is exactly the back-to-school uniform buyer in August. STRONG. https://www.reforge.com/guides/beat-the-cold-start-problem-in-a-marketplace
- **Get the hardest side first; the other side then becomes "2-10X easier to bring onboard."** Outdoorsy prioritized RV owners, after which "demand came 5X faster and cheaper." STRONG. https://www.nfx.com/post/19-marketplace-tactics-for-overcoming-the-chicken-or-egg-problem
- **The "hard side" of a resale marketplace is the seller.** Andrew Chen: a minority of users "create disproportionate value... do more work... but are that much harder to acquire and retain"; attract them first "and the other side of the network will follow." Uber's "Power Drivers constitute 20% of the supply but create 60% of the trips." STRONG. https://andrewchen.com/solve-a-hard-problem-cold-start-problem/

> **Implication for UniformPass:** the concierge-consignment pickup *is* the supply-first strategy made physical. You're not waiting for parents to list — you go get the pile. That's the single highest-leverage move and it's already the moat. The distribution playbook's "land SUPPLY first, then DEMAND" sequencing is correct and sourced.

### Proven cold-start tactics, with named examples

- **DoorDash faked supply and did everything by hand in ONE town.** Founders built PaloAltoDelivery.com in an afternoon, posted eight restaurant PDF menus scraped off the web (restaurants never agreed to join), and put their own Google Voice number at the bottom; they picked up and delivered the first orders personally. They ran manually and completed ~217 deliveries before Y Combinator — no app. STRONG (core story; exact early tools vary by retelling — assert "landing page + phone + self-delivery + manual dispatch"). https://www.alexanderjarvis.com/doordash-doing-things-that-dont-scale/
- **Airbnb seeded its own supply, then recruited the rest by hand, city by city.** "Brian Chesky's and Joe's apartment was the first unit of supply on Airbnb." To launch a market they traveled there, activated ~100 listings, then drove demand to it. STRONG (verified on the primary). https://andrewchen.com/grow-marketplace-supply/
- **Airbnb's single most effective recruiting lever was showing hosts an earnings estimate — "an order of magnitude more effective than any other value prop... any time we hid or obscured it, growth dipped."** STRONG (verified verbatim). https://andrewchen.com/grow-marketplace-supply/
  > **Direct steal:** lead every supply pitch with a dollar number. "Your closet of outgrown [school] uniforms is worth roughly $[X]." Put a rough payout estimate on `/sell-for-me` and in the pickup text. This is the highest-ROI copy change available.
- **Zappos held no inventory and fulfilled by hand.** Nick Swinmurn photographed shoes at local stores, listed them, and only bought/shipped a pair after an order came in. Near-identical to a consignment/meet-up model: list first, hold no stock, broker the handoff once a buyer commits. STRONG (tactic; the "Wizard of Oz" label is loose). https://medium.com/rocket-startup/how-zappos-built-a-product-by-faking-it-d3fd692a1fed
- **Craigslist began as one person's curated email list of local happenings to friends** — a single-sided list, not a two-sided market on day one. STRONG. https://www.nfx.com/post/19-marketplace-tactics-for-overcoming-the-chicken-or-egg-problem
- **"Make supply look bigger" by pre-filling listings** — Yelp, Indeed, Goodreads seeded data so the site didn't feel empty. STRONG. Same NFX URL.
  > **Steal:** seed each school page with your own donation stock + your first few pickups, flagged "Verified by UniformPass," *before* you drive buyers there. A school hub with 8-10 real listings converts; one with zero kills the referral.
- **Geographic constraint as a deliberate launch tactic is named for Lyft, Yelp, Craigslist** — restrict to one geography first. STRONG. Same NFX URL.

### Frameworks worth citing (Andrew Chen, *The Cold Start Problem*)

- **Atomic network** = "a single stable, engaged network that can self-sustain" — the smallest network that delivers value alone. Products "start small, in a single city, college campus... like when Facebook launched at Harvard." Airbnb's atomic unit was "hundreds of active listings in a given market." STRONG. https://www.sachinrekhi.com/p/andrew-chen-the-cold-start-problem
- **Airbnb's critical-mass threshold per market was "300 listings, with 100 reviewed listings"** before bookings accelerated. STRONG (verified on primary). https://andrewchen.com/grow-marketplace-supply/
  > **[JUDGMENT] Set a per-school liquidity target, not a network-wide one.** For a uniform school hub, "300 listings" is the wrong scale — the atomic network is *enough coverage across the common sizes/grades that a typical parent finds their item*. A workable target per school: ~20-30 live listings spanning the core SKUs (polos, plaid bottoms, PE kit, blazers) across the 3-4 most common sizes. Hit that in ONE school before opening the next.
- **"Come for the tool, stay for the network."** Build a standalone single-player tool first, then layer the network (OpenTable = restaurant reservation software before the diner network). STRONG. https://andrewchen.com/solve-a-hard-problem-cold-start-problem/
  > **[JUDGMENT] For UniformPass the "tool" is the concierge service itself.** A parent gets standalone value (their closet cleared + a check) even if no network exists yet, because *you* are the buyer-finder. That's why the concierge model sidesteps the cold-start better than a pure listings board would.

### Why winning one school fully beats being thin across three

- **Saturate one hyper-connected group first:** "Rather than getting 1,000 users randomly who don't know each other, focus on getting 1,000 users who are densely connected already... saturate the network and hold onto that group... then go from there." A single school's parents are a pre-built dense graph (same pickup line, same uniform, same group chats). STRONG. https://andrewchen.com/how-to-solve-the-cold-start-problem-for-social-products/
- **Expanding too early "can leave you vulnerable due to limited supply or demand-side relationships, making expansion highly expensive." Win the node before adding nodes.** STRONG. https://www.reforge.com/guides/beat-the-cold-start-problem-in-a-marketplace
- **Focus beats spray:** the median number of supply-growth levers the biggest marketplaces used was TWO (avg 2.5). Pick one or two tactics, not ten. STRONG. https://www.lennysnewsletter.com/p/how-to-kickstart-and-scale-a-marketplace-911
- **Nextdoor grew strictly neighborhood-by-neighborhood with address verification** — a hyperlocal, gated-community expansion model (exact growth figures WEAK, secondary blogs). https://about.nextdoor.com/

> **[JUDGMENT] Tension with the current plan:** the playbook spreads day-1 outreach across all three schools. The literature says pick your single strongest node (the one where your mom has the deepest group access) and saturate it first — get that school to real liquidity, generate visible word-of-mouth and a few "I made $X" stories, *then* clone the playbook to school #2. Three thin schools is the classic hyperlocal failure mode.

---

## 2. Consignment / managed-supply economics

### Where a 50% split sits vs the market

| Model | What the SELLER keeps | Labor borne by | Source (confidence) |
|---|---|---|---|
| Standard consignment (general) | ~60% (60/40 favoring consignor) | Store | puppetvendors.com (STRONG) |
| **Kids' clothing consignment** | **40-60%** (store keeps 40-60%) | Store | puppetvendors.com (STRONG) |
| Furniture / art gallery consignment | 50% (50/50 is the norm) | Store | puppetvendors.com (STRONG) |
| JBF pop-up, self-tagged | up to 60% | Seller tags own items | jbfsale.com franchise (STRONG) |
| **JBF "valet/VIP tagger" (concierge analog)** | ~40% net (JBF takes 20% fee + supplies on top of standard cut) | Operator/valet | jbfsale.com (STRONG) |
| ThredUp (managed online) | 5-80%, but **15-17% on sub-$35 items** | Platform | tumbleweedthrift.com (STRONG examples) |
| The RealReal (white-glove) | **20% on sub-$100 items**, rising to 70-85% at high value | Platform (photo/copy/logistics) | topbubbleindex.com (STRONG) |
| Once Upon a Child (buy outright) | **10-15% of retail** (30-40% of resale, cash now) | Store owns inventory + risk | firstquarterfinance.com (STRONG) |
| **UniformPass concierge (proposed)** | **50% of sale** | **Operator (Dylan/mom)** | founder's model |

**The headline:** at the labor level UniformPass is offering (full pickup + photograph + list + field every buyer message + arrange the meet-up), **50% to the owner is at the generous end of every full-service benchmark.** White-glove (The RealReal) keeps ~80% on cheap items; full-service kids' consignment nets the seller ~40%; buy-outright pays 10-15% of retail. Sources above.

- **The RealReal's overall take rate is ~30%, "effectively triple" a pure peer-to-peer marketplace** — the canonical stat for the managed-vs-P2P premium. STRONG. https://techcrunch.com/2017/05/25/anatomy-of-a-managed-marketplace/
- **Managed marketplaces insert paid labor (photography, copywriting, logistics, authentication) BEFORE the item sells.** That upfront labor is exactly what the concierge pickup replaces for the family — the reason the model can charge a premium take. STRONG. Same TechCrunch URL.
- **P2P benchmark take rates (2026):** Poshmark 20%, eBay ~13.25%, Etsy ~10%, Depop ~3.3%, Kidizen 12% + $0.50. So a family selling uniforms *themselves* on a P2P app keeps 80-97% — but does 100% of the labor and gets no local buyer. STRONG. https://www.voolist.com/blog/marketplace-fees-comparison-2026 ; Kidizen: https://support.kidizen.com/hc/en-us/articles/203840829-Marketplace-Fee

### The decision UniformPass has to make explicit: 50% of *sale* vs 50% of *profit*

The project context says "owner keeps **50% of profit**"; the distribution playbook says "keep **50%**" (of sale). These are very different numbers and buyers/sellers will hold you to whatever you say. **[JUDGMENT]**
- *50% of sale price* = simple, honest, matches the Mary of Nazareth precedent (§4), easy to explain in one text. Recommended for the pitch. Downside: on a $6 polo the operator nets $3 for a pickup+list+meetup — brutal per-item.
- *50% of profit* = requires defining costs (your time? gas? none?), invites "what were the costs?" questions, and reads as less generous. Avoid unless you're netting real out-of-pocket costs.

**Recommendation: say "50% of the sale price" and protect margin by only accepting PILES, never single items** (the model already implies this). The unit that makes economic sense is a pile, not an item.

### Unit economics of a single pile (illustrative) **[JUDGMENT]**

Using the real Mary of Nazareth resale prices (§4): a typical pile of ~15 outgrown items (mix of polos $6, PE kit $5, plaid bottoms $10-15) sells for roughly **$100-140**. At a 50/50 sale split: **~$50-70 to the family, ~$50-70 to the operator per pile.** That's the number that has to justify the operator's time.

The labor per pile: 1 pickup drive + photograph ~15 items + create ~15 listings + field buyer messages + coordinate meet-ups. **The meet-up-per-item is the hidden killer** — 15 separate cash handoffs destroys the economics.

- **What breaks for a solo operator: "unless inventory turns over very quickly, successful programs will quickly require more warehouses and more people." The model is labor-bound, not capital-bound.** STRONG. https://theagainco.medium.com/comparing-re-commerce-marketplace-options-peer-to-peer-versus-consignment-9b874ea81b2d
- **Consignment keeps unsold-inventory risk with the family (item stays theirs until sold); buy-outright shifts it to the operator.** This is *why* consignment can offer a more generous split — you're not eating dead stock. STRONG. https://firstquarterfinance.com/how-much-does-once-upon-a-child-pay/ ; https://puppetvendors.com/blogs/consignment-commission-rates-guide
- **Consignment/managed = slower to launch, storage + handling overhead, doesn't scale on one human; P2P launches in weeks with no inventory.** STRONG. theagainco Medium URL above.

> **[JUDGMENT] Three margin-savers for the single operator:**
> 1. **Bundle by size, sell as lots.** "Size 8 boys' SJR starter set — polo + 2 pants + PE kit, $35" is ONE meetup instead of five, and mirrors how buyers actually shop (they need a whole outfit, not one polo). This is the single biggest ops lever.
> 2. **Batch pickups and meet-ups geographically** — one Saturday, one town, several families.
> 3. **Cap intake quality at the door.** You hold the inventory risk *only* if you accept junk. Accept "excellent condition" only (Mary of Nazareth's exact rule), so nothing rots in the garage.

---

## 3. Virality + trust in tight parent communities

### The strongest real-world proof points for THIS business

- **Just Between Friends (JBF): a single local human operator (usually a mom) runs a twice-yearly meet-up children's-consignment sale — replicated 150+ times across 32 states, "trusted by over 1 million families," "served over 3 million families," consignors "make upwards of $700 each year," shoppers save "50-90% below retail."** This is direct, scaled evidence that *one trusted local operator can anchor a recurring resale community* and that the meet-up/no-shipping format works. STRONG. https://jbfsalefranchise.com/ ; https://www.jbfsale.com/
  > The operator-as-trust-anchor is not a weakness of the single-operator model — it's the mechanism. Your mom being *the* known face is the JBF playbook.
- **Buy Nothing Project: hyperlocal, no-payment, meet-up gift economy that reached ~7.5M members purely via closed Facebook groups, kept deliberately small and bounded to neighborhood lines so pickups stay local.** Trust is *emergent* — built by "witnessing all the generosity... repeated visible small exchanges," not by ratings or escrow. STRONG on scale/mechanism (Wikipedia); exact early growth-curve numbers WEAK (search snippets). https://en.wikipedia.org/wiki/Buy_Nothing_Project ; https://www.analystnews.org/posts/the-buy-nothing-movement-is-restitching-our-social-fabric-one-gift-at-a-time
  > **Lesson:** trust in a no-payments meet-up network is built by *volume of small visible successes*, not software. Every completed UniformPass handoff should be visible/celebrated in the group ("another SJR family just cleared their closet"). Social proof is the trust engine.

### How used uniforms actually spread inside a school

- **The dominant real mechanism is a PTA/PTO-linked "Preloved Uniform" closed Facebook/WhatsApp group with a school-affiliation gate:** to join, applicants answer a screening question and the school verifies "a genuine connection to the school." That verification IS the trust gate. WEAK (illustrative FB-group post via search) but consistent with the pattern. https://www.facebook.com/groups/1458438024296291/
- **Local school buy-sell groups see a predictable end-of-school-year surge of outgrown uniforms, "local pickup means no shipping costs"** — seasonality (June-Aug) + meet-up-only is already what parents expect. STRONG. https://www.goodto.com/money/turn-old-school-uniform-into-cash
- **Schools run recurring physical "pop-up" secondhand uniform shops (a "summer term tradition"), photographing items each week, managing appointments via "Calendly, Classlist or even a Google Spreadsheet," taking "a little commission."** Proof that spreadsheet-grade tooling + a physical event is a legitimate operating model, and that a small commission is normal. STRONG. https://www.classlist.com/blog/how-top-schools-are-reinventing-second-hand-school-uniform-sales

### Why a same-school parent beats a Craigslist stranger

- **Facebook Marketplace overtook Craigslist specifically on trust:** every listing is "connected to a Facebook account," giving both sides "background information on the person," whereas "Craigslist thrives on anonymity." STRONG. https://www.shopify.com/blog/craigslist-vs-facebook-marketplace ; https://www.ecommercebytes.com/2021/04/10/craigslist-versus-facebook-how-the-two-platforms-stack-up-for-reselling/
  > A same-school parent is a *stronger* version of that identity signal than a random FB profile. UniformPass's "Verified by UniformPass" badge + school-scoping is buying exactly this trust for free. Lean into it: show the seller's school affiliation and the Verified badge prominently.
- **Academic backing for "school affiliation as trust signal":** "particularized trust is typical to close groups and communities"; "relational trust is more likely to arise in schools where... participants have deliberately chosen to affiliate" (a chosen Catholic school pre-conditions trust). WEAK/extrapolated (this literature is about parent-school trust, not resale). https://www.brookings.edu/articles/strengthening-trust-in-schools-and-communities/

### What actually spreads (and the caution)

- **Group-chat forwarding is fast but leaky:** a school message "was forwarded to a friend outside the community... reaching local Facebook groups within an hour." Shows an offer can jump school-to-channel in under an hour — and is *also* why admins mute spammers. WEAK (search paraphrase). https://www.safeonsocial.com/post/why-schools-and-parent-groups-should-stop-using-whatsapp-for-communication
  > **[JUDGMENT] The unlock is the messenger, not the message.** Your mom (a known parent) posting "my son built this" in a group she belongs to converts far better than a stranger link — and the playbook already says this. The single most viral asset is a *specific dollar outcome*: "An SJR mom just cleared her closet and got $60 — here's how." Named, local, concrete.

---

## 4. Pricing used school uniforms

### The crown-jewel analog: a Catholic school already runs UniformPass's exact model

**Mary of Nazareth Catholic School HSA used-uniform sale — verified price list and split (confirmed on the primary page):**
- Girls kilts/jumpers **$15**; khaki pants (girls/boys) **$10**; polo shirts with logo **$6**; PE items (shorts/sweats/tees/sweatshirts) **$5 each**; hair accessories/ties/belts **$1**.
- **"For each used item re-sold, 50% of the sale price goes to the family and 50% goes to the HSA."**
- Accepts "gently used uniforms that are in excellent condition"; items must be tagged; untagged items become donations.
- STRONG (verified). https://www.maryofnazareth.org/used-uniform-sale

> This is UniformPass's model — a Catholic-community used-uniform sale on an exact 50/50 split — *already working in the wild*. It validates both the split and the price points, and it's the single best precedent to cite when a parent asks "is this legit?"

### New uniform prices (the anchor buyers compare against)

- **Flynn O'Hara (a dominant Catholic-school uniform vendor):** navy plaid pleated skirt **$55**; wrap kilt **$62**; slacks **$37-56**; performance polos **$24-34**; oxford shirts **$34-43**. Plaid drop-waist jumper **$55**; sweater vest **$40-46**. STRONG. https://flynnohara.com/shop/charlotte-catholic-high-school-nc022/ ; https://flynnohara.com/shop/epiphany-catholic-school-fl032/
- **Branded/crested items are the pricey ones:** school-specific crested uniforms run **$100-500+** per outfit; a **blazer with school insignia alone is $100-300+**. STRONG. https://education.costhelper.com/school-uniforms.html
- **NJ back-to-school 2025:** median **$628/child**, ~**$800/high-schooler**, +4% YoY, with uniforms flagged as a hot category. STRONG. https://nj1015.com/ixp/393/p/back-to-school-supplies-nj/

### What used uniforms actually fetch (% of retail)

- **Anchor math from real data:** a plaid kilt/jumper resells at **$15 used vs ~$55-62 new ≈ 24-27% of retail** (Mary of Nazareth vs Flynn O'Hara, both STRONG).
- **General used-clothing "50/25/10 rule":** ~50% of retail if <1yr old, 25% if 1-3 yrs, 10% if 3+ yrs; mid-range brands retain 15-35%. Uniforms sit in the lower tiers. STRONG. https://www.thrift.guide/guide/how-to-price-used-clothes
- **Swap/exchange programs are usually free or $1/item**; the paid model (Mary of Nazareth, $1-15/item, 50/50) is the exception and the one that maps to UniformPass. STRONG. https://classic.ptotoday.com/answers/question/14271-uniform-swap

> **[JUDGMENT] Pricing rules for UniformPass, grounded in the above:**
> - **Anchor every listing to new price.** Show "New $55 → UniformPass $15." The savings *is* the pitch (parents feel the $628/child pain).
> - **Price used branded plaid at ~25-30% of new**, polos/PE kit at $5-6 flat (matches the real Mary of Nazareth list — don't overthink it). Round, simple numbers move faster in a meet-up cash economy.
> - **Blazers and crested items are the margin — price them higher (~30-40% of a $100-300 new blazer)**; they're the items parents most dread buying new, and the resale savings are largest in absolute dollars.

### Why uniforms are a genuinely good resale category

- **Required purchase every year** + **standardized/branded per school** = predictable, repeat demand for the *exact same SKU* (each school locks to one plaid/vendor — Flynn O'Hara's school-specific catalogs prove it). STRONG.
- **High new cost creates the savings motive** ($55-62/branded item; $100-300+ blazer; ~$800/HS student in NJ). STRONG.
- **Kids outgrow fast → supply turnover.** Widely asserted but only WEAK-sourced in what could be verified; use as intuition, not a hard stat.

> **[JUDGMENT] One category caveat for THIS beachhead:** all three launch schools are Catholic *high schools* (Don Bosco Prep and Bergen Catholic are all-boys; SJR is coed). High-schoolers outgrow slower than elementary kids, so the biggest, most reliable supply event is **graduating seniors dumping full sets** (blazers, ties, gym kit) each June — plus size jumps in freshman/sophomore year. Target graduating-senior families hard; that's your fattest supply vein. (School genders/levels are public fact; the supply-timing inference is [JUDGMENT], not sourced.)

---

## 5. Three-to-five prioritized moves for the next month

Ordered by leverage. Each is chosen to fit the no-payments, meet-up, single-operator, consignment-moat reality — not generic startup advice.

### Move 1 — Pick ONE beachhead school and saturate it before the other two
**Why:** density in one pre-connected community beats being thin across three; expanding early is the classic hyperlocal failure. (Andrew Chen; Reforge — §1.) **[JUDGMENT]** Choose the school where your mom has the deepest group-chat access. Define "won" concretely: **~20-30 live, Verified listings covering the common sizes/SKUs, and 3+ completed sales with a named "$X" story.** Only then clone to school #2.
**This week:** point all supply outreach at that one school; get its hub non-empty first.

### Move 2 — Run the concierge pickup as your supply engine, led with a dollar estimate
**Why:** the pickup *is* supply-first made physical (§1), and Airbnb proved an upfront earnings estimate is "an order of magnitude" more effective than any other pitch. **Steal it directly:** every `/sell-for-me` pitch and pickup text opens with "Your pile of outgrown [school] uniforms is worth roughly $[X] — you keep half, you do nothing." Target **graduating-senior families first** (fattest supply vein — §4).
**Goal for the month:** 3-5 real piles picked up, photographed, listed, Verified.

### Move 3 — Seed each school hub so it's never empty, then drive demand
**Why:** empty stores convert nobody; Yelp/Indeed/Airbnb all pre-filled supply before showing buyers (§1). List your own donation stock + first pickups, flag "Verified by UniformPass," *then* push buyers via the group post. Sequence supply → demand, exactly as the distribution playbook says. **Bundle inventory into size-based lots** (one meet-up per outfit, not per item) to protect operator margin (§2).

### Move 4 — Make your mom the trust anchor and post ONE dollar-outcome story per school group
**Why:** JBF proves a single known local operator anchors a resale community at scale; FB-Marketplace-beats-Craigslist proves identity is the trust signal; same-school affiliation is the strongest free version of it (§3). Your mom posting "my son built this, an [school] mom just cleared her closet and got $60" in a group she belongs to is the single most viral asset you have. One post per group, from her account, spaced out (anti-spam rules in the playbook are correct).

### Move 5 — Lock the split language and the intake bar, in writing
**Why:** ambiguity between "50% of sale" and "50% of profit" will burn trust the moment money changes hands (§2). Decide now: **"You keep 50% of the sale price"** (matches the Mary of Nazareth precedent, simplest to explain). Pair it with a written **"excellent condition only"** intake rule (Mary of Nazareth's exact bar) so you never hold dead stock — the one place a consignment operator eats real loss.

---

## Confidence & sourcing notes

**Load-bearing / STRONG (built the recommendations on these):** Paul Graham "Do Things That Don't Scale" (verified verbatim, paulgraham.com/ds.html); Andrew Chen marketplace-supply + cold-start posts (Airbnb 300/100 threshold and earnings-estimate lever verified on primary); Reforge and Lenny/a16z cold-start guides; NFX 19 tactics; TechCrunch managed-marketplace (~30% take rate); The RealReal / Once Upon a Child / JBF / ThredUp split data; **Mary of Nazareth used-uniform sale (verified on primary — the crown-jewel 50/50 Catholic-school analog)**; Flynn O'Hara catalog prices; CostHelper; thrift.guide; Buy Nothing (Wikipedia) and JBF franchise scale.

**Treated with caution / WEAK (hedged or flagged in-text, not used as hard anchors):** a16z "two-thirds die on supply" exact fraction (primary 403'd, via Reforge); Nextdoor and Buy Nothing exact growth-curve numbers (secondary blogs/snippets); UniformMarket uniform-cost stats (403); Mercari 2026 take rate (sources disagree); ThredUp exact service fee (sources disagree); the "outgrow twice a year" and "girls 12% costlier" claims; WhatsApp "within an hour" anecdote; the Preloved-Uniform FB-group screening detail. Anything marked **[JUDGMENT]** is my strategic synthesis for UniformPass specifically, not a sourced fact.

**Deliberately not double-counted with the existing playbook:** this brief is the *evidence + economics + pricing* layer; the turn-by-turn outreach scripts, cadence, and tracker live in `uniformpass-distribution-playbook-2026-07-12.md`. Where they overlap (supply-before-demand sequencing, mom-as-messenger), this brief supplies the sourced reason the playbook is right.
