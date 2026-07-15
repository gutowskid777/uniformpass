STATUS: complete

# Mobile lens — 390px pass

Re-walked Browse, Auto Sell, New Listing, Listing Detail, My Listings, Sign-in, and Manage
against the literal Tailwind responsive classes in the code (breakpoint = `sm:` = 640px, so
everything below that is what the launch audience — arriving via QR code / group text on a
phone — actually sees). `resize_window`/iframe-harness tooling in this sandbox couldn't force
a true 390px viewport (window stayed pinned near 1800px regardless of tool calls; the
mobile-iframe harness artifact is CSP-blocked from framing an external origin), so this pass is
class-by-class code verification, not a live screenshot — every finding below is cited to the
literal Tailwind classes that determine what renders at <640px.

## Top 3

1. **The fixed `BottomNav` overlaps the footer's last line on every single page, and the footer's "Contact us" link is the only mobile path to `/contact`.** `main` only gets `pb-16` (`app/layout.tsx:59`) — that space sits *between* `main` and `<footer>`, not *after* it. `BottomNav` is `fixed bottom-0` (`components/BottomNav.tsx:16`), so it is not in document flow and nothing reserves clearance below `<footer>` (`app/layout.tsx:61-71`) for it. When a mobile user scrolls to the true bottom of any page, the fixed nav bar sits on top of the footer's tail — which is exactly where "Contact us" (`layout.tsx:68`) and the copyright line live — with no other mobile-nav path to `/contact` anywhere in the app. **Fix:** add bottom padding/margin equal to the nav's real height (including `env(safe-area-inset-bottom)`) after `<footer>`, not just after `<main>`. **Why:** `position: fixed` is relative to the viewport, not the document — anything that isn't explicitly given clearance for a fixed element will end up underneath it the instant the user scrolls to the point where that content and the fixed element would coincide.

2. **The header's "+ Sell" pill is the one nav link NOT hidden on mobile, so it duplicates `BottomNav`'s "Sell" tab.** `app/layout.tsx:43` (`Auto Sell`) and `:46` (`My Listings`) are both `hidden sm:inline-flex` — correctly suppressed on mobile because `BottomNav` already covers them. But `+ Sell` at `layout.tsx:50-55` has no `hidden` class, so on a 390px screen it sits in the header top-right *at the same time* `BottomNav`'s "➕ Sell" tab (`components/BottomNav.tsx:9`) sits at the bottom — two visible controls for the identical destination (`/new`) on the same screen. **Fix:** add `hidden sm:inline-flex` to the `+ Sell` link, matching the other two. **Why:** this is the exact "duplicate affordance" pattern flagged in prior passes (a "Shop SJR" button on a page that's already only SJR) — once BottomNav owns primary navigation on mobile, the header should stop repeating it, and the freed header space could carry something BottomNav can't (e.g. Sign in/out, which today is the only header item actually doing useful work on mobile).

3. **On the listing detail page, the primary "Contact/Text seller" CTA sits 2-3 screens below the fold on mobile because the photo comes first in DOM order and mobile has no side-by-side layout.** `grid-cols-1 md:grid-cols-2` (`app/listing/[id]/page.tsx:89`) means below 768px the photo gallery div (`:91-120`, a full-width `aspect-[3/4]` image — ~520px tall at 390px width — plus a thumbnail row) stacks *above* the Details column, and the Contact block (`:186-212`) is the near-last thing in that Details column, after price/title, tags, the details table, and the optional comments box. On desktop the two columns sit side-by-side so the CTA is visible without scrolling; on mobile — the actual launch device — a buyer has to scroll past the entire photo gallery and every detail row before reaching the one action that converts a browse into a sale. **Fix:** either reorder so a compact price + "Contact seller" CTA renders directly under the title (before the full gallery) on mobile, or make the contact button a sticky bottom bar that's visible while scrolling. **Why:** the desktop grid gives contact top-of-viewport visibility "for free" via side-by-side columns; stacking removes that for free without anything replacing it, so the single highest-intent action on the page is effectively hidden behind a wall of photo and metadata on the device 100% of the launch audience is using.

