STATUS: complete

# UX Pass — UniformPass — 2026-07-15

## Method (3 lines)
Six personas walked the live product (`personas/`), five lenses audited it cold — first-touch, mobile 390px, clutter, conversion, gaps (`lenses/`).
Those converged into one ideal: IA (`01`), per-page specs (`02`), components (`03`), click-paths (`04`).
Then every claim was re-Read against live code today and tagged VALID/OBSOLETE → the ranked list in **`05-gap-and-change-list.md`**. **37 valid · 4 obsolete · 0 stale-shipped.**

## The number that reorders everything
**Live DB right now: 2 available listings. 1 of 45 schools has any stock. 4 pickup requests.**

So **44 of 45 schools render an empty grid** — the empty state isn't an edge case, it's the product for ~98% of school-scoped visits. And Auto Sell already has 4 real requests against browse's ~zero: **the moat works, the marketplace has no inventory yet.** Intake and distribution outrank browse polish. Every dead end must offer Auto Sell — the one thing that works on an empty marketplace.

Ranking = impact × reach ÷ effort, ×3 for **cold-mobile discovery** (QR/group-text on a 390px phone), ×3 for the **Auto Sell moat**. The top 5 all carry both.

## Headline moves

- **The spine is two doors, not a school.** Killing per-school hubs was right — but it left no spine, so `/` opens with a buyer headline, a seller banner, and a search box: three answers to three questions, stacked. "I have stuff" / "I want stuff." School is a *filter*, not a place — `/?school=` already works and is never fed.
- **The account is a field, not a gate.** Both seller personas quit at the same element: the modal that fires *after* they press submit. Maria won't author a password for a site she'll never reopen; Jen's Post button didn't post. The locked model requires an account — it never required a gate. One inline field with a pre-filled password + "Set my own" toggle serves both.
- **Trust is built backwards.** Auto Sell asks strangers to leave belongings outside their house for an unnamed "we"; the *lower*-risk public meetup gets a dedicated safety module. The product reassures people where they already feel safe and leaves them alone where they'd hesitate.
- **Three dead ends share two states, and the best CTA is unreachable.** `schoolId` counts as "a filter," so picking your school always sets `hasFilters` — which means "Or be the first to sell" *can never render once a school is selected*. And a school we don't have returns literal silence.
- **Where simplicity cut too far:** who "we" are · "what if it doesn't sell?" · "we'll reach out" with no window · the payout math hidden when donating. One over-correction to reverse: **"Support the startup!"** — the one word on the site that turns a neighbor into a vendor.

## TOP 5 BUILDABLE — ranked

1. **Split `EmptyState` into 3 states, Auto Sell as the cold-start CTA** — `components/BrowseExperience.tsx` (`:77` is the bug: `schoolId` counts as a filter, so "be the first to sell" is unreachable; `:211` makes an unknown school silent). 44/45 schools land here. **M**
2. **H1 → "Turn uniforms into cash." + two equal doors** — `components/BrowseExperience.tsx:193-195`. The flyer and OG card (`api/flyer-image:110`, `api/og:82`) both already say this; the homepage says "Stop buying uniforms new." The flyer is in circulation *right now*. **M**
3. **`AccountField` replaces the `InlineAccountStep` modal** — `components/InlineAccountStep.tsx` → new `components/AccountField.tsx`, wired into `app/new/page.tsx:207` + `app/sell-for-me/page.tsx:159`. Both sellers' quit point, sitting on the moat's intake path. **M**
4. **`TrustLine` — name the operator** — `app/layout.tsx:70` (the footer ends on "© All rights reserved," which is literally where Sue quits) + `app/sell-for-me/page.tsx:11-15`. This is the PARKED "About the founder" item — **a sentence isn't a page.** **S**
5. **Require price + photo + contact before `available`** — `app/new/page.tsx:135-144` (`Price ($) *` is a lie: never validated, `|| 0` → renders "Free" in bold) + the draft "Post it" at `app/my-listings/page.tsx:265`. **S**

**Also S-effort and worth doing in the same sitting:** repoint `scopedUrl()` (`lib/schoolTheme.ts:102-108`) — it still builds `/s/{code}`, **a route deleted on 2026-07-11**. It's dead only because every call site passes `theme={null}`. The day anyone wires up Sue's scoped share link it 404s 400 Bergen Catholic families — and repointing it at `/?school={dbId}` *is* the feature.

## Two things to check yourself
- **`RESEND_API_KEY` in Vercel prod is still unconfirmed** (`context.md:105`). If it's unset, `api/pickups/notify:14-15` returns `{emailed:false}`, `/sell-for-me` swallows it with `.catch(() => {})`, the seller sees "Got it! We'll be in touch" — and **you may never learn the request exists.** There are already 4 real pickups in the DB. I didn't read the prod env: a UX audit isn't a reason to dump production secrets config.
- **`capture="environment"` (`app/new/page.tsx:347`)** — 02 says drop it (on many Android browsers it skips the photo library). But you shipped it deliberately as "H10: camera-first" (`e509650`). It's a reversal, not a bug fix — your call.

## Two upstream items are wrong — don't build them
- **"Kill `MonogramPatch`"** (`03:199`) — it's load-bearing: `api/og/route.tsx:153`, `api/og/listing/route.tsx:81,91`. Deleting it breaks the OG cards.
- **"Extract the *masked* contact chooser"** (`03:117`) — you removed the mask on purpose (`fbc17d0`). Don't re-add it.

Full detail, tiers, and the other 30 items: **`05-gap-and-change-list.md`**.
