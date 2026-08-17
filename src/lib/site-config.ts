/**
 * Public hostname for canonicals, hreflang, sitemap, Open Graph, and Simple Analytics.
 *
 * Current host is GitHub Pages, pending owner review. After review, set this
 * to `anticobagliosiciliano.it` (and Pages → Custom domain). `app.html`
 * `data-hostname` is filled from this value at prerender.
 */
export const SITE_HOSTNAME = 'anticobagliosiciliano.rednaw.github.io';

export const SITE_ORIGIN = `https://${SITE_HOSTNAME}`;

/** Flip to `true` on launch so search engines can index the site. */
export const SITE_PUBLIC = true;
