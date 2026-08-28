import { describe, expect, it } from 'vitest';
import { baglioLocation } from '$lib/data/content';
import { ARRIVE_MAP } from './arrive-map';

function inBounds(lat: number, lon: number) {
  const [[south, west], [north, east]] = ARRIVE_MAP.bounds;
  return lat >= south && lat <= north && lon >= west && lon <= east;
}

describe('arrive map', () => {
  it('opens on the baglio and can show the whole island', () => {
    expect(ARRIVE_MAP.zoom).toBe(12);
    expect(ARRIVE_MAP.minZoom).toBe(8);
    expect(ARRIVE_MAP.maxZoom).toBeGreaterThan(ARRIVE_MAP.zoom);
    expect(inBounds(baglioLocation.lat, baglioLocation.lon)).toBe(true);
    expect(inBounds(37.075, 15.287)).toBe(true);
    expect(inBounds(36.68, 15.13)).toBe(true);
    expect(inBounds(41.9, 12.5)).toBe(false);
  });
});
