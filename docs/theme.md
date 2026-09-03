# Site theme

Marketing site visual system for Antico Baglio Siciliano. Tokens live in `src/app.css`. Archive (`archive/`) is a separate product and is out of scope.

## Character

Warm paper ground, deep teal action, olive meta accents, Fraunces display + Figtree body, sharp corners (`--radius: 2px`), photographic full-bleed heroes. Sicilian estate / hospitality — editorial and quiet, not dashboard-y. Do not restyle toward purple gradients, generic cream/terracotta “AI hospitality,” or broadsheet newspaper looks.

## Palette

| Token | Role |
|---|---|
| `--ink` / `--ink-soft` / `--muted` | Primary text, leads, secondary meta |
| `--paper` | Page ground (body also adds soft sea/olive radials) |
| `--paper-deep` | Recessed / loading wells (e.g. map frame) |
| `--surface` | Raised interactive tiles on paper (cards, form fields) |
| `--sea` / `--sea-deep` | Brand action, CTAs, dark bands, cinema |
| `--on-sea` | Text and icons on sea / sea-deep / dark bands |
| `--olive` | Eyebrows, quiet emphasis |
| `--line` | Hairline borders |
| `--wash` | Soft paper overlay on media (controls, map credit) |
| `--error` | Form errors only |
| `--shadow` / `--ease` | Hover lift and shared motion curve |

Do not invent new hex accents (Leaflet map-control blues, favicon gold, etc.) for site chrome. Leaflet’s own controls may keep library defaults; our overlays use theme tokens.

## Type

- **Display:** `--font-display` (Fraunces) on `h1`–`h3`, brand, section titles. Weight ~500, tight tracking.
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
| Tokens, body wash, `.btn`, `.section`, `.eyebrow`, `.band-dark` | `src/app.css` |
| Sticky chrome | `Header.svelte`, `Footer.svelte` |
| Largest cinematic surface | `src/routes/(site)/+page.svelte` |
| House pages | `src/routes/(site)/case/[slug]/+page.svelte` |

Agent edit constraints: `.cursor/rules/theme.mdc`.
