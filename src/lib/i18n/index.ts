/** Locale helpers for the `/standard/` variant. EN copy is archive originals only. */

export type Locale = 'it' | 'en';

export const locales: Locale[] = ['it', 'en'];

export type LocalizedString = { it: string; en?: string };
export type LocalizedStrings = { it: string[]; en?: string[] };

export function pick(value: LocalizedString, locale: Locale): string {
	if (locale === 'en' && value.en) return value.en;
	return value.it;
}

export function pickList(value: LocalizedStrings, locale: Locale): string[] {
	if (locale === 'en' && value.en?.length) return value.en;
	return value.it;
}

/**
 * UI chrome strings.
 *
 * Most EN labels come from anticobagliosiciliano.wordpress.com (owner-written)
 * or Lodgify platform defaults ("Contact"). Lodgify’s translated menu
 * ("Captive", "Curiosity", "House Master John") is machine translation and
 * must not be used.
 *
 * `navImperdibili.en` is new: the old English site kept the Italian word;
 * "Nearby" is owner-chosen for the English nav/title (Italian stays Imperdibili).
 */
export const ui = {
	navHome: { it: 'Home', en: 'Home' },
	navHouses: { it: 'Alloggi', en: 'The Houses' },
	navImperdibili: { it: 'Imperdibili', en: 'Nearby' },
	housesGroup: { it: 'Case', en: 'The Houses' },
	ourHouses: { it: 'I nostri alloggi', en: 'The Houses' },
	discoverHouses: { it: 'Scopri gli alloggi', en: 'The Houses' },
	highlights: { it: 'In evidenza', en: 'Amenities' },
	awards: { it: 'Riconoscimenti', en: 'Awards' },
	/** Page eyebrow only; the nav/CTA uses `requestAvailability`. */
	contact: { it: 'Contatti', en: 'Contact' },
	/** Owner-supplied wording, not from the archives. Single label for the one enquiry page. */
	requestAvailability: { it: 'Richiesta disponibilità', en: 'Request availability' },

	/* House page chrome — translated, no archive original. */
	accommodation: { it: 'Alloggio', en: 'Accommodation' },
	otherHouses: { it: 'Altre case', en: 'The other houses' },
	keepExploring: { it: 'Continua a esplorare', en: 'Keep exploring' },
	houseNotFound: { it: 'Casa non trovata', en: 'House not found' },

	/*
	 * Controls and screen-reader labels. Mostly invisible, but they were Italian
	 * on the English pages (and "Language" was English on the Italian ones).
	 */
	skipToContent: { it: 'Vai al contenuto', en: 'Skip to content' },
	backToHub: { it: 'Torna all’indice', en: 'Back to the index' },
	mainNav: { it: 'Principale', en: 'Main' },
	language: { it: 'Lingua', en: 'Language' },
	menu: { it: 'Menu', en: 'Menu' },
	closeMenu: { it: 'Chiudi menu', en: 'Close menu' },
	gallery: { it: 'Galleria', en: 'Gallery' },
	previousPhoto: { it: 'Foto precedente', en: 'Previous photo' },
	nextPhoto: { it: 'Foto successiva', en: 'Next photo' },
	thumbnails: { it: 'Anteprime', en: 'Thumbnails' },
	/** Followed by the photo number: "Vai alla foto 3" / "Go to photo 3". */
	goToPhoto: { it: 'Vai alla foto', en: 'Go to photo' },
	replayVideo: { it: 'Rivedi il video', en: 'Replay the video' },
	videoUnsupported: {
		it: 'Il tuo browser non supporta la riproduzione video.',
		en: 'Your browser does not support video playback.'
	}
} satisfies Record<string, LocalizedString>;

/** App path (no base) for a standard-variant page. `subpath` e.g. `imperdibili`, `case/casa-1`, or ``. */
export function standardHref(locale: Locale, subpath = ''): string {
	const root = locale === 'en' ? '/standard/en' : '/standard';
	const clean = subpath.replace(/^\/+|\/+$/g, '');
	return clean ? `${root}/${clean}/` : `${root}/`;
}

/** Prefix with SvelteKit `base` (GitHub Pages). Prefer this over typed `resolve()` for dynamic locale paths. */
export function withBase(pathname: string, base = ''): string {
	if (!base || base === '/') return pathname;
	const b = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${b}${pathname}`;
}

/** Map current pathname between IT and EN under `/standard/`. */
export function counterpartHref(pathname: string, target: Locale, base = ''): string {
	let path = pathname;
	if (base && path.startsWith(base)) path = path.slice(base.length) || '/';
	path = path.replace(/\/+$/, '') || '/';

	const rest = path
		.replace(/^\/standard\/en(?=\/|$)/, '')
		.replace(/^\/standard(?=\/|$)/, '')
		.replace(/^\//, '');

	return standardHref(target, rest);
}

export function localeFromPath(pathname: string, base = ''): Locale {
	let path = pathname;
	if (base && path.startsWith(base)) path = path.slice(base.length) || '/';
	return /\/standard\/en(\/|$)/.test(path) ? 'en' : 'it';
}
