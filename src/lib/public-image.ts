import { asset } from '$app/paths';
import type { MediaTier } from '$lib/standard/network-tier';
import { getMediaTier } from '$lib/standard/network-tier';

/**
 * In production the build emits WebP into `static/` before prerender, then
 * drops JPEG/PNG from `build/`. Dev keeps the committed originals.
 * SEO / OG / JSON-LD always use full tier (default).
 */
export function publicImage(
  path: string,
  prod = import.meta.env.PROD,
  tier: MediaTier = 'full'
): string {
  if (!prod) return path;
  if (tier === 'light') {
    return path.replace(/\.(jpe?g|png)$/i, '-light.webp');
  }
  return path.replace(/\.(jpe?g|png)$/i, '.webp');
}

/** Production full-tier WebP (or committed original in dev). Prefer `responsiveImage` in page markup. */
export function imageAsset(path: string): string {
  return asset(publicImage(path));
}

/**
 * Page images: prod full → `.webp`, light → `-light.webp`.
 * Pass `{ tier: $mediaTier }` so URLs update when the session downgrades.
 * Dev always returns the committed JPEG/PNG.
 */
export function responsiveImage(path: string, opts?: { tier?: MediaTier }): string {
  const tier = opts?.tier ?? getMediaTier();
  return asset(publicImage(path, import.meta.env.PROD, tier));
}
