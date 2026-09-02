---
name: Weather at the baglio
status: pending
saved: 2026-09-02
overview: Client-direct Open-Meteo current conditions for baglioLocation, soft-fail, full-tier only like Leaflet. No snapshot, no API key. Place a compact reading on Come arrivare next to the map.
todos:
  - id: decide-surface
    content: Confirm UI is a chip/reading on /come-arrivare/ (not homepage, not a second map stack)
    status: pending
  - id: fetch-module
    content: Open-Meteo client module — baglio lat/lon, timeout, parse current temp + WMO code; fixture tests; never throw into the page
    status: pending
  - id: ui
    content: Bilingual weather chip on Come arrivare; hide entirely on light tier / reduceMotion-irrelevant / fetch fail
    status: pending
  - id: csp-privacy
    content: Allow api.open-meteo.com in connect-src; one privacy sentence; assert-build CSP check
    status: pending
  - id: docs
    content: Ship docs/weather.md + thin .cursor/rules/weather.mdc; link from static-boundaries as in-use
    status: pending
---

# Weather at the baglio

Client-direct third party. Prefer **client compute over a weather snapshot** — conditions are visitor-timed and cheap to fetch once per page view; a committed JSON would go stale for no gain.

Escape hatch: browser → Open-Meteo → chip. Origin stays static. No key, no Action, no `occupancy.json`-style commit.

Grounding: [`.cursor/ideas/static-boundaries.md`](../ideas/static-boundaries.md) (client-direct third parties); coords in `baglioLocation` (`src/lib/data/content.ts`); CSP in `vite.config.ts`; tier rules in [docs/network-tier.md](../../docs/network-tier.md).

## Decisions

| Choice | Value |
|---|---|
| Provider | Open-Meteo forecast API (`api.open-meteo.com`), current weather only for v1 |
| Coords | `baglioLocation.lat` / `lon` (courtyard pin) — not `directionsOrigin` |
| Hatch | Client fetch — **not** a scheduled snapshot |
| Tier | Fetch and show only when network tier is `full` (same family as Leaflet). Light = no request, no UI |
| Failure | Soft-fail: timeout / HTTP / parse / CSP → render nothing. Never block Come arrivare, never call `markLight()` |
| Surface | Compact chip on `/come-arrivare/` (and `/en/come-arrivare/`) near the map — temperature + short condition label. No weather-radar tiles, no second map library |
| Icons | Optional inline SVG or CSS for a small set of WMO buckets; no third-party icon CDN |
| Copy | IT/EN labels for buckets; liveCopy / content seed like other UI strings |
| Privacy | One sentence: we request a forecast for the baglio’s public coordinates; no cookies from that call |

Out of scope for this plan: homepage hero weather, multi-day forecast UI, radar, OpenWeatherMap (key), snapshotting weather into git.

## API shape (implementer)

Approximate request (confirm fields against current Open-Meteo docs when coding):

```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}&longitude={lon}
  &current=temperature_2m,weather_code
  &timezone=Europe/Rome
```

- `AbortSignal` timeout (~3–4s). One request per mount of the chip; no polling.
- Map `weather_code` → a few bilingual buckets (clear / cloudy / rain / storm / fog / snow) — do not expose raw WMO integers in the UI.
- Unit: °C (site audience and locale).

## CSP / assert-build

Today `connect-src` is `self` + Simple Analytics origins only. Add `https://api.open-meteo.com`. Extend `tests/assert-build.mjs` so the prerendered CSP meta includes it (same pattern as SA / OSM checks).

## Module layout (proposed)

| Piece | Where |
|---|---|
| Fetch + parse + code→bucket | `src/lib/standard/weather.ts` (+ `.test.ts` with fixtures, no live network in CI) |
| Chip UI | `src/lib/standard/WeatherChip.svelte` (or similar) |
| Mount | `come-arrivare/+page.svelte` next to `ArriveMap` |
| Privacy blurb | `privacy` copy in `content.ts` + privacy page |

Do not put Open-Meteo URLs in prerendered HTML as required resources — the chip hydrates client-side only.

## Resilience checklist

- Light tier: no `fetch`, no empty chrome.
- Full tier + fail: invisible chip; map and directions copy unchanged.
- Reduced motion: still show the chip if full (static text/number — not motion-dependent).
- Network tier prove must not wait on weather; weather waits on tier (or no-ops on light).

## Done when

- Come arrivare (IT + EN) shows current temp + condition on full tier when Open-Meteo answers.
- Light tier and failures leave the page looking as today.
- CSP + privacy + unit tests + assert-build updated.
- `docs/weather.md` + rule exist; ideas doc can mark weather as in-use under client-direct third parties.
