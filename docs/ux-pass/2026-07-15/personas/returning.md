STATUS: complete

# Persona: Kate — returning seller, checking on her stuff

## 1. Who she is

Kate, 43, Montvale. Posted 4 listings and requested an Auto Sell pickup 9 days ago, then got busy and forgot about it. She has one draft she never finished. She's back for five minutes on her phone. In her words: **"Just tell me — did anything sell, did anyone reach out, when's my pickup, and do I have money coming."**

Success = she gets all four answers without texting or calling the operator.

## 2. The ideal journey

Designed from scratch, constrained only by: no shipping, no in-app payments, buyers contact sellers directly, Auto Sell pays sellers 50% via cash/Venmo outside the app.

**Step 1 — She's pulled back, not left to remember.**
Job: get her back to the site at the moment something actually happened, instead of relying on her to think of it 9 days later.
A short email/text fires the moment her Auto Sell status changes (pickup scheduled with a date, or an item sells) or a listing sells. She doesn't have to go looking — the product tells her.

**Step 2 — One screen answers all four questions in under 5 seconds.**
Job: total status, zero clicks.
She lands on `/my-listings` signed in (session persists) and sees, above everything else, a one-line summary: *"1 item sold · $18 earned so far · pickup scheduled for Thu · 1 draft unfinished."* Everything below is detail, not discovery.

**Step 3 — Her 4 listings, with real signal, not just a status word.**
Job: know which items are getting attention.
Each listing card shows live/sold, and — critically — *"3 people have tapped to contact you"* next to it, so "did anyone contact me" has an actual answer instead of silence.

**Step 4 — Her Auto Sell pickup, shown as a pipeline with an end in sight.**
Job: know how far along it is, not just its current word.
A horizontal tracker — Requested → Scheduled (with date) → Picked up → Listed → Sold — with her current stage lit up. Once items are listed, each one is a tappable thumbnail linking straight to the live listing page, so she can watch it the way a buyer would.

**Step 5 — Money is a ledger, not a policy sentence.**
Job: answer "where's my money" with a number and a date.
*"$18 earned, paid via Venmo Jul 12"* or *"$24 owed, paid within a few days."* Per pickup, per sale — not a repeated explanation of the 50% split.

**Step 6 — The unfinished draft is a task, not inventory.**
Job: she can't miss it, and resuming costs one tap.
A standalone banner above the listings list — *"You have an unfinished listing: [item] — finish it"* — links straight back into the exact form state she left, not buried at equal weight next to her 3 live listings.

**Step 7 — She leaves.**
Nothing left to chase. No reason to text the operator.

## 3. Where the current build diverges

**No link from a pickup request to the listing(s) it produced.**
`lib/supabase.ts:50-65` — `PickupRequest` has no `listing_id` field, and no such column exists anywhere in the codebase (confirmed by grep across `app/` and `lib/`). Once the operator marks a pickup `listed` or `done` in admin (`app/admin/page.tsx:10`, `PICKUP_STATUSES`), there is no data connection to the actual listing rows created for it. Current behavior: the pickup card on `/my-listings` (`app/my-listings/page.tsx:296-339`) and `/pickup/[id]` (`app/pickup/[id]/page.tsx:108-111`) just render the status word "Listed for sale" or "Sold. Done." Correct behavior: the card should show a thumbnail + link to each resulting listing. Why: "did anything sell" is Kate's #1 question — a label tells her a fact occurred, a link lets her *see* it, which is what "checking on her stuff" actually means.

**No money ledger — "your cut" is a static policy line, not a fact about her sale.**
`app/pickup/[id]/page.tsx:110` renders `{req.payout_choice === 'donate' ? 'Donating your share 💚' : 'Paid to you (50%)'}` — this is the same sentence whether the pickup is brand new or sold three weeks ago. There is no `sale_price`, `amount_paid`, or `paid_at` field anywhere in the schema (confirmed by grep: zero hits for payout/sale_price/amount_paid/proceeds across `lib/` and `app/`). Correct behavior: once a pickup reaches `done`, show an actual dollar amount and a paid/unpaid state with a date. Why: "where is my money" is literally why she came back, and the product can currently only restate a policy she already knows from `/sell-for-me` — it never answers the question with data.

