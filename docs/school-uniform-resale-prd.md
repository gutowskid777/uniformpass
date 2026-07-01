# School Uniform Resale Platform — Build Brief
# Created: 2026-06-08
# Status: ready

---

## Problem
Private school uniforms are expensive and abundant — families accumulate stacks of barely-worn pieces as kids grow. When people try to offload them on Facebook Marketplace, listings get snatched instantly, meaning buyers and sellers are both underserved. There's no dedicated, school-specific place to browse, filter, and contact sellers. The result: tons of uniform waste and unnecessary spending on new uniforms every year.

## Success Criteria
- A parent can post a uniform listing with photos in under 3 minutes
- A parent can browse listings filtered by school, type, size, and condition and find what they're looking for
- Mom can manage all listings from an admin panel (mark sold, delete)
- App is live on Vercel with a shareable URL

## Scope
**In:**
- Listing creation: school, category (uniform/sport/spirit/alumni), gender, type, size, condition, price, location (city only), contact method (email/Venmo/Zelle), photos (up to 4)
- Browse/search: filter by school, category, gender, size, condition; grid layout with photos
- Listing detail page: full info + contact button
- Admin panel (password-protected): view all listings, mark as sold, delete
- Hardcoded school list: NJ private/parochial schools to start (expandable)

**Out:**
- In-app messaging or payment processing
- Shipping calculation
- Seller accounts / authentication (MVP: email-based contact)
- Concierge/pickup service
- Books, sports gear, non-uniform items
- Charity donation lots
- Middle school focus (add later)

## Constraints & Dependencies
- Stack: Next.js 14, Supabase (Postgres + Storage), Vercel
- Dylan has $300 Supabase credits + Vercel free tier
- Supabase MCP connected — use it for schema setup
- No seller auth in MVP: sellers include contact info in listing, buyers reach out directly

## Build Plan
| Block | What gets built | Done when |
|---|---|---|
| 1 | Project init + Supabase schema | Next.js app running, DB tables + storage bucket created via MCP |
| 2 | Listing creation form + photo upload | Can create a listing with up to 4 photos, stored in Supabase |
| 3 | Browse page + filtering | Grid of listings, filterable by school / category / gender / size / condition |
| 4 | Listing detail page | Full listing view with all fields + contact info |
| 5 | Admin panel | /admin (password-protected) — view all listings, mark sold, delete |
| 6 | Polish + Vercel deploy | Mobile-responsive, deployed to Vercel with live URL |

## Long-Term Todos
- Add middle school support (smaller uniform sets, different sizing)
- Concierge listing service: mom picks up, lists, takes cut or donates proceeds
- Book and school merch section
- Sports gear / extracurricular items (dance shoes, cleats, fencing gear)
- Expand school list beyond NJ
- Seller accounts + listing management (edit, relist)
- "Lots" feature: bundle multiple items in one listing
- Email notification when a listing matching saved criteria is posted
- SEO: school-specific landing pages for organic search

## Open Questions
- What password should mom use for the admin panel? (Dylan to provide — hardcoded for MVP)
- Preferred domain name? (e.g. uniformpass.com, schoolthrift.com — suggest Dylan registers one)
- Should sold listings stay visible (greyed out) or get hidden?
