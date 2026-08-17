# Antico Baglio Siciliano

SvelteKit rebuild of [anticobagliosiciliano.it](https://anticobagliosiciliano.it/), deployed as a static site on GitHub Pages.

The public host is **`anticobagliosiciliano.rednaw.github.io`** until the owners approve the custom domain **`anticobagliosiciliano.it`**. Canonicals, hreflang, sitemap, and Simple Analytics all follow `SITE_HOSTNAME` in `src/lib/site-config.ts`.

## Develop

Requires Node.js 24+.

```sh
npm install
npm run dev
```

### Dependency updates

[Renovate](https://docs.renovatebot.com/) runs daily from GitHub Actions (no GitHub
App) and opens dependency PRs. Setup: [`docs/dependency-updates.md`](docs/dependency-updates.md).

## Build

```sh
npm run build
npm run preview
```

## Deploy

Push to `main`. The GitHub Actions workflow builds and deploys to GitHub Pages.

In the repo settings, set **Pages → Source** to **GitHub Actions**. After owner review, set **Pages → Custom domain** to `anticobagliosiciliano.it` and change `SITE_HOSTNAME` in `src/lib/site-config.ts`.

### Simple Analytics

Production only — reports under the current `SITE_HOSTNAME` (`app.html` is filled at prerender). The script is stripped during `npm run dev`.

1. In [Simple Analytics](https://simpleanalytics.com/) → **Websites** → add the current hostname (`anticobagliosiciliano.rednaw.github.io` for now).
2. Deploy — page views appear after the first visit (SPA navigation is tracked automatically).
3. When the custom domain goes live, add `anticobagliosiciliano.it` as a website (or rename) so it matches `SITE_HOSTNAME`.

## Contact email

Update `email` in `src/lib/data/content.ts` if needed (used by the contact form / mailto).

## Archivio

`/archivio/` is an unlinked owner archive of photos and texts from previous sites (not in the public nav). Regenerate thumbs after `archive/` changes (requires LFS files locally):

```sh
npm run archivio:build
```

