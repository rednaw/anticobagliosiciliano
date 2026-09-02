import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  abortVideoLoad,
  hasBufferProgress,
  hasMinimumBuffer,
  homeCinemaSession,
  MIN_BUFFER_AHEAD_S,
  parkVideoAtEnd,
  showAmbientControl
} from './ambient-video';
import { isSlowNetwork } from './network-quality';
import { proveFullMedia } from './network-prove';
import { getMediaTier, markFull, markLight, mediaTier, resetMediaTier } from './network-tier';

describe('showAmbientControl', () => {
  const idle = { playing: false, reduceMotion: false, ended: false, playBlocked: false };

  it('hides while the video is playing', () => {
    expect(showAmbientControl({ ...idle, playing: true })).toBe(false);
    expect(
      showAmbientControl({ playing: true, reduceMotion: true, ended: true, playBlocked: true })
    ).toBe(false);
  });

  it('hides when idle with nothing to recover from', () => {
    expect(showAmbientControl(idle)).toBe(false);
  });

  it('shows when autoplay or play() was blocked', () => {
    expect(showAmbientControl({ ...idle, playBlocked: true })).toBe(true);
  });

  it('shows for reduced motion and after the clip ends', () => {
    expect(showAmbientControl({ ...idle, reduceMotion: true })).toBe(true);
    expect(showAmbientControl({ ...idle, ended: true })).toBe(true);
  });

  it('shows when a play-once session was already spent', () => {
    expect(showAmbientControl({ ...idle, sessionSpent: true })).toBe(true);
  });
});

describe('homeCinemaSession', () => {
  afterEach(() => {
    homeCinemaSession.reset();
  });

  it('tracks started and finished phases', () => {
    expect(homeCinemaSession.spent()).toBe(false);
    expect(homeCinemaSession.finished()).toBe(false);

    homeCinemaSession.markStarted();
    expect(homeCinemaSession.spent()).toBe(true);
    expect(homeCinemaSession.finished()).toBe(false);

    homeCinemaSession.markFinished();
    expect(homeCinemaSession.spent()).toBe(true);
    expect(homeCinemaSession.finished()).toBe(true);
  });

  it('does not downgrade from finished to started', () => {
    homeCinemaSession.markFinished();
    homeCinemaSession.markStarted();
    expect(homeCinemaSession.finished()).toBe(true);
  });
});

describe('parkVideoAtEnd', () => {
  it('seeks near the end and pauses', () => {
    const video = {
      duration: 10,
      currentTime: 0,
      pause: () => {}
    } as HTMLVideoElement;

    let paused = false;
    video.pause = () => {
      paused = true;
    };

    parkVideoAtEnd(video);
    expect(video.currentTime).toBeCloseTo(9.95);
    expect(paused).toBe(true);
  });
});

describe('hasMinimumBuffer', () => {
  it('accepts HAVE_ENOUGH_DATA regardless of buffered ranges', () => {
    const video = {
      readyState: 4,
      currentTime: 0,
      buffered: { length: 0 }
    } as HTMLVideoElement;
    expect(hasMinimumBuffer(video)).toBe(true);
  });

  it('requires HAVE_FUTURE_DATA and enough ahead in buffered', () => {
    const video = {
      readyState: 3,
      currentTime: 0,
      buffered: {
        length: 1,
        start: () => 0,
        end: () => MIN_BUFFER_AHEAD_S
      }
    } as unknown as HTMLVideoElement;
    expect(hasMinimumBuffer(video)).toBe(true);
    expect(hasMinimumBuffer(video, MIN_BUFFER_AHEAD_S + 0.5)).toBe(false);
  });

  it('rejects below HAVE_FUTURE_DATA', () => {
    const video = {
      readyState: 2,
      currentTime: 0,
      buffered: {
        length: 1,
        start: () => 0,
        end: () => 10
      }
    } as unknown as HTMLVideoElement;
    expect(hasMinimumBuffer(video)).toBe(false);
  });
});

describe('hasBufferProgress', () => {
  it('is true when a buffered range extends past currentTime', () => {
    const video = {
      currentTime: 0,
      buffered: {
        length: 1,
        start: () => 0,
        end: () => 0.5
      }
    } as unknown as HTMLVideoElement;
    expect(hasBufferProgress(video)).toBe(true);
  });

  it('is false when nothing is buffered past currentTime', () => {
    const video = {
      currentTime: 0,
      buffered: { length: 0 }
    } as HTMLVideoElement;
    expect(hasBufferProgress(video)).toBe(false);
  });
});

describe('abortVideoLoad', () => {
  it('clears src, removes children, and calls load', () => {
    const child = { nodeType: 1 } as ChildNode;
    let first: ChildNode | null = child;
    const video = {
      src: 'x.mp4',
      get firstChild() {
        return first;
      },
      removeAttribute: vi.fn(),
      removeChild: vi.fn(() => {
        first = null;
        return child;
      }),
      load: vi.fn()
    } as unknown as HTMLVideoElement;

    abortVideoLoad(video);
    expect(video.removeAttribute).toHaveBeenCalledWith('src');
    expect(video.src).toBe('');
    expect(video.removeChild).toHaveBeenCalled();
    expect(video.load).toHaveBeenCalled();
  });
});

describe('isSlowNetwork', () => {
  it('treats saveData and slow effectiveTypes as slow', () => {
    expect(isSlowNetwork({ saveData: true })).toBe(true);
    expect(isSlowNetwork({ effectiveType: '3g' })).toBe(true);
    expect(isSlowNetwork({ effectiveType: '4g' })).toBe(false);
    expect(isSlowNetwork(undefined)).toBe(false);
  });
});

describe('mediaTier', () => {
  afterEach(() => {
    resetMediaTier();
  });

  it('starts light and markFull upgrades until markLight locks', () => {
    expect(getMediaTier()).toBe('light');
    markFull();
    expect(getMediaTier()).toBe('full');
    markLight();
    expect(getMediaTier()).toBe('light');
    markFull();
    expect(getMediaTier()).toBe('light');
  });

  it('notifies subscribers on markLight', () => {
    markFull();
    let seen = '';
    const unsub = mediaTier.subscribe((t) => {
      seen = t;
    });
    markLight();
    expect(seen).toBe('light');
    unsub();
  });
});

describe('proveFullMedia', () => {
  it('returns true when the probe finishes in time', async () => {
    const blob = new Blob(['ok']);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(blob, { status: 200 }))
    );
    let t = 0;
    await expect(proveFullMedia('/probe', 800, () => ((t += 100), t))).resolves.toBe(true);
    vi.unstubAllGlobals();
  });

  it('returns false when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      })
    );
    await expect(proveFullMedia('/probe', 800)).resolves.toBe(false);
    vi.unstubAllGlobals();
  });
});
