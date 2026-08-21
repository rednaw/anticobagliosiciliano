import { describe, expect, it } from 'vitest';
import { localeFromPath, localize, pick, stripBase } from './locale';

describe('pick', () => {
  it('returns the matching locale', () => {
    const value = { it: 'Casa', en: 'House' };
    expect(pick(value, 'it')).toBe('Casa');
    expect(pick(value, 'en')).toBe('House');
  });
});

describe('localize', () => {
  it('picks nested localized strings and lists', () => {
    const tree = {
      title: { it: 'Titolo', en: 'Title' },
      items: { it: ['uno'], en: ['one'] },
      plain: 3
    };
    expect(localize(tree, 'en')).toEqual({ title: 'Title', items: ['one'], plain: 3 });
  });
});

describe('stripBase', () => {
  it('drops the GitHub Pages project base', () => {
    expect(stripBase('/anticobagliosiciliano/', '/anticobagliosiciliano')).toBe('/');
    expect(stripBase('/anticobagliosiciliano/en/contatti/', '/anticobagliosiciliano')).toBe(
      '/en/contatti/'
    );
    expect(stripBase('/en/contatti/', '/anticobagliosiciliano')).toBe('/en/contatti/');
  });

  it('is a no-op when the site is at the domain root', () => {
    expect(stripBase('/en/contatti/', '')).toBe('/en/contatti/');
  });
});

describe('localeFromPath', () => {
  it('treats /en as English, everything else as Italian', () => {
    expect(localeFromPath('/anticobagliosiciliano/', '/anticobagliosiciliano')).toBe('it');
    expect(localeFromPath('/anticobagliosiciliano/en/', '/anticobagliosiciliano')).toBe('en');
    expect(localeFromPath('/anticobagliosiciliano/en/case/casa-1/', '/anticobagliosiciliano')).toBe(
      'en'
    );
    expect(localeFromPath('/anticobagliosiciliano/come-arrivare/', '/anticobagliosiciliano')).toBe(
      'it'
    );
  });
});
