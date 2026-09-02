---
name: Media tier (viewport + network)
status: done
saved: 2026-09-02
overview: Session full|light; pessimistic until proven (prove fetch + Network API). -light.webp build; buffer-gated cinema; light cinema = reduced-motion UX. Viewport srcset deferred.
todos: []
---

# Media tier

Session **`full` | `light`**. **Viewport and tier are orthogonal** — portone `<picture>` (wide/tall) only; no site-wide `srcset` yet.

**Strategy:** Viewport `srcset`/`sizes` usually saves mobile bandwidth by matching layout width. We use **network tier** first: on slow links / Save-Data → `-light.webp`, static cinema, no MP4. Responsive srcsets may come later (tier picks file family; srcset picks width within it).

See `.cursor/rules/ambient-video.mdc` for cinema layout.

---

## Cinema

| Asset | Runtime role |
|-------|----------------|
| `baglio-movie.mp4` | Premium autoplay |
| `baglio-movie-start.jpg` | `<video poster>` while loading |
| `baglio-movie-end.jpg` | `posterEnd` when static cinema |

Start/end are normal JPEGs under `static/videos/` — same build emit (`.webp`, `-light.webp`) as everything in `static/images/` and `static/videos/`. When the MP4 is replaced, re-export both stills (ffmpeg frame 0 / last frame); no separate pipeline.

### Static cinema (`reduceMotion || tier === 'light'`)

Same UX for both triggers — shared `staticCinema` in `+page.svelte`:

- `posterOnly` + `posterEnd` — no MP4, **no play control**
- Desktop landscape: sticky pin + Chi siamo hold card (`cinema-card--hold`)
- Portrait: Chi siamo below clip (`portraitMobile` only)
- Never `baglio-movie-start.jpg` on this path

Premium path earns the end frame via playback; static path skips to it.

---

## Tier — pessimistic until proven

Default / unknown session is **`light`**. Upgrade with `markFull()` only after proof; `markLight()` **locks** for the session (no upgrade).

| Signal | Rule |
|--------|------|
| sessionStorage `light` | Restore light (locked) |
| sessionStorage `full` | Restore full |
| Network API slow | `saveData` or `effectiveType` ∈ slow-2g / 2g / 3g → `markLight()` *(3g — revisit)* |
| Throughput prove | Cache-busted fetch of `mappa` light asset within 800ms → `markFull()`; else `markLight()` |
| Buffer stall / timeout | Abort MP4 → `markLight()` → static cinema |

Deep links use the same init path (no dependency on homepage cinema). DevTools throttling often leaves `navigator.connection` optimistic — the prove fetch still fails closed to light.

### Buffer gate (`ambient-video.ts`)

`MIN_BUFFER_AHEAD_S = 2`, `AUTOPLAY_PREPARE_MS = 6_000`.

1. No `<source>` until cinema `ready` and tier `full`; `preload="none"`; video visually hidden (no start poster) until play / recovery UI
2. On intersect: attach source, `preload="auto"`, `video.load()`
3. `hasMinimumBuffer`: `readyState >= 4`, or `>= 3` and ≥2s ahead in `video.buffered`
4. Autoplay only when buffered; clear timeouts on success
5. Stall: 2s with no buffer progress → abort → `markLight()` → static cinema
6. Timeout: 6s without minimum buffer → abort → `markLight()` → static cinema

---

## Images

### Build

Walk `static/images/` and `static/videos/` — all JPEG/PNG treated alike:

- Full: `MAX_EDGE` 1600, `QUALITY` 80 → `.webp`
- Light: `LIGHT_MAX_EDGE` ~800, `LIGHT_QUALITY` 80 → `-light.webp`

`npm run images:verify-light` after emit.

### `responsiveImage(path, { tier? })`

- Tier-only — no `sizes`/`srcset` in this plan
- Pass `{ tier: $mediaTier }` (or page `tier`) so URLs update on downgrade
- **Dev:** always committed JPEG/PNG (tier affects cinema only)
- **Prod:** `full` → `.webp`; `light` → `-light.webp` (all page images incl. galleries)
- **First paint:** client starts `light` until prove/`markFull`; prerendered markup may still show full URLs until hydration — acceptable
- **SEO/OG/JSON-LD:** always full via `publicImage()` — not tiered
- **Come arrivare:** light tier keeps the static map image only (`ArriveMap`) — no Leaflet / OSM tiles

### Naming

`-light` suffix = network-tier WebP (build). No `-sm` or hand width variants. Cinema filenames (`baglio-movie-*`) are convention only, not a separate tier.

---

## Files

`optimize-site-images.mjs`, `public-image.ts`, `network-quality.ts`, `network-prove.ts`, `network-tier.ts`, `ambient-video.ts`, `AmbientVideo.svelte`, `ArriveMap.svelte`, `+page.svelte`, `+layout.svelte`, `ambient-video.mdc`

---

## Out of scope / follow-ups

- Site-wide viewport `srcset`
- Replacing portone `<picture>`
- Merging reduced motion, portrait, and slow link into one flag
- Revisit whether `3g` → light is too aggressive
- Tune `PROVE_FULL_MAX_MS` / probe asset after real-network samples
