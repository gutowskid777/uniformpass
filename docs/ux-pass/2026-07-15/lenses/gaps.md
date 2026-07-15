STATUS: complete

# UX Pass — Lens: GAPS (missing vs. expectation / vs. FB Marketplace)
Audited 2026-07-15 against live code on disk.

## Top 3

1. **Auto Sell asks strangers to leave belongings "by your door" for a completely unnamed "we"** — a higher-trust ask than a public meetup, yet the flow that gets a dedicated safety module is the *lower*-risk one (buyer meeting a seller in public), while the one where someone comes to your actual house gets zero identity or trust content anywhere. `app/sell-for-me/page.tsx:11-15`, whole file.
2. **Three distinct dead-end states (school not in our list / school in list but zero listings / filters zeroed out an otherwise-stocked school) collapse into two, and the copy is mismatched to the state the user is actually in.** A school that literally doesn't exist in the DB produces a silently-empty search dropdown with no capture at all — worse than the other two. `components/BrowseExperience.tsx:174,211-225` (silent zero-result) and `:77,264-334` (cold-start vs. filtered-to-zero given identical treatment).
3. **The "Verified by UniformPass" badge — the one signal that separates operator-quality inventory from a random listing — is delivered only via a native hover tooltip, which never fires on a touchscreen.** Every viewer of this badge is on a phone (bottom-nav mobile audience). `components/VerifiedBadge.tsx:6-13`.

---

## CRITICAL

### 1. Auto Sell's "we" is never identified — the highest-trust ask in the product gets the least trust content
**Element:** `app/sell-for-me/page.tsx:11-15` (`STEPS` array — "Leave it by your door at a set time" / "We come to you" / "Cash or Venmo. Half is yours.") and the rest of the page (`164-320`), plus `app/pickup/[id]/page.tsx` and `app/admin/page.tsx` (pickup confirmation + admin pickup card).

