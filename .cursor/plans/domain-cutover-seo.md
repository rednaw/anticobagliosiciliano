---
name: Domain cutover SEO
status: pending
saved: 2026-08-28
overview: One public host. github.io stays noindex until .it serves this site. Then DNS to Pages, flip SITE_*, submit the .it sitemap. Old hosts each get one host-wide 301 to the apex.
todos:
  - id: noindex-github
    content: SITE_PUBLIC false; github.io URL Inspection shows noindex
    status: completed
  - id: gsc-github
    content: github.io URL-prefix property verified; do not submit its sitemap in GSC
    status: completed
  - id: freeze-ia
    content: Confirm the public slug list below is final
    status: pending
  - id: decide-host
    content: Canonical host is apex https://anticobagliosiciliano.it/; www 301s to it
    status: completed
  - id: wp-en
    content: WordPress /en/ is replaced by this site’s /en/; no special redirect
    status: completed
  - id: citations
    content: Fill the citation table (Business, Maps, social, booking) before cutover week
    status: pending
  - id: cutover-code
    content: Same release as DNS/Pages custom domain — SITE_HOSTNAME anticobagliosiciliano.it, SITE_BASE '', SITE_PUBLIC true
    status: pending
  - id: redirects
    content: Host-wide 301 of .com, wordpress.com, www, and github.io to the apex
    status: pending
  - id: gsc-sitemap-it
    content: Submit sitemap.xml on the .it property only after SITE_PUBLIC is true
    status: pending
---

# SEO cutover runbook

This file is the checklist for making this rebuild the only public site at `anticobagliosiciliano.it`. It covers the frozen github.io state, public slugs, citations, DNS records at cutover, and the `SITE_*` flips.

Who can click: **one owner conversation**, once — `.cursor/plans/owner-access.md`. Remote (two countries): they grant access; **you** do every technical step. Occupancy API already works and is not that conversation. Do not put login asks here.

One public site. Do not rank github.io and `.it` at the same time. Code to flip is in `src/lib/site-config.ts`. Simple Analytics already uses `anticobagliosiciliano.it` — leave `SIMPLE_ANALYTICS_HOSTNAME` alone. Old hosts get one 301 each; see Redirects.

## Now (frozen)

This is the live state of the rebuild as of 28 Aug 2026. It exists so you do not accidentally undo `noindex`, submit the github.io sitemap, or point citations at github.io before `.it` is this site. Treat every row as a constraint until the cutover night.

| Item | Value |
|---|---|
| Live rebuild | `https://rednaw.github.io/anticobagliosiciliano/` |
| `SITE_HOSTNAME` | `rednaw.github.io` |
| `SITE_BASE` | `/anticobagliosiciliano` |
| `SITE_PUBLIC` | `false` → every page `noindex, nofollow` |
| GSC github.io | URL-prefix `https://rednaw.github.io/anticobagliosiciliano/` — verified 28 Aug 2026 |
| Sitemap file | Live at `/sitemap.xml`. **Do not** add it under GSC **Sitemaps** on github.io |
| `robots.txt` | `Allow: /`, `Disallow` only `/archivio/`. Indexing is blocked by the meta tag, not by Disallow |
| Canonicals | Still github.io (must match the host that serves the HTML) |
| WordPress `.it` | Still the indexed public site |

Do not add github.io to Google Business, Instagram, email, or print.

## Do next (before you own the cutover window)

Work you can finish while WordPress still owns `.it`. None of it puts the rebuild in the index. The public host is already decided (apex). What remains here is freeze URLs and list citations. Access (who can open the panels) is the other file, one conversation. Tick the YAML todos as you finish.

### 1. Freeze public slugs

This is the public URL inventory. These paths must not change after cutover. Confirm the list is final; `/archivio/` is not in it and stays unlinked and `noindex` forever.

Italian (also `hreflang` x-default): `/` `/imperdibili/` `/come-arrivare/` `/contatti/` `/privacy/` `/case/casa-1/` `/case/casa-2/` `/case/casa-3/` `/case/casa-4/`

English: `/en/` plus the same suffixes.

### 2. Public host (decided)

Canonical host is the apex: `https://anticobagliosiciliano.it/`. `www.anticobagliosiciliano.it` only exists to 301 to apex (HTTPS, same path, trailing slash to match this site). Cutover `SITE_HOSTNAME` is `anticobagliosiciliano.it`. This matches Simple Analytics (`SIMPLE_ANALYTICS_HOSTNAME`) and the email domain.

- [x] Apex `https://anticobagliosiciliano.it/`
- [x] `https://www.anticobagliosiciliano.it/…` → 301 → `https://anticobagliosiciliano.it/…`

### 3. Fill citations (update these URLs in the cutover week)

This is the list of places that still send people and crawlers to a URL. Fill current values now so that, in the same week as the swap, you can point them at `https://anticobagliosiciliano.it/` instead of WordPress, Lodgify, or github.io. Google Maps is already a live inbound: change that field in the same week even if wordpress.com also 301s.

