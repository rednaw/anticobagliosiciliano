import {
	contactCopy,
	getHouse,
	homeCopy,
	imperdibiliMeta,
	privacyCopy,
	site
} from '$lib/data/content';
import { stripBase, type Locale } from '$lib/locale';
import { publicImage } from '$lib/public-image';
import { SITE_ORIGIN } from '$lib/site-config';
import { absoluteUrl, pick, ui } from '$lib/standard/i18n';

/** Default share card: 1200×630 crop of the baglio gate. */
export const OG_IMAGE_PATH = '/images/og-share.jpg';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export type PageSeo = {
	title: string;
	description: string;
	image: string;
	imageAlt: string;
	robots?: string;
};

/** Path without locale prefix, no trailing slash (`/`, `/contatti`, `/case/casa-1`). */
function routeKey(pathname: string): string {
	const path = stripBase(pathname).replace(/\/+$/, '') || '/';
	const withoutLocale = path.replace(/^\/en(?=\/|$)/, '') || '/';
	return withoutLocale.startsWith('/') ? withoutLocale : `/${withoutLocale}`;
}

export function pageSeo(pathname: string, locale: Locale): PageSeo {
	const key = routeKey(pathname);
	const image = absoluteUrl(OG_IMAGE_PATH, SITE_ORIGIN);
	const imageAlt = pick(homeCopy.alt.hero, locale);

	if (key === '/404.html') {
		return {
			title: `${pick(ui.notFoundTitle, locale)} · ${site.name}`,
			description: pick(ui.notFoundBody, locale),
			image,
			imageAlt,
			robots: 'noindex, nofollow'
		};
	}

	if (key === '/imperdibili') {
		return {
			title: `${pick(ui.navImperdibili, locale)} · ${site.name}`,
			description: pick(imperdibiliMeta, locale),
			image,
			imageAlt
		};
	}

	if (key === '/contatti') {
		return {
			title: `${pick(ui.requestAvailability, locale)} · ${site.name}`,
			description: pick(contactCopy.metaDescription, locale),
			image,
			imageAlt
		};
	}

	if (key === '/privacy') {
		return {
			title: `${pick(ui.privacy, locale)} · ${site.name}`,
			description: pick(privacyCopy.metaDescription, locale),
			image,
			imageAlt
		};
	}

	const houseSlug = key.match(/^\/case\/([^/]+)$/)?.[1];
	if (houseSlug) {
		const house = getHouse(houseSlug, locale);
		if (house) {
			return {
				title: `${house.name} · ${site.name}`,
				description: house.summary,
				image: absoluteUrl(publicImage(house.image), SITE_ORIGIN),
				imageAlt: house.name
			};
		}
	}

	return {
		title: `${site.name} · ${site.tagline}`,
		description: pick(homeCopy.metaDescription, locale),
		image,
		imageAlt
	};
}
