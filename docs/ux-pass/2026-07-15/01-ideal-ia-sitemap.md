STATUS: complete

# 01 — Ideal IA + Sitemap
Synthesis of 6 persona journeys + 5 lens audits. 2026-07-15.

## The spine: intent, not school

The old UX study said "school-as-spine" and Dylan killed per-school sections (`/s/[code]`, archived
2026-07-11). That kill was right, and this synthesis does **not** re-litigate it. But it left the product
with no spine at all — which is why the homepage currently opens with a buyer headline, a seller banner,
and a search box, three answers to three different questions, stacked.

**The spine is two doors: "I have stuff" / "I want stuff."** School is a *filter*, not a place.

This resolves the one thing every agent tripped over. Rob (QR, cold, wants his school instantly) and Sue
(wants a "for Bergen Catholic" link to hand 400 families) both need school scoping — but neither needs a
*second website*. They need `/?school=<id>`, which already works (`BrowseExperience.tsx:23,64`) and is
never fed. Scoping is a URL state on one page. That is compatible with the archive decision; a themed
per-school hero is not.

---

## The ranked moves (this is the run's output)

Ranked by: convergence across agents × visibility of the fix × the fact that real users are arriving now.

| # | Move | Convergence |
|---|---|---|
| 1 | **Two-door hero; H1 echoes the flyer/OG card verbatim** | 3 agents (first-touch #3, group-text D1, pile-mom D1) |
| 2 | **The account becomes a form field, not a post-submit gate** | 3 agents — and it is *both* seller personas' quit point |
| 3 | **Three empty states with three different CTAs (today there are 2 doing the job of 3, and the best one is unreachable)** | 4 agents (gaps #2, group-text D3, bargain-dad #4, first-touch #1) |
| 4 | **Post-success = the live listing + Share + Post another** (not the edit form) | diy-seller |
| 5 | **One operator-identity line in the footer + on `/sell-for-me`** | 2 agents — Sue's quit point (connector, gaps #1) |
| 6 | **QR/share links carry `?school=`; hero has a scoped state; back link keeps it** | bargain-dad, connector |
| 7 | **Price/photo/contact required before `available`** | conversion #1,2,4,6 |
| 8 | **Seller loop: pickup→listing link, contact taps, staged tracker** | returning (whole report) |
| 9 | **Delete the duplicates: `+ Sell`, school `<select>`, School row** | 2 agents (clutter #1-3, mobile #2) |
| 10 | **Mobile: footer clearance under BottomNav, sticky contact CTA** | mobile #1,3 |

---

## The central tension: Maria wants zero work, Jen wants full control

They are not opposites. **They quit at the same element** — `InlineAccountStep`
(`components/InlineAccountStep.tsx:76-79`), the modal that fires on submit at `app/new/page.tsx:201-209`
and `app/sell-for-me/page.tsx:159`. That convergence is the most useful finding in the run, because it
means one change serves both.

- **Maria** (`pile-mom`) quits because she's asked to *author a password* for a site she'll never reopen,
  at the exact instant "You do nothing" promised she was done.
- **Jen** (`diy-seller`) quits because a **wall appears after she pressed Post**. The account isn't the
  problem; the ambush is. FB's Post button posts.

Their fixes look contradictory (Maria: ask me less; Jen: give me control) but both are downstream of the
same design error: **deferred signup was implemented as a modal instead of a field.** The locked model says
accounts are required to post. It never said the account had to be a *gate*.

**Resolution — the account is the last field of the form the user is already filling, not a door after it:**
- Email + password render inline at the bottom of `/new` and `/sell-for-me`, above the submit button, for
  logged-out users. Nothing pops up. The submit button keeps its promise.
- Password is **pre-filled with a generated value** and a "Set my own" toggle. Maria types one field (email)
  and taps submit — done, no authored credential. Jen taps "Set my own" and controls it, because she's a
  repeat seller who *will* come back.
- Same component, same locked rule, opposite personas, one screen.

**Why this is the right call:** a gate is a thing you pass to reach the task. A field is part of the task.
Every persona in this run tolerated fields and quit at gates — the deferred-signup mechanism was already
built to remove the gate at the *start* of the form; it just recreated it at the *end*.

Corollary (conversion #3): a returning seller who forgot their password hits this field with **no recovery
path anywhere in `app/`**. The original deferral reason ("password reset needs email") is now stale — Resend
is verified and delivering (`context.md`, 2026-07-11). Ship reset.

---

## Sitemap

```
/                          Browse — the two doors + your school's grid       [public]
├── /listing/[id]          One item · reach the seller                       [public]
│   └── /manage            Edit / take down (owner or token)                 [owner]
├── /seller/[id]           Everything one person is selling                  [public]
├── /sell-for-me           Auto Sell — the moat                              [public → account on submit]
├── /new                   List it yourself                                  [public → account on submit]
├── /my-listings           Your stuff: listings + pickups + money            [account]
├── /flyer                 The share kit                                     [public, noindex]
├── /contact               Reach a human · report a listing                  [public]
├── /signin  (+ /reset-password — NEW)                                       [public]
└── /admin                 Operator                                          [password]
```

Nesting rule: **public depth ≤ 2, private surfaces hang off `/my-listings`.** A buyer never needs an
account; a seller never needs to remember a URL.

---

## Kill / merge

### KILL `/pickup/[id]` → merge into `/my-listings?new=pickup`
- **Current behavior (why it's wrong):** `app/pickup/[id]/page.tsx` and the pickup block on
  `/my-listings` (`app/my-listings/page.tsx:283-359`) render the *same fields* from two data paths
  (token vs. session), neither links to the other, and `STATUS_LABEL` is duplicated verbatim in both files
  (`pickup/[id]/page.tsx:9-17`, `my-listings/page.tsx:10-18`). `/pickup/[id]:94` still says *"Bookmark this
  page to check status or cancel"* — copy from the pre-account era (`context.md:125-129`) that the account
  model made obsolete on 2026-07-11.
- **Correct behavior:** delete the route. Submit routes to `/my-listings?new=pickup` with a confirmation
  banner — **exactly the pattern the draft flow already uses** (`/my-listings?saved=draft`).
- **WHY:** two screens showing the same status with no link between them means the user can't tell which is
  current. Accounts are required for pickups now, so the token surface protects nothing — it just splits the
  truth in two. Confirmation is a *state* of the page that owns her stuff, and landing there teaches Maria
  where to look next time instead of asking her to bookmark a URL the product already tracks.

### KILL `scopedUrl()` → `/s/[code]`
- **Current behavior (why it's wrong):** `lib/schoolTheme.ts:102-108` builds `uniformpass.shop/s/{code}`.
  That route was deleted on 2026-07-11. `buyMessage`/`sellMessage` (`lib/shareMessages.ts:6-20`) call it the
  moment anyone passes a real `theme` to `SharePanel` — every call site passes `theme={null}`
  (`app/flyer/page.tsx:31`, `app/listing/[id]/page.tsx:76`), so it's dead today.
- **Correct behavior:** repoint `scopedUrl` at `/?school={dbId}` — the live filtered-browse URL the hero's
  own picker already writes (`BrowseExperience.tsx:93`).
- **WHY:** found independently by two agents (connector, group-text D4). It's a loaded gun: the day anyone
  wires up the school-scoped share link Sue needs, it silently 404s 400 Bergen Catholic families. Repointing
  it *also* ships the feature — the scoped link is the thing Sue came for.

### DEMOTE `/listing/[id]/manage` — stop using it as the success screen
- **Current behavior (why it's wrong):** `app/new/page.tsx:194` routes a successful post to
  `/listing/${id}/manage?token=…&new=1` — an **edit form** — whose only success messaging is a static banner
  (`manage/page.tsx:213-219`) with no next action. Jen has three items to post and the app hands her a
  settings screen.
- **Correct behavior:** success routes to `/listing/[id]?new=1` — the live listing, as buyers see it — with a
  success bar carrying **Share it** + **Post another**. `/manage` stays reachable from `/my-listings` and from
  the listing page's own Manage pill (`listing/[id]/page.tsx:80-85`) for the edit/lost-token case.
- **WHY:** the moment after posting is the single highest-motivation instant a seller ever has, and the
  product spends it on an edit form. Showing her the live card proves the post worked (no banner needed),
  Share puts the actual value prop in her hand at peak motivation, and Post another keeps a three-item batch
  in a loop instead of making her re-find `+ Sell` twice.

### NO `/about` page — put the sentence where Sue quits
- **Current behavior (why it's wrong):** the footer (`app/layout.tsx:61-71`) is the only persistent trust
  surface and it ends on *"© 2026 UniformPass. All rights reserved."* Sue's quit point is **that exact line**
  — she scans for a human, finds a copyright notice, and leaves. Meanwhile Auto Sell asks strangers to leave
  belongings outside their house for an unnamed "we" (`sell-for-me/page.tsx:11-15`), while the *lower*-risk
  public meetup gets a dedicated safety module (`listing/[id]/page.tsx:190-196`). Trust is built backwards.
- **Correct behavior:** one line in the footer ("Run by [Name], a Bergen County parent — [contact]") and one
  on `/sell-for-me` beside the pickup steps ("[Name] does the pickups herself"). No page.
- **WHY:** "About the founder/team" is PARKED as hard (`context.md:19`) — and it *is* hard, because a page
  needs a bio, a photo, a story. **A sentence isn't a page.** Sue didn't quit for lack of an About page; she
  quit at the footer, because that's where she looked. Answer her where she asked. Trust must scale with the
  size of the ask, and "someone comes to your house" is the biggest ask in the product.

### CUT, not kill (clutter lens, both confirmed by mobile lens)
| Element | Why |
|---|---|
| `+ Sell` header pill on mobile (`layout.tsx:50-55`) | Its two siblings are `hidden sm:inline-flex`; it isn't. Duplicates `BottomNav.tsx:9` in fixed chrome at both ends of a 390px screen. Reads as a bug, not emphasis. **Add `hidden sm:inline-flex`.** |
| School `<select>` in the filter bar (`BrowseExperience.tsx:117-120`) | Second widget writing the same `schoolId` state as the hero finder. A filter dimension gets exactly one input. Replace with a dismissible chip by the `Fresh from {school}` heading. |
| `School` row in the listing facts table (`listing/[id]/page.tsx:169`) | Verbatim echo of the eyebrow at `:126`, inches above. One padded row primes users to skim the rows that matter (Payment, Posted). |
| "or need help taking down a listing?" (`contact/page.tsx:49`) | Dylan already cut this from the footer on 2026-07-14 because sellers self-serve. It survived as `/contact`'s **headline**, advertising the slow path for a job the product solves in two taps. |

---

## Where the simplicity pivot cut too far

Dylan's bias runs toward cutting text — correctly, most of the time. These four are context a newcomer
genuinely needs and can no longer find anywhere:

1. **Who "we" are** — above. The riskiest ask in the product is made by nobody.
2. **"What if it doesn't sell?"** (gaps #7) — `/sell-for-me` never answers it. Do items come back? Get
   donated? When? One collapsed `<details>` row, reusing the pattern already on that page at `:248-261`.
   Progressive disclosure means the answer is behind a tap, not deleted.
3. **"We'll reach out"** with no window (`sell-for-me/page.tsx:306`) — Maria's whole premise is offloading
   mental overhead; an unbounded promise hands it back. Commit to "We'll text you within 2 days."
4. **The payout line is hidden entirely when Donate is selected** (`sell-for-me/page.tsx:300-304`) — a
   donating seller still deserves to know the 50% math she's donating. Show the number, change the verb.

And one over-*correction* to reverse: **"Support the startup!"** (`sell-for-me/page.tsx:286`). Sue reads
"startup" as "someone's business is soliciting my community's donated goods" at the exact moment she's
deciding whether to spend her credibility. It's the one word on the site that converts a neighbor into a
vendor.
