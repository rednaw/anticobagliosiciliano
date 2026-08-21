# Antico Baglio Siciliano

SvelteKit rebuild of [anticobagliosiciliano.it](https://anticobagliosiciliano.it/), deployed as a static site on GitHub Pages.

The public host is **`https://rednaw.github.io/anticobagliosiciliano/`** until the owners approve the custom domain **`anticobagliosiciliano.it`**. Canonicals, hreflang, sitemap, and asset URLs follow `SITE_HOSTNAME` and `SITE_BASE` in `src/lib/site-config.ts`. Simple Analytics already reports under `anticobagliosiciliano.it`.

## Develop

Requires Node.js 24+.

```sh
npm install
npm run dev
```

### Owner copy

Italiano and English seed copy lives in `src/lib/data/content.ts` and `src/lib/standard/i18n.ts`. The owner edits `copy/testi.csv`. Overrides land in `src/lib/data/copy-overrides.json`.

```sh
npm run copy:export   # writes gitignored copy/testi.csv
npm run copy:import   # applies that CSV onto copy-overrides.json
```

The last CSV column is a stable `id`. Import accepts comma, semicolon, or tab separators (and an Excel `sep=` first line) and refuses a file whose ids do not match the site. Blank cells are left unchanged — they do not wipe site copy. Overrides win over the seed; unchanged strings stay in the seed and show up on the next export. Restart `npm run dev` after import if the running app still shows the old text.

### Lodgify occupancy

```sh
npm run lodgify:sync        # writes src/lib/data/occupancy.json
```

Needs `LODGIFY_API_KEY` (local env, and the GitHub Actions secret of the same name). Occupied night ranges only (Casa 1–4); no guest names. One-night gaps between bookings are filled (minimum stay). If Lodgify fails, the last good JSON is left as it is.

A scheduled workflow (`.github/workflows/lodgify-availability.yml`) runs `lodgify:sync` twice a day. If occupancy changed it commits `occupancy.json` and deploys Pages. `GITHUB_TOKEN` commits do not retrigger CI. You can also run it from **Actions → Lodgify occupancy → Run workflow**.

### Dependency updates

[Renovate](https://docs.renovatebot.com/) runs daily from GitHub Actions (no GitHub
App) and opens dependency PRs.

## Build

```sh
npm run build
npm run preview
```

`npm run build` writes WebP next to marketing JPEG/PNG in `static/` (gitignored), then Vite prerenders, then JPEG/PNG are dropped from `build/` except `og-share.jpg`. Check the result with `npm run preview`, not `vite dev`.

## Deploy

Push to `main`. The GitHub Actions workflow builds and deploys to GitHub Pages.

In the repo settings, set **Pages → Source** to **GitHub Actions**. After owner review, set **Pages → Custom domain** to `anticobagliosiciliano.it`, then set `SITE_HOSTNAME` to that host and `SITE_BASE` to `''` in `src/lib/site-config.ts`. Simple Analytics already uses that hostname.

### Simple Analytics

Production only. The script is stripped during `npm run dev`. Page views are collected under **`anticobagliosiciliano.it`** (`SIMPLE_ANALYTICS_HOSTNAME`) even while the site is still on GitHub Pages, so the dashboard does not need renaming at cutover.

1. In [Simple Analytics](https://simpleanalytics.com/) → **Websites**, add `anticobagliosiciliano.it`.
2. Deploy — page views appear after the first visit (SPA navigation is tracked automatically).

## Contact email

Update `email` in `src/lib/data/content.ts` if needed (used by the contact form / mailto).

## Archivio

`/archivio/` is an unlinked owner archive of photos and texts from previous sites (not in the public nav). Regenerate thumbs after `archive/` changes (requires LFS files locally):

```sh
npm run archivio:build
```

