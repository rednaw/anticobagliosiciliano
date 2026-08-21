/** Play overlay: reduced motion, clip finished, or play() was blocked. */
export function showAmbientControl({
  playing,
  reduceMotion,
  ended,
  playBlocked
}: {
  playing: boolean;
  reduceMotion: boolean;
  ended: boolean;
  playBlocked: boolean;
}): boolean {
  return !playing && (reduceMotion || ended || playBlocked);
}
