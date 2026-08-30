import type { Locale } from '$lib/locale';

export type LatLon = { lat: number; lon: number };

export type DirectionsEndpoint = LatLon & { label?: string };

export function googleDirectionsUrl(
  from: DirectionsEndpoint,
  to: DirectionsEndpoint,
  locale: Locale
): string {
  const params = new URLSearchParams({
    api: '1',
    travelmode: 'driving',
    origin: from.label ?? `${from.lat},${from.lon}`,
    destination: to.label ?? `${to.lat},${to.lon}`,
    hl: locale
  });
  return `https://www.google.com/maps/dir/?${params}`;
}

/** Append Google Maps UI language (`hl`) to a click-out link (e.g. business listing). */
export function googleMapsLinkWithLocale(href: string, locale: Locale): string {
  const url = new URL(href);
  url.searchParams.set('hl', locale);
  return url.toString();
}

/** Turn-by-turn directions on openstreetmap.org (car, OSRM). */
export function osmDirectionsUrl(from: LatLon, to: LatLon): string {
  const route = `${from.lat},${from.lon};${to.lat},${to.lon}`;
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${route}`;
}

export function placeDirectionApps(locale: Locale) {
  return [
    {
      id: 'google',
      href: (from: DirectionsEndpoint, to: DirectionsEndpoint) =>
        googleDirectionsUrl(from, to, locale)
    },
    { id: 'osm', href: osmDirectionsUrl }
  ] as const;
}
