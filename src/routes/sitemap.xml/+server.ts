import { housesSource } from '$lib/data/content';
import { SITE_ORIGIN } from '$lib/site-config';
import { absoluteUrl, standardHref, type Locale } from '$lib/standard/i18n';
import type { RequestHandler } from './$types';

export const prerender = true;
export const trailingSlash = 'never';

const subpaths = [
	'',
	'imperdibili',
	'come-arrivare',
	'contatti',
	'privacy',
	...housesSource.map((h) => `case/${h.slug}`)
];

function loc(locale: Locale, subpath: string) {
	return absoluteUrl(standardHref(locale, subpath), SITE_ORIGIN);
}

function escapeXml(value: string) {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

export const GET: RequestHandler = () => {
	const urls = subpaths.flatMap((subpath) => {
		const it = loc('it', subpath);
		const en = loc('en', subpath);
		const alternates = [
			`<xhtml:link rel="alternate" hreflang="it" href="${escapeXml(it)}" />`,
			`<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}" />`,
			`<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(it)}" />`
		].join('');

		return [it, en].map(
			(href) =>
				`<url><loc>${escapeXml(href)}</loc>${alternates}</url>`
		);
	});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

	return new Response(xml, {
		headers: { 'content-type': 'application/xml; charset=utf-8' }
	});
};
