# My Listings rework summary

- `app/api/my/pickups/route.ts` — Added service-role pickup list, edit, and cancel actions scoped exclusively to the owner verified from the supplied Supabase JWT.
- `app/api/listings/manage/route.ts` — Added a verified JWT owner fallback for listing management while preserving the existing secret-token authorization path and update cleaning.
- `app/my-listings/page.tsx` — Rebuilt My Listings as an account dashboard with signed-out guidance, user-scoped listings, cross-device quick actions, pickup display/edit/cancel controls, and optional same-device manage tokens.
- `lib/supabase.ts` — Updated `PickupRequest` with `user_id`, `cancel_token`, and the `cancelled` status.
- Verification — Confirmed the admin pickup view already renders `item_summary` and `notes`; `npx tsc --noEmit && npm run build` passes.
