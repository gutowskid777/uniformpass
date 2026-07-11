## Buyer — Just Browsing (No Specific Target)

**Goal:** Get a feel for what's available for their kid's school — prices, categories, quality — with zero commitment. Discover something they didn't know they needed. Decide whether this marketplace is "worth coming back to."

**Mental state / constraints:** Curious, low-intent, first-time or casual visitor. Probably arrived via a link shared in a school parent group, PTO email, or QR code on a flyer — not by searching UniformPass directly. Likely on a phone, likely mid-multitask (school pickup line, between errands). Has zero patience for signup friction and is silently judging whether this is a "real," trustworthy site or a sketchy Craigslist clone. Doesn't yet know or care that there's no in-app payment — that needs to be self-evident before it becomes a confusion point.

**Ideal entry point:** A school-specific storefront URL (e.g., `uniformpass.com/sjr`), not a generic homepage. The shared link already encodes the school, so the visitor lands directly on "St. Joseph Regional Marketplace" with live inventory visible above the fold — no school picker, no search bar required to get started.

**Ideal click-path (numbered, ≤7 steps):**
1. Lands on school storefront — hero shows school name/crest, live item count ("212 items available"), and a one-line trust statement ("Free to browse. No account. Meet up locally to pay.")
2. Scrolls a curated overview of category tiles (Uniforms / Sports / Spirit Wear / Alumni) each showing item count + price range — no filters forced yet
3. Taps a category tile that catches their eye → grid of listing cards (photo, price, size, condition badge)
4. Taps an item card → detail view: photos, price, size/condition, seller first name + general area, "Verified by UniformPass" badge if consigned, "Contact Seller" button
5. Scrolls a "More from this school" strip to keep browsing without backing out
6. Taps "Contact Seller" on something interesting — opens a no-login contact sheet (text/email/WhatsApp intent, pre-filled subject)
7. Leaves via a passive "Got uniforms to sell? We'll do it for you →" banner, priming the concierge-consignment loop for next visit

**The ONE primary CTA per key screen:**
- Storefront landing: scroll/explore prompt into category tiles (no hard CTA — this is a browsing surface)
- Category grid: tap an item card
- Item detail: "Contact Seller"

**Trust / clarity reinforcement points:** "Verified by UniformPass" badge with a one-tap explainer ("picked up, photographed, and listed by us"); seller shown as first name + general area only (never full address); listing freshness ("Listed 2 days ago"); explicit no-account/no-fee/no-shipping statement visible without scrolling; a light "how it works" strip (browse → contact seller → meet up & pay) so first-timers immediately understand the off-platform meetup model.

**Components this journey demands:** School storefront template, category tile nav with live counts, item card component (photo/price/size/condition badge), item detail page, no-login contact sheet, "how it works" explainer strip, related-items rail, empty-state design for thin categories, passive concierge-consignment banner.

**Friction to eliminate:** Any signup/account wall; a manual school search/dropdown on landing (should be pre-loaded from the link); filter overload thrown at a browser who hasn't shown intent yet; ambiguity about how payment/pickup actually works; dead-end category pages with no guidance when inventory is sparse.

**Top 3 non-negotiables:**
1. Zero login or signup to browse or contact a seller — ever.
2. School context loads instantly from the entry link; no manual school selection step.
3. Every item card shows price, size, and condition at a glance, with no click required.

---

## Buyer — Hyper Price-Sensitive

**Goal:** Find the cheapest option — ideally free — fast. Compare prices across sellers and lots, and lock in the best deal before someone else does. Minimize time spent per dollar saved.

**Mental state / constraints:** Task-oriented, budget-driven, impatient. Often shopping for a specific item/size (e.g., "boys polo, size 10") rather than exploring, possibly outfitting multiple kids. Mentally comparing every price against the cost of buying new. Wants control (sort, filter) more than curation. Will abandon quickly if forced through a browsing-style storefront before reaching a filterable list, and will disengage entirely if a listing they contact turns out to already be sold.

**Ideal entry point:** The school storefront, but landing directly on — or one tap from — a filterable, sortable inventory list rather than a curated hero. Sort defaults to price-ascending, and a "Free" quick-filter chip is visible immediately, not buried inside a price-range slider.

**Ideal click-path (numbered, ≤7 steps):**
1. Lands on school storefront, taps straight past the hero into "Browse All" (or the storefront itself surfaces a sticky filter/sort bar immediately)
2. Sets category + gender + size via fast tap-chips; "Free" and "Lots" chips sit alongside standard filters as first-class options, not secondary
3. Results render sorted price-ascending by default, with a pinned "Free Items" strip surfaced at the top regardless of sort order
4. Scans a dense list view (price bolded/large, condition badge secondary) to compare several items at a glance without opening each one
5. Taps into 2-3 candidates to compare detail (price, condition photos, lot contents if applicable); back button returns to the exact same filtered/sorted list state
6. For a "Lot" listing, expands "View Lot Contents" to see per-item price breakdown (e.g., "$25 for 6 items — $4.17/item")
7. Taps "Contact Seller" on the winning deal, using a pre-filled quick message ("Is this still available? Can we meet at pickup?") to lock it in before anyone else does

**The ONE primary CTA per key screen:**
- Storefront/filter entry: "Sort by Price" (pre-selected default)
- Filtered results list: tap a row to open detail
- Item detail: "Contact Seller" (pre-filled fast message)

**Trust / clarity reinforcement points:** Unmistakable, color-coded "Free" badge (not just "$0" text easy to skim past); transparent per-item pricing on lots so bundle value is instantly clear; visible "still available" / freshness signal; condition badges backed by required photos for anything below "good" so price and condition aren't in dispute; a "sold/reserved" state that removes or visibly flags dead listings in near-real time so price hunters never waste a message chasing something gone.

**Components this journey demands:** Sticky filter/sort bar, price-ascending default sort, first-class "Free" and "Lots" quick-filter chips, per-item price calculation on lot listings, dense list-view toggle (vs. photo grid), sold/reserved status flag, quick-message template on the contact action, filter-state persistence across back-navigation.

**Friction to eliminate:** Sort/filter controls buried behind extra taps or menus; free items scattered randomly instead of surfaced together; no visibility into per-item lot value (forcing manual math); stale/sold listings still showing as available; typing a full message from scratch to every seller; losing applied filters when navigating back from an item; bundle-only pricing with no breakdown.

**Top 3 non-negotiables:**
1. "Free" and "Lots" are one-tap, first-class filters — never nested inside a price-range slider.
2. Default sort is price-ascending, and filter/sort state persists through back-navigation.
3. Sold/reserved items are flagged or removed in near-real time so price-sensitive buyers never chase a dead listing.
