import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
  asset: (path: string) => path
}));

import { arriveCopy, housesSource, privacyCopy, site } from '$lib/data/content';
import { pick } from '$lib/locale';
import { ui } from './i18n';
import { pageSeo } from './seo';

describe('pageSeo', () => {
  it('titles marketing pages in both locales', () => {
    expect(pageSeo('/anticobagliosiciliano/', 'it').title).toBe(`${site.name} · ${site.tagline}`);
    expect(pageSeo('/anticobagliosiciliano/en/', 'en').title).toBe(`${site.name} · ${site.tagline}`);
    expect(pageSeo('/anticobagliosiciliano/contatti/', 'it').title).toBe(
      `${pick(ui.requestAvailability, 'it')} · ${site.name}`
    );
    expect(pageSeo('/anticobagliosiciliano/privacy/', 'it').description).toBe(
      privacyCopy.metaDescription.it
    );
    expect(pageSeo('/anticobagliosiciliano/en/come-arrivare/', 'en').description).toBe(
      arriveCopy.metaDescription.en
    );
  });

  it('noindexes the photo credits page', () => {
    const seo = pageSeo('/anticobagliosiciliano/imperdibili/crediti-foto/', 'it');
    expect(seo.robots).toBe('noindex, follow');
    expect(seo.title).toMatch(/Crediti fotografici/i);
  });

  it('does not noindex public pages', () => {
    expect(pageSeo('/anticobagliosiciliano/', 'it').robots).toBeUndefined();
    expect(pageSeo('/anticobagliosiciliano/en/come-arrivare/', 'en').robots).toBeUndefined();
  });

  it('noindexes the GitHub Pages 404 document', () => {
    const seo = pageSeo('/anticobagliosiciliano/404.html', 'it');
    expect(seo.robots).toBe('noindex, nofollow');
    expect(seo.title).toMatch(/non trovata/i);
  });

  it('uses the house summary for house pages', () => {
    const house = housesSource[0];
    const seo = pageSeo(`/anticobagliosiciliano/case/${house.slug}/`, 'it');
    expect(seo.title).toBe(`${house.name} · ${site.name}`);
    expect(seo.description).toBe(house.summary.it);
  });
});
