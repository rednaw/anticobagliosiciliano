import { asset } from '$app/paths';

/** Share cards stay JPEG — some chat crawlers are still picky about WebP. */
const KEEP_JPEG = /(?:^|\/)og-share\.jpe?g$/i;

/**
 * In production the build emits WebP into `static/` before prerender, then
 * drops JPEG/PNG from `build/`. Dev keeps the committed originals.
 */
export function publicImage(path: string): string {
	if (!import.meta.env.PROD) return path;
	if (KEEP_JPEG.test(path)) return path;
	return path.replace(/\.(jpe?g|png)$/i, '.webp');
}

export function imageAsset(path: string): string {
	return asset(publicImage(path));
}