**Current behavior (why it's wrong):** The Auto Sell pitch is literally "leave your stuff unattended outside your home for a stranger to collect." Nowhere on `/sell-for-me`, the pickup confirmation page, or the pickup-request email does the product say *who* is coming — no operator name, no photo, no "run by a mom from your own school community," nothing. Compare this to the individual listing page, which for a lower-stakes public cash meetup gets a dedicated safety callout block ("Meeting up, the safe way" — `app/listing/[id]/page.tsx:190-196`). The riskier ask (stranger comes to your door) gets *less* reassurance than the safer one (you meet a stranger in a public place). `context.md:19` confirms this was already noticed once ("About the founder/team section: PARKED... 'later bc that's hard'") — it's live with real users now, which raises the stakes on the same open gap.

**Correct behavior:** Add one line of identity/trust to the Auto Sell hero or the pickup steps — e.g. "Run by [Name], a [School] parent" or a small photo + first name — and repeat that identity on the pickup-confirmation page (`app/pickup/[id]/page.tsx`) so a parent who already submitted a request can see who's about to knock on their door.

**WHY (mental model):** Trust has to scale with the size of the ask. A cash meetup in a parking lot is a known, low-commitment social script; inviting someone to your home to collect your belongings is not. A product that puts a safety module in front of the *smaller* ask and nothing in front of the *bigger* one is solving trust backwards — it reassures people exactly where they already feel safe and leaves them alone exactly where they'd naturally hesitate.

---

### 2. Dead-end handling is two states doing the job of three, and the fallback CTA is wrong for the state that matters most
**Element A — silent zero-result search (the "not-listed" state):** `components/BrowseExperience.tsx:174` (`const results = query.trim() ? searchSchools(schools, query).slice(0, 6) : []`) and `:211-225` (`{focused && results.length > 0 && (...)}`).

**Current behavior (why it's wrong):** If a parent types their school into the Hero search and it isn't one of the ~44 hardcoded schools, `results` is an empty array and the dropdown block simply doesn't render — line 211's gate (`results.length > 0`) means there is no "no matches" message, no "request your school" link, no email-capture, nothing. The user's typed text just sits in the box with zero feedback. This is the single worst dead end in the product — it captures *no* lead at all — yet it's silent, so it's easy to miss in a walkthrough.

**Element B — cold-start school vs. over-filtered school (mapped to the same treatment):** `components/BrowseExperience.tsx:77` (`activeFilters = [schoolId, category, gender, size, condition].filter(Boolean).length`) feeds into `EmptyState` (`:264-334`). Because `schoolId` is counted as just another filter, picking a school via the Hero search (the product's primary intended flow — `pick()` at `:184-188`) always makes `hasFilters` true. So a school that has genuinely never had a single listing (cold-start) renders identically to a school with plenty of listings that the user has over-filtered down to zero (filtered-to-zero): same "Nothing here yet." headline (`:291`), same "Or clear the filters" link (`:323-326`). The one CTA that's actually right for a true cold-start school — "Or be the first to sell →" (`:328-331`) — is gated on `!hasFilters`, a condition that can never be true once a school is selected from the Hero. So the exact moment a newcomer picks their school and finds it empty, the product hides its best next step from them and offers a "clear filters" link that, for a single-filter cold-start, does nothing useful (there's nothing more to clear back to).

**Correct behavior:** Distinguish the three states explicitly: (1) query with zero school matches → render an inline "Don't see your school? [Notify me when it's added]" capture, not a silently empty box. (2) school selected, zero listings, *no other filters active* → cold-start copy ("No one's listed from [School] yet") + "Be the first to sell" as the primary CTA, notify-me as secondary. (3) school + other filters active, zero results → filtered-to-zero copy ("No matches for these filters at [School]") + "Clear filters" as the primary CTA (school stays selected).

**WHY (mental model):** These are three different user intents needing three different next actions — "my school isn't here" wants a promise it'll be added; "my school is here but empty" wants to be told they can be first; "I over-filtered" wants a smaller haystack. Serving the wrong CTA (or none) at each of these moments either wastes the strongest lead-capture opportunity in the product (a parent who just typed their exact school name is the highest-intent visitor you'll ever get) or tells them to do something ("clear filters") that can't actually fix their problem.

---

### 3. The only visible "this listing is legit" signal is unreachable on the audience's device
**Element:** `components/VerifiedBadge.tsx:6-13` — the badge's entire explanation lives in a native `title="..."` attribute (line 9): *"Operator-listed and quality-checked by UniformPass — we picked it up, checked it, and listed it ourselves."* The visible badge itself just reads "✓ Verified" (compact, on grid cards — `components/BrowseExperience.tsx:376-378`) or "✓ Verified by UniformPass" (full, on listing detail — `app/listing/[id]/page.tsx:128-130`).

**Current behavior (why it's wrong):** `title` tooltips fire on `:hover`, which does not exist on touch input. On iOS Safari and most mobile Android browsers, tapping the badge does nothing — no tooltip, no click handler, no fallback. The code comment even documents this was already a workaround for one bug (a previous custom popup got clipped by `overflow-hidden`) without addressing that the *replacement* mechanism doesn't work on mobile at all. Given the mobile bottom-nav was added specifically because "Browse/Sell-for-me were `hidden sm:block` ... invisible on the launch audience's device" (`context.md:109`), the same audience now sees a badge whose entire meaning is inaccessible to them — they see "✓ Verified" with no way to learn what it verifies.

**Correct behavior:** Move the explanation off `title` entirely — a tap-to-reveal popover/sheet on mobile (and hover-or-click on desktop), or simplest: put a compact explainer inline near every Verified badge instance ("✓ Verified — we picked it up & checked it ourselves") so no interaction is required at all.

**WHY (mental model):** A trust badge that requires an interaction pattern (hover) which doesn't exist on the device 100% of your audience is using is not a degraded trust signal — it's a decorative checkmark with no meaning attached, for everyone. The entire point of "Verified" is to differentiate operator inventory from a stranger's FB-Marketplace-style listing; if the differentiation text is unreachable, the badge conveys nothing beyond "some listings have a blue checkmark," which reads as arbitrary rather than trustworthy.

---

## HIGH

### 4. The seller profile page is the thinnest page in the product — less trust info than a single listing, and no way to act from it
**Element:** `app/seller/[id]/page.tsx` — entire file. Renders `{sellerName}'s listings` (`:33`), an item count (`:34-38`), and a grid of that seller's other available listings (`:48-64`). No other field is read or shown.

**Current behavior (why it's wrong):** This page exists specifically as the "see everything this person is selling" destination (linked from every listing with a `user_id` — `app/listing/[id]/page.tsx:214-219`), which makes it the natural second-look page before a buyer decides to message a stranger about a cash meetup. Yet it shows *less* trust information than the single listing it was linked from: the individual listing page has "Posted [date]" and a contact block; this page has neither. There's no "member since," no aggregate "X sold," no Verified indicator if any of the seller's items are operator-verified, and critically no way to contact the seller from this page at all — a buyer who wants to ask "do you have anything else in a 14?" has to pick one specific listing, open it, and use *that* listing's contact block, even though the intent that brought them here was about the seller, not one item.

**Correct behavior:** Add a lightweight trust line under the seller name (e.g. "Selling since [first listing date]" using `MIN(created_at)` across their listings, which the query already fetches) and a single contact affordance sourced from any one of their listings' `contact_info`, so a buyer can reach out about the seller's whole inventory without picking an arbitrary single item first.

**WHY (mental model):** A page whose entire reason to exist is "look at more from this person before you decide to trust them" should be the *most* trust-dense page in the product, not the least. Right now it's a bare grid — it answers "what else do they have" but not the question that sent the buyer there in the first place: "is this a real person I should message?"

---

### 5. There is no free-text item search — only a school name type-ahead exists
**Element:** `components/BrowseExperience.tsx:165-234` (the Hero search box, wired to `searchSchools()` from `lib/schoolSearch.ts`, which only matches against the `schools` table) and `:116-137` (the filter bar: 5 `<select>` dropdowns for School/Category/Gender/Size/Condition, no keyword input anywhere).

**Current behavior (why it's wrong):** The one text box on the browse page is scoped entirely to finding a *school*, not an *item*. A parent who knows what they want ("navy blazer size 16", "cleats") but doesn't know how the product bucketed it across five separate dropdowns (is a kilt filed under Category=Uniform, Gender=Girls, and which Size bucket?) has no way to type it and get a match — they have to guess-and-check across five selects. This is the core interaction FB Marketplace is built around (type a keyword, get matches), and it's the explicit named competitor for this product per the audit brief.

**Correct behavior:** Add a keyword field (matching against `item_type` and `description`) to the filter bar, distinct from the school finder, so "navy blazer" or "cleats" works as a query on its own or alongside a school filter.

**WHY (mental model):** Filters are for narrowing a list you're already willing to browse; search is for jumping straight to a thing you already have in mind. A marketplace with only filters and no search forces every specific-item shopper into a browse-and-scan pattern even when they know exactly what they're looking for — that's a materially slower path than the one they're used to from the competitor this product is explicitly positioned against.

---

### 6. No way for a buyer to flag a bad actor — the contact form only frames itself around delisting
**Element:** `app/contact/page.tsx:44-51` — the page heading and subhead: *"Contact us... Questions, or need help taking down a listing? Send us a note and we'll sort it out."* No listing-detail page, seller page, or footer link offers a "report this listing" or "report this seller" path anywhere in the codebase (`app/listing/[id]/page.tsx`, `app/seller/[id]/page.tsx`, `app/layout.tsx` footer all checked — none exists).

**Current behavior (why it's wrong):** A buyer who gets ghosted after agreeing to meet, or who suspects a listing is fake/scam, has exactly one channel — the generic contact form — and its own copy tells them it exists for delisting help and "questions," not for reporting someone. There's no signal anywhere in the product that bad behavior is policed, which matters more here than on FB Marketplace precisely *because* this product has no payment rail or messaging history to fall back on if something goes wrong — cash changes hands off-platform with no record.

**Correct behavior:** Add a lightweight "Report this listing" link on the listing detail page (reusing the existing `/contact` form with a pre-filled subject/context) and broaden the contact page's own copy to explicitly name reporting as a reason to write in.

**WHY (mental model):** Trust in a no-payment, no-messaging marketplace rests entirely on the belief that misbehavior has consequences. Even a simple, unglamorous "report" link signals to a wary stranger that someone is watching — its absence signals the opposite, regardless of whether reports would actually be acted on quickly.

---

## NICE-TO-HAVE

### 7. "What happens if my stuff doesn't sell?" is never answered — a genuine question the simplicity pivot left uncovered
**Element:** `app/sell-for-me/page.tsx:164-320` — the entire pickup-request page: hero, 3-step visual, form, pile-size chips, donate/keep toggle. No FAQ, no expandable "what if it doesn't sell," no timeline for how long items stay listed before being returned or donated.

**Current behavior (why it's wrong):** The page answers "how do I request a pickup" thoroughly but never answers the next question a cautious parent will have before bagging up their kid's uniforms and leaving them by the door: what happens to items that don't sell? Do they come back? Get donated automatically? How long does that take? This is exactly the kind of context Dylan's own bias check calls out — a genuinely necessary answer that a "simplicity pivot" (which already stripped Auto Sell's longer mission copy per `context.md:16`) may have cut along with the filler.

**Correct behavior:** One collapsed FAQ item (reusing the existing `<details>` pattern already on this page at `:248-261`) answering "what if it doesn't sell" — even a one-line answer is enough; it doesn't need to reopen the wall-of-text the pivot removed.

**WHY (mental model):** Progressive disclosure means the answer should exist *somewhere reachable*, not that it should be deleted. Cutting a question entirely (rather than tucking it behind a tap) doesn't reduce cognitive load — it just moves the uncertainty into the parent's head at the exact moment they're deciding whether to hand over their kid's belongings.

### 8. No favorites / save-for-later on browse
**Element:** `components/BrowseExperience.tsx:338-395` (`ListingCard`) — the card is a plain link to the listing; no save/heart affordance exists anywhere in the browse grid or listing detail.

**Current behavior (why it's wrong):** A parent scanning a grid of 20+ items across sizes/conditions has no way to shortlist a few before deciding, and no way to come back to something they liked without re-filtering from scratch (there's also no browsing history — this is a fully stateless grid beyond the URL-persisted filters).

**Correct behavior:** A simple heart/save toggle on the card, persisted to `localStorage` (no account required, consistent with buyers browsing anonymously) or to the account if signed in.

**WHY (mental model):** Browsing and deciding are different mental modes — shoppers compare several candidates before committing to one contact. Without a save mechanism, "compare a few options" degrades into "keep several tabs open" or "just message whichever one you're looking at right now," which pushes people toward a worse decision than they'd otherwise make.

### 9. No proximity/distance signal despite being an explicitly hyper-local product
**Element:** `components/BrowseExperience.tsx:388-391` (`ListingCard` renders `locationStr` as plain text — city/state only) and the filter bar (`:116-137`, no sort control at all).

**Current behavior (why it's wrong):** Listings show a town name as static text but there's no way to sort or filter by proximity to the buyer, and no distance shown ("12 min away" etc.). For a product whose entire value prop is "meet locally," this is exactly the dimension a buyer cares most about after school/size/price, yet it's the one dimension with zero tooling.

**Correct behavior:** At minimum, a sort-by-town option once a school is selected (most listings within a 3-school cluster will already share a handful of towns — Montvale/Ramsey/Oradell), or a "closest to [buyer's saved town]" default sort using the town field already captured in `seller_profiles`.

**WHY (mental model):** "No shipping, meet locally" makes distance a first-class filter criterion, not an afterthought — a buyer choosing between two otherwise-identical listings will pick the one that's a shorter drive, and today the product gives them no way to know which one that is without opening both.
