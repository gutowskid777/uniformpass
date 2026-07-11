## Buyer — Mobile, one-handed, in the pickup line
**Goal:** Find one specific thing (e.g. "SJR boys blazer, size 14") in under 30 seconds and either save it or message the seller — without breaking attention from the carpool line.

**Mental state / constraints:** One thumb, one hand (other hand on wheel/holding something), glancing between the road and the phone, screen glare washing out contrast, spotty signal near the school building, session gets abandoned and resumed 3-4 times before a decision is made. Zero tolerance for typing. Zero tolerance for horizontal scrolling or multi-step forms. Any screen requiring two hands or sustained focus (>5 seconds of reading) gets abandoned.

**Ideal entry point:** A bookmarked/home-screen-installed PWA icon that opens DIRECTLY to "your school" (remembered from last visit via localStorage — no login, no picker) with the last-used filters (size, kid's category) still applied. If first-ever visit, entry is a single big school-picker (logo grid, tap once) — not a text search.

**Ideal click-path (numbered, ≤7 steps):**
1. Open app icon → lands on home feed, already scoped to saved school + saved size/category filters (0 taps if returning user).
2. Glance at photo-grid feed, thumb-scroll (native gesture, not a tap).
3. Tap a filter chip (e.g. "Size 14") if not already set — one tap, chip toggles, feed re-sorts instantly, filter sheet auto-collapses.
4. Tap a listing card → opens as a slide-up sheet (not full page nav) showing large photo, price, condition, size, seller name, Verified badge.
5. Tap "Save" (heart icon) to bookmark for later, OR
6. Tap "Message Seller" → pre-filled template opens in their default SMS/WhatsApp/Venmo-note app ("Hi, is the [item] still available? Saw it on UniformPass.") — one tap to send, no in-app typing required.
7. Swipe sheet down to return to feed, done — total elapsed time target: under 20 seconds for steps 2-6.

**The ONE primary CTA per key screen:**
- Home feed: **tap a card** (browsing IS the CTA — no competing button).
- Listing detail sheet: **Message Seller** (contact is the money action; Save is a secondary/tertiary icon-only action, not competing for primary visual weight).
- Empty/no-results state: **Notify me when this size is listed** (converts a dead end into a retained lead instead of a bounce).

**Mobile layout priorities (above-fold, sticky, thumb-reach, tap targets):**
- **Sticky top bar** (never scrolls away): school name/logo (tap to switch schools) + a single filter-summary chip row (e.g. "Boys · Size 14 · ✕"). Height capped at ~56px so it doesn't eat feed real estate.
- **Sticky bottom filter bar** (thumb zone — bottom third of screen is where one-handed thumbs naturally rest): Category, Size, Price toggle. Tapping opens a bottom sheet, not a new page — sheet slides up from same zone the thumb is already in.
- **No top-of-screen primary actions.** Anything above the natural thumb arc (top 40% of a large phone screen) should be glanceable only, never require a tap. Search/filter triggers live in the bottom sheet, not a top search bar.
- **Card grid, not list-with-detail:** 2-column photo-first grid so a single thumb-scroll surfaces 6-8 items per glance; price and size as bold overlay text on the photo itself (readable through glare without opening the card).
- **Tap targets minimum 44x44pt, filter chips/buttons minimum 48x48pt** — pickup-line thumbs are imprecise, often driving-glove-covered in winter.
- **High contrast, glare-resistant palette:** avoid low-contrast pastel-on-white; price and size overlays need a scrim/shadow behind text regardless of photo brightness.
- **Message Seller button is a persistent sticky footer inside the listing sheet** (not buried below a photo carousel) — reachable without scrolling the sheet at all.
- **Offline/weak-signal resilience:** feed and last-viewed listings cache locally so a signal drop near the school doesn't blank the screen; "Message Seller" degrades gracefully to a copy-able phone number/Venmo handle if the deep-link app isn't reachable.

**Trust / clarity reinforcement points:**
- Verified badge shown as a small icon directly on the photo card in the grid (not just on detail view) — buyer should never open a listing just to check legitimacy.
- Seller first name + general area ("pickup near SJR gym") visible on the card, building comfort before contact — no surprise reveal only after messaging.
- Condition stated in plain words on the card overlay ("Like new," "Good," "Worn") — not a hidden field requiring a tap to discover.
- "Lot" flag (bundle listings) shown as a distinct badge so buyers scanning fast don't mistake a 5-item lot price for a single-item price.
- Free items ($0) shown with a bright, distinct "FREE" tag, not just "$0" — reduces re-reading/confusion during a fast scan.

**Components this journey demands:**
- Persistent school-context header component (logo + switcher).
- Bottom-sheet filter component with instant-apply chips (no "Apply" button — filtering is live).
- Photo-first card component with overlay metadata (price/size/condition/badges baked into the image area).
- Slide-up listing detail sheet (not a full page transition) with sticky footer CTA.
- One-tap "compose message" deep-link handler (SMS/WhatsApp/Venmo intent) with pre-filled template text.
- LocalStorage-based "remembered school + filters" state (no accounts, so this is the only personalization mechanism available).
- Empty-state / "notify me" capture component tied to school+size+category (email or phone, no account creation).

**Friction to eliminate:**
- Any login/signup wall — this business model has none, and the UX must never imply one is coming.
- Full-page navigation for listing detail (kills scroll position, forces a "back" tap) — use sheets/overlays instead.
- Typed search as the default discovery path — filters/chips should cover 90% of intent; search is a fallback, not the entry point.
- Multi-step filter forms (school → then category → then size → then submit) — collapse to a single bottom sheet with all filters visible/tappable at once.
- In-app messaging/chat UI — this is off-platform by design; don't build a inbox nobody asked for. One tap out to the buyer's own messaging app is faster and requires zero UGC moderation.
- Image carousels that require horizontal swiping to see price/size — critical info must be an overlay on the FIRST photo, always.

**Top 3 non-negotiables:**
1. Returning buyer reaches a relevant, filtered feed with zero taps and zero typing — state persistence (school + filters) via localStorage is mandatory, not a nice-to-have.
2. Contact happens in exactly one tap from the listing sheet via a deep-link to the buyer's own SMS/WhatsApp — never an in-app form, never a second screen.
3. Every piece of decision-critical info (price, size, condition, Verified badge, lot flag) is visible on the card in the scroll feed itself — opening a listing should be optional, not required, to make a save/message decision.
