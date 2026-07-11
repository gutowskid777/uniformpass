# UniformPass — UX / Information-Architecture Design Study
*Generated 2026-07-10. Design study only — no code was changed.*

## What this is
A ground-up redesign of UniformPass's **layout, structure, navigation, and click-paths**, derived by simulating every meaningful kind of person, goal, and situation and reconciling their *ideal* journeys into one recommended site structure — then diffing that ideal against the site as it exists today.

## Method
1. **Ground truth** — read `context.md`, the PRD, and all 9 live pages (`app/`) + data model (`lib/supabase.ts`).
2. **Persona × situation fan-out** — 13 parallel agents, each designing one persona's ideal, lowest-friction journey *from scratch* (ignoring the current build), constrained only by the fixed business model (no accounts, no in-app payments, off-platform meetup, consignment moat). Reports in `personas/`.
3. **Synthesis** (load-bearing) — one agent reconciled all 13 into a single IA, page inventory, per-page specs, shared components, and consolidated click-paths.
4. **Gap analysis** (load-bearing) — one agent diffed the ideal against the current code line-by-line and produced a prioritized change list.

## The five structural moves (the headline)
1. **School is the spine, not a filter.** Every school gets a real, deep-linkable hub at `/s/[slug]`; the homepage becomes a lightweight router whose one job is a fuzzy **school type-ahead** — replacing the buried 44-item `<select>` that can't scale or survive the cold-mobile-FB audience.
2. **Elevate the moat.** "Sell it for me" becomes a first-class nav slot, homepage fork, and empty-state CTA — *including on mobile*, where it and Browse are currently hidden.
3. **Make trust ambient.** Safe-meetup, Verified, and how-it-works render as inline modules placed exactly where fear spikes (above Contact) — never as blocking gates. This is how buyer-speed and buyer-trust coexist.
4. **Convert every dead end into a captured lead.** School-not-listed, listed-but-empty cold-start, and filtered-to-zero are three distinct states, each turned into a notify/waitlist signal that doubles as the expansion queue.
5. **Keep no-accounts, close its one fatal gap.** Mandatory contact-capture-as-recovery-key + a self-serve `/recover` magic-link flow, so lost manage-links stop routing to the operator.

## File guide
| File | Contents |
|---|---|
| `01-ideal-ia-sitemap.md` | Navigation model, full route inventory (18 routes: keep/add/change/remove), primary-flows map, ASCII sitemap, resolved conflicts |
| `02-per-page-specs.md` | Per-page "one job + above-the-fold priority + single primary CTA + mobile notes" for all 18 pages |
| `03-shared-components.md` | 14 reusable components; **school type-ahead worked end-to-end** as the reference example |
| `04-persona-clickpaths.md` | One clean ideal click-path per persona/situation (24 total) |
| `05-gap-and-change-list.md` | Prioritized CRITICAL / HIGH / NICE change list vs. today, each tied to a persona pain + implementation note + effort; Top-5-first sequence; explicit "do NOT build yet" list |
| `personas/*.md` | The 13 raw persona×situation ideal-journey reports |

## Top 5 to build first (from `05`)
1. **Unhide Browse + "Sell it for me" on mobile** (S) — a class removal in `layout.tsx`; the moat is currently invisible on the exact device the cold FB audience uses. Highest leverage-to-effort in the whole study.
2. **School type-ahead + per-school `/s/[slug]` hubs** (L) — the IA spine; ship as one unit (type-ahead needs `slug`/`aliases` columns, hubs are its destination).
3. **Empty-state → notify/waitlist capture** (M) — at launch nearly every school is empty, so the bounce screen IS the default screen; turn it into demand + expansion queue (new `school_requests` table).
4. **Per-listing OpenGraph share cards** (M) — the literal first screen for cold Facebook traffic.
5. **`/sell-for-me` trust module + worked payout math** (S–M) — front-end copy; biggest non-structural conversion lever on the moat.

*Dependency:* mandatory contact-capture at post (CRITICAL) must precede the `/recover` magic-link flow (HIGH).
