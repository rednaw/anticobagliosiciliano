---
name: Media tier (viewport + network)
status: pending
saved: 2026-09-02
overview: Session full|light tier for images and cinema; build -light.webp and ffmpeg movie-end sync; slow-link detection and buffer-gated autoplay. Viewport layout and reduced motion stay orthogonal.
todos:
  - id: cinema-movie-stills-build
    content: Ffmpeg steps for baglio-movie-start.jpg (frame 0) and baglio-movie-end.jpg in optimize-site-images.mjs; skip when MP4 mtime ≤ JPEG mtime
    status: pending
  - id: build-light-webp
    content: Extend optimize-site-images.mjs — full WebP + -light.webp (orientation-aware, LIGHT_MAX_EDGE ~800)
    status: pending
  - id: verify-light-output
    content: Add npm run images:verify-light — dimensions/spot-checks for -light emit
    status: pending
  - id: responsive-image-helper
    content: Add responsiveImage() in public-image.ts (tier full|light, optional sizes/srcset)
    status: pending
  - id: network-quality-module
    content: Add network-quality.ts (Network Information API — saveData, effectiveType)
    status: pending
  - id: buffer-gated-autoplay
    content: AmbientVideo — deferred source, preload none, 6s abort, abortVideoLoad
    status: pending
  - id: network-tier-store
    content: network-tier.ts — sessionStorage full|light; earliest pessimistic signal wins
    status: pending
  - id: wire-video-tier
    content: posterOnly when tier === light; posterEnd; keep reduceMotion as separate trigger
    status: pending
  - id: roll-out-images
    content: Migrate portone, map, houses, imperdibili, GalleryCarousel to responsiveImage()
    status: pending
  - id: update-ambient-video-rule
    content: Document slow-link path in ambient-video.mdc
    status: pending
---

# Media tier

Session **`full` | `light`** for images; cinema uses **`baglio-movie-start.jpg`** (loading) vs **`baglio-movie-end.jpg`** (static). Viewport (`srcset`, `<picture>`) and network tier are **orthogonal** — no 2×2 matrix.

See `.cursor/rules/ambient-video.mdc` for cinema layout and reduced-motion behaviour.

---

## Rollout

1. **Build** — ffmpeg `baglio-movie-start.jpg` + `baglio-movie-end.jpg`, `-light.webp` emit, `images:verify-light`.
2. **Slow-link video** — `network-quality.ts`, buffer-gated autoplay, `network-tier.ts`, wire `posterOnly` for light tier.
3. **Site-wide images** — `responsiveImage()`, migrate listing/gallery pages, update `ambient-video.mdc`.

---

## Bandwidth → `tier = 'light'`

| Signal | Mechanism |
|--------|-----------|
| Network Information API | `saveData` or `effectiveType` slow-2g / 2g / 3g |
| Autoplay prep timeout | 6s without ~2s buffer on `baglio-movie.mp4` → abort fetch, play control |
| Hero throughput *(optional)* | Resource Timing on portone still |

Earliest pessimistic signal wins. DevTools throttling does not update `navigator.connection` — rely on the timeout path for tests.

---

## Cinema assets

`baglio-movie.mp4` — 1280×720, ~4.5 MB. Start and end stills match frame 0 and last frame.

| File | Role |
|------|------|
| `baglio-movie.mp4` | Premium autoplay |
| `baglio-movie-start.jpg` | First frame; video `poster` while loading |
| `baglio-movie-end.jpg` | Last frame; `posterEnd` when `posterOnly` (reduced motion **or** light tier) |

```ts
poster="/videos/baglio-movie-start.jpg"
posterEnd="/videos/baglio-movie-end.jpg"
posterOnly={reduceMotion || tier === 'light'}  // separate triggers
```

Light tier: no MP4 until opt-in play. Never use `baglio-movie-start.jpg` on the static path.

---

## Naming

| Suffix | Meaning | Example |
|--------|---------|---------|
| `-movie` | Cinema MP4 | `baglio-movie.mp4` |
| `-movie-start` | First MP4 frame (build-synced) | `baglio-movie-start.jpg` |
| `-movie-end` | Last MP4 frame (build-synced) | `baglio-movie-end.jpg` |
| `-light` | Network tier WebP (build) | `cortile-light.webp` |

Do not reintroduce `-sm`, `-763w`, `-744w`, `-mobile`, or hand size variants.

---

## Build

```bash
ffmpeg -y -i static/videos/baglio-movie.mp4 -frames:v 1 -q:v 2 static/videos/baglio-movie-start.jpg
ffmpeg -sseof -0.1 -i static/videos/baglio-movie.mp4 -frames:v 1 -q:v 2 static/videos/baglio-movie-end.jpg
```

- Full WebP: existing walk of `static/images/`, `static/videos/` at `MAX_EDGE` 1600.
- Light WebP: `{basename}-light.webp`, orientation-aware `LIGHT_MAX_EDGE` (~800).

---

## Runtime helper

```ts
responsiveImage(path, { tier?: 'full' | 'light', sizes?: string })
```

Reads tier from `network-tier.ts` (`sessionStorage`). Until store + emit exist, pages keep `imageAsset()`.

When `light`: cinema → `posterOnly` + `posterEnd`; images → `-light.webp`.

---

## Files

| Area | Touch |
|------|-------|
| Build | `scripts/optimize-site-images.mjs`, `package.json` |
| Video | `AmbientVideo.svelte`, `ambient-video.ts`, `+page.svelte` |
| Network | `network-quality.ts`, `network-tier.ts` (new) |
| Images | `public-image.ts` |
| Rules | `ambient-video.mdc` |

---

## Open decisions

1. **`LIGHT_QUALITY`** — 80 or lower?
2. **`baglio-movie-start.jpg` / `-end.jpg` in git** — committed alongside build step, or build-only?
3. **Play on tap (light)** — start poster then video, or MP4 from end still?
4. **Hero throughput probe** — phase 2 or defer?
5. **Galleries** — light tier for all slides or lead only?
6. **Dev fallback** — full JPEG when `-light.webp` missing?

---

## Out of scope

- Network × orientation file matrix.
- Replacing portone wide vs tall `<picture>`.
- Single flag for reduced motion, portrait, and slow link.
