import { describe, expect, it } from 'vitest';
import { getHouse, housesSource } from '../data/content';
import { splitParagraphs } from '../locale';
import { houseEntries, loadHouse } from './house-page';

describe('house paragraphs', () => {
  it('keeps the casa copy as separate paragraphs', () => {
    expect(splitParagraphs(housesSource[0].paragraphs.it)).toHaveLength(6);
    expect(splitParagraphs(housesSource[0].paragraphs.en)).toHaveLength(6);
    expect(splitParagraphs(housesSource[2].paragraphs.it)).toHaveLength(5);
    expect(splitParagraphs(housesSource[2].paragraphs.en)).toHaveLength(4);
    expect(splitParagraphs(housesSource[3].paragraphs.it)).toHaveLength(6);
    expect(splitParagraphs(housesSource[3].paragraphs.en)).toHaveLength(5);
  });
});

describe('getHouse', () => {
  it('localises a known house and ignores unknown slugs', () => {
    const it = getHouse('casa-1', 'it');
    const en = getHouse('casa-1', 'en');
    expect(it?.name).toBe('Casa 1');
    expect(it?.summary).toBe(housesSource[0].summary.it);
    expect(en?.summary).toBe(housesSource[0].summary.en);
    expect(it?.highlights).toEqual(housesSource[0].highlights.map((item) => item.it));
    expect(en?.highlights).toEqual(housesSource[0].highlights.map((item) => item.en));
    expect(getHouse('casa-99')).toBeUndefined();
  });
});

describe('houseEntries', () => {
  it('prerenders every house slug', () => {
    expect(houseEntries()).toEqual(housesSource.map((house) => ({ slug: house.slug })));
  });
});

describe('loadHouse', () => {
  it('returns the house for the locale from the parent layout', async () => {
    const { house } = await loadHouse({
      params: { slug: 'casa-2' },
      parent: async () => ({ locale: 'en' as const })
    });
    expect(house.slug).toBe('casa-2');
    expect(house.summary).toBe(housesSource[1].summary.en);
  });

  it('returns the house in Italian when the layout says so', async () => {
    const { house } = await loadHouse({
      params: { slug: 'casa-1' },
      parent: async () => ({ locale: 'it' as const })
    });
    expect(house.summary).toBe(housesSource[0].summary.it);
  });

  it('throws 404 for an unknown slug', async () => {
    await expect(
      loadHouse({
        params: { slug: 'casa-99' },
        parent: async () => ({ locale: 'it' as const })
      })
    ).rejects.toMatchObject({ status: 404 });
  });
});
