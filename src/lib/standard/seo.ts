import {
  contactCopy,
  getHouse,
  homeCopy,
  arriveCopy,
  imperdibiliMeta,
  imperdibiliPhotoCreditsCopy,
  privacyCopy,
  site
} from '$lib/data/content';
import { stripBase, type Locale } from '$lib/locale';
import { publicImage } from '$lib/public-image';
import { SITE_ORIGIN } from '$lib/site-config';
import { absoluteUrl, pick, ui } from '$lib/standard/i18n';

/** Default share card — same wide portone still as the homepage gate. */
export const OG_IMAGE_PATH = '/images/ambiance/hero-portone-wide.jpg';
export const OG_IMAGE_WIDTH = 1248;
export const OG_IMAGE_HEIGHT = 1229;

export type PageSeo = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  robots?: string;
};

/** Path without locale prefix, no trailing slash (`/`, `/contatti`, `/case/casa-1`). */
export function routeKey(pathname: string): string {
  const path = stripBase(pathname).replace(/\/+$/, '') || '/';
  const withoutLocale = path.replace(/^\/en(?=\/|$)/, '') || '/';
  return withoutLocale.startsWith('/') ? withoutLocale : `/${withoutLocale}`;
}

export function pageSeo(pathname: string, locale: Locale): PageSeo {
  const key = routeKey(pathname);
  const image = absoluteUrl(publicImage(OG_IMAGE_PATH), SITE_ORIGIN);
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

  if (key === '/imperdibili/crediti-foto') {
    return {
      title: `${pick(ui.photoCredits, locale)} · ${site.name}`,
      description: pick(imperdibiliPhotoCreditsCopy.metaDescription, locale),
      image,
      imageAlt,
      robots: 'noindex, follow'
    };
  }

  if (key === '/come-arrivare') {
    return {
      title: `${pick(ui.navArrive, locale)} · ${site.name}`,
      description: pick(arriveCopy.metaDescription, locale),
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
