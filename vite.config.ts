/// <reference types="vitest/config" />
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { SITE_BASE } from './src/lib/site-config.ts';

const SA_SCRIPT =
  /<script[\s\S]*?scripts\.simpleanalyticscdn\.com\/latest\.js[\s\S]*?<\/script>\s*/;

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
