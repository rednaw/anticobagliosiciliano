/// <reference types="vitest/config" />
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { parse as parseYaml } from 'yaml';
import { SITE_BASE } from './src/lib/site-config.ts';

const require = createRequire(import.meta.url);
const repoRoot = fileURLToPath(new URL('.', import.meta.url));

const SA_SCRIPT =
  /<script[\s\S]*?scripts\.simpleanalyticscdn\.com\/latest\.js[\s\S]*?<\/script>\s*/;

/** Public Simple Analytics origins used by `app.html` (`latest.js` + Beacon). */
const SA_SCRIPT_ORIGIN = 'https://scripts.simpleanalyticscdn.com';
const SA_QUEUE_ORIGIN = 'https://queue.simpleanalyticscdn.com';

/** Leaflet raster tiles on Come arrivare (`{s}.tile.openstreetmap.org`). */
const OSM_TILE_ORIGINS = [
  'https://a.tile.openstreetmap.org',
  'https://b.tile.openstreetmap.org',
  'https://c.tile.openstreetmap.org'
] as const;

/** Open-Meteo current conditions on Come arrivare (full tier only). */
const OPEN_METEO_ORIGIN = 'https://api.open-meteo.com';

/** Turn `content/*.yml` imports into JS objects (no yaml parser in the client bundle). */
function yamlDataPlugin(): Plugin {
  return {
    name: 'yaml-data',
    transform(code, id) {
      const file = (id.split('\0').pop() ?? id).split('?')[0];
      if (!file.endsWith('.yml') && !file.endsWith('.yaml')) return;
      return {
        code: `export default ${JSON.stringify(parseYaml(code))};`,
        map: { mappings: '' }
      };
    }
  };
}

/** Copy/serve the npm IIFE next to `static/admin/index.html` (no unpkg). */
function sveltiaIife() {
  const from = join(dirname(require.resolve('@sveltia/cms')), 'sveltia-cms.js');
  return readFileSync(from, 'utf8').replace(
    /\n\/\/# sourceMappingURL=sveltia-cms\.js\.map\s*$/,
    '\n'
  );
}

function copySveltiaCms() {
  writeFileSync(join(repoRoot, 'static/admin/sveltia-cms.js'), sveltiaIife());
}

function sveltiaCmsPlugin(): Plugin {
  let command: 'build' | 'serve' = 'serve';
  return {
    name: 'sveltia-cms',
    configResolved(config) {
      command = config.command;
    },
    buildStart() {
      if (command === 'build') copySveltiaCms();
    },
    configureServer(server) {
      const urlPath = `${SITE_BASE}/admin/sveltia-cms.js`;
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0];
        if (path !== urlPath) return next();
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(sveltiaIife());
      });
    }
  };
}

/** `/admin` → `/admin/` (relative CMS assets). `/admin/` → `index.html` (Vite has no directory index; Pages does). */
function adminIndexPlugin(): Plugin {
  const admin = `${SITE_BASE}/admin`;
  const withSlash = `${admin}/`;
  const indexed = `${admin}/index.html`;
  function splitUrl(url: string | undefined) {
    if (!url) return { path: '', query: '' };
    const q = url.indexOf('?');
    return q === -1 ? { path: url, query: '' } : { path: url.slice(0, q), query: url.slice(q) };
  }
  function attachQuery(path: string, query: string) {
    return query ? `${path}${query}` : path;
  }
  function middleware(req: { url?: string }, res: { statusCode: number; setHeader: (n: string, v: string) => void; end: () => void }, next: () => void) {
    const { path, query } = splitUrl(req.url);
    if (path === admin) {
      res.statusCode = 308;
      res.setHeader('Location', attachQuery(withSlash, query));
      res.end();
      return;
    }
    if (path === withSlash) {
      req.url = attachQuery(indexed, query);
    }
    next();
  }
  return {
    name: 'admin-index',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
}

/** Strip Simple Analytics in dev — production builds keep the tag in app.html. */
function simpleAnalyticsDevPlugin(): Plugin {
  return {
    name: 'simple-analytics-dev',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (!ctx.server) return html;
        return html.replace(SA_SCRIPT, '');
      }
    }
  };
}

export default defineConfig({
  plugins: [
    sveltiaCmsPlugin(),
    adminIndexPlugin(),
    yamlDataPlugin(),
    simpleAnalyticsDevPlugin(),
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true
      },
      // Root-absolute under SITE_BASE so GitHub Pages 404.html works at nested URLs.
      paths: { base: SITE_BASE, relative: false },
      adapter: adapter({
        fallback: undefined,
        precompress: false,
        strict: true
      }),
      prerender: {
        entries: ['*']
      },
      // GitHub Pages cannot set CSP headers. SvelteKit emits a <meta> tag and
      // hashes the inline scripts it generates. style-src needs unsafe-inline
      // for Reveal --delay, the app.html wrapper, and the noscript .reveal rule.
      csp: {
        mode: 'hash',
        directives: {
          'default-src': ['none'],
          'base-uri': ['self'],
          'form-action': ['self'],
          'script-src': ['self', SA_SCRIPT_ORIGIN],
          'style-src': ['self', 'unsafe-inline'],
          'img-src': ['self', SA_QUEUE_ORIGIN, ...OSM_TILE_ORIGINS],
          'font-src': ['self'],
          'media-src': ['self'],
          // Script origin is for DevTools fetching latest.js.map.
          'connect-src': ['self', SA_QUEUE_ORIGIN, SA_SCRIPT_ORIGIN, OPEN_METEO_ORIGIN],
          'frame-src': ['none'],
          'object-src': ['none'],
          'worker-src': ['none'],
          'manifest-src': ['self'],
          'upgrade-insecure-requests': true
        }
      }
    })
  ],
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,svelte}'],
      exclude: ['src/**/*.test.ts', 'src/**/*.dom.test.ts']
    }
  }
});
