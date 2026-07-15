STATUS: complete

# Clutter lens — UniformPass — 2026-07-15

Lens: keep/cut on over-explaining, redundant/duplicate affordances, and elements that earn nothing.
Every candidate below gets an explicit keep or cut call. Genuine content is deferred, not deleted, where possible.

## Top 3

1. **On mobile, "Sell" is a literal duplicate — printed twice, in two different fixed chrome bars, at all times.** `app/layout.tsx:50-55` (header "+ Sell" pill) has no `hidden sm:` guard, unlike its three sibling header links, so it renders on every breakpoint including phones — right on top of `components/BottomNav.tsx:9` ("Sell" tab, same `/new` destination). A mobile buyer's screen shows the word "Sell" twice at once, doing the identical thing, for no reason other than a missed class.
2. **Browse has two independent, permanently-visible controls for the same "which school" filter.** The Hero's fuzzy-search typeahead (`components/BrowseExperience.tsx:200-226`) and the plain `<select>` "All Schools" dropdown in the filter bar (`components/BrowseExperience.tsx:117-120`) both write to the identical `schoolId` state (`:90-94` vs `:117`). After a parent finds their school via the nice search box, they scroll down and meet a second, dumber picker already pointed at the same school — an entirely redundant second control on the highest-traffic page in the app.
3. **The listing detail page prints the school name twice, verbatim, a few inches apart, with zero new information the second time.** `app/listing/[id]/page.tsx:126` (eyebrow above the item title) and `app/listing/[id]/page.tsx:169` (`<Row label="School" value={listing.school_name} />` in the facts table) are the exact same string.

---

## CRITICAL

