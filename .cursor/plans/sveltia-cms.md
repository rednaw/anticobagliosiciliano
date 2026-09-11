---
name: Sveltia CMS
status: pending
saved: 2026-09-11
overview: Git-backed /admin (Sveltia) for marketing copy. Maintainer first, then owners on GitHub. YAML in src/content/*.yml. Shared labels in site.yml.
---

# Sveltia CMS

**Shipped invariants:** `.cursor/rules/content.mdc` (YAML), `.cursor/rules/sveltia-cms.mdc` (`/admin`).

## Decisions

- Authors: you first; owners later. Same `/admin`. Owner GitHub Write is the one conversation in `.cursor/plans/owner-access.md`.
- Hybrid: `src/content/*.yml` — houses, places, home, amenities, awards, contact, site (no email), arrive (labels only), imperdibili, privacy. Nested `{ it, en }` on each field. Sequence of houses/places is the import list in `src/lib/data/content.ts` (Vite plugin + `scripts/register-lib.mjs` both parse `.yml`).
- Not in YAML: occupancy, Lodgify ids, courtyard coords, map `href`s, `SITE_*`. Inbox is `contact.yml` `inbox` (scalar). All other user-facing strings are `src/content/*.yml`. `i18n.ts` is path helpers only.
- `/admin` is `static/admin/`. CMS IIFE is copied from `node_modules/@sveltia/cms` on build (`./sveltia-cms.js`); Vite serves it from `node_modules` in dev. Live: GitHub OAuth via `https://auth.tientjeketama.nl` (`backend.base_url`, `auth_methods: [oauth]`). Project Pages URL is `…/anticobagliosiciliano/admin/` until `.it` cutover. Local: Local Repository, this folder. Not in the public nav. `robots.txt` Disallow `${SITE_BASE}/admin/`. Localized YAML is object widgets (`it`/`en`) — do not enable Sveltia i18n (`single_file` is top-level locale keys and empties collections).
- Marketing YAML is the only copy store.

## Remaining

**OAuth origin.** iac cms-oauth `ALLOWED_DOMAINS` includes `rednaw.github.io`. At cutover add `anticobagliosiciliano.it` — `.cursor/plans/domain-cutover-seo.md`. Secret stays on the VPS. Open **iac** for that allowlist.
