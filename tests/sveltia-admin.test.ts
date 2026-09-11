import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { SITE_BASE, SITE_HOSTNAME } from '../src/lib/site-config';

const root = resolve(import.meta.dirname, '..');
const indexHtml = readFileSync(resolve(root, 'static/admin/index.html'), 'utf8');
const configText = readFileSync(resolve(root, 'static/admin/config.yml'), 'utf8');

type Field = {
  name: string;
  widget?: string;
  fields?: Field[];
  i18n?: unknown;
};

type Collection = {
  name: string;
  create?: boolean;
  delete?: boolean;
  folder?: string;
  i18n?: unknown;
  editor?: { preview?: boolean };
  files?: Array<{ name?: string; file: string; i18n?: unknown; fields?: Field[] }>;
  fields?: Field[];
};

type CmsConfig = {
  backend: {
    name: string;
    repo: string;
    base_url?: string;
    auth_methods?: string[];
  };
  site_url?: string;
  display_url?: string;
  media_folder: string;
  public_folder: string;
  i18n?: unknown;
  slug?: unknown;
  collections: Collection[];
};

const config = parse(configText, { maxAliasCount: 1000 }) as CmsConfig;
const byName = Object.fromEntries(config.collections.map((c) => [c.name, c]));

function listYml(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listYml(path);
    return entry.name.endsWith('.yml') ? [path] : [];
  });
}

function assertYamlMatchesCms(label: string, data: unknown, fields: Field[] | undefined) {
  expect(fields, `${label} has CMS fields`).toBeDefined();
  if (data == null || typeof data !== 'object') return;
  if (Array.isArray(data)) {
    const item = data.find((entry) => entry && typeof entry === 'object' && !Array.isArray(entry));
    if (item && fields?.length) assertYamlMatchesCms(`${label}[]`, item, fields);
    return;
  }
  const yamlKeys = Object.keys(data);
  const cmsKeys = fields!.map((field) => field.name);
  const missing = yamlKeys.filter((key) => !cmsKeys.includes(key));
  expect(missing, `${label} YAML keys missing from CMS`).toEqual([]);
  expect(
    cmsKeys.filter((key) => yamlKeys.includes(key)),
    `${label} field order`
  ).toEqual(yamlKeys);
  for (const field of fields!) {
    if (!yamlKeys.includes(field.name) || !field.fields) continue;
    assertYamlMatchesCms(`${label}.${field.name}`, (data as Record<string, unknown>)[field.name], field.fields);
  }
}

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

  it('308s /admin to /admin/ so relative CMS assets resolve', () => {
    const vite = readFileSync(resolve(root, 'vite.config.ts'), 'utf8');
    expect(vite).toMatch(/statusCode = 308/);
    expect(vite).toMatch(/path === admin/);
    expect(vite).toMatch(/path === withSlash/);
  });

  it('points at this repo, OAuth, and the public site origin', () => {
    const publicOrigin = `https://${SITE_HOSTNAME}${SITE_BASE}`;
    expect(config.backend).toMatchObject({
      name: 'github',
      repo: 'rednaw/anticobagliosiciliano',
      base_url: 'https://auth.tientjeketama.nl',
      auth_methods: ['oauth']
    });
    expect(config.site_url).toBe(publicOrigin);
    expect(config.display_url).toBe(publicOrigin);
    expect(config).toMatchObject({
      media_folder: 'static/images',
      public_folder: '/images'
    });
    expect(config.i18n).toBeUndefined();
    expect(config.slug).toBeUndefined();
  });

  it('covers every content YAML key in CMS field order, without creating houses or places', () => {
    expect(config.collections.map((c) => c.name)).toEqual(['pages', 'houses', 'places']);
    expect(byName.pages.editor).toMatchObject({ preview: false });
    expect(byName.houses).toMatchObject({
      create: false,
      delete: false
    });
    expect(byName.houses.folder).toBeUndefined();
    expect(byName.places).toMatchObject({
      folder: 'src/content/places',
      create: false,
      delete: false
    });
    expect(byName.chrome).toBeUndefined();
    expect(byName.pages.i18n).toBeUndefined();
    expect(byName.houses.i18n).toBeUndefined();
    expect(byName.places.i18n).toBeUndefined();

    const pageFiles = byName.pages.files ?? [];
    const houseFiles = byName.houses.files ?? [];
    expect(pageFiles.at(-1)).toMatchObject({
      name: 'chrome',
      file: 'src/content/site.yml'
    });
    expect(houseFiles.slice(0, -1).map((file) => file.file)).toEqual([
      'src/content/houses/casa-1.yml',
      'src/content/houses/casa-2.yml',
      'src/content/houses/casa-3.yml',
      'src/content/houses/casa-4.yml'
    ]);
    expect(houseFiles.at(-1)).toMatchObject({
      name: 'chrome',
      file: 'src/content/accommodation.yml'
    });

    const cmsFiles = [
      ...pageFiles.map((file) => resolve(root, file.file)),
      ...houseFiles.map((file) => resolve(root, file.file)),
      ...listYml(resolve(root, 'src/content/places'))
    ].map((path) => relative(root, path).replaceAll('\\', '/'));
    const diskFiles = listYml(resolve(root, 'src/content')).map((path) =>
      relative(root, path).replaceAll('\\', '/')
    );
    expect(cmsFiles.sort()).toEqual(diskFiles.sort());

    for (const file of [...pageFiles, ...houseFiles]) {
      const data = parse(readFileSync(resolve(root, file.file), 'utf8'));
      assertYamlMatchesCms(file.file, data, file.fields);
    }
    for (const path of listYml(resolve(root, byName.places.folder!))) {
      const data = parse(readFileSync(path, 'utf8'));
      assertYamlMatchesCms(`places/${relative(root, path)}`, data, byName.places.fields);
    }

    const weather = pageFiles
      ?.find((file) => file.file === 'src/content/arrive.yml')
      ?.fields?.find((field) => field.name === 'weather');
    expect(weather?.fields?.find((field) => field.name === 'line')).toMatchObject({
      widget: 'hidden'
    });
    expect(weather?.fields?.find((field) => field.name === 'aria')).toMatchObject({
      widget: 'hidden'
    });
  });
});
