# Archived: per-school sections (2026-07-11)
# STATUS: PARKED — removed from the live UI at Dylan's call ("simplicity is key"
# while the marketplace is starting out). Bring back when school volume earns it.

## What this was
School-scoped experiences: `/s/sjr` `/s/dbp` `/s/bc` landed on a hero dressed in
that school's real colors (monogram patch, live count, school-filtered grid,
themed cold-start capture), plus per-school OG link-preview cards and homepage
monogram tiles. Built on the uniformpass-fable branch per the 2026-07-12 design
brief (Lever 1 + 2A).

## Files in this folder (copies at removal time)
- `BrowseExperience.tsx` — full version with ScopedHero, themed ColdStart, tiles
- `s-code-page.tsx` — the /s/[code] route (per-school metadata + OG wiring)
- `schoolTheme.ts` — SCHOOL_THEME map with Dylan-confirmed hexes (SJR #00563F/#C5A253, DBP #6D1A36/#FFF, BC #C8102E/#FFB81C)
- `og-route.tsx` — /api/og with the per-school card branch
- `MonogramPatch.tsx` — the varsity patch component

## Still live in the app (kept because harmless/used elsewhere)
- `lib/schoolTheme.ts` + `MonogramPatch` (listing OG cards still use them)
- `/api/og?school=<code>` still renders school cards if ever linked again

## To restore
1. `git log --oneline` on branch uniformpass-fable around commits f7af07c..7a36db3
   has the full working history, or copy these files back over their originals.
2. Re-add the `/s/[code]` route from `s-code-page.tsx`.
3. Re-wire homepage tiles + scoped metadata in `app/page.tsx` (see git history).
