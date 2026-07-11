## Operator — Mom/admin triaging on her phone
**Goal:** Answer "what needs me right now" in under 10 seconds, then process it in as few taps as possible — new pickup requests first (revenue), then stale pipeline items, then listing moderation, then messages.

**Mental state / constraints:** Non-technical, busy, on her phone in short bursts (between errands, at work, at home) — not sitting down to "work a queue." Fat-finger risk: needs large tap targets, minimal typing, no jargon. Anxiety about breaking something or losing a listing — needs confirmations on anything destructive and near-zero friction on anything routine. She's the human face of quality (the Verified badge is her word), so she needs to feel confident, not rushed, when approving.

**Ideal entry point:** A push notification that deep-links straight into the specific item that needs her (not a generic "open the app" ping). Secondary entry: a home-screen icon (installed PWA) that opens directly to the Triage Dashboard — she stays signed in on her trusted device, with at most a short PIN (not a full password) if the session ever times out.

**Ideal click-path (numbered, ≤7 steps) for the daily triage:**
1. Notification: "New pickup request — Sarah M., 3 items. Tap to schedule." → opens straight to that request's detail.
2. She skims item photos/summary + contact info, taps **Schedule Pickup**, picks a slot from presets (Today / Tomorrow / This Weekend / Custom).
3. App auto-messages the seller with the confirmed time; the card moves itself to "Scheduled." She backs out — done, no extra save step.
4. Later, the home-screen badge shows "2 need you" → tap opens the Triage Dashboard.
5. Dashboard shows the "Needs You" feed with new listings up top; she taps one, glances at photos, taps **Approve** or **Reject** — no drill-down required for a clean listing.
6. On an item she personally inspected, she flips one switch: **Mark Verified** — badge appears instantly, optimistic UI, no spinner wait.
7. If a message badge is showing, tap it, read, and reply with a canned response ("Thanks! We'll be in touch.") or a quick custom line.

**The ONE primary CTA per key screen:**
- Triage Dashboard → **"Handle Next"** (jumps straight to the top-priority item across every queue)
- Pickup request, stage "New" → **"Schedule Pickup"**
- Pickup request, stage "Scheduled" → **"Mark Picked Up"**
- Pickup request, stage "Picked Up" → **"Mark Listed"** (auto-generates the draft listing from the request's photos/info)
- Listing review → **"Approve"** (Reject sits as a smaller secondary action, never equal visual weight)
- Message thread → **"Reply"**

**Priority queue design (what surfaces first; how new pickup requests are made unmissable):** One unified "Needs You" feed, strictly ordered: (1) brand-new pickup requests, always first — unscheduled requests risk the seller bailing to a competitor, and this is the revenue engine; (2) pipeline items stalled at a stage (scheduled-for-today, or picked-up-but-not-yet-listed for 48h+) — these are money sitting idle; (3) new listings pending moderation; (4) unread messages. Every pickup card carries a live "age" chip ("New — 4h ago") that flips yellow at 24h and red at 48h so nothing quietly rots. One combined count badge on the home-screen icon and browser tab sums the whole "Needs You" feed, so she knows there's work without opening the app.

**Alerting / notification pattern (how she learns of a new request without refreshing):** Immediate push (PWA web push, with SMS as a fallback channel if push proves unreliable on her phone) fires the instant a new pickup request comes in — no batching, ever, because that's direct revenue. Messages flagged urgent, or unread past 4 hours, also push immediately. Everything lower-stakes (new listings, routine messages) rolls into two digest pushes a day, e.g. 9am and 5pm — "3 things need you: 1 pickup, 2 listings" — so she isn't pinged all day over low-urgency items. Nothing lives only inside the app: if it doesn't reach her lock screen, it effectively doesn't exist to her.

**Components this journey demands (triage dashboard, pickup pipeline board, one-tap status, verify toggle, moderation):**
- **Triage Dashboard** — the unified "Needs You" feed described above, sorted by priority with age indicators.
- **Pickup pipeline** — rendered as a single-column list grouped by stage with collapsible sections, NOT a drag-and-drop kanban board (fussy and error-prone on a phone). Stage changes happen only through the one primary CTA button on the card.
- **One-tap status bumper** — a single button per pickup card that advances it to the next stage; "Decline" is always available as a secondary, visually distinct destructive action requiring one confirm tap.
- **Verify toggle** — a switch on any item/listing detail screen, visually distinct (checkmark badge), updates instantly with optimistic UI.
- **Moderation view** — Approve/Reject for new listings, Delete for live ones, backed by a reason-code picker (not a free-text box) so rejections stay fast and consistent.
- **Canned-reply picker** — 3–5 preset responses plus a custom-text option for messages.

**Friction to eliminate:** No drag-and-drop anywhere. No screens that force scrolling past unrelated items to find the thing a notification pointed at — always deep-link straight to it. No multi-field forms — pickup scheduling is a tap-to-pick date/time, not typed text. No login friction on her trusted device — stay signed in, short PIN not full password on timeout. No irreversible one-tap actions on deletes/declines/rejects (single confirm required), but no artificial confirms on approvals/schedules/status-advances either — those should be instant, since adding friction there just slows down her paid work. No internal jargon anywhere in the UI ("Verified," "Scheduled," "Picked Up" — never "stage_2" or "pending_moderation").

**Top 3 non-negotiables:**
1. New pickup requests are never buried and always trigger an immediate push — a missed request is lost revenue and a seller who won't come back.
2. Every action she needs is one tap away from the notification that told her about it — no menu-hunting on a small screen.
3. Friction is proportional to risk: destructive/ambiguous actions (delete, reject, decline) get one explicit confirm; routine forward-progress actions (approve, schedule, mark picked up, verify) are instant and confirm-free.
