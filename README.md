# The GlenLary Estate

Website for The GlenLary Estate, a wedding and event venue on a historic horse
farm in Paris, Kentucky. Next.js 16, Tailwind 4, framer-motion, Lenis.

- **Live:** https://glenlary.vercel.app (Vercel project `glenlary`)
- **Deploys:** every push to `main` builds and goes live automatically.
- **Pages:** `/` `/estate` `/weddings` `/gallery` `/love-notes` `/tour`

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # judge styling on the production build
```

## Where things live

| What | Where |
| --- | --- |
| Email, social links, nav, testimonials, gallery photos | `lib/site.ts` |
| Page copy | `app/<page>/page.tsx` |
| Home opening drive (gates → drive → manor) | `components/Arrival.tsx` |
| Estate map (gallery page) | `components/EstateMap.tsx`, drawings in `components/estate-map-icons.tsx` |
| Colors, type, eyebrow and scrim styles | `app/globals.css` (the header comment documents the color system) |
| Photos | `public/images/` (2400px max, JPEG q82) |

To add a gallery photo, drop it in `public/images/` and add one line to the
gallery list in `lib/site.ts` with its category and orientation (`w`/`h`).

## Before pointing eventsatglenlary.com here

`eventsatglenlary.com` still serves the old WordPress site from GoDaddy. To
switch it over:

1. In Vercel → project `glenlary` → Settings → Domains, add
   `eventsatglenlary.com` and `www.eventsatglenlary.com`.
2. At GoDaddy DNS, set the records Vercel shows (A record for the apex, CNAME
   for `www`).
3. Nothing in the code changes. The sitemap, robots file, structured data and
   social preview images build their URLs from Vercel's production domain
   (`siteUrl` in `lib/site.ts`), so they follow the domain automatically on
   the next deploy.

## Known limits

- **Tour form:** "Request your tour" opens the visitor's email app with a
  pre-filled message to elizabeth@eventsatglenlary.com. It does not store or
  send anything on its own. If a server-sent form is wanted later, wire it to
  an email service (only the API key belongs in Vercel env vars).
- **Photo rules:** photos of Elizabeth's own earlier wedding must never appear
  on the site. Every current image has been checked.

## Verification scripts

`scripts/*.js` drive headless Chrome against the production server on port
3571 (`next start -p 3571`) and write screenshots to `shots*/` (git-ignored).
`scripts/map-check.js` also sweeps every page on desktop and phone for console
errors, broken images and horizontal overflow.
