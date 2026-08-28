/** Default view is the baglio; zoom/pan stay on the island. */
export const ARRIVE_MAP = {
  zoom: 12,
  minZoom: 8,
  maxZoom: 18,
  bounds: [
    [36.4, 11.8],
    [38.55, 15.9]
  ] as [[number, number], [number, number]]
};

/** Web Mercator Y in 0–1 world units (north is smaller). */
function latToWorldY(lat: number) {
  const r = (lat * Math.PI) / 180;
  return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2;
}

/**
 * Lowest zoom that still shows the whole island in a map of this CSS size.
 * Desktop stays at `ARRIVE_MAP.minZoom`; a phone can go lower.
 */
export function arriveMinZoomForView(width: number, height: number): number {
  if (width < 1 || height < 1) return ARRIVE_MAP.minZoom;
  const [[south, west], [north, east]] = ARRIVE_MAP.bounds;
  const spanX = (east - west) / 360;
  const spanY = latToWorldY(south) - latToWorldY(north);
  const zoomX = Math.log2(width / (256 * spanX));
  const zoomY = Math.log2(height / (256 * spanY));
  const fit = Math.floor(Math.min(zoomX, zoomY));
  return Math.min(ARRIVE_MAP.minZoom, Math.max(0, fit));
}
