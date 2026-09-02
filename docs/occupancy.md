# Occupancy

The marketing site stays fully static and mailto-only, while the contact calendar still respects real availability.

## Design

- **Snapshot, not booking.** A scheduled sync writes `src/lib/data/occupancy.json` (occupied night ranges only). No live Lodgify calls from the browser, no rates/quotes/booking API.
- **Privacy-first public JSON.** Guest names and booking payloads are stripped. Ids in `src/lib/data/lodgify.ts` are not secrets; `LODGIFY_API_KEY` never enters git.
- **Fail closed.** API errors leave the last good snapshot. Unchanged fingerprints do not commit or redeploy.
- **Contact UX matches the snapshot.** Occupied nights are disabled; checkout on an occupied morning stays allowed (`[checkIn, checkOut)`). With “nessuna preferenza”, a night blocks only when every house is occupied.

## Pipeline

```text
Lodgify calendar API → lodgify:sync → occupancy.json → CI / Pages → contact calendar → mailto
```

- Local: `LODGIFY_API_KEY=… npm run lodgify:sync`
- Schedule: `.github/workflows/lodgify-availability.yml` (twice daily + manual). On change: test, build, `assert-build`, deploy Pages. `GITHUB_TOKEN` commits do not retrigger `ci.yml`.

## Mapping

Property `129476`. Public houses only (Casa #5 and Tutte omitted):

| Site slug | Lodgify room | `room_type_id` |
|---|---|---|
| `casa-1` | Casa #1 | `150204` |
| `casa-2` | Casa #2 | `150205` |
| `casa-3` | Casa #3 | `159913` |
| `casa-4` | Casa #4 | `159914` |

Horizon: 18 months. Occupied periods merge; a single free night between bookings is filled (2+ night minimum).

## Code map

| Concern | Where |
|---|---|
| Property / room map, snapshot shape | `src/lib/data/lodgify.ts` |
| Committed snapshot | `src/lib/data/occupancy.json` |
| Form load / helpers | `src/lib/standard/occupancy.ts` |
| Calendar disable rules | `src/lib/standard/stay-dates.ts`, `StayDates.svelte` |
| Mailto body | `src/lib/standard/contact-mail.ts` |
| Sync script | `scripts/sync-lodgify-availability.mjs` |

Agent edit constraints: `.cursor/rules/occupancy.mdc`.
