STATUS: complete

# Persona journey: Rob — bargain hunter on a phone, cold from a QR

## 1. Who he is

Rob, 39, Ramsey NJ. Son starts Don Bosco Prep in three weeks; the school-store blazer is $180. He scanned a QR code on a paper flyer taped in the DBP lobby. Standing up, on cell data, ~90 seconds of attention, never heard of UniformPass, doesn't trust it yet.

**Success, in his words:** "Tell me in the next 30 seconds whether a size-16 Don Bosco blazer exists here and for how much, and give me one tap to reach whoever's selling it."

---

## 2. The ideal journey

**Step 1 — The QR lands him already inside Don Bosco Prep, not the homepage.**
Job: prove in zero taps that this flyer was FOR his school, not a generic ad. The QR target encodes the school (`?school=<dbp-id>`), so the very first pixel he sees is a Don Bosco-colored (maroon/white) header confirming "Don Bosco Prep uniforms, Ramsey families" — not a neutral indigo hero that could belong to any school in NJ.

**Step 2 — One tap to "Blazer," not two dropdowns and a scroll.**
Job: get from "I'm on the school page" to "show me blazers" in one thumb motion. A row of big tappable item chips (Blazer / Pants / Skirt / Polo / Sweater / Gym) sits right under the school header — not a generic 4-option category `<select>` he has to open, read, and pick from.

**Step 3 — Size jumps out visually, no second filter needed.**
Job: scan 5-10 cards in under 10 seconds. Each card already shows size in large type; he doesn't need to also open a size dropdown before scanning — he's already narrowed to "Blazer," so eyeballing "16" among 4 cards is fast.

**Step 4a — Found it: one tap to a real human.**
Job: get a price and a way to reach a person, zero login. Tap the card → price, condition, one big "Text [Seller]" button that opens his native SMS app pre-addressed. Done. This already exists and works well (see below).

**Step 4b — Not found (the likely case this early): a plan for his 3-week deadline, not a mailbox.**
Job: convert "not today" into "I will have this before school starts." Not a generic email capture — a phone-number-based "text me the second a Don Bosco blazer, size 16, gets listed" with an honest expectation ("we check daily" / "usually within a week"), PLUS a visible fallback ("or text the person running this directly and we'll try to match you by hand" — cheap to build, this is early-launch and the operator can genuinely do this manually).

**Step 5 — Never lose his place.**
Job: every "back" or "not this one" action returns him to Don Bosco Prep, filtered, exactly where he left off — never back to a blank, unscoped homepage that makes him redo work he already did.

---

## 3. Where the current build diverges

**1. The flyer QR carries no school — it points at the bare homepage, throwing away the one signal the flyer's physical placement already knows for free.**
`app/api/flyer-image/route.tsx:40` — `QRCode.toString(SITE_URL, ...)`, and `SITE_URL` (`lib/schoolTheme.ts:23`) is just `https://uniformpass.shop`, no query param. Current behavior: a flyer taped inside the Don Bosco Prep lobby produces the exact same QR target as one taped at Bergen Catholic or St. Joe's — the generic "Stop buying uniforms new" hero (`components/BrowseExperience.tsx:190-233`), with zero school context. This is wrong because the app already has everything it needs to do better: `BrowseExperience` reads `searchParams.get('school')` and auto-filters (`components/BrowseExperience.tsx:23,64`) — the plumbing exists, it's just never fed. Correct behavior: generate (or let admin generate) a per-school flyer whose QR target is `SITE_URL + '?school=' + theme.dbId`, so scanning it lands Rob already filtered to Don Bosco. Why it matters: the whole value of a physical, location-anchored flyer is that the location *is* the personalization — a stranger who scans a piece of paper stapled to the DBP bulletin board has already told you his school with 100% certainty. Sending him to a neutral page and asking him to type "bosco" into a search box a second time is discarding a free, perfect trust signal and adding back exactly the step (find-my-school) the QR should have skipped.

