# Owner archive

Photos and texts recovered from previous sites, plus a local browser to view them. **Not deployed** with the marketing site.

## Layout

| Path | Role |
|---|---|
| `original-site/`, `lodgify-com/`, `old-wordpress/`, `vrbo/` | Source assets (Git LFS for images) |
| `browser/public/` | Generated locally — thumbs + `index.json` (gitignored) |

Source images use Git LFS (`.gitattributes`: `archive/**/*.{jpg,jpeg,png,webp,avif}`). Thumbnails are rebuilt from sources; they are not committed.

## Local browser

From the repo root:

```sh
npm run archive:dev       # builds if needed, then http://localhost:5174
```

After changing files under the source folders, run `npm run archive:build` or start `archive:dev` again (rebuilds only when sources are newer than the last build).

See [browser/README.md](browser/README.md).
