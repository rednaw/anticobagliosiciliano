/// <reference types="vitest/config" />
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { parse as parseYaml } from 'yaml';
import { SITE_BASE } from './src/lib/site-config.ts';

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

/** `/admin/` → `admin/index.html` (Vite has no directory index; Pages does). */
function adminIndexPlugin(): Plugin {
  const admin = `${SITE_BASE}/admin`;
  const indexed = `${admin}/index.html`;
  function rewrite(url: string | undefined) {
    if (!url) return url;
    const [path, query] = url.split('?');
    if (path !== admin && path !== `${admin}/`) return url;
    return query ? `${indexed}?${query}` : indexed;
  }
  return {
    name: 'admin-index',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const nextUrl = rewrite(req.url);
        if (nextUrl) req.url = nextUrl;
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const nextUrl = rewrite(req.url);
        if (nextUrl) req.url = nextUrl;
        next();
      });
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