| Place | Current URL | New URL | Done |
|---|---|---|---|
| Google Business / Maps (`https://maps.app.goo.gl/NA1BwasQVcFzn1qHA`) | `http://anticobagliosiciliano.wordpress.com/` | `https://anticobagliosiciliano.it/` | |
| Instagram (`https://www.instagram.com/anticobagliosiciliano/`, Elena Delitala) | `https://www.airbnb.it/users/26312991/listings` | `https://anticobagliosiciliano.it/` | |
| Facebook (`https://www.facebook.com/AnticoBaglioSiciliano/`) | `http://anticobagliosiciliano.wordpress.com/` | `https://anticobagliosiciliano.it/` | |
| Lodgify website (`https://anticobagliosiciliano.com/`) | `https://anticobagliosiciliano.com/` | `https://anticobagliosiciliano.it/` | |
| Booking.com (`https://www.booking.com/hotel/it/antico-baglio-siciliano.html`) | none — GDT forbids website/social links in listing content | — | |
| Airbnb (host [Elena Delitala](https://www.airbnb.it/users/show/26312991), four houses) | none — off-platform links in listings/messages are prohibited | — | |
| Printed cards / email footer | | | |

## DNS (you edit as Technical Administrator)

Registrar is Register.it. You already have the panel from the owner conversation. You type the records; they do not paste them.

Cutover (same night as the `SITE_*` release):

- Apex **A** and **AAAA** → GitHub Pages IPs
- `www` **301** → `https://anticobagliosiciliano.it/` (HTTPS, same path, trailing slash to match this site)
- Leave **MX** (and mailbox CNAMEs) untouched

Search Console: you add the `.it` **domain** property in *your* GSC; you publish the TXT in this zone; you click Verify. The owners do not use Search Console.

Same zone later (no new owner conversation):

- GitHub Pages `_github-pages-challenge-…` TXT when the custom domain is attached
- Another **A**/**AAAA** change if the host ever leaves Pages
- **SPF** / **DKIM** / **DMARC** if `info@` changes provider
- Other **TXT**/**CNAME** proofs (Bing, Meta, extra Google products, Apple Pay)
- Extra **subdomains** (`staging.`, `book.`, …)
- **DNS-01** TXT if TLS is ever terminated off Pages
- **Auth-code** only if they later choose to transfer the domain

Do **not** transfer `.it` to TransIP.

## Cutover night (one release)

This is the single window where `.it` starts serving this site and github.io stops being a competing document. **You** take WordPress offline on `.it` and turn on the host-wide 301s (Lodgify `.com`, wordpress.com). DNS records are the section above. The three `site-config.ts` flips and the `.it` sitemap submit belong in the same release. Do not flip canonicals to `.it` while github.io is still the document Google fetches.

1. Pages → Custom domain = `anticobagliosiciliano.it` (apex).
2. In `src/lib/site-config.ts`:
   - `SITE_HOSTNAME` → `anticobagliosiciliano.it`
   - `SITE_BASE` → `''`
   - `SITE_PUBLIC` → `true`
3. Deploy. Spot-check a live page: canonical, hreflang, and OG must be `https://anticobagliosiciliano.it/come-arrivare/` (no `/anticobagliosiciliano/` prefix).
4. In *your* Search Console, on the `.it` **domain** property (verified after you publish the TXT) → **Sitemaps** → submit `sitemap.xml`.
5. Host-wide 301s the same night: Lodgify `.com` and wordpress.com → `https://anticobagliosiciliano.it/`.

## Redirects (decided: host-wide only)

Every old host is one 301 to `https://anticobagliosiciliano.it/`. No per-path table. Apex `.it` is the destination: old WordPress paths there (`/casa-1/`, blog, hotel plugin, WPML) become **404**. Do not catch-all those onto `/`.

| Host | Do |
|---|---|
| `www.anticobagliosiciliano.it` | DNS 301 → apex (same path; this is the live site’s www) |
| `anticobagliosiciliano.com` | One host-wide 301 → `https://anticobagliosiciliano.it/` |
| `anticobagliosiciliano.wordpress.com` | One host-wide 301 → `https://anticobagliosiciliano.it/` |
| `rednaw.github.io` (project URL) | Pages custom-domain enforcement |

## After (same week, then watch)

This is the follow-through once `.it` is the live site. Citations must match the new canonical host in the same week, then Search Console tells you which old URLs were missed. Do not retitle or reslug while Google is transferring the house-page queries.

- [ ] Update every row in the citation table the same week as the swap.
- [ ] GSC `.it`: 404s. Do not rewrite titles or slugs for the first weeks.
- [ ] GSC github.io: confirm URLs stay `noindex` / empty out. After `.it` is live, do not keep indexing the project URL.
- [ ] **Change of address** only if you also had a URL-prefix property for the old WordPress site, and only when this site is already live on `.it`. A domain property on your account is enough; the owners do not need Search Console.
- Expect a noisy fortnight. Brand queries recover faster than house queries.

## Do not

These are the failure modes that create two indexable sites, hide `noindex` from Google, or throw old-page equity at the homepage. If a step below would do one of these, stop.

- Soft-launch on `.it` while WordPress still answers those paths.
- `Disallow` the whole site in `robots.txt` instead of `noindex` (hides the tag from Google).
- Submit the github.io sitemap in GSC.
- Index `/archivio/`.
- Treat wordpress.com copy as the new `/en/` without checking the page language.
- Configure per-path 301s (houses, Lodgify ids, WPML, blog).
- Catch-all old `.it` WordPress paths onto `/`.
