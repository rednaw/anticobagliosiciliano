import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

const root = resolve(import.meta.dirname, '..');
const indexHtml = readFileSync(resolve(root, 'static/admin/index.html'), 'utf8');
const configText = readFileSync(resolve(root, 'static/admin/config.yml'), 'utf8');

describe('Sveltia admin', () => {
  it('pins the same Sveltia version in the script and the schema', () => {
    const script = indexHtml.match(/unpkg\.com\/@sveltia\/cms@([^/]+)\/dist\/sveltia-cms\.js/);
    const schema = configText.match(/unpkg\.com\/@sveltia\/cms@([^/]+)\/schema\/sveltia-cms\.json/);
    expect(script?.[1]).toBeDefined();
    expect(schema?.[1]).toBe(script?.[1]);
    expect(indexHtml).toContain('noindex');
  });

  it('points collections at src/content and does not allow creating houses or places', () => {
    type Field = { name: string; widget?: string; fields?: Field[]; i18n?: unknown; multiple?: boolean };
    const config = parse(configText, { maxAliasCount: 1000 }) as {
      backend: { name: string; repo: string };
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
      repo: 'rednaw/anticobagliosiciliano'
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
    const cortile = homeFile?.fields?.find((field) => field.name === 'cortile');
    expect(cortile?.fields?.[0]).toMatchObject({ name: 'image', widget: 'image' });
    const giardino = homeFile?.fields?.find((field) => field.name === 'giardino');
    expect(giardino?.fields?.map((field) => field.name).slice(0, 2)).toEqual(['image', 'agrumeto']);
    const pageFiles = byName.pages.files?.map((file) => file.file) ?? [];
    expect(pageFiles).toEqual(
      expect.arrayContaining([
        'src/content/site.yml',
        'src/content/home.yml',
        'src/content/contact.yml',
        'src/content/arrive.yml',
        'src/content/imperdibili.yml',
        'src/content/privacy.yml'
      ])
    );
  });
});
