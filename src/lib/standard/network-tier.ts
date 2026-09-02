import { asset } from '$app/paths';
import { get, writable } from 'svelte/store';
import { getNetworkInformation, isSlowNetwork } from './network-quality';
import { proveFullMedia } from './network-prove';

export type MediaTier = 'full' | 'light';

const STORAGE_KEY = 'media-tier';

/** Committed JPEG; prod probe uses the light WebP sibling (small, always emitted). */
const PROBE_SOURCE = '/images/ambiance/mappa.jpg';

function probeUrl(): string {
  if (import.meta.env.PROD) {
    return asset(PROBE_SOURCE.replace(/\.jpg$/i, '-light.webp'));
  }
  return asset(PROBE_SOURCE);
}

function readStored(): MediaTier | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    if (value === 'light' || value === 'full') return value;
    return null;
  } catch {
    return null;
  }
}

function writeStored(tier: MediaTier): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, tier);
  } catch {
    /* private mode / quota */
  }
}

/**
 * Session media tier — pessimistic until proven.
 * Default / unknown is `light`. `markFull` upgrades; `markLight` locks for the session.
 */
export const mediaTier = writable<MediaTier>('light');

let lockedLight = false;
let initStarted = false;

export function getMediaTier(): MediaTier {
  return get(mediaTier);
}

/** Downgrade to light and lock — no upgrade for the rest of the session. */
export function markLight(): void {
  lockedLight = true;
  if (get(mediaTier) === 'light') {
    writeStored('light');
    return;
  }
  mediaTier.set('light');
  writeStored('light');
}

/** Upgrade to full when not locked by a pessimistic signal. */
export function markFull(): void {
  if (lockedLight) return;
  if (get(mediaTier) === 'full') {
    writeStored('full');
    return;
  }
  mediaTier.set('full');
  writeStored('full');
}

/**
 * Hydrate from sessionStorage, Network Information API, then a throughput prove.
 * Call once on the client (e.g. site layout mount).
 */
export async function initMediaTier(): Promise<void> {
  if (initStarted) return;
  initStarted = true;

  const stored = readStored();
  if (stored === 'light') {
    lockedLight = true;
    mediaTier.set('light');
    return;
  }
  if (stored === 'full') {
    mediaTier.set('full');
    return;
  }

  // Unknown session: stay light until proven.
  mediaTier.set('light');

  if (isSlowNetwork(getNetworkInformation())) {
    markLight();
    return;
  }

  if (await proveFullMedia(probeUrl())) markFull();
  else markLight();
}

/** @internal Vitest helper */
export function resetMediaTier(): void {
  lockedLight = false;
  initStarted = false;
  mediaTier.set('light');
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
