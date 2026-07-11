# UniformPass — Listing-Creation UX Study
Sellers, two situations. Design study only — ideal journey from scratch, not a critique of any existing build.

Fixed constraints assumed throughout: no accounts/login, no in-app payments, no shipping (meet off-platform, cash/Venmo), secret manage-link is the only "identity" a seller has, concierge consignment is the moat and must be a first-class path (not a hidden menu item), launch market is NJ prep-school parents.

---

## SELLER — ONE ITEM (fast, low-typing, wants the right buyers fast)

**Goal:** Get one outgrown blazer listed in front of the right school's families in under 2 minutes, with as little typing as physically possible, and sell it fast.

**Mental state / constraints:** Busy parent, doing this in a spare 90 seconds between other tasks (school pickup line, lunch break). Has done online marketplaces before (Poshmark, FB Marketplace, eBay) so knows the shape of "list an item" — will bail immediately if this flow is slower or more form-heavy than what they're used to. Not emotionally invested in the item; wants it gone and out of the closet. Will tolerate smart defaults without reading fine print, but will not tolerate typing a title, researching a price, or creating a login.

**Ideal entry point:** A direct "Sell" link, ideally pre-scoped to their school via a URL parameter distributed through the actual acquisition channel (school parent Facebook group post, PTA newsletter QR code, or a "List another item" button already inside the app if they've sold before). If the school is already known from the referral link, skip school selection entirely — this alone can cut one full step for this persona.

**Ideal click-path (numbered, ≤7 steps):**
1. Tap "Sell" (school pre-filled from referral link/geolocation/last-used-school cookie; if not pre-filled, one scrollable single-tap school picker appears first).
2. Camera opens immediately (not a file-upload dialog) — snap the blazer, auto-crop/straighten/brighten applied instantly; optionally snap up to 3 more; tap "Use these."
3. Confirm AI-suggested attributes shown as pre-selected chips from the photo (category: "Blazer," size: best-guess chip highlighted, brand if a tag/crest is visible): tap to accept, tap a different chip only if wrong. No free-text category or size typing required.
4. Confirm price: pre-filled with a comp-based suggested number ("Blazers like this at [School] usually go for $42"), adjustable only via a +/- $5 stepper, no numeric keypad required.
5. Enter phone number (single field, numeric keypad, auto-formats) — this single field doubles as both "notify me when someone's interested" and "where to text the manage link."
6. Review the auto-generated listing card (title auto-built from School + Category + Size + Brand — seller never types a title) and tap "Post it."
7. Success screen: listing is live, manage link auto-texted to the phone just entered and silently saved on-device, plus a one-tap "Share to [School] parents Facebook group" button.

**The ONE primary CTA per key screen:** Screen 1 → "Take Photo." Screen 3 → "Looks Right." Screen 4 → "Use This Price." Screen 5 → "Continue." Screen 6 → "Post It." Screen 7 → "Share to Facebook Group" (secondary: "Done"). Every screen has exactly one high-contrast action; anything else is a low-emphasis text link.

**Trust / clarity reinforcement points:** School name/crest shown persistently in the header so it reads as "[School]'s marketplace," not a generic listing site. Inline microcopy next to the phone field: "Never shown publicly — only used to text you updates." One line at the top of screen 1: "No account needed. Your link is your key — we'll text it to you." Post-submit confirmation restates that the listing can be edited or marked sold anytime with no login.

**Components this journey demands (esp. minimal-field form design, photo UX, manage-link delivery, consignment escape hatch):**
- Minimal-field form built entirely from chip-selectors and steppers, not open text inputs — the only typed field in the whole flow is the phone number.
- Photo-to-attribute AI autofill (vision-based category/size/brand suggestion) that seeds the chips in step 3, and an auto-generated title composer so nobody ever writes ad copy.
- Camera-first capture component with auto-crop/auto-brighten and drag-to-reorder for multi-photo, defaulting to 1 required photo.
- Comp-based price-suggestion engine (by school + category + condition) surfaced as a pre-filled number, not a blank price field.
- Manage-link delivery via automatic SMS-to-self plus silent on-device persistence (localStorage-backed "My Listings" state), so the seller never has to actively save anything.
- Consignment escape hatch present but low-key here (a small "List multiple items? Let us handle it" link in the footer) — this persona doesn't need it front-and-center, but it should never be more than one tap away for the day they have five items instead of one.

**Friction to eliminate:** Typing a title. Typing or guessing a price with no market reference. Any login/password/account creation. Multi-page forms with unrelated fields bundled together. Uploading via a generic file picker instead of camera-first capture. Any confirmation step that isn't a single tap.

**Top 3 non-negotiables:**
1. Zero typed fields except the phone number — everything else is tap-to-confirm.
2. Total flow completes in under 2 minutes on a phone with one hand, thumb-only.
3. Manage link is delivered automatically (SMS) and persisted on-device — the seller should never need to "remember" to save it.

---

## SELLER — NON-TECHNICAL PARENT ON A PHONE (overwhelmed, needs hand-holding, photos are the hard part)

**Goal:** Get an outgrown uniform item off their hands without feeling stupid, intimidated, or stuck — succeeding either by completing a very short, forgiving self-serve flow, or by handing the whole problem to UniformPass via consignment.

**Mental state / constraints:** Low confidence with apps/forms; anxious about "doing it wrong," uploading a bad photo, or being publicly judged for a messy picture. Easily stopped by any screen that looks like a form (multiple fields, required asterisks, small text). Will abandon rather than ask for help if a screen looks effortful. Needs permission to not be perfect, and needs the "give up" path to feel like a legitimate, respected option — not a failure state.

**Ideal entry point:** One big, plain-language button on the homepage: "Sell an item" (icon of a blazer, no jargon like "list," "post," or "create listing"). The very first screen after tapping it must immediately present the fork between doing it themselves and handing it off — this persona should never have to discover the escape hatch by struggling first.

**Ideal click-path (numbered, ≤7 steps):**
1. Tap "Sell an item" → immediately shown two big, equally-weighted buttons: "I'll do it myself (about 2 minutes)" and "Sell it for me (we do everything)." No school picker, no fields yet — just the fork.
2. If self-serve: single-purpose photo screen. A labeled example thumbnail ("like this") sits above a giant camera button; reassurance text under it: "Doesn't need to be perfect." A quiet secondary link below: "This part's tricky — let us do it instead," which routes straight into the concierge flow without losing anything already done.
3. Plain-language confirmation card built from the photo: "Looks like a Lawrenceville blazer, size 16 — is that right?" with two big buttons: "Yes, that's right" / "Let me fix it." The "fix it" path opens simple tap-chips, never a blank text field.
4. Price shown as one number with a reassuring line ("Most sellers at [School] accept this price — you don't have to figure this out"), with "Use this price" as the obvious action and "Change price" tucked away as a small link for anyone who wants control.
5. Phone number screen, numeric keypad, one line of reassurance: "So we can text you the second someone wants it. We never share this number." This is the only typed input in the entire flow.
6. Single tap: "Post my item" (no separate review screen — one fewer decision for this persona than the fast-seller path).
7. Success screen with warm, plain language ("Done! We'll text you when someone's interested") plus a one-tap "Add to Home Screen" prompt so the listing/manage link is reachable by icon tap forever after, removing any need to remember a link at all; a persistent, non-judgmental line underneath: "Change your mind? We can always take it from here — just reply to our text."

**The ONE primary CTA per key screen:** Screen 1 → the fork itself is the CTA (two equal buttons, not one primary + one buried). Screen 2 → "Take Photo." Screen 3 → "Yes, that's right." Screen 4 → "Use This Price." Screen 5 → "Continue." Screen 6 → "Post My Item." Screen 7 → "Add to Home Screen" (secondary: "I'm done").

**Trust / clarity reinforcement points:** Every screen uses plain language, no marketplace jargon ("post" not "publish," "item" not "SKU"). Explicit permission-giving copy ("Doesn't need to be perfect," "You don't have to figure this out") at every point of possible anxiety. The concierge escape hatch is framed as a normal, respected choice ("Sell it for me") rather than a fallback for people who failed. Phone-number reassurance repeated verbatim from the fast-seller flow for consistency. No screen shows more than one required action at a time — nothing is ever "optional but visible," optional things are simply absent from this persona's default path.

**Components this journey demands (esp. minimal-field form design, photo UX, manage-link delivery, consignment escape hatch):**
- The fork screen itself as a first-class, reusable component (self-serve vs. concierge), shown before any field is collected — not after a form is half-filled.
- One-field-per-screen wizard (not a scrolling single-page form) with a soft progress indicator, since a visible wall of fields is the single biggest abandonment risk for this persona.
- Forgiving photo UX: example image, explicit "doesn't need to be perfect" copy, camera auto-enhancement doing the quality work invisibly so the seller isn't asked to be a photographer.
- A genuinely short concierge intake form (3 fields max: phone, item description in one sentence, and a drop-off or pickup preference) so the escape hatch is actually faster than the self-serve flow, not a punishment for choosing it.
- Contextual, non-intrusive re-offers of the concierge path: present at screen 2 (the hardest step, photos) and again passively in the screen 7 footer — never modal, never guilt-laden.
- Manage-link delivery via auto-SMS plus an "Add to Home Screen" prompt, since this persona is unlikely to dig through texts or bookmarks later; the icon-on-homescreen pattern removes the "remember a link" burden entirely.

**Friction to eliminate:** Any screen with more than one visible required field. Any technical vocabulary (login, listing, SKU, publish). Silence or ambiguity about whether a photo is "good enough." A buried or hard-to-find handoff option. Any step that requires typing beyond the phone number. A review/summary screen that re-exposes every field for double-checking (adds anxiety, not confidence, for this persona).

**Top 3 non-negotiables:**
1. The "sell it for me" concierge option is visible on the very first screen, not discovered after a struggle — and it must be genuinely faster to complete than self-serve.
2. No field in the self-serve path requires typing except the phone number; every other input is a big tappable choice.
3. Constant, explicit reassurance copy at every step ("doesn't need to be perfect," "we never share this," "you don't have to figure this out") — silence reads as judgment to this persona.
