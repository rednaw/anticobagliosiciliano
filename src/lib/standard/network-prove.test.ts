import { describe, expect, it, vi } from 'vitest';
import { proveFullMedia } from './network-prove';

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

  it('returns false when the body arrives after maxMs', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(new Blob(['ok']), { status: 200 }))
    );
    let calls = 0;
    const now = () => (calls++ === 0 ? 0 : 900);
    await expect(proveFullMedia('/probe', 800, now)).resolves.toBe(false);
    vi.unstubAllGlobals();
  });

  it('returns false when fetch is aborted by the timeout timer', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn((_url, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('The operation was aborted.', 'AbortError'));
          });
        });
      })
    );

    const pending = proveFullMedia('/probe', 50);
    await vi.advanceTimersByTimeAsync(51);
    await expect(pending).resolves.toBe(false);

    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
});
