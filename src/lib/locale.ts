import { SITE_BASE } from './site-config';

export type Locale = 'it' | 'en';

export type LocalizedString = { it: string; en: string };

export function pick(value: LocalizedString, locale: Locale): string {
  if (locale === 'en') {
    if (import.meta.env.DEV && !value.en) {
      console.warn('Missing English string:', value.it);
    }
    return value.en;
  }
  return value.it;
}

/** Blank line in a CMS/YAML textarea starts a new `<p>`. */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}

function isLocalizedString(value: unknown): value is LocalizedString {
  return (
    typeof value === 'object' &&
    value !== null &&
    'it' in value &&
    typeof (value as LocalizedString).it === 'string'
  );
}

/** Walk a tree of `LocalizedString` leaves and pick the active locale. */
export function localize<T>(value: T, locale: Locale): Localized<T> {
  if (isLocalizedString(value)) return pick(value, locale) as Localized<T>;
  if (Array.isArray(value)) {
    return value.map((item) => localize(item, locale)) as Localized<T>;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      out[key] = localize(child, locale);
    }
    return out as Localized<T>;
  }
  return value as Localized<T>;
}

type Localized<T> = T extends LocalizedString
  ? string
  : T extends Array<infer U>
    ? Localized<U>[]
    : T extends object
      ? { [K in keyof T]: Localized<T[K]> }
      : T;

/** Drop the SvelteKit `base` prefix (GitHub Pages). */
export function stripBase(pathname: string, base = SITE_BASE): string {
  if (base && (pathname === base || pathname.startsWith(`${base}/`))) {
    return pathname.slice(base.length) || '/';
  }
  return pathname;
}

export function localeFromPath(pathname: string, base = SITE_BASE): Locale {
  return /^\/en(\/|$)/.test(stripBase(pathname, base)) ? 'en' : 'it';
}
