import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

function read(rel: string) {
  return readFileSync(resolve(root, rel), 'utf8');
}

describe('prerender regressions', () => {
  it('does not swallow prerender HTTP errors (that shipped a site-wide 404)', () => {
    expect(read('vite.config.ts')).not.toMatch(/handleHttpError\s*:/);
  });

  it('does not read page.url.search while prerendering (that threw on every HTML page)', () => {
    const header = read('src/lib/standard/Header.svelte');
    expect(header).toMatch(/import\s*\{\s*building\s*\}\s*from\s*'\$app\/environment'/);
    expect(header).toMatch(/building\s*\?\s*''\s*:\s*page\.url\.search/);
  });

  it('applies the contact house query after mount, not during prerender', () => {
    const contact = read('src/routes/(site)/contatti/+page.svelte');
    expect(contact).toMatch(/onMount\s*\(\s*\(\)\s*=>\s*\{[\s\S]*page\.url\.searchParams/);
    const beforeMount = contact.slice(0, contact.indexOf('onMount'));
    expect(beforeMount).not.toMatch(/page\.url\.search/);
  });

  it('reports Simple Analytics under SIMPLE_ANALYTICS_HOSTNAME, not SITE_HOSTNAME', () => {
    expect(read('src/app.html')).toContain('data-hostname="__SIMPLE_ANALYTICS_HOSTNAME__"');
    const hooks = read('src/hooks.server.ts');
    expect(hooks).toMatch(/replaceAll\('__SIMPLE_ANALYTICS_HOSTNAME__',\s*SIMPLE_ANALYTICS_HOSTNAME\)/);
    expect(hooks).not.toMatch(/replaceAll\([^)]*SITE_HOSTNAME/);
  });

  it('ships a hashed CSP that allows Simple Analytics, not inline scripts', () => {
    const vite = read('vite.config.ts');
    expect(vite).toMatch(/csp:\s*\{/);
    expect(vite).toMatch(/mode:\s*'hash'/);
    expect(vite).toContain('https://scripts.simpleanalyticscdn.com');
    expect(vite).toContain('https://queue.simpleanalyticscdn.com');
    expect(vite).toMatch(/'script-src':\s*\[[^\]]*'self'/);
    expect(vite).not.toMatch(/'script-src':\s*\[[^\]]*'unsafe-inline'/);
    expect(vite).toMatch(/'style-src':\s*\[[^\]]*'unsafe-inline'/);
    expect(vite).toMatch(/'object-src':\s*\[[^\]]*'none'/);
    expect(vite).toMatch(/'frame-src':\s*\[[^\]]*'none'/);
  });
});
