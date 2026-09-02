/**
 * Tiny fetch used to upgrade media tier from light → full when the Network
 * Information API is missing or optimistic (e.g. DevTools throttle).
 */
export const PROVE_FULL_MAX_MS = 800;

/** Cache-busted GET; true when the body arrives within `maxMs`. */
export async function proveFullMedia(
  probeUrl: string,
  maxMs = PROVE_FULL_MAX_MS,
  now: () => number = () => performance.now()
): Promise<boolean> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), maxMs);
  try {
    const t0 = now();
    const sep = probeUrl.includes('?') ? '&' : '?';
    const res = await fetch(`${probeUrl}${sep}media-prove=${t0}`, {
      cache: 'no-store',
      credentials: 'same-origin',
      signal: ctrl.signal
    });
    if (!res.ok) return false;
    await res.arrayBuffer();
    return now() - t0 <= maxMs;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
