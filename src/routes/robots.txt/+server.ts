import { SITE_BASE } from '$lib/site-config';
import { absoluteUrl } from '$lib/standard/i18n';
import type { RequestHandler } from './$types';

export const prerender = true;
export const trailingSlash = 'never';

export const GET: RequestHandler = () => {
  const admin = `${SITE_BASE}/admin/`;
  const body = `User-agent: *
Allow: /
Disallow: ${admin}

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' }
  });
};