**2. There's no one-tap way to filter to "Blazer" — item type is free text, and the only structured filter is a broad 4-bucket category dropdown.**
`app/new/page.tsx:34,118,138,268` — `item_type` is a free-text input (sellers type "Blazer," "Navy skirt," "Fleece," whatever), with no controlled vocabulary. `components/BrowseExperience.tsx:121-124` — the only structured filter is a `<select>` for `CATEGORY_LABELS` (`uniform / sport / spirit / alumni` — `lib/supabase.ts:118-123`), not a garment type. Current behavior: to check "does a size-16 blazer exist," Rob has to open the category dropdown, pick "Uniform" (which also includes skirts, pants, sweaters, polos), open the size dropdown, pick "16," then visually read every card's `item_type` text looking for the word "Blazer." Correct behavior: a row of tappable garment chips (sourced from the handful of real garment types a school uniform actually has) that filter instantly, no dropdown-open-scroll-select cycle. Why it matters: Rob has one specific item in mind, not a browsing mood — every extra decision (which dropdown, which value, then still having to read text to confirm) burns his 90-second budget on mechanics instead of the answer.

**3. "Back to listings" forgets which school he was looking at.**
`app/listing/[id]/page.tsx:70-72` — `<Link href="/" ...>← Back to listings</Link>` is a hardcoded root link with no query string. Current behavior: Rob filters to Don Bosco, opens a listing that turns out to be the wrong size, taps back, and lands on the plain unfiltered homepage — his school selection is gone and he must re-type "bosco" into the search box again. Correct behavior: the back link should carry the filter state forward (`href={`/?school=${schoolId}`}` or simply `router.back()`), so "not this one" returns him to where he was, not to square one. Why it matters: this is the exact "corner-✕-reads-as-dismiss" failure mode named in the brief — a nav control that silently discards context trains a cold, untrusting visitor that the app doesn't remember what he told it, which reads as broken, not just mildly annoying.

**4. The empty-state promises an automated notification it doesn't structurally have, and it's email-only for a guy standing up on his phone.**
`components/BrowseExperience.tsx:264-334`, specifically the "You're on the list." confirmation at line 296-298, backed by `app/api/contact/route.ts` — that route just inserts a row into `contact_messages` and best-effort emails the operator (`gutowskidylan@gmail.com`); there is no code path that fires when a matching listing is later posted. Current behavior: Rob types his email, sees "You're on the list," and reasonably assumes some system will alert him when a Don Bosco size-16 blazer shows up — but nothing actually watches for that; it only works if Dylan's mom later re-reads a contact-messages inbox, remembers what he asked for, and manually reaches out. Correct behavior: either build the actual match-and-notify trigger, or be honest in the copy ("We'll keep an eye out and text you" implies a person, not a system) and collect a phone number (SMS) instead of email, since that's the channel a standing, cold, low-trust visitor is fastest to type and most likely to actually check. Why it matters: for a persona with a hard 3-week deadline, the gap between "the app implies this is handled" and "it's actually a manual maybe" is the difference between him trusting the wait and him going straight to Facebook Marketplace as backup — which defeats the whole point of capturing him.

---

## 4. The single moment he quits

**Screen: the empty-state on the Don Bosco Prep filtered browse view** (`components/BrowseExperience.tsx:151-152` → `EmptyState`, rendered when `listings.length === 0`).

**Exact reason:** this is a brand-new marketplace whose only inventory today is two orphaned St. Joe's tennis listings (per `context.md`'s 2026-07-14 notes) — there is almost certainly nothing listed for Don Bosco Prep, let alone a size-16 blazer. Rob does the work (scans QR, finds/confirms his school, filters or scans for a blazer) and is met with "Nothing here yet" and an email box. He has no way to tell, in the moment, whether this product is alive or a dead shell someone taped to a bulletin board and forgot about — there's no visible proof of activity (a count, a recent listing anywhere, a person to text right now), and the one CTA offered (email capture, backed by a manual, un-automated inbox per finding #4) doesn't credibly solve "I need a blazer before school starts in three weeks." He closes the tab and either buys the $180 store blazer or tries Facebook Marketplace — the exact behavior UniformPass exists to intercept.
