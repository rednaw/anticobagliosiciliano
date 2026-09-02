# Weather (Come arrivare)

Current conditions at the baglio via a client-direct Open-Meteo fetch. The origin stays static: no API key, no scheduled snapshot, no weather in git.

## Design

- **Client compute, not a snapshot.** Conditions are visitor-timed; one GET per chip mount is cheaper than committing stale JSON.
- **Full tier only.** Same family as Leaflet on Come arrivare. Light tier: no request, no UI.
- **Soft-fail.** Timeout / HTTP / parse / CSP → render nothing. Never block the page; never call `markLight()`.
- **Coords:** `baglioLocation.lat` / `lon` (courtyard pin).
- **Surface:** two-line chip top-center with a Meteocons monochrome icon (Meteo attuale/Current weather, then temp · condition); Open-Meteo CC BY credit as its own bottom-left pill (OSM stays bottom-right). Soft-fail → no chip/credit. No radar, no second map stack.
- **Icons:** vendored MIT Meteocons monochrome (`static/images/weather/`); bucket → stem via `weatherIconStem` (`clear` uses day/night from Open-Meteo `is_day`). Painted with `currentColor` via CSS mask (Meteocons’ recommended theming path).

## Pipeline

```text
Come arrivare (full tier) → fetch Open-Meteo → parse → WeatherChip
                         ↘ light / fail → nothing
```

## Code map

| Concern | Where |
|---|---|
| Fetch / parse / WMO buckets | `src/lib/standard/weather.ts` |
| Meteocons monochrome SVGs | `static/images/weather/` |
| Chip UI | `src/lib/standard/WeatherChip.svelte` |
| Mount | `come-arrivare/+page.svelte` |
| Copy | `weatherCopy` in `content.ts` |
| Privacy | `privacyCopy.weather*` + privacy page |
| CSP `connect-src` | `vite.config.ts` → `https://api.open-meteo.com` |

Agent edit constraints: `.cursor/rules/weather.mdc`.
