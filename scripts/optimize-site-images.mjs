#!/usr/bin/env node
/**
 * Production image pipeline (two steps around `vite build`):
 *
 *   --emit   Write WebP next to JPEG/PNG in `static/` so prerender can fetch them.
 *            Source files stay as-is. Generated `.webp` are gitignored.
 *   --prune  Drop JPEG/PNG from `build/` after Vite copies them (keep `og-share.jpg`).
 *
 * Skips `og-share.jpg` (Open Graph) and never touches `archivio/`.
 *
 * Usage:
 *   node scripts/optimize-site-images.mjs --emit
 *   node scripts/optimize-site-images.mjs --prune [build-dir]
 *
 * Env: MAX_EDGE (default 1600), QUALITY (default 80)
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png']);
const SKIP_NAMES = new Set(['og-share.jpg', 'og-share.jpeg']);
const MAX_EDGE = Number(process.env.MAX_EDGE ?? 1600);
const QUALITY = Number(process.env.QUALITY ?? 80);
const CONCURRENCY = 8;

const args = process.argv.slice(2);
const emit = args.includes('--emit');
const prune = args.includes('--prune');
const positional = args.filter((a) => !a.startsWith('--'));

/**
 * @param {string} dir
 * @param {string[]} [acc]
 */
async function walk(dir, acc = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err && /** @type {NodeJS.ErrnoException} */ (err).code === 'ENOENT') return acc;
    throw err;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) await walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

/**
 * @template T, R
 * @param {T[]} items
 * @param {number} limit
 * @param {(item: T) => Promise<R>} fn
 */
async function mapPool(items, limit, fn) {
  /** @type {Set<Promise<R>>} */
  const pending = new Set();
  /** @type {Promise<R>[]} */
  const results = [];
  for (const item of items) {
    const run = Promise.resolve().then(() => fn(item));
    results.push(run);
    pending.add(run);
    run.finally(() => pending.delete(run));
    if (pending.size >= limit) await Promise.race(pending);
  }
  return Promise.all(results);
}

/** @param {string} src */
function destFor(src) {
  return src.replace(/\.(jpe?g|png)$/i, '.webp');
}

/** @param {string} file */
function isConvertible(file) {
  const ext = path.extname(file).toLowerCase();
  if (!SOURCE_EXT.has(ext)) return false;
  if (SKIP_NAMES.has(path.basename(file).toLowerCase())) return false;
  return true;
}

/**
 * @param {string} src
 * @returns {Promise<{ src: string, dest: string, before: number, after: number } | { skipped: true, src: string, dest: string } | null>}
 */
async function emitWebp(src) {
  if (!isConvertible(src)) return null;

  const dest = destFor(src);
  const before = (await fs.stat(src)).size;

  try {
    const destStat = await fs.stat(dest);
    const srcStat = await fs.stat(src);
    if (destStat.mtimeMs >= srcStat.mtimeMs) {
      return { skipped: true, src, dest };
    }
  } catch (err) {
    if (!(err && /** @type {NodeJS.ErrnoException} */ (err).code === 'ENOENT')) throw err;
  }

  await sharp(src)
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: QUALITY })
    .toFile(dest);

  const after = (await fs.stat(dest)).size;
  return { src, dest, before, after };
}

async function runEmit() {
  const searchRoots = [path.join(root, 'static', 'images'), path.join(root, 'static', 'videos')];
  /** @type {string[]} */
  const files = [];
  for (const dir of searchRoots) files.push(...(await walk(dir)));

  /** @type {Exclude<Awaited<ReturnType<typeof emitWebp>>, null>[]} */
  const results = [];
  await mapPool(files, CONCURRENCY, async (file) => {
    const result = await emitWebp(file);
    if (result) results.push(result);
  });

  const converted = results.filter((r) => !('skipped' in r));
  const skipped = results.filter((r) => 'skipped' in r);
  converted.sort((a, b) => a.src.localeCompare(b.src));

  let bytesBefore = 0;
  let bytesAfter = 0;
  for (const item of converted) {
    bytesBefore += item.before;
    bytesAfter += item.after;
    const rel = path.relative(path.join(root, 'static'), item.src);
    console.log(`  ${rel} → ${path.basename(item.dest)} (${item.before} → ${item.after} bytes)`);
  }

  console.log(
    `optimize-site-images: emit converted=${converted.length} skipped=${skipped.length}`
  );
  if (converted.length) {
    console.log(
      'optimize-site-images: image payload ' +
        `${(bytesBefore / 1048576).toFixed(2)} MiB → ${(bytesAfter / 1048576).toFixed(2)} MiB ` +
        `(max edge ${MAX_EDGE}px, quality ${QUALITY})`
    );
  }
}

async function runPrune() {
  const siteDir = path.resolve(root, positional[0] ?? 'build');
  const searchRoots = [path.join(siteDir, 'images'), path.join(siteDir, 'videos')];
  /** @type {string[]} */
  const files = [];
  for (const dir of searchRoots) files.push(...(await walk(dir)));

  let removed = 0;
  for (const file of files) {
    if (!isConvertible(file)) continue;
    await fs.unlink(file);
    removed += 1;
  }

  console.log(`optimize-site-images: prune removed=${removed} jpeg/png from ${path.relative(root, siteDir)}`);
}

async function main() {
  if (emit === prune) {
    console.error('Usage: node scripts/optimize-site-images.mjs --emit | --prune [build-dir]');
    process.exit(1);
  }
  if (emit) await runEmit();
  else await runPrune();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
