/** Shared with portone hero CSS (`max-aspect-ratio: 7 / 10`). */
export const PORTRAIT_ASPECT_QUERY = '(max-aspect-ratio: 7 / 10)';

export const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Subscribe to a media query; runs `onMatch` immediately and on change. */
export function subscribeMediaQuery(
  query: string,
  onMatch: (matches: boolean) => void
): () => void {
  const mq = window.matchMedia(query);
  onMatch(mq.matches);
  const onChange = () => onMatch(mq.matches);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
