import { base } from '$app/paths';
import { localeFromPath } from '$lib/locale';
import type { Handle } from '@sveltejs/kit';

/** Prerendered HTML must carry the right `lang` — `$effect` only runs after hydration. */
export const handle: Handle = async ({ event, resolve }) => {
	const locale = localeFromPath(event.url.pathname, base);
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('<html lang="it">', `<html lang="${locale}">`)
	});
};
