# UniformPass — Buyer Fast-Path UX Study
Design study, not a bug hunt. Ideal journeys designed from scratch within fixed constraints: no accounts, no in-app payments, no shipping, off-platform meetup, concierge consignment as the moat.

---

## Buyer — Knows School + Size
**Goal:** Find a matching item at their kid's school and get in touch with the seller in under a minute.
**Mental state / constraints:** Decisive, low patience, task-locked ("blazer, size 16, boys, St. Joe's"). Usually on a phone, often in a 2-minute dead-zone (carpool line, between meetings). Zero tolerance for setup steps before seeing real inventory.
**Ideal entry point:** A school-scoped URL (`uniformpass.com/st-joseph-regional`) reachable from a text/email link, QR code on a school flyer, or the homepage school type-ahead. If they land on the generic homepage, school selection is the single first action, not buried in a menu.
**Ideal click-path (numbered, ≤7 steps):**
1. Land on school-scoped page (school pre-filled if via deep link).
2. Set category + gender + size in one combined filter bar (defaults open; no forced sequence).
3. View results grid — sorted by relevance/best price match by default.
4. Tap a listing card that matches.
5. Review item detail: photos, condition, price, seller name, "Verified by UniformPass" badge if applicable.
6. Tap "Contact Seller" — opens native SMS/email/Venmo app prefilled with item reference.
7. Send message and arrange meetup off-platform.
**The ONE primary CTA per key screen:** Homepage → "Find your school." School/filter screen → "Show matches." Item detail → "Contact Seller."
**Trust / clarity reinforcement points:** "Verified by UniformPass" badge on operator-listed items; seller first name + general location shown before contact; condition stated in plain language (new/good/fair) next to photos, not just a tag; "posted X days ago" so buyer knows the listing is live; footer micro-copy on meetup safety norms (public place, daylight) shown once on the contact screen, not repeated everywhere.
**Components this journey demands:** School type-ahead with fuzzy match + "school not listed? request it" fallback; combined multi-select filter (category, gender, size, condition) that persists in the URL so links are shareable/bookmarkable; sort-by-relevance and sort-by-price; grid view with size/price visible on the card (no tap-in required to rule items out); one-tap contact buttons that deep-link to `sms:`/`mailto:`/Venmo with prefilled item context; back-button that preserves filter state.
**Friction to eliminate:** Any login/account/password step; ambiguous sizing (kids vs. adult cut must be explicit, not inferred); listings that are actually sold but not marked as such; photos that hide labels/tags/condition flaws; contact flows that require typing a message from scratch.
**Top 3 non-negotiables:**
1. Zero account creation — full browse-to-contact flow works anonymously.
2. School + size + gender filter reachable in ≤2 taps from entry, and shareable via URL.
3. Contact is one tap into the buyer's own native messaging app — never an in-platform inbox requiring signup.

---

## Buyer — Needs It By Monday (Urgent)
**Goal:** Find an in-stock, contactable, nearby item today and lock in a pickup before Monday.
**Mental state / constraints:** Stressed, deadline-driven — uniform day snuck up, kid outgrew something overnight, or an item got lost. Often browsing at night after realizing the problem. Needs certainty of *availability and reachability*, not just a plausible match; will message multiple sellers in parallel to hedge against no-replies.
**Ideal entry point:** Same school-scoped landing page as the decisive buyer, but arriving (or one tap away) at an "available now" view — recency-sorted results with a visible urgency toggle, not a separate app or flow.
**Ideal click-path (numbered, ≤7 steps):**
1. Land on school-scoped page.
2. Apply category + size + gender filter, and toggle "Available now" (sorts by newest + surfaces responsiveness signal).
3. Scan results grid — each card shows "listed X hours ago," a "responds fast" badge, and city/distance without opening the item.
4. Tap a listing with strong freshness + distance signals.
5. Review item detail — confirms last-active time, seller location, and price.
6. Tap "Message Seller" — opens native app with a prefilled urgent template ("Hi, is this still available? I need it by Monday — can we meet today or tomorrow?").
7. If no reply within the buyer's own window, back button preserves filters to message a second/third seller, or set a notify-me alert if nothing matches.
**The ONE primary CTA per key screen:** Filter screen → "Show available now." Results grid → tap card (implicit "View item"). Item detail → "Message Seller — Ask if available." No-match/empty state → "Notify me the moment a match is listed."
**Trust / clarity reinforcement points:** Explicit "listed X hours/days ago" timestamp on every card, not just the detail page; "responds fast" badge computed from seller's historical reply speed; city/distance shown at grid level so today-pickup feasibility is obvious before tapping in; stale listings (no seller activity in weeks) auto-suppressed or flagged so the buyer never wastes a message on a dead lead; "Verified by UniformPass" items ranked with a slight boost in urgent view since concierge-listed stock is confirmed real and in-hand.
**Components this journey demands:** Default sort-by-newest in urgent mode; seller "responds fast" / last-active signal; distance/city display on grid cards plus optional radius filter; no-account notify-me alert (buyer leaves an email/phone tied to the saved filter, gets pinged when a new match posts — no login); prefilled urgent-message template to cut typing to zero; filter-state persistence across back navigation so parallel outreach to multiple sellers doesn't cost re-filtering; stale-listing suppression logic.
**Friction to eliminate:** Dead or stale listings that waste the buyer's limited window; no way to judge seller responsiveness before messaging; missing/vague location forcing extra back-and-forth just to learn the item is 90 minutes away; needing an account to save a search or get notified; losing applied filters when returning from a dead-end listing; unclear "still available" status on consignment lots that may already be sold.
**Top 3 non-negotiables:**
1. Default recency sort + visible "responds fast"/last-active signal so no time is spent on unreachable sellers.
2. Distance/city visible at a glance on every card — today-feasibility must be assessable without opening items.
3. No-account, no-match notify-me alert (SMS/email tied to the saved filter) so a zero-result search still converts into a lead instead of a bounce.
