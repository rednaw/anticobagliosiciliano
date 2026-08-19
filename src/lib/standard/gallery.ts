import type { Locale } from '$lib/locale';

/** Wrap a carousel index. Empty galleries have no valid index. */
export function wrapIndex(next: number, count: number): number | null {
	if (count === 0) return null;
	return ((next % count) + count) % count;
}

export function indexAfterKey(key: string, index: number, count: number): number | null {
	if (count === 0) return null;
	switch (key) {
		case 'ArrowLeft':
			return wrapIndex(index - 1, count);
		case 'ArrowRight':
			return wrapIndex(index + 1, count);
		case 'Home':
			return 0;
		case 'End':
			return count - 1;
		default:
			return null;
	}
}

export function photoAlt(alt: string, index: number, count: number, locale: Locale): string {
	return locale === 'it'
		? `${alt} — foto ${index + 1} di ${count}`
		: `${alt} — photo ${index + 1} of ${count}`;
}
