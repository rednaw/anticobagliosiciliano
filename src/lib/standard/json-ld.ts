import { baglioLocation, getHouse, homeCopy, housesSource, site } from '$lib/data/content';
import type { Locale } from '$lib/locale';
import { publicImage } from '$lib/public-image';
import { SITE_ORIGIN } from '$lib/site-config';
import { absoluteUrl, pick, standardHref, ui } from '$lib/standard/i18n';
import { OG_IMAGE_PATH, routeKey } from './seo';

export const LODGING_ID_FRAGMENT = '#lodging';
export const RENTAL_ID_FRAGMENT = '#rental';

export function lodgingId(locale: Locale): string {
  return `${absoluteUrl(standardHref(locale), SITE_ORIGIN)}${LODGING_ID_FRAGMENT}`;
}

export function rentalId(slug: string, locale: Locale): string {
  return `${absoluteUrl(standardHref(locale, `case/${slug}`), SITE_ORIGIN)}${RENTAL_ID_FRAGMENT}`;
}

/** Safe to embed in a `<script type="application/ld+json">` body. */
export function jsonLdScriptContent(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    addressLocality: 'Balestrate',
    addressRegion: 'PA',
    addressCountry: 'IT'
  };
}

function geoCoordinates() {
  return {
    '@type': 'GeoCoordinates',
    latitude: baglioLocation.lat,
    longitude: baglioLocation.lon
  };
}

function lodgingSameAs(): string[] {
  return baglioLocation.links.map((link) => link.href).filter((href) => href.startsWith('https://'));
}

function lodgingBusiness(locale: Locale) {
  return {
    '@type': 'LodgingBusiness',
    '@id': lodgingId(locale),
    name: site.name,
    description: pick(homeCopy.metaDescription, locale),
    url: absoluteUrl(standardHref(locale), SITE_ORIGIN),
    email: site.email,
    image: absoluteUrl(publicImage(OG_IMAGE_PATH), SITE_ORIGIN),
    geo: geoCoordinates(),
    address: postalAddress(),
    sameAs: lodgingSameAs(),
    containsPlace: housesSource.map((house) => ({ '@id': rentalId(house.slug, locale) }))
  };
}

function vacationRental(slug: string, locale: Locale) {
  const house = getHouse(slug, locale);
  const source = housesSource.find((h) => h.slug === slug);
  if (!house || !source) return null;

  const { capacity } = source;
  return {
    '@type': ['VacationRental', 'Accommodation'],
    '@id': rentalId(slug, locale),
    name: house.name,
    description: house.summary,
    url: absoluteUrl(standardHref(locale, `case/${slug}`), SITE_ORIGIN),
    image: absoluteUrl(publicImage(house.image), SITE_ORIGIN),
    containedInPlace: { '@id': lodgingId(locale) },
    occupancy: {
      '@type': 'QuantitativeValue',
      minValue: capacity.guestMin,
      maxValue: capacity.guestMax
    },
    numberOfBedrooms: capacity.bedroomCount,
    numberOfBathroomsTotal: capacity.bathroomCount,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: capacity.floorAreaSqm,
      unitCode: 'MTK'
    }
  };
}

function breadcrumbList(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

function houseBreadcrumbs(slug: string, locale: Locale) {
  const house = getHouse(slug, locale);
  if (!house) return null;

  return breadcrumbList([
    { name: pick(ui.navHome, locale), url: absoluteUrl(standardHref(locale), SITE_ORIGIN) },
    {
      name: pick(ui.navHouses, locale),
      url: `${absoluteUrl(standardHref(locale), SITE_ORIGIN)}#houses`
    },
    {
      name: house.name,
      url: absoluteUrl(standardHref(locale, `case/${slug}`), SITE_ORIGIN)
    }
  ]);
}

const SKIP_JSON_LD = new Set(['/404.html', '/privacy', '/imperdibili', '/imperdibili/crediti-foto']);

/** Structured data for the current page, or null when the route should not carry JSON-LD. */
export function pageJsonLd(pathname: string, locale: Locale): Record<string, unknown> | null {
  const key = routeKey(pathname);
  if (SKIP_JSON_LD.has(key)) return null;

  const houseSlug = key.match(/^\/case\/([^/]+)$/)?.[1];
  if (houseSlug) {
    const rental = vacationRental(houseSlug, locale);
    const crumbs = houseBreadcrumbs(houseSlug, locale);
    if (!rental || !crumbs) return null;
    return {
      '@context': 'https://schema.org',
      '@graph': [rental, crumbs]
    };
  }

  if (key === '/' || key === '/contatti' || key === '/come-arrivare') {
    return {
      '@context': 'https://schema.org',
      ...lodgingBusiness(locale)
    };
  }

  return null;
}
