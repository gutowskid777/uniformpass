# UniformPass

A school-specific marketplace for buying and selling used school uniforms. Built for NJ private school parents who are tired of digging through Facebook Marketplace — list a uniform tied to a specific school, browse by school, size, and condition, and reach the seller directly.

> Used uniforms sell out instantly and generate a ton of waste, with no good way to search by school. UniformPass fixes that.

## How it works

- **No accounts, no friction.** Sellers post a listing with their own contact info; buyers reach out directly (text, email, Venmo, etc.). The MVP intentionally has no auth and no in-app payments.
- **School-first browsing.** Every listing is tied to a school, so parents see only what's relevant to them.
- **Lightweight admin.** A password-protected panel lets the operator view all listings, mark items sold, and remove posts.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database & storage | Supabase (Postgres + Storage) |
| Hosting | Vercel |

## Project structure

```
app/
├── page.tsx              # Browse — filterable grid of listings
├── new/page.tsx          # Create listing form (school, category, gender, size, condition, price, photos)
├── listing/[id]/page.tsx # Listing detail + contact button
├── admin/page.tsx        # Password-protected admin panel (view all / mark sold / delete)
├── layout.tsx            # Root layout, sticky header, footer
└── globals.css           # Tailwind base styles
lib/
└── supabase.ts           # Supabase client, shared types, and option constants
```

### Data model

Three tables back the app — `schools`, `listings`, and `listing_photos` — plus a public Storage bucket (`uniform-photos`) for images. A listing carries its school, category (`uniform` / `sport` / `spirit` / `alumni`), gender, size, condition (`new` / `good` / `fair`), price, accepted payment methods, seller contact, and status (`available` / `pending` / `sold` / `draft`). See `lib/supabase.ts` for the full type definitions and the size / state / payment option lists.

## Getting started

```bash
npm install
npm run dev
# http://localhost:3000
```

Create a `.env.local` in the project root (it's gitignored — never commit it):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-password
```

## Deploying

1. Import this repo into Vercel (New Project → import).
2. Add the three environment variables above in the Vercel project settings.
3. Deploy.

The admin panel lives at `/admin` and is gated by `NEXT_PUBLIC_ADMIN_PASSWORD` — set a real password before sharing the link, and update it in Vercel any time (redeploy to apply).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run Next.js lint |

## Status

MVP — all core pages built and wired to a live Supabase backend. Out of scope for now: in-app payments, seller accounts, concierge pickup, and non-uniform gear.
