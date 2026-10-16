# The GlenLary Estate

Website for The GlenLary Estate, a wedding and event venue on a historic horse
farm in Paris, Kentucky. Next.js 16, Tailwind 4, framer-motion, Lenis.

- **Live:** https://eventsatglenlary.com (www and the old temporary hosts glenlary.smwolf.com / glenlary.vercel.app forward to it), Vercel project `glenlary`
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

## Domain

eventsatglenlary.com went live on Vercel on 2026-10-15. DNS stays at GoDaddy
(nameservers ns41/ns42.domaincontrol.com) with the A records and the `www`
CNAME that Vercel lists under project `glenlary` → Settings → Domains. The
apex is primary; `www` 308s to it. The SSL certificate was issued with
`vercel certs issue eventsatglenlary.com www.eventsatglenlary.com` and renews
itself. `siteUrl` in `lib/site.ts` is fixed to https://eventsatglenlary.com, and
`next.config.ts` forwards the temporary hosts plus every old WordPress URL.

## Known limits

- **Tour form:** posts to `/api/tour`, which emails the request through Brevo
  (Epic client email protocol) from noreply@epicdevsolutions.com to
  elizabeth@eventsatglenlary.com (default in `lib/lead-email.ts`; override with
  `LEAD_TO_EMAIL`). The ONLY env var is `BREVO_API_KEY`. Health check, no mail
  sent: `GET /api/tour?verify=1`. Email preview: `LEAD_PREVIEW=1 npm start` then
  `/api/tour/preview`. If a send fails the visitor gets a one-tap prefilled
  email to Elizabeth instead, so no request is lost.
  `BREVO_API_KEY` may be pasted as the plain `xkeysib-...` key or as the base64
  blob Brevo's "API keys & MCP" page shows; `brevoKey()` unwraps it. If
  `?verify=1` reports "unrecognised IP address", Brevo's Security → Authorized
  IPs blocking for API keys is on; deactivate it (Vercel's IPs change).
- **Photo rules:** photos of Elizabeth's own earlier wedding must never appear
  on the site. Every current image has been checked.

## Verification scripts

`scripts/*.js` drive headless Chrome against the production server on port
3571 (`next start -p 3571`) and write screenshots to `shots*/` (git-ignored).
`scripts/map-check.js` also sweeps every page on desktop and phone for console
errors, broken images and horizontal overflow.
