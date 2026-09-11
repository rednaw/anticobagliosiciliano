---
name: Sveltia CMS
status: pending
saved: 2026-09-09
overview: Git-backed /admin (Sveltia) for marketing copy. Maintainer first, then owners on GitHub. YAML in src/content/*.yml. Shared labels in site.yml.
todos:
  - id: cms-oauth
    content: GitHub OAuth via auth.tientjeketama.nl (iac origin allowlist for this host)
    status: pending
---

# Sveltia CMS

**Shipped invariants:** `.cursor/rules/content.mdc` (YAML), `.cursor/rules/sveltia-cms.mdc` (`/admin`).

## Decisions

- Authors: you first; owners later (GitHub write on this repo). Same `/admin`.
- Hybrid: `src/content/*.yml` — houses, places, home (amenities + awardItems), contact, site (no email), arrive (labels only), imperdibili, privacy. Nested `{ it, en }` on each field. Sequence of houses/places is the import list in `src/lib/data/content.ts` (Vite plugin + `scripts/register-lib.mjs` both parse `.yml`).
- Not in YAML: occupancy, Lodgify ids, courtyard coords, map `href`s, `SITE_*`. Inbox is `contact.yml` `inbox` (scalar). All other user-facing strings are `src/content/*.yml`. `i18n.ts` is path helpers only.
- `/admin` is `static/admin/` (Sveltia 0.206.0). Local: Local Repository, this folder. Not in the public nav. `robots.txt` Disallow `${SITE_BASE}/admin/`. Localized YAML is object widgets (`it`/`en`) — do not enable Sveltia i18n (`single_file` is top-level locale keys and empties collections).
- Marketing YAML is the only copy store.

## Remaining

**OAuth.** Add `backend.base_url: https://auth.tientjeketama.nl` and `auth_methods: [oauth]`. Project Pages URL is `…/anticobagliosiciliano/admin/` until `.it` cutover. iac must allow this origin (and later the apex). Secret stays on the VPS.