---

## CRITICAL

### 1. Fixed BottomNav covers the footer's last line / only mobile route to Contact
- **File:** `app/layout.tsx:59-71`, `components/BottomNav.tsx:16`
- **Current:** `<main className="min-h-screen pb-16 sm:pb-0">` pads main's *bottom*, not the page's true bottom. `<footer>` (`mt-16 py-8`) comes after `<main>` in flow, and `<BottomNav>` (`fixed bottom-0`, ~51-85px tall once `env(safe-area-inset-bottom)` is added on notched phones) is layered on top of whatever sits at the visual bottom of the viewport when scrolled to the end — which is the footer's tail, since nothing after `</footer>` reserves clearance.
- **Why wrong:** `pb-16` on `main` only creates space *before* the footer, it does nothing for space *after* the footer where the fixed nav actually needs clearance.
- **Correct behavior:** reserve bottom clearance (≥ the nav's rendered height + safe-area inset) after the true last element of the page (or on `<body>`), not on `main`.
- **Why:** fixed-position elements sit outside document flow; only explicit padding at the *actual end of the document* protects content from being covered when the user scrolls all the way down. This is the app's only footer, and "Contact us" is not reachable from BottomNav or the header on mobile — it's a genuine dead end if covered.

### 2. Header "+ Sell" duplicates BottomNav's "Sell" tab on mobile
- **File:** `app/layout.tsx:43-55` vs. `components/BottomNav.tsx:6-11`
- **Current:** `Auto Sell` and `My Listings` header links are `hidden sm:inline-flex`; `+ Sell` has no such class, so it renders on every screen size.
- **Why wrong:** `BottomNav` already puts a "➕ Sell" tab in front of the mobile user at all times — the header pill is the same label pointing at the same `/new` route, just in a second location.
- **Correct behavior:** `hidden sm:inline-flex` on the `+ Sell` link, consistent with its header siblings.
- **Why:** once a bottom tab bar owns primary navigation on a given breakpoint, anything the header repeats is dead weight competing for the same thumb-reach real estate that could carry something unique (e.g. auth state).

### 3. Listing-detail Contact CTA buried below the fold on mobile
- **File:** `app/listing/[id]/page.tsx:89-92` (layout), `:186-212` (contact block)
- **Current:** `grid-cols-1 md:grid-cols-2` stacks the photo gallery above the Details/Contact column below 768px; the `aspect-[3/4]` hero photo alone is ~520px tall at 390px width.
- **Why wrong:** the desktop 2-column layout gives the contact CTA immediate visibility beside the photo "for free"; the mobile 1-column stack removes that and puts the CTA after the full gallery + tags + details table + optional comments — several screens of scrolling before the one high-intent action on the page.
- **Correct behavior:** surface a compact price/CTA near the top on mobile (before the full gallery), or make "Contact seller" a sticky bottom action bar.
- **Why:** the launch audience is 100% on this breakpoint; burying the conversion action costs real sales, not just aesthetics.

---

## HIGH

### 4. Photo-delete "×" is a 20×20px tap target
- **File:** `app/new/page.tsx:331-334`
- **Current:** `className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 ..."` — a 20×20px circle to remove an uploaded photo during listing creation.
- **Why wrong:** well under the ~44×44px thumb-target floor (Apple HIG / Android 48dp guidance), on the exact screen where a mis-tap silently deletes the wrong photo the seller just took.
- **Correct behavior:** grow the hit area to ≥44×44px (padding the tappable region even if the visible circle stays small), same fix needed at `app/listing/[id]/manage/page.tsx:259-260` and `:267-268` where the equivalent button is `w-6 h-6` (24px) — bigger, still under the floor.
- **Why:** this is a photo-heavy, one-handed mobile flow; small delete controls next to a dense photo grid are exactly where accidental taps happen most.

### 5. `capture="environment"` blocks picking existing photos on many Android browsers
- **File:** `app/new/page.tsx:347`, `app/listing/[id]/manage/page.tsx:274`
- **Current:** `<input type="file" accept="image/*" capture="environment" multiple ...>`
- **Why wrong:** on a number of Android browsers, setting `capture` on a file input launches the camera app directly and skips the photo-library picker entirely — a seller who already has photos of the uniform on their phone (the common case: photos taken earlier, or received from another parent) has no way to select them, only to shoot new ones.
- **Correct behavior:** drop `capture="environment"` (keep `accept="image/*" multiple`) so the OS shows its normal chooser (camera *or* library) on both platforms.
- **Why:** forcing a fresh photo instead of letting a seller reuse one they already took adds real friction to the single highest-effort step of listing an item on a phone.

### 6. Listing-detail header actions row has no mobile fallback and overflows its budget
- **File:** `app/listing/[id]/page.tsx:69-87`
- **Current:** `<div className="flex items-center justify-between gap-3 mb-6">` holds "← Back to listings" on the left and, on the right, the Share pill (`:74-79`) plus — when the viewer is the listing's own seller (manage token in localStorage) — a "Manage your listing" pill (`:80-85`). None of these three elements, nor their parent row, sets `flex-wrap`.
- **Why wrong:** at 390px the available row width (~358px after `px-4` container padding) is comfortably exceeded by "← Back to listings" + the Share pill + "Manage your listing" pill together (rough estimate: ~430px combined) — with no wrap allowed, the pills' text either wraps mid-word inside a fixed-height pill or the row visually crowds/clips. This is exactly the screen a seller lands on most often (checking their own live listing from their phone).
- **Correct behavior:** stack the row (`flex-col gap-2 sm:flex-row sm:justify-between`) below `sm`, or shorten "Manage your listing" to "Manage" on mobile.
- **Why:** the seller-owned view is a repeat-visit surface (checking how the listing looks, sharing it, editing it) — a cramped header there is a recurring papercut, not a one-time glitch.

---

## NICE-TO-HAVE

### 7. InlineAccountStep modal has no scroll fallback under the mobile keyboard
- **File:** `components/InlineAccountStep.tsx:62-63` (outer `fixed inset-0 flex items-center justify-center p-4`, no `overflow-y-auto`), `:73-74` (`autoFocus` on the email input)
- **Current:** the modal is vertically centered in a non-scrolling fixed container, and immediately autofocuses the email field — which opens the keyboard the instant the modal appears.
- **Why wrong:** on shorter phones, the keyboard can eat enough of the visual viewport that the password field and/or submit button end up below the visible area, with no scroll container to reach them (this modal appears mid-flow on both `/new` and `/sell-for-me`, right after a seller has already filled in a whole form — the worst place to strand them).
- **Correct behavior:** add `overflow-y-auto` to the outer container (or drop `items-center` for `items-start` + top padding) so the modal can scroll under the keyboard.
- **Why:** deferred account creation is the whole point of this modal's design ("nothing re-entered") — if the submit button is unreachable, the seller's completed form is stuck behind a keyboard they can't work around.

### 8. My Listings action-button row is close to its mobile width budget
- **File:** `app/my-listings/page.tsx:263-275`
- **Current:** `<div className="w-full sm:w-auto flex items-center gap-2 shrink-0">` holds Manage / status-toggle (e.g. "Mark available") / Delete in one non-wrapping row that takes the full card width on mobile.
- **Why wrong:** longer status labels ("Mark available") push this row close to the ~334px available inside the card at 390px, leaving little margin — a slightly longer school name truncating elsewhere is fine, but these are tap targets, and a squeeze here risks the row wrapping unpredictably or buttons touching.
- **Correct behavior:** allow this row to wrap (`flex-wrap`) or drop to two rows on mobile (Manage on one line, status+Delete on the next) so it never depends on a tight fit.
- **Why:** this is the seller's own management surface — a self-serve product should never make its own primary actions feel cramped.
