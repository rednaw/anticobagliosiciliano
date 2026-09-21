# Sveltia CMS

Git-backed `/admin` for marketing copy. Shipped invariants: `.cursor/rules/content.mdc`, `.cursor/rules/sveltia-cms.mdc`. Owner GitHub Write: [owner-access.md](./owner-access.md). Cutover OAuth host: [domain-cutover-seo.md](./domain-cutover-seo.md).

## Decided

| | |
|--|--|
| Authors | You first; owners later. Same `/admin`. |
| YAML | `src/content/{pages,houses,places}/` — disk path is CMS `collection.name` / `file.name`. Nested `{ it, en }` per field. Sequence of houses/places is the import list in `src/lib/data/content.ts`. |
| Not in YAML | Occupancy, Lodgify ids, courtyard coords, map `href`s, `SITE_*`. Inbox is `pages/contact.yml` `inbox` (scalar). `i18n.ts` is path helpers only. |
| `/admin` | `static/admin/`. Live GitHub OAuth via `https://auth.rednaw.nl`. Local: Local Repository. Not in the public nav. Object widgets `it`/`en` — do not enable Sveltia `i18n`. |
| Copy store | Marketing YAML only. |

## Decide

None.

## Do

### 0. OAuth origin at `.it` cutover

after [domain-cutover-seo.md](./domain-cutover-seo.md) cutover night — iac `ALLOWED_DOMAINS` already includes `rednaw.github.io`; add `anticobagliosiciliano.it` in that same release. Do not duplicate the runbook here.
