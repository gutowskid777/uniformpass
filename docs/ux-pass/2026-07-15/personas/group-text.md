STATUS: complete

# Persona: Dana — got the flyer forwarded in a group text

## 1. Who she is, and what success means

Dana, 46, Park Ridge. No problem to solve — a friend forwarded the UniformPass link into a 30-person
school group text and Dana taps it out of idle curiosity, half-watching TV. In her words: *"I get what
this is without having to think about it, it looks like an actual thing real parents at real schools
are using — not somebody's side project — and if it lands, I might send it to my sister's group too."*
She is not a buyer or a seller today. She is a distribution node. If the app doesn't earn a forward, it
gets nothing from her — no signup, no listing, no purchase is on the table.

## 2. The ideal journey

**Step 0 — The unfurled card in the thread (before any tap).**
One job: land the whole idea with zero taps, because most of the 30 people in that thread never click
anything. Needs, in order: what it is (turn your kid's old uniform into cash / find one for cheap),
who it's for (ideally *her* school by name, not a generic "families"), and one because-it's-real line
(no fees, no shipping, meet up — sounds like Facebook Marketplace's trust model, not a stranger's app).

**Step 1 — She taps. Landing screen.**
One job: prove continuity. The first thing she sees after the tap must be the *same promise* she was
just shown — same headline, same two-choice frame ("got stuff to get rid of" / "want to buy something")
— not a different headline or a cold search box. Zero doubt that she landed in the right place.

**Step 2 — Proof, above the fold, no scroll.**
One job: prove real humans are doing this near her, right now. A mom's bar for "is this legit enough to
re-share" is social proof, not features — a live count or a couple of real recent listing photos from a
nearby school does more work here than any copy.

**Step 3 — She peeks, no wall.**
One job: let her confirm with her own eyes by tapping into one or two real listings, with nothing
gating that (no login, no email ask) — she's vetting, not shopping.

**Step 4 — The reforward.**
One job: put one obvious "Share" tap wherever she currently is, pre-loaded with the same card + a
ready-to-paste line, so the loop that just brought her in can run the other direction with one tap.
This has to live on the page she's actually standing on, not three scrolls away.

**Step 5 — She leaves.**
No signup, no email ask — asking for anything beyond a possible reshare overshoots her actual interest
today. The win is impression + maybe-forward, not conversion.

## 3. Where the current build diverges

**D1 — The tap breaks continuity: the landing headline doesn't match the card she just saw.**
`app/api/og/route.tsx:82-84` (the generic OG card, the one that unfurls for the plain
`uniformpass.shop` link — the only link `/flyer`'s share flow ever produces, see D5) reads **"Turn
uniforms into cash."** with two doors, Auto Sell and Buy and sell. But that link resolves to `/`, whose
first-fold headline is a completely different framing: `components/BrowseExperience.tsx:193-195`,
**"Stop buying uniforms new."** — buying-focused, not selling-focused — followed immediately by a big
school-search box, not the two-door choice the card just sold her on. Correct behavior: the first fold
after the tap should echo the exact promise of the card, same "turn uniforms into cash" framing, same
two-choice structure, before dropping into search/browse mode. Why: continuity is the entire trust
mechanism for a cold tap from a stranger's forward — a headline swap in the first instant reads as
"wait, is this the same thing," and she has zero invested interest to spend resolving that doubt.

**D2 — No visible way to reforward on the page she actually lands on.**
The only reforward affordance anywhere outside `/flyer` and a single listing's detail page is a small
gray footer text link: `app/layout.tsx:63-66`, *"Spread the word: share the flyer."* Dana lands on `/`
(the domain root — see D1), and `BrowseExperience`'s hero (`components/BrowseExperience.tsx:190-234`)
and Auto Sell band (`:238-260`) have no Share button anywhere in the primary viewport; reaching the
footer link means scrolling past the hero, the Auto Sell band, and a full grid of other people's used
clothes. Correct behavior: the same Share button already built for `/flyer` (`SharePanel`,
`app/flyer/page.tsx:31`) belongs in the hero itself, next to the search box. Why: the impulse to
reforward peaks in the first "oh, that's clever" second, before she's scrolled past strangers' listings
and lost the thread — a footer link assumes she read the whole page first, and a curious-not-shopping
visitor won't.

**D3 — Her single most natural action (search her own school) can dead-end into a page that reads as abandoned.**
The biggest, most prominent interactive element on the landing page is the school-search input,
`components/BrowseExperience.tsx:200-210` — placeholder *"Find your school... try 'SJR' or 'Bosco'."*
Only 3 of the 44 schools in the DB (SJR, Don Bosco, Bergen Catholic) have real seeded inventory; every
other school — including Our Lady of Mercy Academy, Park Ridge, added the day before this audit
(`context.md`, 2026-07-14 session) — resolves to `EmptyState`
(`components/BrowseExperience.tsx:264-335`): **"Nothing here yet."** plus an email-capture form as the
PRIMARY action, with **"Or be the first to sell →"** as a small underlined secondary link below it. If
Dana's own kid's school is one of the 41 unseeded ones (plausible — she's in Park Ridge, home to the
school that was *just* added with zero inventory), her one instinctive check comes back looking dead.
Correct behavior: a zero-result school search should lead with the Auto Sell pitch — it works today,
for her specifically, with zero dependency on anyone else already using the app — as the primary CTA,
not a secondary link beneath an email ask. Why: her bar for "legit enough to forward" is "does this feel
alive," not "does this have listings for me specifically" — an empty grid plus a request for her email
is the opposite signal at the exact moment she's deciding whether to re-share.

**D4 (latent, not on Dana's path today) — school-scoped share links point at a deleted route.**
`lib/schoolTheme.ts:106-108`, `scopedUrl()`, builds `https://uniformpass.shop/s/{code}` — but
`/app/s/[code]` was deleted in the 2026-07-11 "simplicity pivot" (`context.md`: *"Removed by Dylan's
call: per-school sections (/s/[code]...) → archived"*). `buyMessage`/`sellMessage`
(`lib/shareMessages.ts:6-20`) are wired to call `scopedUrl` the moment anyone passes a real `theme`
into `SharePanel`; today's only call site (`/flyer`) always passes `theme={null}`, so it's dead code,
not a live bug for Dana. Flagging it because "share a school-specific version of this flyer" is the
obvious next iteration of exactly this persona, and it will silently 404 the day someone wires it up.
Fix: point `scopedUrl` at `/?school={dbId}` (the live filtered-browse URL the Hero's own picker already
writes) or delete it with the rest of the archived section.

**D5 (secondary risk, worth flagging) — the flyer's own primary action produces a link-less image.**
`app/flyer/page.tsx:23-29`, the first and most visually prominent button on `/flyer` is **"Save
image,"** which downloads the flat 1080×1350 PNG (`/api/flyer-image`) with no embedded hyperlink — just
a QR code and small text reading "uniformpass.shop." Forwarding a *saved photo* into a group text (the
single most natural way a non-technical parent "forwards a flyer") is a real alternate path to Dana's
first screen, and it produces something worse than the OG card: a static image in a chat bubble with no
tap target at all. She'd have to hand-type the URL or scan a QR code off her own phone screen inside
the Messages app, which most people won't do. This audit follows the task brief's framing (the OG/link
card is her canonical first screen), but it's worth naming: whichever of the two forwarding paths mom
actually used determines whether Dana gets a tappable promise or a dead-end photo.

## 4. The single moment she quits

**Screen:** the browse homepage (`/`), after she types her own kid's school into the Hero search box
(`components/BrowseExperience.tsx:200-225`) and it resolves to `EmptyState`
(`components/BrowseExperience.tsx:264-335`) — "Nothing here yet." with nothing on screen but a request
for her email.

**Exact reason:** she came in with zero intent, used the one big, obvious input to answer the only
question she actually has — *"is this real for me?"* — and the app answered with an empty grid and an
ask for her personal contact info. That reads as a dead side project, not something 30 people in her
group text are plausibly already using. She will not forward a ghost town to a 30-person group — the
social cost of "the thing I sent everyone was empty" outweighs whatever goodwill sharing it might have
earned. She closes the tab, and the reforward that could have carried this to a second group text
quietly never happens.
