/** Homepage cinema clip — survives SPA navigation, clears on full reload. */
const session = { phase: 'fresh' as 'fresh' | 'started' | 'finished' };

export const homeCinemaSession = {
  spent(): boolean {
    return session.phase !== 'fresh';
  },
  finished(): boolean {
    return session.phase === 'finished';
  },
  markStarted(): void {
    if (session.phase === 'fresh') session.phase = 'started';
  },
  markFinished(): void {
    session.phase = 'finished';
  },
  /** @internal Vitest helper */
  reset(): void {
    session.phase = 'fresh';
  }
};

/** Play overlay: reduced motion, clip finished, or play() was blocked. */
export function showAmbientControl({
  playing,
  reduceMotion,
  ended,
  playBlocked,
  sessionSpent = false
}: {
  playing: boolean;
  reduceMotion: boolean;
  ended: boolean;
  playBlocked: boolean;
  sessionSpent?: boolean;
}): boolean {
  return !playing && (reduceMotion || ended || playBlocked || sessionSpent);
}

/** Seek to the last frame and sync bindable ended/playing state. */
export function parkVideoAtEnd(video: HTMLVideoElement): void {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return;
  video.currentTime = Math.max(0, video.duration - 0.05);
  video.pause();
}

/** Minimum buffered lead before autoplay; prepare aborts after this window. */
export const MIN_BUFFER_AHEAD_S = 2;
export const AUTOPLAY_PREPARE_MS = 6_000;
/** Abort sooner when the media element has received no buffered media at all. */
export const AUTOPLAY_STALL_MS = 2_000;

/**
 * True when the element has enough data to start (`HAVE_ENOUGH_DATA`), or
 * `HAVE_FUTURE_DATA` with at least `minAhead` seconds ahead of `currentTime`.
 */
export function hasMinimumBuffer(
  video: HTMLVideoElement,
  minAhead = MIN_BUFFER_AHEAD_S
): boolean {
  // HAVE_ENOUGH_DATA = 4, HAVE_FUTURE_DATA = 3
  if (video.readyState >= 4) return true;
  if (video.readyState < 3) return false;

  const t = video.currentTime;
  const { buffered } = video;
  for (let i = 0; i < buffered.length; i += 1) {
    if (buffered.start(i) <= t && buffered.end(i) >= t + minAhead) return true;
  }
  return false;
}

/** True when any buffered range extends past `currentTime`. */
export function hasBufferProgress(video: HTMLVideoElement): boolean {
  const t = video.currentTime;
  const { buffered } = video;
  for (let i = 0; i < buffered.length; i += 1) {
    if (buffered.end(i) > t) return true;
  }
  return false;
}

/** Cancel an in-flight media fetch: drop sources/src and call `load()`. */
export function abortVideoLoad(video: HTMLVideoElement): void {
  video.removeAttribute('src');
  video.src = '';
  while (video.firstChild) {
    video.removeChild(video.firstChild);
  }
  video.load();
}
