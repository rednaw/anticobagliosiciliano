import {
  contactCopy,
  getHouse,
  homeCopy,
  arriveCopy,
  imperdibiliMeta,
  imperdibiliPhotoCreditsCopy,
  imperdibiliTitle,
  privacyCopy,
  site
} from '$lib/data/content';
import { stripBase, type Locale } from '$lib/locale';
import { publicImage } from '$lib/public-image';
import { SITE_ORIGIN } from '$lib/site-config';
import { absoluteUrl, pick } from '$lib/standard/i18n';

/** Default share card — same wide still as the homepage hero. */
export const OG_IMAGE_PATH = homeCopy.portone.wide;
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
  const imageAlt = pick(homeCopy.portone.alt, locale);

  if (key === '/404.html') {
    return {
      title: `${pick(site.pageNotFoundTitle, locale)} · ${homeCopy.brand.name}`,
      description: pick(site.pageNotFoundBody, locale),
      image,
      imageAlt,
      robots: 'noindex, nofollow'
    };
  }

  if (key === '/imperdibili') {
    return {
      title: `${pick(imperdibiliTitle, locale)} · ${homeCopy.brand.name}`,
      description: pick(imperdibiliMeta, locale),
      image,
      imageAlt
    };
  }

  if (key === '/imperdibili/crediti-foto') {
    return {
      title: `${pick(imperdibiliPhotoCreditsCopy.title, locale)} · ${homeCopy.brand.name}`,
      description: pick(imperdibiliPhotoCreditsCopy.metaDescription, locale),
      image,
      imageAlt,
      robots: 'noindex, follow'
    };
  }

  if (key === '/come-arrivare') {
    return {
      title: `${pick(arriveCopy.title, locale)} · ${homeCopy.brand.name}`,
      description: pick(arriveCopy.metaDescription, locale),
      image,
      imageAlt
    };
  }

  if (key === '/contatti') {
    return {
      title: `${pick(contactCopy.title, locale)} · ${homeCopy.brand.name}`,
      description: pick(contactCopy.metaDescription, locale),
      image,
      imageAlt
    };
  }

  if (key === '/privacy') {
    return {
      title: `${pick(privacyCopy.title, locale)} · ${homeCopy.brand.name}`,
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
        title: `${house.name} · ${homeCopy.brand.name}`,
        description: house.summary,
        image: absoluteUrl(publicImage(house.image), SITE_ORIGIN),
        imageAlt: house.name
      };
    }
  }

  return {
    title: `${homeCopy.brand.name} · ${homeCopy.brand.tagline}`,
    description: pick(homeCopy.brand.description, locale),
    image,
    imageAlt
  };
}
