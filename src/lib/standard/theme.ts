/** Site theme ids — values live in `src/app.css` `[data-theme]` blocks. */
export const SITE_THEMES = ['baglio', 'oggi'] as const;

export type SiteTheme = (typeof SITE_THEMES)[number];

export const DEFAULT_SITE_THEME: SiteTheme = 'baglio';

export const SITE_THEME_STORAGE_KEY = 'abs-theme';

export function isSiteTheme(value: unknown): value is SiteTheme {
  return typeof value === 'string' && (SITE_THEMES as readonly string[]).includes(value);
}

export function applySiteTheme(
  theme: SiteTheme,
  options: {
    root?: HTMLElement | null;
    storage?: Pick<Storage, 'setItem'> | null;
  } = {}
): SiteTheme {
  const root = options.root ?? (typeof document !== 'undefined' ? document.documentElement : null);
  root?.setAttribute('data-theme', theme);
  const storage = options.storage === undefined ? globalThis.sessionStorage : options.storage;
  if (storage) {
    try {
      storage.setItem(SITE_THEME_STORAGE_KEY, theme);
    } catch {
      /* private mode / quota — ignore */
    }
  }
  return theme;
}

/** Flip to the next theme in `SITE_THEMES` (wraps). */
export function toggleSiteTheme(
  current: string | null | undefined,
  options?: Parameters<typeof applySiteTheme>[1]
): SiteTheme {
  const idx = isSiteTheme(current) ? SITE_THEMES.indexOf(current) : -1;
  const next = SITE_THEMES[(idx + 1) % SITE_THEMES.length]!;
  return applySiteTheme(next, options);
}

/** Restore from sessionStorage, else the attribute on `<html>`, else default. */
export function initSiteTheme(
  options: {
    root?: HTMLElement | null;
    storage?: Pick<Storage, 'getItem' | 'setItem'> | null;
  } = {}
): SiteTheme {
  const root = options.root ?? (typeof document !== 'undefined' ? document.documentElement : null);
  const storage =
    options.storage === undefined
      ? (globalThis.sessionStorage as Pick<Storage, 'getItem' | 'setItem'> | undefined)
      : options.storage;
  let stored: string | null = null;
  if (storage) {
    try {
      stored = storage.getItem(SITE_THEME_STORAGE_KEY);
    } catch {
      stored = null;
    }
  }
  if (isSiteTheme(stored)) return applySiteTheme(stored, { root, storage });
  const attr = root?.getAttribute('data-theme');
  return applySiteTheme(isSiteTheme(attr) ? attr : DEFAULT_SITE_THEME, { root, storage });
}
