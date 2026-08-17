import { SITE_ORIGIN } from '$lib/site-config';
import type { RequestHandler } from './$types';

export const prerender = true;
export const trailingSlash = 'never';

export const GET: RequestHandler = () => {
	const body = `User-agent: *
Allow: /
Disallow: /archivio

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;

	return new Response(body, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
};
