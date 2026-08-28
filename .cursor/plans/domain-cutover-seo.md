---
name: Domain cutover SEO
status: pending
saved: 2026-08-28
overview: When this site becomes anticobagliosiciliano.it, keep one public host and one URL per page. 301 old WordPress, Lodgify, wordpress.com, and github.io shapes onto the new paths. Do not rank two sites at once.
todos:
  - id: noindex-github
    content: Keep github.io noindex (SITE_PUBLIC false) until the night .it serves this site
    status: pending
  - id: freeze-ia
    content: Freeze public slugs and write the redirect table before cutover
    status: pending
  - id: search-console
    content: Add a Search Console domain property for anticobagliosiciliano.it
    status: pending
  - id: citations
    content: List Google Business, Maps, social, and booking website URLs to update in the cutover week
    status: pending
  - id: cutover-canonicals
    content: Flip SITE_HOSTNAME to anticobagliosiciliano.it and SITE_BASE to '' so canonicals, hreflang, OG, and sitemap match the live host
    status: pending
  - id: redirects
    content: Turn on 301s from old URL shapes (exact page or 410). Keep them for years
    status: pending
---

# SEO when this site becomes anticobagliosiciliano.it

Not DNS or GitHub Pages setup. This is how search engines, maps listings, and old URLs should behave.

Treat the launch as **one public site, one URL per page**. Everything else 301s (or 410s) onto that. Canonicals, hreflang, and the sitemap must already emit the public `.it` URLs in the same release as the swap.

## What is moving

| Today | Role | Typical old paths |
|---|---|---|
| `anticobagliosiciliano.it` | Live WordPress (the domain to keep) | `/`, `/en/`, `/casa-1/`…`/casa-4/`, `/informazioni/imperdibili/` |
| `rednaw.github.io/anticobagliosiciliano/` | This rebuild | `/anticobagliosiciliano/…` |
| `anticobagliosiciliano.com` | Lodgify | `/it/591433/imperdibili`, old “Mastro …” house URLs |
| `anticobagliosiciliano.wordpress.com` | Oldest brochure (English-first) | `/room/casa-1/`, `/about/`, `/testimonials/` |

New paths do **not** match WordPress (`/casa-1/` vs `/case/casa-1/`). Italian is the default; English is `/en/…` with `hreflang` `x-default` on Italian. `/archivio/` stays unlinked and `noindex`.

If you are not careful, Google sees **two** URL changes at once: host and path. Plan them as one cutover, not two public launches.

## Principle

Google follows **301 + matching canonical + sitemap**. Dumping every old URL on the homepage looks like a soft 404 and throws the equity away. Map each old URL to the **same house or topic**, or to a real 410 if that page should die (Casa 5 / agrumeto, empty `/informazioni/`, blog posts you are not bringing back).

Keep those 301s for **years**, not weeks. Citations (Google Business, maps, Instagram, printed cards) should be updated in the same week as the swap, or they keep sending people and crawlers to ghosts.

## Before the domain is yours

Do not let two indexable sites compete. Right now the rebuild can be indexed on github.io (`SITE_PUBLIC` in `src/lib/site-config.ts`) while WordPress still owns `.it`. Pick one:

- **Preferred:** keep github.io **noindex** (`SITE_PUBLIC = false`) until the night you flip `.it`. Canonicals can already *say* `.it` only if that host already serves this site; otherwise they would point at a WordPress page. Until cutover, canonicals stay on github.io **and** the pages stay `noindex`.
- **If github.io is already indexed:** recoverable (the project URL can 301 onto the custom domain), but you then rely on a second hop from `/anticobagliosiciliano/come-arrivare/` to `/come-arrivare/`. Avoid adding more public links to github.io (Google Business, Instagram, email).

Meanwhile:

