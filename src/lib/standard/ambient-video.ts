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
