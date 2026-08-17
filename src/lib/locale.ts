export type Locale = 'it' | 'en';

export type LocalizedString = { it: string; en: string };
export type LocalizedStrings = { it: string[]; en: string[] };

export function pick(value: LocalizedString, locale: Locale): string {
	if (locale === 'en') {
		if (import.meta.env.DEV && !value.en) {
			console.warn('Missing English string:', value.it);
		}
		return value.en;
	}
	return value.it;
}

export function pickList(value: LocalizedStrings, locale: Locale): string[] {
	if (locale === 'en') {
		if (import.meta.env.DEV && !value.en?.length) {
			console.warn('Missing English list:', value.it);
		}
		return value.en;
	}
	return value.it;
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
	: T extends LocalizedStrings
		? string[]
		: T extends Array<infer U>
			? Localized<U>[]
			: T extends object
				? { [K in keyof T]: Localized<T[K]> }
				: T;

export function localeFromPath(pathname: string, base = ''): Locale {
	let path = pathname;
	if (base && path.startsWith(base)) path = path.slice(base.length) || '/';
	return /^\/en(\/|$)/.test(path) ? 'en' : 'it';
}
