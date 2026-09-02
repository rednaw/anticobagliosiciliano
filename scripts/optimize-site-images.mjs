#!/usr/bin/env node
/**
 * Production image pipeline (two steps around `vite build`):
 *
 *   --emit   Write WebP next to JPEG/PNG in `static/` so prerender can fetch them.
 *            Source files stay as-is. Generated `.webp` are gitignored.
 *   --prune  Drop JPEG/PNG from `build/` after Vite copies them.
 *   --verify-light  Spot-check that every convertible source has a -light.webp
 *            within LIGHT_MAX_EDGE (after --emit).
 *
 * Usage:
 *   node scripts/optimize-site-images.mjs --emit
 *   node scripts/optimize-site-images.mjs --prune [build-dir]
 *   node scripts/optimize-site-images.mjs --verify-light
 *
 * Env: MAX_EDGE (default 1600), QUALITY (default 80),
 *      LIGHT_MAX_EDGE (default 800), LIGHT_QUALITY (default 80)
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png']);
const MAX_EDGE = Number(process.env.MAX_EDGE ?? 1600);
const QUALITY = Number(process.env.QUALITY ?? 80);
const LIGHT_MAX_EDGE = Number(process.env.LIGHT_MAX_EDGE ?? 800);
const LIGHT_QUALITY = Number(process.env.LIGHT_QUALITY ?? 80);
const CONCURRENCY = 8;

const args = process.argv.slice(2);
const emit = args.includes('--emit');
const prune = args.includes('--prune');
const verifyLight = args.includes('--verify-light');
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
function destFull(src) {
  return src.replace(/\.(jpe?g|png)$/i, '.webp');
}

/** @param {string} src */
function destLight(src) {
  return src.replace(/\.(jpe?g|png)$/i, '-light.webp');
}

/** @param {string} file */
function isConvertible(file) {
  const ext = path.extname(file).toLowerCase();
  return SOURCE_EXT.has(ext);
}

/**
 * @param {string} src
 * @param {string} dest
 * @param {number} maxEdge
 * @param {number} quality
 * @returns {Promise<{ src: string, dest: string, before: number, after: number } | { skipped: true, src: string, dest: string } | null>}
 */
async function emitOne(src, dest, maxEdge, quality) {
  if (!isConvertible(src)) return null;

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
    .webp({ quality })
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

  /** @type {Exclude<Awaited<ReturnType<typeof emitOne>>, null>[]} */
  const results = [];
  await mapPool(files, CONCURRENCY, async (file) => {
    const full = await emitOne(file, destFull(file), MAX_EDGE, QUALITY);
    if (full) results.push(full);
    const light = await emitOne(file, destLight(file), LIGHT_MAX_EDGE, LIGHT_QUALITY);
    if (light) results.push(light);
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
        `(full max ${MAX_EDGE}px q${QUALITY}; light max ${LIGHT_MAX_EDGE}px q${LIGHT_QUALITY})`
    );
  }
}

async function runVerifyLight() {
  const files = await collectSources();
  let failed = 0;

  for (const src of files) {
    const dest = destLight(src);
    const rel = path.relative(path.join(root, 'static'), src);
    try {
      await fs.stat(dest);
    } catch {
      console.error(`FAIL  missing ${path.relative(path.join(root, 'static'), dest)} (from ${rel})`);
      failed += 1;
      continue;
    }

    const meta = await sharp(dest).metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    if (w > LIGHT_MAX_EDGE || h > LIGHT_MAX_EDGE) {
      console.error(
        `FAIL  ${path.basename(dest)} is ${w}×${h}, exceeds LIGHT_MAX_EDGE ${LIGHT_MAX_EDGE}`
      );
      failed += 1;
      continue;
    }
    console.log(`ok    ${path.relative(path.join(root, 'static'), dest)} (${w}×${h})`);
  }

  if (failed) {
    console.error(`optimize-site-images: verify-light failed=${failed}`);
    process.exit(1);
  }
  console.log(`optimize-site-images: verify-light ok count=${files.length}`);
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
  const modes = [emit, prune, verifyLight].filter(Boolean).length;
  if (modes !== 1) {
    console.error(
      'Usage: node scripts/optimize-site-images.mjs --emit | --prune [build-dir] | --verify-light'
    );
    process.exit(1);
  }
  if (emit) await runEmit();
  else if (verifyLight) await runVerifyLight();
  else await runPrune();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
