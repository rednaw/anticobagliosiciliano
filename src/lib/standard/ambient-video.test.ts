import { afterEach, describe, expect, it } from 'vitest';
import { homeCinemaSession, parkVideoAtEnd, showAmbientControl } from './ambient-video';

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
