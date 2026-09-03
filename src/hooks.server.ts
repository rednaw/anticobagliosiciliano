import { localeFromPath } from '$lib/locale';
import { SIMPLE_ANALYTICS_HOSTNAME } from '$lib/site-config';
import type { Handle } from '@sveltejs/kit';

/** Prerendered HTML must carry the right `lang` and analytics hostname. */
export const handle: Handle = async ({ event, resolve }) => {
  const locale = localeFromPath(event.url.pathname);
  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html
        .replace(/<html\b([^>]*)\blang="it"/, `<html$1lang="${locale}"`)
        .replaceAll('__SIMPLE_ANALYTICS_HOSTNAME__', SIMPLE_ANALYTICS_HOSTNAME)
  });
};
