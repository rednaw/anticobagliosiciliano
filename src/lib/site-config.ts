/**
 * Public host for canonicals, hreflang, sitemap, Open Graph, and Simple Analytics.
 *
 * This is a GitHub Pages *project* site, so pages live under SITE_BASE
 * (`https://rednaw.github.io/anticobagliosiciliano/`). After owner review, set
 * SITE_HOSTNAME to `anticobagliosiciliano.it`, SITE_BASE to `''`, and Pages →
 * Custom domain. `app.html` `data-hostname` is filled from SITE_HOSTNAME at
 * prerender.
 */
export const SITE_HOSTNAME = 'rednaw.github.io';

/**
 * SvelteKit `paths.base`. Must start with `/` and must not end with `/`.
 * Empty string when the site is served at the domain root.
 */
export const SITE_BASE = '/anticobagliosiciliano';

/** Scheme + host only. Paths go through `absoluteUrl()` so SITE_BASE is applied. */
export const SITE_ORIGIN = `https://${SITE_HOSTNAME}`;

/** Flip to `true` on launch so search engines can index the site. */
export const SITE_PUBLIC = true;
