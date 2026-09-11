import { describe, expect, it } from 'vitest';
import { amenitiesSource, contactCopy, homeCopy, housesSource, inbox, placesSource, site, weatherCopy } from './content';

describe('marketing YAML', () => {
  it('loads houses and places in site order', () => {
    expect(housesSource.map((house) => house.slug)).toEqual([
      'casa-1',
      'casa-2',
      'casa-3',
      'casa-4'
    ]);
    expect(placesSource.map((place) => place.slug)).toEqual([
      'segesta',
      'riserva-dello-zingaro',
      'duomo-di-monreale',
      'cappella-palatina',
      'selinunte',
      'saline-di-trapani',
      'erice',
      'ruderi-di-gibellina'
    ]);
  });

  it('keeps nested it/en on YAML-backed copy', () => {
    expect(housesSource[0].tagline.it).toContain('soppalco');
    expect(homeCopy.chiSiamo.title).toEqual({ it: 'Chi siamo', en: 'About us' });
    expect(contactCopy.submit.en).toBe('Open in email');
    expect(inbox).toBe('info@anticobagliosiciliano.it');
    expect(site).not.toHaveProperty('email');
    expect(contactCopy).not.toHaveProperty('inbox');
    expect(site.tagline).toBe('Case vacanze in Sicilia');
    expect(site.nav.home).toEqual({ it: 'Home', en: 'Home' });
    expect(site.nav.requestAvailability.en).toBe('Request availability');
    expect(homeCopy.houses.eyebrow.it).toBe('I nostri alloggi');
    expect(site.chrome.menu).toEqual({ it: 'Menu', en: 'Menu' });
    expect(homeCopy.video.play.en).toBe('Play the video');
    expect(weatherCopy.clear.it).toBe('sereno');
    expect(contactCopy.eyebrow.en).toBe('Contact');
    expect(homeCopy).not.toHaveProperty('metaDescription');
    expect(homeCopy.heroLead.it).toContain('Sicilia occidentale');
    expect(homeCopy).not.toHaveProperty('amenities');
    expect(homeCopy).not.toHaveProperty('awardItems');
    expect(homeCopy).not.toHaveProperty('images');
    expect(homeCopy.heroWide).toBe('/images/ambiance/hero-portone-wide.jpg');
    expect(homeCopy.heroTall).toBe('/images/ambiance/hero-portone-tall.jpg');
    expect(homeCopy.cortile.image).toBe('/images/ambiance/cortile.jpg');
    expect(homeCopy.giardino.image).toBe('/images/ambiance/giardino.jpg');
    expect(homeCopy.giardino.agrumeto).toBe('/images/ambiance/agrumeto.jpg');
    expect(amenitiesSource).toHaveLength(7);
    expect(typeof housesSource[0].paragraphs.it).toBe('string');
    expect(housesSource[0].paragraphs.it).toContain('\n\n');
    expect(housesSource[0].highlights[0]).toEqual({
      it: 'Terrazza sull’uliveto (15 mq)',
      en: 'Terrace overlooking the olive grove (15 sq m)'
    });
    expect(housesSource[3].highlights).toHaveLength(5);
  });
});
