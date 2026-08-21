import { describe, expect, it } from 'vitest';
import {
  CONTACT_HOUSE_PARAM,
  absoluteUrl,
  contactHref,
  counterpartHref,
  houseSlugFromPath,
  navLinkActive,
  siteHref,
  standardHref,
  withBase
} from './i18n';

describe('standardHref', () => {
  it('uses Italian slugs at the root and /en/ for English', () => {
    expect(standardHref('it')).toBe('/');
    expect(standardHref('en')).toBe('/en/');
    expect(standardHref('it', 'come-arrivare')).toBe('/come-arrivare/');
    expect(standardHref('en', 'come-arrivare')).toBe('/en/come-arrivare/');
    expect(standardHref('it', '/case/casa-1/')).toBe('/case/casa-1/');
  });
});

describe('withBase / siteHref', () => {
  it('prefixes the GitHub Pages project path once', () => {
    expect(withBase('/contatti/', '/anticobagliosiciliano')).toBe(
      '/anticobagliosiciliano/contatti/'
    );
    expect(withBase('/anticobagliosiciliano/contatti/', '/anticobagliosiciliano')).toBe(
      '/anticobagliosiciliano/contatti/'
    );
    expect(siteHref('en', 'privacy')).toBe('/anticobagliosiciliano/en/privacy/');
    expect(siteHref('it')).toBe('/anticobagliosiciliano/');
  });

  it('does not prefix when the site is at the domain root', () => {
    expect(withBase('/contatti/', '')).toBe('/contatti/');
    expect(siteHref('it', 'contatti', '')).toBe('/contatti/');
  });
});

describe('contactHref', () => {
  it('optionally names the house in the query', () => {
    expect(contactHref('it')).toBe('/anticobagliosiciliano/contatti/');
    expect(contactHref('en', 'casa-2')).toBe(
      `/anticobagliosiciliano/en/contatti/?${CONTACT_HOUSE_PARAM}=casa-2`
    );
  });
});

describe('navLinkActive', () => {
  it('marks the current section, never the houses hash', () => {
    expect(navLinkActive('/anticobagliosiciliano/', 'it', '')).toBe(true);
    expect(navLinkActive('/anticobagliosiciliano/', 'it', '', '#houses')).toBe(false);
    expect(navLinkActive('/anticobagliosiciliano/case/casa-1/', 'it', '')).toBe(false);
    expect(navLinkActive('/anticobagliosiciliano/case/casa-1/', 'it', 'case/casa-1')).toBe(true);
    expect(navLinkActive('/anticobagliosiciliano/imperdibili/', 'it', 'imperdibili')).toBe(true);
    expect(navLinkActive('/anticobagliosiciliano/en/come-arrivare/', 'en', 'come-arrivare')).toBe(
      true
    );
    expect(navLinkActive('/anticobagliosiciliano/en/contatti/', 'en', 'contatti')).toBe(true);
    expect(navLinkActive('/anticobagliosiciliano/en/', 'en', '')).toBe(true);
  });
});

describe('houseSlugFromPath', () => {
  it('reads the house from Italian and English paths', () => {
    expect(houseSlugFromPath('/anticobagliosiciliano/case/casa-3/')).toBe('casa-3');
    expect(houseSlugFromPath('/anticobagliosiciliano/en/case/casa-3/')).toBe('casa-3');
    expect(houseSlugFromPath('/anticobagliosiciliano/contatti/')).toBeUndefined();
  });
});

describe('counterpartHref', () => {
  it('keeps the same page in the other locale', () => {
    expect(counterpartHref('/anticobagliosiciliano/come-arrivare/', 'en')).toBe(
      '/en/come-arrivare/'
    );
    expect(counterpartHref('/anticobagliosiciliano/en/case/casa-1/', 'it')).toBe('/case/casa-1/');
    expect(counterpartHref('/anticobagliosiciliano/en/', 'it')).toBe('/');
  });
});

describe('absoluteUrl', () => {
  it('includes host and project base', () => {
    expect(absoluteUrl('/contatti/')).toBe(
      'https://rednaw.github.io/anticobagliosiciliano/contatti/'
    );
    expect(absoluteUrl('/en/')).toBe('https://rednaw.github.io/anticobagliosiciliano/en/');
  });
});
