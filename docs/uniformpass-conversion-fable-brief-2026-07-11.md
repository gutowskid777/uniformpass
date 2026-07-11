# UniformPass — Conversion + Distribution Fable Brief
# STATUS: ACTIVE BRIEF — Created 2026-07-11. Build target for a Fable-orchestrator session (Cowork, 2x usage window).
# RUN AS: Fable = orchestrator/thinker; Opus (or cheaper) subagents execute. NEVER spawn a Fable subagent.
# NOTE: not yet registered in context.md — a parallel chat is mid-edit on UniformPass. Register at the next context.md resync.
# Vision is LOCKED below — do NOT re-open product strategy. Build ON the existing app, do not rebuild.

## The one goal
Turn Dylan's WARM CONNECTIONS into UniformPass money THIS week. Dylan supplies the traffic — he
texts ~15 parents and drops links in 2–3 school parent groups. Your job is to make every one of those
clicks CONVERT. You are building the conversion + distribution MACHINE. You are not filling the store
(inventory + buyers = Dylan's human job, not yours).

## Locked constraints (do not re-open)
- No shipping, no in-app payments. Buyers contact sellers directly, meet up, pay cash/Venmo.
- Moat = concierge consignment: `/sell-for-me` → operator picks up a pile → lists + sells → owner keeps 50%.
- Beachhead = 3 NJ Catholic schools: St. Joseph Regional (Montvale), Don Bosco Prep (Ramsey), Bergen
  Catholic (Oradell). 44 schools seeded in DB.
- Accounts are OPTIONAL and posting stays OPEN. The "must sign in to post" gate + RLS are deliberately
  OFF (the sender domain can't email everyone yet). Do NOT flip enforcement. Do NOT gate posting.
- Domain uniformpass.shop is propagating; app is live at uniformpass.vercel.app. Do NOT touch deploy/DNS/env.
- Stack: Next.js 14 App Router + Tailwind + TS + Supabase. Brand = UniformPass, NJ-focused.

## The 4 levers (build these, in priority order)
1. **LINK → ARRIVAL** (highest leverage). A parent taps a shared link and within ~3 seconds believes:
   *real, local, MY school, safe, easy* — then is pulled into ONE action (browse my school's uniforms,
   or request a pickup). Optimize the landing/hero + school context for warm-share traffic arriving cold.
   DONE = a first-time visitor from a link instantly knows what this is, that it serves their school, and
   the single next thing to do.
2. **THE SHAREABLE ASSET** (distribution engine). Build the actual thing Dylan drops into a WhatsApp/FB
   parent group: a share card / link-preview / one-tap "share to my school" that is irresistible and
   screams the SCHOOL NAME + the offer (buy cheap / sell your pile for cash). Make the OG / link-preview
   image per-school if feasible. DONE = Dylan has a copy-paste message + visual he'd be proud to post in a
   real parent group, and the link preview looks legit.
3. **`/sell-for-me` DEAD-SIMPLE** (supply pipe / the moat). The consignment intake must feel effortless —
   a busy parent gives you a pile and you do everything. Cut every avoidable field/step; make the value
   ("you keep 50%, you do nothing") loud. DONE = a parent completes a pickup request one-handed in under
   30 seconds and understands the 50% deal.
4. **TRUST POLISH** (conversion floor). A no-account marketplace must LOOK legit fast: Verified-by-
   UniformPass badges visible, real-feeling inventory, a clear "how it works / is this safe" for cold
   visitors, no empty/placeholder states that scream dead. DONE = a skeptical parent from a cold link
   believes this is a real operation.

## Design bar — bake into EVERY subagent brief (non-negotiable)
- BIG text / numbers / visuals over walls of small copy. Concise, human copy. No AI slop, no persona/slang.
- Diverge BOLDLY — token-level restraint reads as "nothing changed." Make visible, layout-level moves; ship a bonus delight.
- Readability floor: min sizes, no overlapping text, nothing hidden in corners, no duplicate brand/logo. QA before shipping.
- Punctuation: use "..." or a period, never em-dashes, in user-facing copy.
- Mobile-first: parents open shared links on phones. Every lever must be excellent at 390px.

## Out of scope / defer
- Enforcement gate + RLS (off on purpose) · domain/DNS/Resend/deploy (Claude Code ship lane) · service-role
  key rotation + admin password (Dylan) · general-school / college expansion (later).

## Report back
Per lever: what you built (files touched), the before→after of the conversion moment, the share message +
asset Dylan can post, and any open decision that needs Dylan's taste. FLAG anything you changed that also
touches the parallel build (accounts / seller profiles / contact form) so we can reconcile without clobbering.
