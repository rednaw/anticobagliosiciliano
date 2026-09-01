#!/usr/bin/env node
/**
 * Inspect the prerendered `build/` output. This is what would have caught the
 * GitHub Pages refresh-404: the build succeeded while every real HTML page
 * failed to generate, so `index.html` was the NotFound document.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const build = path.join(root, 'build');
const siteConfig = readFileSync(path.join(root, 'src/lib/site-config.ts'), 'utf8');

const SITE_BASE = siteConfig.match(/export const SITE_BASE = '([^']*)'/)?.[1];
const SITE_HOSTNAME = siteConfig.match(/export const SITE_HOSTNAME = '([^']*)'/)?.[1];
const SIMPLE_ANALYTICS_HOSTNAME = siteConfig.match(
  /export const SIMPLE_ANALYTICS_HOSTNAME = '([^']*)'/
)?.[1];
const SITE_PUBLIC = /export const SITE_PUBLIC = true/.test(siteConfig);

if (SITE_BASE === undefined || !SITE_HOSTNAME || !SIMPLE_ANALYTICS_HOSTNAME) {
  console.error(
    'Could not parse SITE_BASE / SITE_HOSTNAME / SIMPLE_ANALYTICS_HOSTNAME from src/lib/site-config.ts'
  );
  process.exit(1);
}

let failed = 0;

function fail(message) {
  failed += 1;
  console.error(`FAIL  ${message}`);
}

function ok(message) {
  console.log(`ok    ${message}`);
}

function assert(cond, message) {
  if (cond) ok(message);
  else fail(message);
}

function read(rel) {
  const full = path.join(build, rel);
  if (!existsSync(full)) {
    fail(`missing ${rel}`);
    return '';
  }
  return readFileSync(full, 'utf8');
}

function isNotFoundPage(html) {
  return /<p class="eyebrow">\s*404\s*<\/p>/.test(html) || html.includes('Pagina non trovata');
}

function cspContent(html) {
  const match = html.match(/http-equiv="content-security-policy" content="([^"]+)"/i);
  return match?.[1] ?? '';
}

function cspDirective(policy, name) {
  return (
    policy
      .split(';')
      .map((part) => part.trim())
      .find((part) => part === name || part.startsWith(`${name} `)) ?? ''
  );
}

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

if (!existsSync(build)) {
  console.error('build/ is missing — run npm run build first');
  process.exit(1);
}

const homepage = read('index.html');
assert(homepage.length > 0, 'build/index.html exists');
assert(/<h1[^>]*>Antico Baglio Siciliano<\/h1>/.test(homepage), 'homepage h1 is the baglio name, not a 404');
assert(!isNotFoundPage(homepage), 'homepage is not the NotFound document');
assert(/<html lang="it">/.test(homepage), 'homepage html lang is it');
assert(
  homepage.includes(`data-hostname="${SIMPLE_ANALYTICS_HOSTNAME}"`),
  'Simple Analytics hostname is filled in'
);
assert(
  !homepage.includes('__SIMPLE_ANALYTICS_HOSTNAME__'),
  'prerender placeholder __SIMPLE_ANALYTICS_HOSTNAME__ is gone'
);
assert(
  homepage.includes('scripts.simpleanalyticscdn.com/latest.js'),
  'production HTML keeps Simple Analytics'
);

const homepageCsp = cspContent(homepage);
assert(homepageCsp.length > 0, 'homepage has a CSP meta tag');
assert(
  cspDirective(homepageCsp, 'script-src').includes('https://scripts.simpleanalyticscdn.com'),
  'CSP allows the Simple Analytics script origin'
);
assert(
  !cspDirective(homepageCsp, 'script-src').includes('unsafe-inline'),
  'script-src does not allow unsafe-inline'
);
assert(
  /sha256-/.test(cspDirective(homepageCsp, 'script-src')),
  'script-src includes hashes for SvelteKit inline scripts'
);
assert(
  cspDirective(homepageCsp, 'connect-src').includes('https://queue.simpleanalyticscdn.com'),
  'CSP allows the Simple Analytics beacon origin'
);
assert(
  cspDirective(homepageCsp, 'connect-src').includes('https://scripts.simpleanalyticscdn.com'),
  'CSP allows Simple Analytics source maps from the script origin'
);
assert(
  /rel="icon"[^>]*href="(?!data:)[^"]+\.svg"/.test(homepage),
  'favicon is a same-origin svg file, not an inline data URL'
);
assert(
  cspDirective(homepageCsp, 'style-src').includes('unsafe-inline'),
  'style-src allows the inline styles the markup already uses'
);
assert(cspDirective(homepageCsp, 'object-src').includes("'none'"), 'object-src is none');
assert(cspDirective(homepageCsp, 'frame-src').includes("'none'"), 'frame-src is none');
assert(
  cspDirective(homepageCsp, 'img-src').includes('https://a.tile.openstreetmap.org'),
  'img-src allows OpenStreetMap tiles for Come arrivare'
);
assert(!/href="[^"]*\/archivio\/?["#]/.test(homepage), 'homepage does not link to archivio');
assert(homepage.includes(`${SITE_BASE}/come-arrivare/`), 'homepage header can reach Come arrivare');
assert(homepage.includes(`${SITE_BASE}/en/`), 'homepage language switcher reaches English');
assert(
  homepage.includes('application/ld+json'),
  'homepage ships JSON-LD structured data'
);
assert(
  homepage.includes('"@type":"LodgingBusiness"') ||
    homepage.includes('"@type": "LodgingBusiness"'),
  'homepage JSON-LD describes a LodgingBusiness'
);
assert(homepage.includes('#lodging'), 'homepage lodging entity has a stable @id fragment');
assert(
  homepage.includes('maps.app.goo.gl'),
  'homepage lodging JSON-LD includes Google Maps in sameAs'
);
if (SITE_PUBLIC) {
  assert(!/<meta name="robots" content="noindex/.test(homepage), 'public homepage is indexable');
} else {
  assert(
    /<meta name="robots" content="noindex, nofollow"/.test(homepage),
    'pre-launch homepage is noindexed'
  );
}

const enHome = read('en/index.html');
assert(/<html lang="en">/.test(enHome), 'English homepage html lang is en');
assert(/<h1[^>]*>Antico Baglio Siciliano<\/h1>/.test(enHome), 'English homepage is not a 404');
assert(!isNotFoundPage(enHome), 'English homepage is not the NotFound document');
assert(cspContent(enHome).length > 0, 'English homepage has a CSP meta tag');

const notFound = read('404.html');
assert(isNotFoundPage(notFound), '404.html is the NotFound document');
assert(notFound.includes('noindex'), '404.html is noindexed');
assert(cspContent(notFound).length > 0, '404.html has a CSP meta tag');

const contact = read('contatti/index.html');
assert(contact.includes(`mailto:info@anticobagliosiciliano.it`), 'contact page has the mailto');
assert(contact.includes('application/ld+json'), 'contact page ships JSON-LD');
assert(contact.includes('#lodging'), 'contact page repeats the lodging @id');
assert(
  contact.includes('"@type":"LodgingBusiness"') ||
    contact.includes('"@type": "LodgingBusiness"'),
  'contact page JSON-LD describes a LodgingBusiness'
);
assert(contact.includes('%0D%0A'), 'mailto body uses CRLF (iOS)');
assert(/mailto:[^"]+"[^>]*target="_blank"/.test(contact) || /target="_blank"[^>]*href="mailto:/.test(contact), 'mailto opens in a new target, not window.open');
assert(!contact.includes('window.open'), 'contact page does not use window.open');

const occupancy = JSON.parse(
  readFileSync(path.join(root, 'src/lib/data/occupancy.json'), 'utf8')
);
assert(
  JSON.stringify(Object.keys(occupancy.houses ?? {}).sort()) ===
    JSON.stringify(['casa-1', 'casa-2', 'casa-3', 'casa-4']),
  'occupancy snapshot keys are the four public houses'
);

const arrive = read('come-arrivare/index.html');
assert(arrive.includes('Come arrivare'), 'Come arrivare page prerendered in Italian');
assert(arrive.includes('application/ld+json'), 'Come arrivare page ships JSON-LD');
assert(arrive.includes('#lodging'), 'Come arrivare page repeats the lodging @id');
assert(!arrive.includes('<iframe'), 'Come arrivare does not embed a third-party map iframe');
assert(arrive.includes('maps.app.goo.gl'), 'Come arrivare keeps the Google business listing as a click-out');
assert(/fetchpriority="high"/.test(arrive), 'map image is fetchpriority=high');
assert(!arrive.includes('Pagina non trovata'), 'Come arrivare is not a 404');

const arriveEn = read('en/come-arrivare/index.html');
assert(arriveEn.includes('Getting here'), 'English Come arrivare prerendered');
assert(/<html lang="en">/.test(arriveEn), 'English Come arrivare html lang is en');

const privacy = read('privacy/index.html');
assert(privacy.includes('simpleanalytics.com/data-collection'), 'privacy page links Simple Analytics data collection');
assert(
  !privacy.includes('application/ld+json'),
  'privacy page does not ship JSON-LD'
);
assert(
  privacy.includes('osmfoundation.org/wiki/Privacy_Policy#Personal_data_we_receive_automatically'),
  'privacy page links the OpenStreetMap Foundation privacy policy'
);

const casa1 = read('case/casa-1/index.html');
assert(casa1.includes('application/ld+json'), 'house page ships JSON-LD');
assert(
  casa1.includes('"@type":["VacationRental","Accommodation"]') ||
    casa1.includes('"@type": ["VacationRental", "Accommodation"]') ||
    casa1.includes('"@type":"VacationRental"') ||
    casa1.includes('"@type": "VacationRental"'),
  'house page JSON-LD describes a VacationRental'
);
assert(
  casa1.includes('"@type":"BreadcrumbList"') || casa1.includes('"@type": "BreadcrumbList"'),
  'house page JSON-LD includes breadcrumbs'
);
assert(casa1.includes('#rental'), 'house page rental entity has a stable @id fragment');
assert(casa1.includes('#lodging'), 'house page links the rental to the lodging @id');

const archivioHtml = path.join(build, 'archivio', 'index.html');
assert(!existsSync(archivioHtml), 'archivio is not in the production build');
assert(!existsSync(path.join(build, 'archivio')), 'archivio static assets are not in the production build');

const robots = read('robots.txt');
assert(robots.includes(`Sitemap: https://${SITE_HOSTNAME}${SITE_BASE}/sitemap.xml`), 'robots.txt points at the sitemap');

assert(
  existsSync(path.join(build, 'google3e4b083f6284aa55.html')),
  'Search Console HTML verification file is in the build'
);

const sitemap = read('sitemap.xml');
assert(sitemap.includes('xmlns:xhtml'), 'sitemap has hreflang alternates');
assert(!sitemap.includes('/archivio'), 'sitemap does not list archivio');

const locRe = /<loc>([^<]+)<\/loc>/g;
const locs = [];
let match;
while ((match = locRe.exec(sitemap))) locs.push(match[1].replace(/&amp;/g, '&'));
assert(locs.length >= 18, `sitemap lists public pages (got ${locs.length})`);

function fileForLoc(href) {
  const url = new URL(href);
  let pathname = url.pathname;
  if (SITE_BASE && (pathname === SITE_BASE || pathname.startsWith(`${SITE_BASE}/`))) {
    pathname = pathname.slice(SITE_BASE.length) || '/';
  }
  if (pathname.endsWith('/')) return path.join(build, pathname.slice(1), 'index.html');
  return path.join(build, pathname.replace(/^\//, ''));
}

for (const href of locs) {
  const file = fileForLoc(href);
  const rel = path.relative(build, file);
  if (!existsSync(file)) {
    fail(`sitemap URL has no file: ${href} → ${rel}`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  if (isNotFoundPage(html)) fail(`sitemap URL prerendered as 404: ${href}`);
  else ok(`sitemap ${rel}`);
}

const keepJpeg = /(?:^|\/)og-share\.jpe?g$/i;
const imageExt = /\.(jpe?g|png)$/i;
const leaked = [];
for (const dir of ['images', 'videos']) {
  for (const file of walk(path.join(build, dir))) {
    if (imageExt.test(file) && !keepJpeg.test(file)) leaked.push(path.relative(build, file));
  }
}
assert(leaked.length === 0, `build dropped marketing JPEG/PNG (leaked: ${leaked.join(', ') || 'none'})`);
assert(existsSync(path.join(build, 'images/og-share.jpg')), 'og-share.jpg stays JPEG for crawlers');
assert(
  existsSync(path.join(build, 'images/ambiance/mappa.webp')) ||
    existsSync(path.join(build, 'images/ambiance/mappa.jpg')),
  'Come arrivare map is in the build'
);

const required = [
  'imperdibili/index.html',
  'en/imperdibili/index.html',
  'en/contatti/index.html',
  'en/privacy/index.html',
  'case/casa-1/index.html',
  'case/casa-2/index.html',
  'case/casa-3/index.html',
  'case/casa-4/index.html',
  'en/case/casa-1/index.html',
  'en/case/casa-2/index.html',
  'en/case/casa-3/index.html',
  'en/case/casa-4/index.html'
];
for (const rel of required) {
  const html = read(rel);
  assert(html.length > 0 && !isNotFoundPage(html), `${rel} prerendered as a real page`);
}

if (failed) {
  console.error(`\n${failed} build assertion(s) failed`);
  process.exit(1);
}
console.log('\nbuild assertions passed');
