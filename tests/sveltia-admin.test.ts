import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

const root = resolve(import.meta.dirname, '..');
const indexHtml = readFileSync(resolve(root, 'static/admin/index.html'), 'utf8');
const configText = readFileSync(resolve(root, 'static/admin/config.yml'), 'utf8');

describe('Sveltia admin', () => {
  it('loads the npm IIFE, not unpkg, and matches the schema in node_modules', () => {
    const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
      devDependencies: Record<string, string>;
    };
    expect(pkg.devDependencies['@sveltia/cms']).toMatch(/^\d+\.\d+\.\d+$/);
    expect(indexHtml).toContain('src="./sveltia-cms.js"');
    expect(indexHtml).not.toContain('unpkg.com');
    expect(configText).toContain(
      '$schema=../../node_modules/@sveltia/cms/schema/sveltia-cms.json'
    );
    expect(existsSync(resolve(root, 'node_modules/@sveltia/cms/dist/sveltia-cms.js'))).toBe(true);
    expect(existsSync(resolve(root, 'node_modules/@sveltia/cms/schema/sveltia-cms.json'))).toBe(
      true
    );
    expect(indexHtml).toContain('noindex');
  });

  it('points collections at src/content and does not allow creating houses or places', () => {
    type Field = {
      name: string;
      widget?: string;
      fields?: Field[];
      i18n?: unknown;
      multiple?: boolean;
      hint?: string;
    };
    const config = parse(configText, { maxAliasCount: 1000 }) as {
      backend: {
        name: string;
        repo: string;
        base_url?: string;
        auth_methods?: string[];
      };
      media_folder: string;
      public_folder: string;
      i18n?: unknown;
      collections: Array<{
        name: string;
        create?: boolean;
        delete?: boolean;
        folder?: string;
        i18n?: unknown;
        files?: Array<{ name?: string; file: string; i18n?: unknown; fields?: Field[] }>;
        fields?: Field[];
      }>;
    };
    expect(config.backend).toMatchObject({
      name: 'github',
      repo: 'rednaw/anticobagliosiciliano',
      base_url: 'https://auth.tientjeketama.nl',
      auth_methods: ['oauth']
    });
    expect(config).toMatchObject({
      media_folder: 'static/images',
      public_folder: '/images'
    });
    expect(config.i18n).toBeUndefined();
    const byName = Object.fromEntries(config.collections.map((c) => [c.name, c]));
    expect(byName.houses).toMatchObject({
      folder: 'src/content/houses',
      create: false,
      delete: false
    });
    expect(byName.places).toMatchObject({
      folder: 'src/content/places',
      create: false,
      delete: false
    });
    expect(byName.pages.i18n).toBeUndefined();
    expect(byName.houses.i18n).toBeUndefined();
    expect(byName.places.i18n).toBeUndefined();
    const tagline = byName.houses.fields?.find((field) => field.name === 'tagline');
    expect(tagline).toMatchObject({ widget: 'object' });
    expect(tagline?.fields?.map((field) => field.name)).toEqual(['it', 'en']);
    const paragraphs = byName.houses.fields?.find((field) => field.name === 'paragraphs');
    expect(paragraphs).toMatchObject({ widget: 'object' });
    expect(paragraphs?.fields?.map((field) => field.name)).toEqual(['it', 'en']);
    expect(paragraphs?.fields?.map((field) => field.widget)).toEqual(['text', 'text']);
    const highlights = byName.houses.fields?.find((field) => field.name === 'highlights');
    expect(highlights).toMatchObject({ widget: 'list' });
    expect(highlights?.fields?.map((field) => field.name)).toEqual(['it', 'en']);
    expect(highlights?.fields?.map((field) => field.widget)).toEqual(['string', 'string']);
    const houseImage = byName.houses.fields?.find((field) => field.name === 'image');
    expect(houseImage).toMatchObject({ widget: 'image' });
    expect(byName.houses.fields?.slice(0, 2).map((field) => field.name)).toEqual(['name', 'image']);
    const houseGallery = byName.houses.fields?.find((field) => field.name === 'gallery');
    expect(houseGallery).toMatchObject({ widget: 'image', multiple: true });
    const placeImage = byName.places.fields?.find((field) => field.name === 'image');
    expect(placeImage).toMatchObject({ widget: 'image' });
    expect(configText).not.toMatch(/Niente upload/);
    const homeFile = byName.pages.files?.find((file) => file.file === 'src/content/home.yml');
    expect(homeFile?.fields?.find((field) => field.name === 'images')).toBeUndefined();
    expect(homeFile?.fields?.find((field) => field.name === 'heroWide')).toMatchObject({
      widget: 'image'
    });
    expect(homeFile?.fields?.find((field) => field.name === 'heroTall')).toMatchObject({
      widget: 'image'
    });
    expect(homeFile?.fields?.find((field) => field.name === 'heroAlt')).toMatchObject({
      widget: 'object'
    });
    const homeFieldNames = homeFile?.fields?.map((field) => field.name) ?? [];
    const heroAltAt = homeFieldNames.indexOf('heroAlt');
    expect(homeFieldNames.slice(heroAltAt, heroAltAt + 3)).toEqual(['heroAlt', 'video', 'chiSiamo']);
    expect(homeFile?.fields?.find((field) => field.name === 'alt')).toBeUndefined();
    const cortile = homeFile?.fields?.find((field) => field.name === 'cortile');
    expect(cortile?.fields?.slice(0, 2).map((field) => field.name)).toEqual(['image', 'alt']);
    const giardino = homeFile?.fields?.find((field) => field.name === 'giardino');
    expect(giardino?.fields?.map((field) => field.name).slice(0, 4)).toEqual([
      'image',
      'alt',
      'agrumeto',
      'agrumetoAlt'
    ]);
    expect(giardino?.fields?.find((field) => field.name === 'paragraphs')).toMatchObject({
      widget: 'object'
    });
    expect(giardino?.fields?.some((field) => /^p[123]$/.test(field.name))).toBe(false);
    expect(homeFile?.fields?.find((field) => field.name === 'amenities')).toBeUndefined();
    expect(homeFile?.fields?.find((field) => field.name === 'awardItems')).toBeUndefined();
    expect(homeFile?.fields?.find((field) => field.name === 'comfort')).toBeUndefined();
    expect(homeFile?.fields?.find((field) => field.name === 'awards')).toBeUndefined();
    const amenitiesFile = byName.pages.files?.find((file) => file.file === 'src/content/amenities.yml');
    expect(amenitiesFile?.fields?.map((field) => field.name)).toEqual(['eyebrow', 'title', 'items']);
    expect(amenitiesFile?.fields?.[2]).toMatchObject({ name: 'items', widget: 'list' });
    const awardsFile = byName.pages.files?.find((file) => file.file === 'src/content/awards.yml');
    expect(awardsFile?.fields?.map((field) => field.name)).toEqual(['eyebrow', 'title', 'items']);
    expect(awardsFile?.fields?.[2]?.fields?.find((field) => field.name === 'image')).toMatchObject({
      widget: 'image'
    });
    const awardProof = awardsFile?.fields?.[2]?.fields?.find((field) => field.name === 'proof');
    expect(awardProof).toMatchObject({ widget: 'object', required: false });
    expect(awardProof?.fields?.map((field) => field.name)).toEqual(['href', 'label']);
    expect(awardProof?.fields?.[0]).toMatchObject({ name: 'href', widget: 'string' });
    expect(awardProof?.fields?.[1]).toMatchObject({ name: 'label', widget: 'object' });
    const arriveFile = byName.pages.files?.find((file) => file.file === 'src/content/arrive.yml');
    const weather = arriveFile?.fields?.find((field) => field.name === 'weather');
    expect(weather?.fields?.find((field) => field.name === 'line')).toMatchObject({
      widget: 'hidden'
    });
    expect(weather?.fields?.find((field) => field.name === 'aria')).toMatchObject({
      widget: 'hidden'
    });
    const contactFile = byName.pages.files?.find((file) => file.file === 'src/content/contact.yml');
    expect(contactFile?.fields?.find((field) => field.name === 'housesFreeHint')).toMatchObject({
      widget: 'object'
    });
    const pageFiles = byName.pages.files?.map((file) => file.file) ?? [];
    expect(pageFiles).toEqual(
      expect.arrayContaining([
        'src/content/site.yml',
        'src/content/home.yml',
        'src/content/amenities.yml',
        'src/content/awards.yml',
        'src/content/contact.yml',
        'src/content/arrive.yml',
        'src/content/imperdibili.yml',
        'src/content/privacy.yml'
      ])
    );
  });
});
