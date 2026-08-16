# Lodgify site archive (anticobagliosiciliano.com)

Scraped from the older Lodgify booking site for future use.
Not used by the SvelteKit build (`static/images/` remains the live asset source).

- **Source:** https://anticobagliosiciliano.com/
- **Images:** `images/` (Lodgify CDN `l.icdbcdn.com`)
- **Texts:** `text/` (page copy worth preserving, including homepage landing sections)
- **Naming:** Lodgify “Mastro …” labels are the **old** names. Live inventory is **Casa #1–#4** only. Casa sull’agrumeto is a real unit no longer for rent — keep in archive, not on the new site.

## Do not use the `/en/` menu as an English source

Lodgify’s English navigation is **machine translated** and unusable:
`Imperdibili → “Captive”`, `Curiosità → “Curiosity”`,
`Casa di Mastro Giovanni → “House Master John”`,
`Casa sull’Agrumeto → “House the citrus”`.

Only Lodgify’s own platform defaults are genuine English strings:
`Home, Overview, Map, Gallery, Rates, Availability, Reviews, Contact, Book Now`.

For owner-written English chrome use `archive/old-wordpress/text/ui-strings.md`.

Image binaries are intended for Git LFS (`archive/**/*.{jpg,jpeg,png,webp}`).
