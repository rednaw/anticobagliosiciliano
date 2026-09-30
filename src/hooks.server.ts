import { localeFromPath } from '$lib/locale';
import { SIMPLE_ANALYTICS_HOSTNAME, SITE_BASE } from '$lib/site-config';
import type { Handle } from '@sveltejs/kit';

const CSP_META = /<meta\s+http-equiv="content-security-policy"[^>]*>\s*/i;

function isAdminPath(pathname: string): boolean {
  const base = SITE_BASE || '';
  const admin = `${base}/admin`;
  return pathname === admin || pathname.startsWith(`${admin}/`);
}

/** Prerendered HTML must carry the right `lang` and analytics hostname. */
export const handle: Handle = async ({ event, resolve }) => {
  const locale = localeFromPath(event.url.pathname);
  const admin = isAdminPath(event.url.pathname);
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => {
      let out = html
        .replace(/<html\b([^>]*)\blang="it"/, `<html$1lang="${locale}"`)
        .replaceAll('__SIMPLE_ANALYTICS_HOSTNAME__', SIMPLE_ANALYTICS_HOSTNAME);
      if (admin) {
        // ssr=false shells omit layout <svelte:head>; inject what static admin had.
        out = out
          .replace(CSP_META, '')
          .replace(
            /<meta name="viewport"[^>]*>/,
            `$&\n    <meta name="robots" content="noindex" />\n    <title>CMS — Antico Baglio Siciliano</title>`
          );
      }
      return out;
    }
  });
  if (admin) {
    // Dev serves CSP as a response header (font-src 'self' blocks CMS jsDelivr
    // Material Symbols → raw icon ligature names in the sidebar). Pages has no
    // headers; we also strip the meta tag above for prerendered HTML.
    response.headers.delete('content-security-policy');
  }
  return response;
};
