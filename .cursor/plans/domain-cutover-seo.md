# SEO cutover

Make this rebuild the only public site at `anticobagliosiciliano.it`. Owner access is [owner-access.md](./owner-access.md) — they grant panels; you do every technical step. Occupancy API is not this file. Code flips: `src/lib/site-config.ts`.

## Decided

| | |
|--|--|
| One public host | Do not rank github.io and `.it` at the same time. |
| Live rebuild now | `https://rednaw.github.io/anticobagliosiciliano/` — `SITE_HOSTNAME` `rednaw.github.io`, `SITE_BASE` `/anticobagliosiciliano`, `SITE_PUBLIC` `false` (every page `noindex, nofollow`). |
| Canonicals now | Still github.io (must match the host that serves the HTML). WordPress `.it` is still the indexed public site. |
| GSC github.io | URL-prefix verified. Sitemap file is live at `/sitemap.xml`. **Do not** submit it under GSC Sitemaps on github.io. |
| robots.txt | `Allow: /`, `Disallow` only `/archivio/`. Indexing is the meta tag, not Disallow. |
| Analytics | Simple Analytics already uses `anticobagliosiciliano.it` — leave `SIMPLE_ANALYTICS_HOSTNAME` alone. |
| Canonical after cutover | Apex `https://anticobagliosiciliano.it/`. `www` 301s to apex (HTTPS, same path, trailing slash). |
| Redirects | Host-wide 301 only: `.com`, wordpress.com, www, github.io project URL → apex. No per-path table. Old WordPress paths on `.it` become **404** — do not catch-all onto `/`. |
| Registrar | Register.it. You type DNS as Technical Administrator. Do **not** transfer `.it` to TransIP. Leave MX untouched. |
| GSC `.it` | You add the domain property; you publish TXT; you verify. Owners do not use Search Console. |
| `/archivio/` | Not in the public slug list; stays unlinked and `noindex`. |
| Citations | Do not add github.io to Google Business, Instagram, email, or print before `.it` is this site. |

## Decide

None.

## Do

### 0. Freeze public slugs

can start now — confirm this list is final. Paths must not change after cutover.

Italian (`hreflang` x-default): `/` `/imperdibili/` `/come-arrivare/` `/contatti/` `/privacy/` `/case/casa-1/` `/case/casa-2/` `/case/casa-3/` `/case/casa-4/`

English: `/en/` plus the same suffixes.

### 1. Fill citations

can start now — current values now; point them at `https://anticobagliosiciliano.it/` in the cutover week. Google Maps is a live inbound even if wordpress.com also 301s.

| Place | Current URL | New URL |
|---|---|---|
| Google Business / Maps (`https://maps.app.goo.gl/NA1BwasQVcFzn1qHA`) | `http://anticobagliosiciliano.wordpress.com/` | `https://anticobagliosiciliano.it/` |
| Instagram (`https://www.instagram.com/anticobagliosiciliano/`, Elena Delitala) | `https://www.airbnb.it/users/26312991/listings` | `https://anticobagliosiciliano.it/` |
| Facebook (`https://www.facebook.com/AnticoBaglioSiciliano/`) | `http://anticobagliosiciliano.wordpress.com/` | `https://anticobagliosiciliano.it/` |
| Lodgify website (`https://anticobagliosiciliano.com/`) | `https://anticobagliosiciliano.com/` | `https://anticobagliosiciliano.it/` |
| Booking.com listing | none — GDT forbids website/social links | — |
| Airbnb (host Elena Delitala, four houses) | none — off-platform links prohibited | — |
| Printed cards / email footer | | |

### 2. Cutover night (one release)

after slugs frozen and you have Register.it from [owner-access.md](./owner-access.md) — do not flip canonicals to `.it` while github.io is still the document Google fetches.

DNS same night: apex **A**/**AAAA** → GitHub Pages IPs; `www` **301** → apex; leave **MX**. Same zone later without a new owner conversation: Pages challenge TXT, extra proofs, subdomains, DNS-01, auth-code only if they later transfer.

1. Pages → Custom domain = `anticobagliosiciliano.it` (apex).
2. `src/lib/site-config.ts`: `SITE_HOSTNAME` → `anticobagliosiciliano.it`; `SITE_BASE` → `''`; `SITE_PUBLIC` → `true`.
3. Deploy. Spot-check: canonical, hreflang, OG are `https://anticobagliosiciliano.it/come-arrivare/` (no `/anticobagliosiciliano/` prefix).
4. Your GSC `.it` domain property → Sitemaps → submit `sitemap.xml` (only after `SITE_PUBLIC` is true).
5. Host-wide 301s: Lodgify `.com` and wordpress.com → `https://anticobagliosiciliano.it/`.
6. iac cms-oauth `ALLOWED_DOMAINS` add `anticobagliosiciliano.it`. Open **iac**. Secret stays on the VPS.

Do not: soft-launch on `.it` while WordPress still answers those paths; `Disallow` the whole site in `robots.txt`; submit the github.io sitemap; index `/archivio/`; per-path 301s; catch-all old `.it` WordPress paths onto `/`.

### 3. Same week after swap

after cutover — update every citation row. GSC `.it`: watch 404s; do not rewrite titles or slugs for the first weeks. GSC github.io: stay `noindex` / empty out. Change of address only if you also had a URL-prefix property for old WordPress, and only when `.it` is already this site.
