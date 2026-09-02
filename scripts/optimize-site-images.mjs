#!/usr/bin/env node
/**
 * Production image pipeline around `vite build`:
 *
 *   (default)  Emit full + light WebP next to JPEG/PNG in `static/`.
 *   prune      Drop JPEG/PNG from `build/` after Vite copies them.
 *
 * Usage:
 *   node scripts/optimize-site-images.mjs
 *   node scripts/optimize-site-images.mjs prune
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png']);
const FULL_MAX_EDGE = 1600;
const LIGHT_MAX_EDGE = 800;
const QUALITY = 80;
const CONCURRENCY = 8;

const mode = process.argv[2] ?? 'emit';

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

/** @param {string} file */
function isConvertible(file) {
  return SOURCE_EXT.has(path.extname(file).toLowerCase());
}

/**
 * @param {string} src
 * @param {string} dest
 * @param {number} maxEdge
 */
async function emitOne(src, dest, maxEdge) {
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
      width: maxEdge,
      height: maxEdge,
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: QUALITY })
    .toFile(dest);

  const after = (await fs.stat(dest)).size;
  return { src, dest, before, after };
}

async function collectSources() {
  const searchRoots = [path.join(root, 'static', 'images'), path.join(root, 'static', 'videos')];
  /** @type {string[]} */
  const files = [];
  for (const dir of searchRoots) files.push(...(await walk(dir)));
  return files.filter(isConvertible);
}

async function runEmit() {
  const files = await collectSources();

  /** @type {Awaited<ReturnType<typeof emitOne>>[]} */
  const results = [];
  await mapPool(files, CONCURRENCY, async (file) => {
    results.push(
      await emitOne(file, file.replace(/\.(jpe?g|png)$/i, '.webp'), FULL_MAX_EDGE)
    );
    results.push(
      await emitOne(file, file.replace(/\.(jpe?g|png)$/i, '-light.webp'), LIGHT_MAX_EDGE)
    );
  });

  const converted = results.filter((r) => !('skipped' in r));
  const skipped = results.filter((r) => 'skipped' in r);
  converted.sort((a, b) => a.dest.localeCompare(b.dest));

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
        `(full max ${FULL_MAX_EDGE}px; light max ${LIGHT_MAX_EDGE}px; q${QUALITY})`
    );
  }
}

async function runPrune() {
  const siteDir = path.join(root, 'build');
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

  console.log(
    `optimize-site-images: prune removed=${removed} jpeg/png from ${path.relative(root, siteDir)}`
  );
}

async function main() {
  if (mode === 'emit') await runEmit();
  else if (mode === 'prune') await runPrune();
  else {
    console.error('Usage: node scripts/optimize-site-images.mjs [emit|prune]');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