**Zero notification loop back to the seller.**
`app/api/pickups/notify/route.ts` only fires an email to the *operator* (`PICKUP_TO`, defaulting to `gutowskidylan@gmail.com`) when a pickup request is first submitted. Grep across `app/api` for email/notify code shows no outbound message to the seller on any subsequent status change (scheduled, picked up, listed, done) and no email when one of her regular listings gets marked sold. Correct behavior: at minimum, email/text Kate when her pickup is scheduled (with the date) and when it's marked done (with the amount). Why: a "returning to check" persona only exists *because* the product is silent — it should push the update to her instead of making her remember to pull it 9 days later.

**No visibility into buyer interest at all — the question is structurally unanswerable, not just hidden.**
`app/listing/[id]/page.tsx:198-201` renders the contact block as a bare `<a href="tel:…">` / `mailto:` / venmo.com link with no event logged anywhere (confirmed: no view/contact-count field in `Listing` type, `lib/supabase.ts:15-39`). Correct behavior: log a lightweight "contact reveal" tap (just a count, no message content — this doesn't touch payments or shipping, so it's inside the locked model) and surface "N people tapped to contact you" per listing on `/my-listings`. Why: "did anyone contact me" is one of Kate's two named questions, and today there is no code path that could ever answer it — it's not a UI omission, it's a missing capability.

**Auto Sell status is a single-word pill, not a progress tracker.**
`STATUS_LABEL` in both `app/my-listings/page.tsx:10-18` and `app/pickup/[id]/page.tsx:9-17` (duplicated verbatim in two files) renders one badge — e.g. "Pickup scheduled" — with no indication of how many stages exist or remain. Correct behavior: a horizontal 5-stage tracker (Requested → Scheduled → Picked up → Listed → Sold) with the current stage highlighted. Why: someone checking in after 9 days wants to know *how much is left*, not just the current word — "scheduled" alone doesn't tell her if she's near the finish or just past the start.

**The unfinished draft is ranked as equal-weight inventory, not flagged as an open task.**
`app/my-listings/page.tsx:240-244, 264-270` — the draft renders inline in the same "Your listings" list as her 3 completed listings, distinguished only by an amber "Draft" badge and a green "Post it" button at the same visual size as every other row. Correct behavior: a dedicated banner above the fold — "You have an unfinished listing — finish it" — separate from the settled list. Why: a task she needs to *act on* is currently styled identically to items she's done with; she has to notice it by reading every row instead of being told about it.

**Two duplicated, unlinked surfaces for the same pickup instead of one.**
`/pickup/[id]` (`app/pickup/[id]/page.tsx`) and the pickup section of `/my-listings` (`app/my-listings/page.tsx:283-359`) render the *same* fields (status, items, school, town, notes, submitted date) from two different data paths — one token-based, one session-based — and neither links to the other. For a signed-in return visit, `/pickup/[id]` is only reachable if she still has the original URL with `?token=`; nothing on `/my-listings` links out to it. Correct behavior: pick one canonical surface for a logged-in seller (`/my-listings`) and either drop `/pickup/[id]` for authenticated users or make it redirect there. Why: two screens that show the same information with no connection between them means she can't be sure which one is current, and a persona whose whole point is "checking status" shouldn't have to guess which page is the real one.

## 4. The single moment she quits

She opens `/my-listings`, scrolls to "Your pickup requests," and reads the `dl` block (`app/my-listings/page.tsx:332-338`): Items, School, Town, Estimate, Submitted date. That's it — the list stops there. No sale price, no paid/unpaid state, no link to what was listed, no ETA if it's still stuck at "Received." The page technically loaded and technically shows her *something*, but it answers none of the four things she came to check. She closes the tab and texts the operator directly — the exact behavior the self-serve page exists to eliminate. The quit isn't a broken screen; it's a complete one that simply has nothing to tell her.
