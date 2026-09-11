import { describe, expect, it } from 'vitest';
import { splitParagraphs } from '../locale';
import { accommodationCopy, amenitiesCopy, awardsCopy, contactCopy, homeCopy, housesSource, inbox, placesSource, site, weatherCopy } from './content';

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
    expect(site).not.toHaveProperty('nav');
    expect(homeCopy.title).toEqual({ it: 'Home', en: 'Home' });
    expect(contactCopy.title.en).toBe('Request availability');
    expect(homeCopy.houses.eyebrow.it).toBe('I nostri alloggi');
    expect(accommodationCopy.plural).toEqual({ it: 'Alloggi', en: 'Accommodation' });
    expect(homeCopy.houses.eyebrow.en).toBe('Accommodation');
    expect(accommodationCopy.single).toEqual({ it: 'Alloggio', en: 'Accommodation' });
    expect(site.menu).toEqual({ it: 'Menu', en: 'Menu' });
    expect(site.videoPlay.en).toBe('Play the video');
    expect(homeCopy.video).not.toHaveProperty('play');
    expect(homeCopy.video.alt.en).toBe('The baglio seen from above');
    expect(weatherCopy.clear.it).toBe('sereno');
    expect(weatherCopy.line.it).toContain('{temp}');
    expect(weatherCopy.aria.en).toContain('{condition}');
    expect(contactCopy.eyebrow.en).toBe('Contact');
    expect(contactCopy.housesFreeHint.it).toBe('In queste date sono libere');
    expect(contactCopy.housesFreeHint.en).toBe('These dates are free for');
    expect(contactCopy.housesFreeHint.it).not.toContain('{');
    expect(homeCopy).not.toHaveProperty('metaDescription');
    expect(homeCopy.portone.lead.it).toContain('Sicilia occidentale');
    expect(homeCopy).not.toHaveProperty('amenities');
    expect(homeCopy).not.toHaveProperty('awardItems');
    expect(homeCopy).not.toHaveProperty('comfort');
    expect(homeCopy).not.toHaveProperty('awards');
    expect(homeCopy).not.toHaveProperty('images');
    expect(homeCopy).not.toHaveProperty('heroWide');
    expect(homeCopy.portone.wide).toBe('/images/ambiance/hero-portone-wide.jpg');
    expect(homeCopy.portone.tall).toBe('/images/ambiance/hero-portone-tall.jpg');
    expect(homeCopy.portone.alt.it).toContain('Portone');
    expect(homeCopy).not.toHaveProperty('alt');
    expect(homeCopy.cortile.alt.it).toContain('Cortile');
    expect(homeCopy.giardino.agrumetoAlt.en).toContain('citrus grove');
    expect(homeCopy.cortile.image).toBe('/images/ambiance/cortile.jpg');
    expect(homeCopy.giardino.image).toBe('/images/ambiance/giardino.jpg');
    expect(homeCopy.giardino.agrumeto).toBe('/images/ambiance/agrumeto.jpg');
    expect(homeCopy.giardino.paragraphs.it).toContain('\n\n');
    expect(splitParagraphs(homeCopy.giardino.paragraphs.it)).toHaveLength(3);
    expect(splitParagraphs(homeCopy.giardino.paragraphs.en)).toHaveLength(3);
    expect(homeCopy.giardino).not.toHaveProperty('p1');
    expect(amenitiesCopy.items).toHaveLength(7);
    expect(amenitiesCopy.eyebrow.it).toBe('Comfort');
    expect(awardsCopy.items).toHaveLength(3);
    expect(awardsCopy.title.en).toBe('Recognised hospitality');
    expect(awardsCopy.items[0].image).toBe('/images/awards/superhost.png');
    expect(awardsCopy.items[0].proof).toEqual({
      href: 'https://www.airbnb.it/users/show/26312991',
      label: {
        it: 'Profilo host su Airbnb',
        en: 'Airbnb host profile'
      }
    });
    expect(awardsCopy.items[1]).not.toHaveProperty('proof');
    expect(typeof housesSource[0].paragraphs.it).toBe('string');
    expect(housesSource[0].paragraphs.it).toContain('\n\n');
    expect(housesSource[0].highlights[0]).toEqual({
      it: 'Terrazza sull’uliveto (15 mq)',
      en: 'Terrace overlooking the olive grove (15 sq m)'
    });
    expect(housesSource[3].highlights).toHaveLength(5);
  });
});