1. **Freeze the public IA.** No slug changes after the redirect map is written.
2. **Write the redirect table** (below) and decide www vs apex once; the other host 301s to it.
3. **Search Console:** a **domain** property for `anticobagliosiciliano.it` (covers www and the old WordPress URLs). Add the github.io URL-prefix property only so you can watch it empty out.
4. **Inventory inbound links** you control: Google Business website field, the Google Maps listing used on Come arrivare, Apple/OSM if they exist, Lodgify “website”, social bios, Booking.com/Airbnb if they list a site URL.
5. Simple Analytics is already named `anticobagliosiciliano.it` (`SIMPLE_ANALYTICS_HOSTNAME`). Leave it; the dashboard should not be renamed at cutover.

## Cutover (one window)

On `.it`, the new site is the only document Google should see. In the same release:

1. Set `SITE_HOSTNAME` to `anticobagliosiciliano.it` and `SITE_BASE` to `''` so **canonical, hreflang, Open Graph, and sitemap** all emit `https://anticobagliosiciliano.it/come-arrivare/` (and `/en/…`). That is the switch Google actually trusts; redirects without matching canonicals lag.
2. Submit the new sitemap in Search Console. Leave `/archivio/` out (already the case).
3. Turn **301s** on for every old shape you still control. One hop to the final URL, HTTPS, trailing slash to match this site.

### WordPress `.it` → new `.it`

| From | To |
|---|---|
| `/` | `/` |
| `/en/` | `/en/` only if that URL was really English. Today’s `/en/` is still Italian “Nuova Homepage” — if it never was English, send it to `/` and let hreflang do the rest |
| `/casa-1/` … `/casa-4/` | `/case/casa-1/` … `/case/casa-4/` |
| `/informazioni/imperdibili/` | `/imperdibili/` |
| `/informazioni/` | `/` only if you must; a **410** is cleaner (it is a WordPress stub) |
| unknown leftovers | real 404/410, not a blanket homepage 301 |

### github.io → `.it`

Strip the repo prefix, keep the rest of the path:

`https://rednaw.github.io/anticobagliosiciliano/en/case/casa-1/` → `https://anticobagliosiciliano.it/en/case/casa-1/`

### wordpress.com (English-first, if still controlled)

| From | To |
|---|---|
| `/room/casa-1/` … `/casa-4/` | `/en/case/casa-1/` … |
| `/informazioni/imperdibili/` | `/en/imperdibili/` |
| `/about/`, `/testimonials/` | `/en/` |
| `/room/casa-5/` | **410** or `/en/`, never Casa 4 |

### `.com` Lodgify (if still controlled)

- Map the four current houses by *identity*, not the old “Mastro …” names.
- Imperdibili / contact-ish URLs → `/imperdibili/`, `/contatti/`.
- Agrumeto / retired units → 410.
- Do not 301 machine-translated Lodgify `/en/` menu junk onto `/en/` unless the destination is clearly the same page.

New URLs with no ancestor (`/come-arrivare/`, `/privacy/`, `/contatti/`) only need the sitemap and internal links. Do not invent fake “equivalent” 301s from unrelated old pages.

## After

- Watch Search Console for 404s and “Duplicate without user-selected canonical”. Fix missed maps; do not rewrite titles or slugs in the first weeks.
- Update citations in that same week so Google Business and Maps agree with the canonical host.
- If you used URL-prefix properties, use **Change of address** from the old `.it` WordPress property to the new one only when the new site is already live on that host. A domain property makes this less fussy.
- Expect a noisy fortnight, then a slow transfer of house-page queries (`casa 1 balestrate`, etc.). Brand queries usually recover faster than long-tail if 301s are exact.

## What not to do

- Soft-launch on `.it` while WordPress is still answering the same paths.
- Change canonicals to `.it` while github.io is still the thing that actually serves the HTML.
- 301 every obsolete URL to the homepage.
- Index `/archivio/` or the github.io copy after `.it` is live.
- Treat wordpress.com language as the same as the new `/en/` prefix without checking the page language.

The SEO-critical code change at cutover is small: `SITE_HOSTNAME` / `SITE_BASE` so every absolute URL in the head and sitemap is already the public `.it` URL. The SEO-critical *work* is the redirect table and not ranking two hosts at once.
