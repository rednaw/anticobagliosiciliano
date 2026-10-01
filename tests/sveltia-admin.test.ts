import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { cmsConfig } from '../src/lib/cms-config';
import { SITE_BASE, SITE_HOSTNAME } from '../src/lib/site-config';

const root = resolve(import.meta.dirname, '..');

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
  thumbnail?: boolean | string | string[];
  files?: Array<{
    name?: string;
    file: string;
    i18n?: unknown;
    fields?: Field[];
    media_folder?: string;
    public_folder?: string;
  }>;
  fields?: Field[];
};

const config = cmsConfig as {
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
  asset_collections?: Array<{
    name: string;
    label?: string;
    media_folder: string;
    public_folder?: string;
  }>;
};

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
  it('bundles @sveltia/cms via the Kit /admin route, not unpkg or a copied IIFE', () => {
    const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
      devDependencies: Record<string, string>;
    };
    // Exact pin (no ^/~) so Renovate bumps intentionally; version floats with Do 2.
    expect(pkg.devDependencies['@sveltia/cms']).toMatch(/^\d+\.\d+\.\d+$/);

    const page = readFileSync(resolve(root, 'src/routes/(cms)/admin/+page.svelte'), 'utf8');
    const pageTs = readFileSync(resolve(root, 'src/routes/(cms)/admin/+page.ts'), 'utf8');
    const layout = readFileSync(resolve(root, 'src/routes/(cms)/admin/+layout.svelte'), 'utf8');
    expect(page).toMatch(/import\s+CMS\s+from\s+'@sveltia\/cms'/);
    expect(page).toMatch(/CMS\.init\s*\(/);
    expect(page).toMatch(/load_config_file:\s*false/);
    expect(page).toContain('cms-config');
    expect(pageTs).toMatch(/ssr\s*=\s*false/);
    expect(layout).toContain('noindex');
    expect(page).not.toContain('unpkg.com');
    expect(layout).not.toContain('unpkg.com');

    const vite = readFileSync(resolve(root, 'vite.config.ts'), 'utf8');
    expect(vite).not.toMatch(/sveltiaCmsPlugin|sveltiaIife|copySveltiaCms|adminIndexPlugin/);
    expect(existsSync(resolve(root, 'static/admin'))).toBe(false);
    expect(existsSync(resolve(root, 'src/lib/cms-config.ts'))).toBe(true);

    const hooks = readFileSync(resolve(root, 'src/hooks.server.ts'), 'utf8');
    expect(hooks).toMatch(/UMAMI_SCRIPT|analytics\.rednaw\.nl/);
    expect(hooks).toMatch(/SA_SCRIPT|simpleanalyticscdn/);
    expect(hooks).toMatch(/isAdminPath/);
  });

  it('points at this repo, OAuth, and the public site origin', () => {
    const publicOrigin = `https://${SITE_HOSTNAME}${SITE_BASE}`;
    expect(config.backend).toMatchObject({
      name: 'github',
      repo: 'rednaw/anticobagliosiciliano',
      base_url: 'https://auth.rednaw.nl',
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
      delete: false,
      thumbnail: false
    });
    expect(byName.chrome).toBeUndefined();
    expect(byName.pages.i18n).toBeUndefined();
    expect(byName.houses.i18n).toBeUndefined();
    expect(byName.places.i18n).toBeUndefined();

    const pageFiles = byName.pages.files ?? [];
    const houseFiles = byName.houses.files ?? [];
    for (const collection of config.collections) {
      if (collection.files) {
        for (const file of collection.files) {
          expect(file.file, `${collection.name}/${file.name}`).toBe(
            `src/content/${collection.name}/${file.name}.yml`
          );
        }
      } else {
        expect(collection.folder, collection.name).toBe(`src/content/${collection.name}`);
      }
    }

    expect(pageFiles.at(-1)).toMatchObject({
      name: 'chrome',
      file: 'src/content/pages/chrome.yml'
    });
    expect(houseFiles.slice(0, -1).map((file) => file.file)).toEqual([
      'src/content/houses/casa-1.yml',
      'src/content/houses/casa-2.yml',
      'src/content/houses/casa-3.yml',
      'src/content/houses/casa-4.yml'
    ]);
    expect(houseFiles.at(-1)).toMatchObject({
      name: 'chrome',
      file: 'src/content/houses/chrome.yml'
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

    expect(pageFiles.find((file) => file.name === 'arrive')).toMatchObject({
      media_folder: '/static/images/arrive',
      public_folder: '/images/arrive'
    });
    expect(pageFiles.find((file) => file.name === 'home')).toMatchObject({
      media_folder: '/static/images/ambiance',
      public_folder: '/images/ambiance'
    });
    expect(pageFiles.find((file) => file.name === 'awards')).toMatchObject({
      media_folder: '/static/images/awards',
      public_folder: '/images/awards'
    });
    expect(pageFiles.find((file) => file.name === 'contact')?.media_folder).toBeUndefined();
    expect(byName.places).toMatchObject({
      media_folder: '/static/images/places',
      public_folder: '/images/places'
    });
    for (const n of [1, 2, 3, 4] as const) {
      expect(houseFiles.find((file) => file.name === `casa-${n}`)).toMatchObject({
        media_folder: `/static/images/houses/casa-${n}`,
        public_folder: `/images/houses/casa-${n}`
      });
    }
    expect(config.asset_collections).toEqual([
      {
        name: 'home-photos',
        label: 'Home',
        media_folder: '/static/images/ambiance',
        public_folder: '/images/ambiance'
      },
      {
        name: 'awards-photos',
        label: 'Premi',
        media_folder: '/static/images/awards',
        public_folder: '/images/awards'
      },
      {
        name: 'arrive-photos',
        label: 'Come arrivare',
        media_folder: '/static/images/arrive',
        public_folder: '/images/arrive'
      },
      {
        name: 'casa-1-photos',
        label: 'Casa 1',
        media_folder: '/static/images/houses/casa-1',
        public_folder: '/images/houses/casa-1'
      },
      {
        name: 'casa-2-photos',
        label: 'Casa 2',
        media_folder: '/static/images/houses/casa-2',
        public_folder: '/images/houses/casa-2'
      },
      {
        name: 'casa-3-photos',
        label: 'Casa 3',
        media_folder: '/static/images/houses/casa-3',
        public_folder: '/images/houses/casa-3'
      },
      {
        name: 'casa-4-photos',
        label: 'Casa 4',
        media_folder: '/static/images/houses/casa-4',
        public_folder: '/images/houses/casa-4'
      },
      {
        name: 'luoghi-photos',
        label: 'Luoghi',
        media_folder: '/static/images/places',
        public_folder: '/images/places'
      }
    ]);
    const collectionNames = new Set(config.collections.map((c) => c.name));
    for (const asset of config.asset_collections ?? []) {
      expect(collectionNames.has(asset.name), `${asset.name} collides with a collection`).toBe(
        false
      );
    }
    const weather = pageFiles
      ?.find((file) => file.file === 'src/content/pages/arrive.yml')
      ?.fields?.find((field) => field.name === 'weather');
    expect(weather?.fields?.find((field) => field.name === 'line')).toMatchObject({
      widget: 'hidden'
    });
    expect(weather?.fields?.find((field) => field.name === 'aria')).toMatchObject({
      widget: 'hidden'
    });
  });
});
