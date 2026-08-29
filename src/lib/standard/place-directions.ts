export type LatLon = { lat: number; lon: number };

export type DirectionsEndpoint = LatLon & { label?: string };

export function googleDirectionsUrl(from: DirectionsEndpoint, to: DirectionsEndpoint): string {
  const params = new URLSearchParams({
    api: '1',
    travelmode: 'driving',
    origin: from.label ?? `${from.lat},${from.lon}`,
    destination: to.label ?? `${to.lat},${to.lon}`
  });
  return `https://www.google.com/maps/dir/?${params}`;
}

/** Turn-by-turn directions on openstreetmap.org (car, OSRM). */
export function osmDirectionsUrl(from: LatLon, to: LatLon): string {
  const route = `${from.lat},${from.lon};${to.lat},${to.lon}`;
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${route}`;
}

export const placeDirectionApps = [
  { id: 'google', href: googleDirectionsUrl },
  { id: 'osm', href: osmDirectionsUrl }
] as const;
