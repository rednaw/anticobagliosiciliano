import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
  asset: (path: string) => path
}));

import { baglioLocation, homeCopy, housesSource, site } from '$lib/data/content';
import {
  LODGING_ID_FRAGMENT,
  RENTAL_ID_FRAGMENT,
  jsonLdScriptContent,
  lodgingId,
  pageJsonLd,
  rentalId
} from './json-ld';

const base = '/anticobagliosiciliano';

describe('pageJsonLd', () => {
  it('describes the baglio on the homepage', () => {
    const data = pageJsonLd(`${base}/`, 'it');
    expect(data?.['@context']).toBe('https://schema.org');
    expect(data?.['@type']).toBe('LodgingBusiness');
    expect(data?.['@id']).toBe(lodgingId('it'));
    expect(data?.name).toBe(site.name);
    expect(data?.description).toBe(homeCopy.metaDescription.it);
    expect(data?.email).toBe(site.email);
    expect(data?.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: baglioLocation.lat,
      longitude: baglioLocation.lon
    });
    expect(data?.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Balestrate',
      addressRegion: 'PA',
      addressCountry: 'IT'
    });
    expect(data?.sameAs).toContain('https://maps.app.goo.gl/NA1BwasQVcFzn1qHA');
    expect(data?.containsPlace).toHaveLength(4);
    expect((data?.containsPlace as Array<{ '@id': string }>)?.[0]).toEqual({
      '@id': rentalId('casa-1', 'it')
    });
    expect(data).not.toHaveProperty('inLanguage');
  });

  it('repeats the same lodging entity on Contatti and Come arrivare', () => {
    const home = pageJsonLd(`${base}/`, 'it');
    const contact = pageJsonLd(`${base}/contatti/`, 'it');
    const arrive = pageJsonLd(`${base}/come-arrivare/`, 'it');

    expect(contact?.['@id']).toBe(home?.['@id']);
    expect(arrive?.['@id']).toBe(home?.['@id']);
    expect(contact?.['@type']).toBe('LodgingBusiness');
    expect(arrive?.['@type']).toBe('LodgingBusiness');
  });

  it('describes each house with breadcrumbs in both locales', () => {
    const house = housesSource[0];
    const data = pageJsonLd(`${base}/case/${house.slug}/`, 'it');
    expect(data?.['@graph']).toHaveLength(2);

    const rental = (data?.['@graph'] as Record<string, unknown>[])?.[0];
    expect(rental?.['@type']).toEqual(['VacationRental', 'Accommodation']);
    expect(rental?.['@id']).toBe(rentalId(house.slug, 'it'));
    expect(rental?.name).toBe(house.name);
    expect(rental?.description).toBe(house.summary.it);
    expect(rental?.containedInPlace).toEqual({ '@id': lodgingId('it') });
    expect(rental?.occupancy).toEqual({
      '@type': 'QuantitativeValue',
      minValue: house.capacity.guestMin,
      maxValue: house.capacity.guestMax
    });
    expect(rental?.numberOfBedrooms).toBe(house.capacity.bedroomCount);
    expect(rental?.numberOfBathroomsTotal).toBe(house.capacity.bathroomCount);
    expect(rental?.floorSize).toEqual({
      '@type': 'QuantitativeValue',
      value: house.capacity.floorAreaSqm,
      unitCode: 'MTK'
    });

    const crumbs = (data?.['@graph'] as Record<string, unknown>[])?.[1];
    expect(crumbs?.['@type']).toBe('BreadcrumbList');
    const items = crumbs?.itemListElement as Array<{ name: string; position: number }>;
    expect(items).toHaveLength(3);
    expect(items[2].name).toBe(house.name);

    const en = pageJsonLd(`${base}/en/case/${house.slug}/`, 'en');
    const enRental = (en?.['@graph'] as Record<string, unknown>[])?.[0];
    expect(enRental?.description).toBe(house.summary.en);
    expect(enRental?.url).toBe(`https://rednaw.github.io${base}/en/case/${house.slug}/`);
    expect(enRental).not.toHaveProperty('inLanguage');
  });

  it('skips pages that are not entity pages', () => {
    expect(pageJsonLd(`${base}/privacy/`, 'it')).toBeNull();
    expect(pageJsonLd(`${base}/imperdibili/`, 'it')).toBeNull();
    expect(pageJsonLd(`${base}/imperdibili/crediti-foto/`, 'it')).toBeNull();
    expect(pageJsonLd(`${base}/404.html`, 'it')).toBeNull();
  });

  it('uses stable entity id fragments', () => {
    expect(lodgingId('it')).toMatch(new RegExp(`${LODGING_ID_FRAGMENT}$`));
    expect(rentalId('casa-2', 'en')).toMatch(new RegExp(`${RENTAL_ID_FRAGMENT}$`));
  });

  it('localizes the English homepage lodging description and url', () => {
    const data = pageJsonLd(`${base}/en/`, 'en');
    expect(data?.description).toBe(homeCopy.metaDescription.en);
    expect(data?.url).toBe(`https://rednaw.github.io${base}/en/`);
    expect(data?.['@id']).toBe(lodgingId('en'));
    expect(data).not.toHaveProperty('inLanguage');
  });
});

describe('jsonLdScriptContent', () => {
  it('escapes angle brackets for safe script embedding', () => {
    const raw = jsonLdScriptContent({ note: '</script><script>alert(1)</script>' });
    expect(raw).not.toContain('</script>');
    expect(raw).toContain('\\u003c/script');
  });
});
