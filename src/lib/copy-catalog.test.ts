import { describe, expect, it } from 'vitest';
import {
  collectEtichetteRows,
  collectPagineRows,
  csvRowsToCopyRows,
  mergeImportedRows,
  overlayValue,
  parseCsv,
  stringifyCsv,
  copyImportProblem
} from './copy-catalog';
import {
  amenitiesSource,
  arriveCopy,
  awardsSource,
  baglioLocation,
  contactCopy,
  homeCopy,
  housesSource,
  imperdibiliLead,
  imperdibiliMeta,
  imperdibiliPhotoCreditsCopy,
  imperdibiliRouteCopy,
  placesSource,
  privacyCopy,
  site
} from './data/content';
import { ui } from './standard/i18n';

const content = {
  site,
  homeCopy,
  amenitiesSource,
  awardsSource,
  housesSource,
  imperdibiliMeta,
  imperdibiliLead,
  imperdibiliPhotoCreditsCopy,
  imperdibiliRouteCopy,
  placesSource,
  arriveCopy,
  baglioLocation,
  contactCopy,
  privacyCopy
};

describe('copy catalog', () => {
  const pagine = collectPagineRows(content);
  const etichette = collectEtichetteRows(ui);
  const ids = [...pagine, ...etichette].map((row) => row.id);

  it('uses stable ids, including slugs and UI keys', () => {
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('site.name');
    expect(ids).toContain('home.chiSiamo.body');
    expect(ids).toContain('houses.casa-1.tagline');
    expect(ids).toContain('houses.casa-1.paragraphs.0');
    expect(ids).toContain('amenities.0.title');
    expect(ids).toContain('places.segesta.name');
    expect(ids).toContain('arrive.maps.google.label');
    expect(ids).toContain('contact.email');
    expect(ids).toContain('privacy.mapsTitle');
    expect(ids).toContain('ui.gallery');
    expect(ids).not.toContain('site.email');
  });

  it('keys page rows by Italian URLs', () => {
    const byId = Object.fromEntries(pagine.map((row) => [row.id, row]));
    expect(byId['site.name'].pagina).toBe('tutto il sito');
    expect(byId['site.description'].pagina).toBe('/');
    expect(byId['houses.casa-1.tagline'].pagina).toBe('/case/casa-1/');
    expect(byId['places.segesta.name'].pagina).toBe('/imperdibili/#segesta');
    expect(pagine.some((row) => row.italiano.includes('/images/'))).toBe(false);
  });

  it('overlays owner values without rewriting skipped fields', () => {
    const houses = overlayValue(housesSource, 'houses', {
      'houses.casa-1.tagline': {
        it: 'Nuova tagline',
        en: 'New tagline'
      }
    });
    expect(houses[0].tagline.it).toBe('Nuova tagline');
    expect(houses[0].tagline.en).toBe('New tagline');
    expect(houses[0].slug).toBe('casa-1');
    expect(houses[1].tagline.it).toBe(housesSource[1].tagline.it);
  });

  it('stores owner italiano/inglese when they differ from the seed', () => {
    const known = new Set(['home.chiSiamo.title']);
    const live = { 'home.chiSiamo.title': { italiano: 'Chi siamo', inglese: 'About us' } };
    const first = mergeImportedRows(
      {},
      [{ id: 'home.chiSiamo.title', italiano: 'Chi siamo', inglese: 'About us' }],
      known,
      live
    );
    expect(first.overrides['home.chiSiamo.title']).toBeUndefined();

    const renamed = mergeImportedRows(
      {},
      [{ id: 'home.chiSiamo.title', italiano: 'Chi siamo oggi', inglese: 'About us' }],
      known,
      live
    );
    expect(renamed.overrides['home.chiSiamo.title']).toEqual({ it: 'Chi siamo oggi' });
  });

  it('does not blank copy when a spreadsheet cell is empty', () => {
    const known = new Set(['home.chiSiamo.title']);
    const live = { 'home.chiSiamo.title': { italiano: 'Chi siamo oggi', inglese: 'About us' } };
    const kept = mergeImportedRows(
      { 'home.chiSiamo.title': { it: 'Chi siamo oggi' } },
      [{ id: 'home.chiSiamo.title', italiano: '', inglese: 'About us' }],
      known,
      live
    );
    expect(kept.overrides['home.chiSiamo.title']).toEqual({ it: 'Chi siamo oggi' });

    const first = mergeImportedRows(
      {},
      [{ id: 'home.chiSiamo.title', italiano: '   ', inglese: 'About us' }],
      known,
      { 'home.chiSiamo.title': { italiano: 'Chi siamo', inglese: 'About us' } }
    );
    expect(first.overrides['home.chiSiamo.title']).toBeUndefined();
  });

  it('keeps overrides for ids not listed in a partial CSV', () => {
    const known = new Set(['home.chiSiamo.title', 'ui.navHome']);
    const merged = mergeImportedRows(
      {
        'home.chiSiamo.title': { it: 'Chi siamo oggi' },
        'ui.navHome': { it: 'Inizio' }
      },
      [{ id: 'ui.navHome', italiano: 'Casa', inglese: 'Home' }],
      known,
      {
        'home.chiSiamo.title': { italiano: 'Chi siamo oggi', inglese: 'About us' },
        'ui.navHome': { italiano: 'Inizio', inglese: 'Home' }
      }
    );
    expect(merged.overrides['home.chiSiamo.title']).toEqual({ it: 'Chi siamo oggi' });
    expect(merged.overrides['ui.navHome']).toEqual({ it: 'Casa' });
    expect(merged.unknown).toEqual([]);
  });

  it('lists unknown ids without applying them', () => {
    const known = new Set(['home.chiSiamo.title']);
    const merged = mergeImportedRows(
      {},
      [{ id: 'not-a-key', italiano: 'x', inglese: 'y' }],
      known,
      {}
    );
    expect(merged.unknown).toEqual(['not-a-key']);
    expect(merged.overrides).toEqual({});
  });

  it('round-trips quoted CSV fields by header name', () => {
    const row = {
      pagina: '/',
      italiano: 'Ciao, baglio; sì',
      inglese: 'Hello',
      id: 'home.cta.title'
    };
    const parsed = parseCsv(stringifyCsv([row]));
    expect(parsed.header.at(-1)).toBe('id');
    expect(csvRowsToCopyRows(parsed.rows)[0]).toEqual(row);
    expect(stringifyCsv([row])).toContain('"Ciao, baglio; sì"');
  });

  it('accepts a semicolon CSV with commas inside Italian text', () => {
    const text = [
      'pagina;italiano;inglese;id',
      '/;"Ciao, baglio";Hello;home.cta.title'
    ].join('\n');
    const parsed = parseCsv(text);
    expect(csvRowsToCopyRows(parsed.rows)[0]).toEqual({
      pagina: '/',
      italiano: 'Ciao, baglio',
      inglese: 'Hello',
      id: 'home.cta.title'
    });
  });

  it('accepts a tab-separated CSV and quoted newlines', () => {
    const text = ['pagina\titaliano\tinglese\tid', '/\t"Ciao\nbaglio"\tHello\thome.cta.title'].join(
      '\n'
    );
    const parsed = parseCsv(text);
    expect(csvRowsToCopyRows(parsed.rows)[0]).toEqual({
      pagina: '/',
      italiano: 'Ciao\nbaglio',
      inglese: 'Hello',
      id: 'home.cta.title'
    });
  });

  it('accepts an Excel sep= preamble', () => {
    const text = ['sep=;', 'pagina;italiano;inglese;id', '/;Ciao;Hello;home.cta.title'].join('\n');
    const parsed = parseCsv(text);
    expect(csvRowsToCopyRows(parsed.rows)[0]).toEqual({
      pagina: '/',
      italiano: 'Ciao',
      inglese: 'Hello',
      id: 'home.cta.title'
    });
  });

  it('returns no rows when the file is not a copy CSV', () => {
    expect(parseCsv('not a csv').header).toEqual([]);
    expect(parseCsv('not a csv').rows).toEqual([]);
  });

  it('rejects duplicate or missing ids and a shifted column file', () => {
    const known = new Set(['home.chiSiamo.title', 'ui.navHome', 'ui.navHouses']);
    expect(copyImportProblem([], known)).toMatch(/no data rows/i);
    expect(
      copyImportProblem(
        [
          { pagina: '/', italiano: 'a', inglese: 'b', id: 'home.chiSiamo.title' },
          { pagina: '/', italiano: 'c', inglese: 'd', id: 'home.chiSiamo.title' }
        ],
        known
      )
    ).toMatch(/duplicate/i);
    expect(
      copyImportProblem([{ pagina: '/', italiano: 'a', inglese: 'b', id: '' }], known)
    ).toMatch(/no id/i);
    expect(
      copyImportProblem(
        [
          { pagina: '/', italiano: 'x', inglese: 'y', id: 'not-a-key' },
          { pagina: '/', italiano: 'x', inglese: 'y', id: 'also-wrong' }
        ],
        known
      )
    ).toMatch(/no id matches/i);
    expect(
      copyImportProblem(
        [{ pagina: '/', italiano: 'Chi siamo', inglese: 'About us', id: 'home.chiSiamo.title' }],
        known
      )
    ).toBeNull();

    const keys = [...known];
    const shifted = Array.from({ length: 10 }, (_, i) => ({
      pagina: '/',
      italiano: 'x',
      inglese: 'y',
      id: i < 3 ? keys[i] : `shifted-${i}`
    }));
    expect(copyImportProblem(shifted, known)).toMatch(/only 3 of 10/i);
  });
});
