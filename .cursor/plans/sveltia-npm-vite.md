# Sveltia: full npm + Vite route

Replace the static `admin/index.html` + Vite IIFE-copy plugin with a SvelteKit `/admin` client route that `import`s `@sveltia/cms`. Self-hosts CMS assets from Pages (no unpkg). Unblocks Renovate past the 0.221 package-layout break. Implement only after explicit go.

**Not** Simona’s unpkg model. Simona stays on CDN pins.

## Decided

| | |
|--|--|
| Approach | Full **npm + Vite/SvelteKit route** — not unpkg, not `dist/` IIFE copy. |
| Package | Keep `@sveltia/cms` as an npm dependency; Vite bundles `npm/` entry. |
| Route | `/admin` under `SITE_BASE` (`/anticobagliosiciliano/admin/`). |
| SSR | `ssr = false` on the admin route (CMS needs `window`/`document`). |
| Adapter | Still `adapter-static`; admin emits a prerendered HTML shell that loads the client bundle. |
| OAuth / backend | Unchanged: GitHub + `https://auth.rednaw.nl`, `config` backend block as today. |
| Content model | Unchanged: per-field `{ it, en }` objects; do **not** enable Sveltia i18n. |
| Config | **TypeScript** `CmsConfig` (e.g. `src/lib/cms-config.ts`); `CMS.init({ config: { load_config_file: false, ...config } })`. Delete `static/admin/config.yml` once the port is verified. |
| Isolation | Route group `src/routes/(cms)/admin/` with its own minimal layout (no `app.css` / site fonts). Public pages stay under `(site)`. |
| Bump order | Land the route on **`@sveltia/cms@0.206.0` first**; prove shell + OAuth; then a separate Renovate/PR bump to **0.223.0** (or latest). |
| Tradeoffs accepted | No CMS update toast; no PDF thumbnails (npm build limits). |
| Out of scope | Changing Simona; CSP rewrite beyond dropping unpkg assumptions if any; custom domain cutover. |

## Decide

None.

## Do

### 0. Admin route + TS config + drop IIFE plugin (on 0.206.0)

- [x] Agent: implemented
- [ ] Human: reviewed

**Agent will implement** — can start now after go: port `static/admin/config.yml` → `src/lib/cms-config.ts` (`CmsConfig`); add `src/routes/(cms)/admin/` with `ssr = false`, prerendered shell, minimal layout, `import CMS from '@sveltia/cms'` and `CMS.init({ config: { load_config_file: false, ...config } })` (mount `#nc-root` if useful). Keep `@sveltia/cms` at **0.206.0**. Remove `sveltiaCmsPlugin` / `sveltiaIife` / `copySveltiaCms` from `vite.config.ts`; remove `static/admin/index.html` and stop shipping `static/admin/sveltia-cms.js`; delete `static/admin/config.yml` after the port matches. Drop `adminIndexPlugin` if Kit trailing-slash covers `/admin/`; otherwise keep only what still helps. Build must emit admin HTML + hashed CMS chunks/assets under `SITE_BASE`, with no `unpkg.com` CMS entry.

**Human must:** Review TS config vs old YAML; open `/anticobagliosiciliano/admin/` and confirm OAuth still works on 0.206.0.

### 1. Tests and Renovate alignment

- [x] Agent: implemented
- [ ] Human: reviewed

**Agent will implement** — after 0: rewrite `tests/sveltia-admin.test.ts` and `tests/assert-build.mjs` — drop `./sveltia-cms.js` / copied-IIFE / YAML-path assertions; assert admin HTML in build, noindex, no unpkg CMS entry, config lives in `cms-config.ts`, collections still cover every content YAML key/order. Keep Renovate npm rule for `@sveltia/cms` only (no CDN regex manager).

**Human must:** Confirm CI green on the route PR.

### 2. Separate bump to 0.223.0 (or latest) + live smoke

- [ ] Agent: implemented
- [ ] Human: reviewed

**Agent will implement** — after 0–1 merged (or explicitly unblocked): bump `@sveltia/cms` (Renovate PR or manual) on top of the route; skim 0.221+ notes for config breaks (`comment` → `hint`, etc.) against `cms-config.ts`; run `npm run check`, `npm test`, `npm run build`, `npm run test:build`.

**Human must:** Preview `/admin/`: OAuth via `auth.rednaw.nl`; open one page + one house; save a trivial edit; confirm YAML still `{ it, en }` per field; sign out.
