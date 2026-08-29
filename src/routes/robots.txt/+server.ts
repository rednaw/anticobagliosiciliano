import { absoluteUrl } from '$lib/standard/i18n';
import type { RequestHandler } from './$types';

export const prerender = true;
export const trailingSlash = 'never';

export const GET: RequestHandler = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' }
  });
};
