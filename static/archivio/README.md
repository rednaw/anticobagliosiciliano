# Archivio (owner browse UI)

Hidden readonly gallery at `/archivio/` — not linked from the public nav.

- **Thumbnails + index:** generated here (`thumbs/`, `data/index.json`)
- **Full-res:** GitHub LFS via `media.githubusercontent.com` (see `full` URLs in the index)
- **Regenerate:** `npm run archivio:build` (needs local `archive/` with LFS files pulled)

Share `https://<pages-host>/archivio/` with the owners. They browse and reply out-of-band with what to reuse; there is no Keep/Skip UI.
