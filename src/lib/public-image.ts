import { asset } from '$app/paths';

/**
 * In production the build emits WebP into `static/` before prerender, then
 * drops JPEG/PNG from `build/`. Dev keeps the committed originals.
 */
export function publicImage(path: string, prod = import.meta.env.PROD): string {
  if (!prod) return path;
  return path.replace(/\.(jpe?g|png)$/i, '.webp');
}

export function imageAsset(path: string): string {
  return asset(publicImage(path));
}
