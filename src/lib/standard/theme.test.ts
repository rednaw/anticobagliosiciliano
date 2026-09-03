import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_SITE_THEME,
  SITE_THEME_STORAGE_KEY,
  SITE_THEMES,
  applySiteTheme,
  initSiteTheme,
  isSiteTheme,
  toggleSiteTheme
} from './theme';

describe('isSiteTheme', () => {
  it('accepts known ids only', () => {
    expect(isSiteTheme('baglio')).toBe(true);
    expect(isSiteTheme('oggi')).toBe(true);
    expect(isSiteTheme('sera')).toBe(false);
    expect(isSiteTheme(null)).toBe(false);
  });
});

describe('applySiteTheme', () => {
  it('sets data-theme and persists', () => {
    const root = { setAttribute: vi.fn() } as unknown as HTMLElement;
    const setItem = vi.fn();
    expect(applySiteTheme('oggi', { root, storage: { setItem } })).toBe('oggi');
    expect(root.setAttribute).toHaveBeenCalledWith('data-theme', 'oggi');
    expect(setItem).toHaveBeenCalledWith(SITE_THEME_STORAGE_KEY, 'oggi');
  });
});

describe('toggleSiteTheme', () => {
  it('flips between SITE_THEMES and wraps', () => {
    const root = { setAttribute: vi.fn() } as unknown as HTMLElement;
    const storage = { setItem: vi.fn() };
    expect(toggleSiteTheme('baglio', { root, storage })).toBe('oggi');
    expect(toggleSiteTheme('oggi', { root, storage })).toBe('baglio');
    expect(toggleSiteTheme('nope', { root, storage })).toBe(SITE_THEMES[0]);
  });
});

describe('initSiteTheme', () => {
  it('prefers storage over the current attribute', () => {
    const root = {
      getAttribute: () => 'baglio',
      setAttribute: vi.fn()
    } as unknown as HTMLElement;
    const storage = {
      getItem: () => 'oggi',
      setItem: vi.fn()
    };
    expect(initSiteTheme({ root, storage })).toBe('oggi');
    expect(root.setAttribute).toHaveBeenCalledWith('data-theme', 'oggi');
  });

  it('falls back to attribute then default', () => {
    const root = {
      getAttribute: () => null,
      setAttribute: vi.fn()
    } as unknown as HTMLElement;
    const storage = { getItem: () => null, setItem: vi.fn() };
    expect(initSiteTheme({ root, storage })).toBe(DEFAULT_SITE_THEME);
  });
});
