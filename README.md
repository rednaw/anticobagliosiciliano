# Antico Baglio Siciliano

SvelteKit rebuild of [anticobagliosiciliano.it](https://anticobagliosiciliano.it/), deployed as a static site on GitHub Pages.

## Develop

Requires Node.js 24+.

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Deploy

Push to `main`. The GitHub Actions workflow builds and deploys to GitHub Pages.

In the repo settings, set **Pages → Source** to **GitHub Actions**. For a custom domain, add it under **Pages → Custom domain**.

### Simple Analytics

Production only — reports under **`anticobagliosiciliano.rednaw.github.io`**
(`app.html` + `site-config.ts`). The script is stripped during `npm run dev`.

1. In [Simple Analytics](https://simpleanalytics.com/) → **Websites** → add `anticobagliosiciliano.rednaw.github.io`.
2. Deploy — page views appear after the first visit (SPA navigation is tracked automatically).

## Contact email

Update `email` in `src/lib/data/content.ts` if needed (used by the contact form / mailto).

## Owner archive browser

Unlinked page at **`/archivio/`** — thumbnail gallery of photos/text from `archive/` (old `.it`, Lodgify `.com`, WordPress.com). Thumbs ship with the site; clicking opens full-res from GitHub LFS (`media.githubusercontent.com`). Not in the nav; `noindex` + `robots.txt` disallow.

Regenerate after archive changes (requires LFS files locally):

```sh
npm run archivio:build
```
