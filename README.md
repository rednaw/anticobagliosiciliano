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

## Contact email

Update `email` in `src/lib/data/content.ts` if needed (used by the contact form / mailto).
