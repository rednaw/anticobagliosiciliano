# Network tier (images and cinema)

Designed for a high-end experience on capable connections — full WebPs and the homepage aerial clip — with **resilience** when bandwidth or the device is constrained: the page stays functional on the light path.

## Design

- **High-end when earned.** Session is `full` or `light`. After prove, capable links get full `.webp` and the aerial MP4. Viewport `srcset` may come later; tier picks the file family first.
- **Resilience on the light path.** Slow links, Save-Data, failed prove, or video stall/timeout → `light`: `-light.webp`, static cinema, no MP4. The page and navigation must keep working.
- **Fail closed at runtime.** Unknown sessions start `light`. `markFull()` only after proof; `markLight()` locks for the session (no upgrade back). That is resilience, not the product goal.
- **One build pipeline.** JPEG/PNG under `static/images/` and `static/videos/` emit full WebP (max edge 1600) and `-light.webp` (800), quality 80. `optimize-site-images.mjs` emit → Vite build → prune originals from `build/`. Asserted in `test:build`.
- **Cinema must not block the page.** Buffer-gated autoplay on the full path; stall/timeout → light → static end poster. Reduced motion shares that static UX. Never autoplay with sound.

## Tier signals

| Signal | Behaviour |
|---|---|
| sessionStorage `light` / `full` | Restore (light is locked) |
| Network API slow | `saveData` or `effectiveType` in slow-2g / 2g / 3g → light |
| Throughput prove | Cache-busted `mappa` light fetch within 800ms → full; else light |
| Buffer stall / timeout | Abort MP4 → light → static cinema |

`initMediaTier()` in `src/routes/(site)/+layout.svelte`: hydrate → Network API → prove.

## Page images

- Prod: `responsiveImage(path, { tier })` → full `.webp` or `-light.webp` (no `sizes`/`srcset` yet).
- Dev: committed JPEG/PNG (tier still drives cinema).
- SEO / OG / JSON-LD: always full via `publicImage()`.
- Come arrivare: light keeps the static map only — no Leaflet / OSM tiles.

## Homepage cinema

| Asset | Role |
|---|---|
| `baglio-movie.mp4` | Full-tier autoplay (720p, once per SPA session) |
| `baglio-movie-start.jpg` | Poster while the full path loads |
| `baglio-movie-end.jpg` | Static cinema / parked end frame |

**Full tier (motion allowed):** gate hero → aerial when stage intersects; desktop landscape sticky pin + scroll-driven Chi siamo; no `<source>` until ready + full; buffer gate 2s ahead / 6s prepare timeout.

**Light / reduced motion:** `posterOnly` + end poster, no play control; same sticky / portrait layout rules; never the start poster on this path. Stall or timeout on the full path falls back here.

## Code map

| Concern | Where |
|---|---|
| Tier store / prove | `src/lib/standard/network-*.ts` |
| Buffer / session | `src/lib/standard/ambient-video.ts`, `AmbientVideo.svelte` |
| Image URLs | `src/lib/public-image.ts` |
| Cinema layout | `src/routes/(site)/+page.svelte` |
| Build emit / prune | `scripts/optimize-site-images.mjs` |

Agent edit constraints: `.cursor/rules/network-tier.mdc`.

## Open follow-ups

- Site-wide viewport `srcset`
- Whether `3g` → light is too aggressive
- Tune prove timeout / probe asset from real-network samples
- Whether reduced motion, portrait, and slow link should share one flag
