# UniformPass — Deploy Guide

## Run locally
```bash
cd school-uniform-resale
npm install
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel (free tier)
1. Push this folder to a GitHub repo (or drag-drop to Vercel)
2. In Vercel → New Project → import repo
3. Add these Environment Variables in Vercel project settings:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://cfqornklplyvdgiuptgj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_ADMIN_PASSWORD=uniform2026
   ```
4. Deploy — done.

## Admin panel
- URL: `https://your-domain.vercel.app/admin`
- Password: `uniform2026` (change in Vercel env vars before sharing)

## Change admin password
In Vercel → Project → Settings → Environment Variables → update `NEXT_PUBLIC_ADMIN_PASSWORD` → redeploy.

## Supabase project
- Dashboard: https://supabase.com/dashboard/project/cfqornklplyvdgiuptgj
- 24 NJ schools pre-seeded
- Storage bucket: `uniform-photos` (public)
