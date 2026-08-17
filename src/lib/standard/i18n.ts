import { stripBase, type Locale, type LocalizedString } from '$lib/locale';
import { SITE_BASE, SITE_ORIGIN } from '$lib/site-config';

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
	privacy: { it: 'Privacy', en: 'Privacy' },
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
