/**
 * Public host for canonicals, hreflang, sitemap, and Open Graph.
 *
 * This is a GitHub Pages *project* site, so pages live under SITE_BASE
 * (`https://rednaw.github.io/anticobagliosiciliano/`). After owner review, set
 * SITE_HOSTNAME to `anticobagliosiciliano.it`, SITE_BASE to `''`, and Pages →
 * Custom domain. Simple Analytics already reports under that host.
 */
export const SITE_HOSTNAME = 'rednaw.github.io';

/**
 * Simple Analytics website name (`data-hostname` in `app.html`).
 * Already the future public host so the dashboard survives the Pages →
 * custom-domain cutover. Not DNS today. Filled at prerender from
 * `__SIMPLE_ANALYTICS_HOSTNAME__`.
 */
export const SIMPLE_ANALYTICS_HOSTNAME = 'anticobagliosiciliano.it';

/**
 * SvelteKit `paths.base`. Must start with `/` and must not end with `/`.
 * Empty string when the site is served at the domain root.
 */
export const SITE_BASE = '/anticobagliosiciliano';

/** Scheme + host only. Paths go through `absoluteUrl()` so SITE_BASE is applied. */
export const SITE_ORIGIN = `https://${SITE_HOSTNAME}`;

/** Flip to `true` on launch so search engines can index the site. */
export const SITE_PUBLIC = true;
