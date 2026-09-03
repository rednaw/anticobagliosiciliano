# Site theme

Marketing site visual system for Antico Baglio Siciliano. Archive (`archive/`) is a separate product and is out of scope.

## Values vs structure

[`src/app.css`](../src/app.css) is split in two:

1. **Theme values** — `:root, [data-theme='baglio'] { … }` (and `[data-theme='oggi']`). Hex and derived mixes live only here. Shipping default is **baglio** (`data-theme` on `<html>` in `app.html`).
2. **Structure** — body wash, type defaults, `.btn`, `.section`, `.eyebrow`, `.band-dark`, motion. These consume `var(--*)` only; they do not hardcode brand colors.

To experiment: add another `[data-theme='name']` block and list the id in `SITE_THEMES`. Prefer leaving fonts and `--radius` alone until a palette is chosen. Pick themes from the temporary native `<select>` in the header (persists in `sessionStorage`); remove that control when probes are done.

## Baked assumptions (keep clear)

Structure may darken with `color-mix(…, var(--ink))` — not bare `black` / `#000`. Video letterbox uses `--void`. Leaflet zoom/attribution in `ArriveMap` uses theme tokens. Favicon and `<meta name="theme-color">` stay baglio-static (not rewritten on toggle).

## Character (baglio)

Warm paper ground, deep teal action, olive meta accents, Fraunces display + Figtree body, sharp corners (`--radius: 2px`), photographic full-bleed heroes. Sicilian estate / hospitality — editorial and quiet, not dashboard-y. Do not restyle toward purple gradients, generic cream/terracotta “AI hospitality,” or broadsheet newspaper looks.

**`oggi`** is an anti-brochure probe: cooler flat neutrals, charcoal `--sea`, teal accent, and `--font-display` locked to Figtree — tests how much of the “estate brochure” reading is type/palette vs layout and photos.

## Triad contract (not optional)

Structure CSS assumes luminance roles, not just token names:

- `--paper` / `--surface` stay **light** grounds
- `--sea` / `--sea-deep` stay **deep** action / bands
- `--olive` stays a **mid** accent on paper
- `--ink` stays near-black text on paper

Palette experiments may change hue freely inside that relationship. Inverting light/dark via tokens alone (dark paper, light sea) is out of contract — that needs new structure, not a `[data-theme]` block.

## Palette roles

| Token | Role |
|---|---|
| `--ink` / `--ink-soft` / `--muted` | Primary text, leads, secondary meta |
| `--paper` | Page ground (body also adds soft sea/olive radials) |
| `--paper-deep` | Recessed / loading wells (e.g. map frame) |
| `--surface` | Raised interactive tiles on paper (cards, form fields) |
| `--sea` / `--sea-deep` | Brand action, CTAs, dark bands, cinema |
| `--on-sea` | Text and icons on sea / sea-deep / dark bands |
| `--olive` | Eyebrows, quiet emphasis |
| `--void` | Media letterbox / true-black wells |
| `--line` | Hairline borders |
| `--wash` | Soft paper overlay on media (controls, map credit) |
| `--error` | Form errors only |
| `--shadow` / `--ease` | Hover lift and shared motion curve |

Do not invent new hex accents outside a `[data-theme]` value block.

## Type

- **Display:** `--font-display` (Fraunces on baglio) on `h1`–`h3`, brand, section titles. Weight ~500, tight tracking.
- **Body / UI:** `--font-body` (Figtree); base ~1.0625rem / 1.65.
- **Eyebrow:** `.eyebrow` — uppercase, wide tracking, `--olive` on paper; washed `--on-sea` on dark bands.
- Page H1s use local `clamp(...)`; section H2s follow `.section-head` in `app.css`. Prefer those recipes over inventing a parallel scale.

## Surfaces

| Surface | When |
|---|---|
| Paper page | Default content |
| `.band-dark` | Full-width sea-deep band (landing amenities / awards) |
| `--surface` + `--line` | Interactive tiles and form controls only |
| `--wash` | Soft overlays on maps/galleries |
| Full-bleed media + type | Heroes, place grids — not cards |

**Cards are not the default.** Use bordered/raised tiles only when the box is the interaction (house picker, form). Editorial sections stay open on paper.

**Shape:** `--radius: 2px` everywhere for content chrome. Pills (`999px`) only for media controls (carousel / video).

## Motion

Shared keyframes in `app.css`: `fade-up`, `hero-zoom`, `soft-fade`. Scroll reveals via `Reveal`. Respect `prefers-reduced-motion`. Do not add a second motion language.

## Code map

| Concern | Where |
|---|---|
| Theme values + structure | `src/app.css` |
| Theme ids / toggle / storage | `src/lib/standard/theme.ts` |
| Default `data-theme` + early restore | `src/app.html` |
| Temporary theme `<select>` | `Header.svelte` (`.theme-pick`) |
| Sticky chrome | `Header.svelte`, `Footer.svelte` |
| Largest cinematic surface | `src/routes/(site)/+page.svelte` |
| House pages | `src/routes/(site)/case/[slug]/+page.svelte` |

Agent edit constraints: `.cursor/rules/theme.mdc`.