### 1. Duplicate "Sell" CTA on mobile — header pill + bottom-nav tab, both always on screen
- **Element:** the `+ Sell` header button, `app/layout.tsx:50-55`.
- **Current behavior (why wrong):** every other action in that header row is explicitly hidden on mobile — `Auto Sell` (`layout.tsx:43`) and `My Listings` (`layout.tsx:46`) both carry `hidden sm:inline-flex` — but `+ Sell` doesn't. So on a phone (the launch audience's device, per `components/BottomNav.tsx`), the sticky header shows `+ Sell` in the top-right at the same time the fixed bottom nav shows a `Sell ➕` tab (`BottomNav.tsx:9`), both linking to `/new`. It reads as a bug, not a decision — the header row was clearly meant to collapse to just the auth control on mobile, matching its siblings, and this one link was missed when `BottomNav` was added.
- **Correct behavior:** add `hidden sm:inline-flex` to the `+ Sell` link in `layout.tsx`, exactly like its siblings. Mobile keeps exactly one "Sell" affordance (the bottom-nav tab); desktop is unaffected (it has no bottom nav).
- **WHY:** when the same word, same icon-adjacent color treatment, and same destination appear twice in fixed chrome the user never scrolls past, it doesn't read as "extra emphasis" — it reads as sloppy, and it eats vertical space top AND bottom on the smallest, most cramped screens in the audience. One primary action should live in exactly one place.
- **Call: CUT** (delete the duplicate, don't reword it — textbook instance of the known "delete duplicate affordances" pattern for this product).

### 2. Two school-filter widgets on Browse, both live at once
- **Element:** Hero school search (`components/BrowseExperience.tsx:200-226`, placeholder `'Find your school... try "SJR" or "Bosco"'`) vs. the "All Schools" `<select>` in the filter bar (`BrowseExperience.tsx:116-120`).
- **Current behavior (why wrong):** both are bound to the same `schoolId` state (`onPickSchool` at `:90-94` sets it; the filter-bar `<select>`'s `onChange` at `:117` also sets it). Nothing tells the user these are the same control — one is a prominent fuzzy-match search box in the hero, the other is a plain, unstyled native dropdown lower on the page, pre-populated with the same answer. A parent who already typed "Bosco" and picked Don Bosco Prep scrolls down and sees a second, unlabeled-as-connected picker sitting on "Don Bosco Prep, NJ" — is that a second filter, or an echo of the first? There's no way to tell without testing it.
- **Correct behavior:** remove `school` from the filter-bar `<select>` grid (keep Category/Gender/Size/Condition there). Once a school is picked via the Hero, surface it as a small dismissible chip near the `Fresh from {schoolName}` heading (`:100-102`) instead — one visible "current school" state, one place to set or clear it.
- **WHY:** a filter dimension should have exactly one input. Two independent widgets for the same value force the user to reconcile them mentally ("did clearing this dropdown also clear my search? Do I need to touch both?"), and it wastes filter-bar space re-asking a question the Hero already answered, on the single page every cold visitor and every flyer/QR scan lands on first.
- **Call: CUT** the filter-bar school select; replace with a status chip driven by the same state.

---

## HIGH

### 3. Listing detail page states the school name twice, identically, with no new framing
- **Element:** `app/listing/[id]/page.tsx:126` (`<p className="text-sm text-gray-500 font-medium">{listing.school_name}</p>`, the eyebrow above the item title) and `app/listing/[id]/page.tsx:169` (`<Row label="School" value={listing.school_name} />` inside the facts table).
- **Current behavior (why wrong):** these are the literal same string, rendered ~40 lines of JSX (a small vertical gap on the page) apart in the same right-hand column. The eyebrow already does the job the facts-table row is trying to do — establish which school this item belongs to — before the user has read anything else. Unlike a real product-spec table (where repeating "Brand: Nike" under a Nike breadcrumb at least reads as a formal spec), this Row sits between `Location` and `Payment` with zero added precision (no code, no link, nothing the eyebrow lacked).
- **Correct behavior:** drop the `School` row from the facts table (`Row` list at `:168-176`); keep `Location`, `Payment`, `Listed by`, `Posted`. The eyebrow already owns "which school."
- **WHY:** a facts table's value is that every row tells you something new; the moment one row is a verbatim echo of copy the user read three seconds earlier, the whole table reads as padded, and it primes the user to skim past rows that might actually matter (Payment, Posted date).
- **Call: CUT** the School row from the details table.

### 4. /contact still offers the "take down a listing" escape hatch Dylan already decided to remove — and it's more prominent here than where it was cut
- **Element:** `app/contact/page.tsx:49` — `"Questions, or need help taking down a listing? Send us a note and we'll sort it out."` (the H1 subtitle, the first sentence a visitor reads on this page).
- **Current behavior (why wrong):** per `context.md` (2026-07-14 session), the footer's "need to take down a listing?" line was deliberately dropped because sellers now self-serve via `/my-listings → Manage → Delete listing` (`app/listing/[id]/manage/page.tsx:382-390`) — the whole point of shipping accounts. That decision was implemented in the footer (`app/layout.tsx:61-70` now just says "Contact us") but never propagated to `/contact` itself, where the identical use case is not just present but the headline explanation for the whole page. A seller who could delete their own listing in two taps is instead being invited to email and wait.
- **Correct behavior:** cut "or need help taking down a listing?" from the subtitle; leave "Questions? Send us a note and we'll sort it out." The manage-link-invalid fallback (`manage/page.tsx:204`, "Contact us and we'll edit or take down your listing for you") is the correct place for that message — it's shown only to someone who's already proven they can't self-serve (broken/lost token).
- **WHY:** once a self-serve path exists, advertising the slow manual path as a first-class option undermines the reason the path was built, and it's a support-ticket generator for something the product already solves — every finding here (matching the pre-flight raw-PII / dead-end patterns) is about not making the user do more than the product now lets them.
- **Call: CUT** the take-down mention from `/contact`'s subtitle.

---

## NICE-TO-HAVE

### 5. /new's closing caption restates the contact card and the two buttons directly above it
- **Element:** `app/new/page.tsx:449-451` — `"Free to post. Save a draft to finish later, or post now... buyers reach out directly and you meet up to complete the sale."`
- **Current behavior (why wrong):** "Save a draft to finish later, or post now" restates the two buttons sitting immediately above it (`saveDraft` / `Post listing`, `:439-446`) — the buttons are already self-explanatory. "Buyers reach out directly and you meet up to complete the sale" restates the "How buyers reach you" card's intro just above it (`:414-417`: "Buyers contact you directly and arrange payment (cash/Venmo) in person. Nothing goes through the site."). Only "Free to post" is genuinely new information on this page.
- **Correct behavior:** trim to just `"Free to post."` Drop the rest — it's the only clause not already stated elsewhere on the same screen.
- **WHY:** a closing caption should add the one fact the page hasn't said yet, not narrate the buttons the user is about to press; the redundant half makes the real new info ("free") easy to miss in the run-on.
- **Call: CUT** the redundant clause; **KEEP** "Free to post."

---

## Explicit keeps (near-duplicate-looking, but earn their place)

- **Header "Auto Sell" nav link (desktop) + homepage `ConsignmentBand` promo (`BrowseExperience.tsx:238-260`).** Different jobs — global wayfinding vs. a persuasive, benefit-stated module — and they don't compete for the same glance (nav is a thin top bar, the band is a full content module). Standard, not clutter. **KEEP.**
- **`SharePanel`'s "Share..." native-share button + "Copy message + link" button (`components/SharePanel.tsx:144-155`).** Not a real duplicate: native share only renders when `navigator.share` exists (`:144`), so on desktop there's only ever one button. Progressive fallback, not padding. **KEEP.**
- **`/my-listings` per-row quick action (Mark sold / Post it) vs. the full Status tabs inside `/listing/[id]/manage` (`manage/page.tsx:238-250`).** Two speeds of the same job (one-tap vs. full edit context) is a defensible, common inventory-list pattern, not redundant chrome. **KEEP.**
- **Seller name repeated across the listing detail page** (`Listed by` row, `Contact {seller}` header, `Text/Email/Venmo {firstName}` button label, `See everything {seller} is selling →` link). Each instance serves a different intent (attribution, contact framing, action label, cross-sell) — this is how Poshmark/eBay-style listing pages work too. Not clutter. **KEEP.**
- **"No fees · No shipping · Meet locally" appearing in both the Hero (`BrowseExperience.tsx:228-230`) and the global footer (`layout.tsx:62`).** A five-word trust strapline bookending the homepage (and closing every other page) is cheap, standard reinforcement, not padding that earns nothing. **KEEP.**
