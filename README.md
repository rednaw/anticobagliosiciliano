# Antico Baglio Siciliano

SvelteKit rebuild of [anticobagliosiciliano.it](https://anticobagliosiciliano.it/), deployed as a static site on GitHub Pages.

The public host is **`https://rednaw.github.io/anticobagliosiciliano/`** until the owners approve the custom domain **`anticobagliosiciliano.it`**. Canonicals, hreflang, sitemap, and asset URLs follow `SITE_HOSTNAME` and `SITE_BASE` in `src/lib/site-config.ts`.

## Develop

Open the repo in VS Code or Cursor and **Reopen in Container**. The host needs Docker and the editor. Node, npm, and extensions live in the container (`npm ci` runs on create).

```sh
npm run dev
```

CMS (live): [https://rednaw.github.io/anticobagliosiciliano/admin/](https://rednaw.github.io/anticobagliosiciliano/admin/) → **Sign in with GitHub**. Local: [http://localhost:5173/anticobagliosiciliano/admin/](http://localhost:5173/anticobagliosiciliano/admin/) → **Local Repository** → this repo folder. Not in the public nav.

### Owner copy

Houses, places, and pages (including the inbox address) live in `src/content/{pages,houses,places}/`. Edit them in `/admin/`. Map hrefs and courtyard coords stay in `src/lib/data/content.ts`.

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

`npm run build` writes WebP next to marketing JPEG/PNG in `static/` (gitignored), then Vite prerenders, then JPEG/PNG are dropped from `build/`. Check the result with `npm run preview`, not `vite dev`.

## Deploy

Push to `main`. The GitHub Actions workflow builds and deploys to GitHub Pages.

In the repo settings, set **Pages → Source** to **GitHub Actions**. After owner review, set **Pages → Custom domain** to `anticobagliosiciliano.it`, then set `SITE_HOSTNAME` to that host and `SITE_BASE` to `''` in `src/lib/site-config.ts`.

Visit stats: self-hosted Umami at `analytics.rednaw.nl` (production only; stripped in `npm run dev`).

## Contact email

Update `email` in `src/lib/data/content.ts` if needed (used by the contact form / mailto).

## Archive

Owner archive under `archive/` (LFS source photos, local browser in `archive/browser/`). Not deployed.

```sh
npm run archive:dev       # http://localhost:5174 — generates thumbs on first run
```

See [archive/README.md](archive/README.md).

