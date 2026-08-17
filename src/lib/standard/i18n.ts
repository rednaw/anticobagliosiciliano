import { stripBase, type Locale, type LocalizedString } from '$lib/locale';

export type { Locale } from '$lib/locale';
export { pick, localize } from '$lib/locale';
export { stripBase };

export const ui = {
	navHome: { it: 'Home', en: 'Home' },
	navHouses: { it: 'Alloggi', en: 'The Houses' },
	navImperdibili: { it: 'Imperdibili', en: 'Nearby' },
	housesGroup: { it: 'Case', en: 'The Houses' },
	ourHouses: { it: 'I nostri alloggi', en: 'The Houses' },
	discoverHouses: { it: 'Scopri gli alloggi', en: 'The Houses' },
	highlights: { it: 'In evidenza', en: 'Amenities' },
	awards: { it: 'Riconoscimenti', en: 'Awards' },
	contact: { it: 'Contatti', en: 'Contact' },
	requestAvailability: { it: 'Richiesta disponibilità', en: 'Request availability' },
	accommodation: { it: 'Alloggio', en: 'Accommodation' },
	otherHouses: { it: 'Altre case', en: 'The other houses' },
	keepExploring: { it: 'Continua a esplorare', en: 'Keep exploring' },
	houseNotFound: { it: 'Casa non trovata', en: 'House not found' },
	notFoundTitle: { it: 'Pagina non trovata', en: 'Page not found' },
	notFoundBody: {
		it: 'Questo indirizzo non esiste. Torna alla home per scoprire le case del baglio.',
		en: 'This address does not exist. Head home to see the houses at the baglio.'
	},
	errorTitle: { it: 'Qualcosa è andato storto', en: 'Something went wrong' },
	errorBody: {
		it: 'Non siamo riusciti a caricare questa pagina. Puoi tornare alla home e riprovare.',
		en: 'We could not load this page. You can go back home and try again.'
	},
	skipToContent: { it: 'Vai al contenuto', en: 'Skip to content' },
	mainNav: { it: 'Principale', en: 'Main' },
	language: { it: 'Lingua', en: 'Language' },
	menu: { it: 'Menu', en: 'Menu' },
	closeMenu: { it: 'Chiudi menu', en: 'Close menu' },
	gallery: { it: 'Galleria', en: 'Gallery' },
	previousPhoto: { it: 'Foto precedente', en: 'Previous photo' },
	nextPhoto: { it: 'Foto successiva', en: 'Next photo' },
	thumbnails: { it: 'Anteprime', en: 'Thumbnails' },
	goToPhoto: { it: 'Vai alla foto', en: 'Go to photo' },
	replayVideo: { it: 'Rivedi il video', en: 'Replay the video' },
	playVideo: { it: 'Riproduci il video', en: 'Play the video' },
	videoUnsupported: {
		it: 'Il tuo browser non supporta la riproduzione video.',
		en: 'Your browser does not support video playback.'
	}
} satisfies Record<string, LocalizedString>;

/** App path (no base). `subpath` e.g. `imperdibili`, `case/casa-1`, or ``. */
export function standardHref(locale: Locale, subpath = ''): string {
	const clean = subpath.replace(/^\/+|\/+$/g, '');
	if (locale === 'en') return clean ? `/en/${clean}/` : '/en/';
	return clean ? `/${clean}/` : '/';
}

/** Prefix with SvelteKit `base` (GitHub Pages). */
export function withBase(pathname: string, base = ''): string {
	if (!base || base === '/') return pathname;
	const b = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${b}${pathname}`;
}

/** Locale path with the GitHub Pages `base` prefix. */
export function siteHref(locale: Locale, subpath = '', base = ''): string {
	return withBase(standardHref(locale, subpath), base);
}

/** Same page in the other locale. */
export function counterpartHref(pathname: string, target: Locale, base = ''): string {
	const path = stripBase(pathname, base).replace(/\/+$/, '') || '/';
	const rest = path.replace(/^\/en(?=\/|$)/, '').replace(/^\//, '');
	return standardHref(target, rest);
}

/** Absolute URL for canonical / hreflang. Do not pass `$app/paths` `base` — it is relative per page. */
export function absoluteUrl(pathname: string, origin: string): string {
	if (/^https?:\/\//.test(pathname)) return pathname;
	return new URL(pathname, `${origin.replace(/\/$/, '')}/`).href;
}
