import { stripBase, type Locale } from '$lib/locale';
import { SITE_BASE, SITE_ORIGIN } from '$lib/site-config';

export type { Locale } from '$lib/locale';
export { pick, localize, splitParagraphs } from '$lib/locale';
export { stripBase };

/** App path (no base). `subpath` e.g. `imperdibili`, `case/casa-1`, or ``. */
export function standardHref(locale: Locale, subpath = ''): string {
  const clean = subpath.replace(/^\/+|\/+$/g, '');
  if (locale === 'en') return clean ? `/en/${clean}/` : '/en/';
  return clean ? `/${clean}/` : '/';
}

/** Prefix with SvelteKit `base` (GitHub Pages project path). */
export function withBase(pathname: string, base = SITE_BASE): string {
  if (!base || base === '/') return pathname;
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  if (pathname === b || pathname.startsWith(`${b}/`)) return pathname;
  return `${b}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

/** Locale path with the GitHub Pages `base` prefix. */
export function siteHref(locale: Locale, subpath = '', base = SITE_BASE): string {
  return withBase(standardHref(locale, subpath), base);
}

/** Whether a header nav item matches the current path. `#houses` is never current. */
export function navLinkActive(
  pathname: string,
  locale: Locale,
  subpath: string,
  hash = '',
  base = SITE_BASE
): boolean {
  const path = stripBase(pathname, base).replace(/\/$/, '') || '/';
  const target = standardHref(locale, subpath).replace(/\/$/, '') || '/';
  if (hash === '#houses') return false;
  if (!subpath) return path === target;
  return path === target || path.startsWith(`${target}/`);
}

/** Query on `/contatti/` so the mailto names the house the guest was viewing. */
export const CONTACT_HOUSE_PARAM = 'casa';

/** House slug from `/case/casa-1/` or `/en/case/casa-1/`, if present. */
export function houseSlugFromPath(pathname: string, base = SITE_BASE): string | undefined {
  const path = stripBase(pathname, base).replace(/\/+$/, '') || '/';
  const rest = path.replace(/^\/en(?=\/|$)/, '') || '/';
  return rest.match(/^\/case\/([^/]+)$/)?.[1];
}

/** Contact page, optionally pre-selecting a house. */
export function contactHref(locale: Locale, houseSlug?: string, base = SITE_BASE): string {
  const href = siteHref(locale, 'contatti', base);
  if (!houseSlug) return href;
  return `${href}?${CONTACT_HOUSE_PARAM}=${encodeURIComponent(houseSlug)}`;
}

/** Same page in the other locale. */
export function counterpartHref(pathname: string, target: Locale, base = SITE_BASE): string {
  const path = stripBase(pathname, base).replace(/\/+$/, '') || '/';
  const rest = path.replace(/^\/en(?=\/|$)/, '').replace(/^\//, '');
  return standardHref(target, rest);
}

/** Absolute URL for canonical / hreflang / Open Graph. Applies SITE_BASE. */
export function absoluteUrl(pathname: string, origin = SITE_ORIGIN): string {
  if (/^https?:\/\//.test(pathname)) return pathname;
  return new URL(withBase(pathname), `${origin.replace(/\/$/, '')}/`).href;
}
