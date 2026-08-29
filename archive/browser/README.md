# Archive browser

Local-only UI for the parent `archive/` folder.

## Usage

From the repo root:

```sh
npm run archive:dev
```

Open http://localhost:5174. On first run (or after source changes), thumbs and `public/index.json` are generated automatically. Output under `public/` is gitignored.

To rebuild without starting the dev server:

```sh
npm run archive:build
```

Full-resolution images open from GitHub LFS via `media.githubusercontent.com`.
