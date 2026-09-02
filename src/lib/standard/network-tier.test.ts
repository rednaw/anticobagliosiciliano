import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
  asset: (path: string) => `/base${path}`
}));

const proveFullMedia = vi.fn<typeof import('./network-prove').proveFullMedia>();
vi.mock('./network-prove', () => ({
  proveFullMedia: (...args: Parameters<typeof proveFullMedia>) => proveFullMedia(...args)
}));

const getNetworkInformation = vi.fn<typeof import('./network-quality').getNetworkInformation>();
const isSlowNetwork = vi.fn<typeof import('./network-quality').isSlowNetwork>();
vi.mock('./network-quality', () => ({
  getNetworkInformation: (...args: Parameters<typeof getNetworkInformation>) =>
    getNetworkInformation(...args),
  isSlowNetwork: (...args: Parameters<typeof isSlowNetwork>) => isSlowNetwork(...args)
}));

import { getMediaTier, initMediaTier, markFull, resetMediaTier } from './network-tier';

describe('initMediaTier', () => {
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      }
    });
    proveFullMedia.mockReset();
    getNetworkInformation.mockReturnValue(undefined);
    isSlowNetwork.mockReturnValue(false);
    resetMediaTier();
  });

  afterEach(() => {
    resetMediaTier();
    vi.unstubAllGlobals();
  });

  it('hydrates a stored light tier and skips prove', async () => {
    storage['media-tier'] = 'light';

    await initMediaTier();

    expect(getMediaTier()).toBe('light');
    expect(isSlowNetwork).not.toHaveBeenCalled();
    expect(proveFullMedia).not.toHaveBeenCalled();
    markFull();
    expect(getMediaTier()).toBe('light');
  });

  it('hydrates a stored full tier and skips prove', async () => {
    storage['media-tier'] = 'full';

    await initMediaTier();

    expect(getMediaTier()).toBe('full');
    expect(proveFullMedia).not.toHaveBeenCalled();
  });

  it('locks light when the Network Information API reports slow', async () => {
    isSlowNetwork.mockReturnValue(true);

    await initMediaTier();

    expect(getMediaTier()).toBe('light');
    expect(isSlowNetwork).toHaveBeenCalled();
    expect(proveFullMedia).not.toHaveBeenCalled();
    expect(storage['media-tier']).toBe('light');
    markFull();
    expect(getMediaTier()).toBe('light');
  });

  it('upgrades to full when prove succeeds', async () => {
    proveFullMedia.mockResolvedValue(true);

    await initMediaTier();

    expect(getMediaTier()).toBe('full');
    expect(proveFullMedia).toHaveBeenCalledWith('/base/images/ambiance/mappa.jpg');
    expect(storage['media-tier']).toBe('full');
  });

  it('locks light when prove fails or times out', async () => {
    proveFullMedia.mockResolvedValue(false);

    await initMediaTier();

    expect(getMediaTier()).toBe('light');
    expect(storage['media-tier']).toBe('light');
    markFull();
    expect(getMediaTier()).toBe('light');
  });

  it('runs only once per session', async () => {
    proveFullMedia.mockResolvedValue(true);

    await initMediaTier();
    await initMediaTier();

    expect(proveFullMedia).toHaveBeenCalledTimes(1);
  });
});
