#!/usr/bin/env node
/**
 * Build owner archive browser assets for `archive/browser/`:
 * - archive/browser/public/thumbs/**  (~480px JPEGs)
 * - archive/browser/public/index.json
 *
 * Source photos stay in Git LFS under `archive/` (original-site, lodgify-com, …).
 * Full-res links use media.githubusercontent.com.
 */
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, '..');
const archiveRoot = path.resolve(appRoot, '..');
const repoRoot = path.resolve(archiveRoot, '..');
const outRoot = path.join(appRoot, 'public');
const thumbsRoot = path.join(outRoot, 'thumbs');
const indexPath = path.join(outRoot, 'index.json');

const REPO = 'rednaw/anticobagliosiciliano';
const BRANCH = 'main';
const THUMB_MAX = 480;
const THUMB_QUALITY = 78;

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function mediaUrl(archiveRelPosix) {
  const encoded = archiveRelPosix
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return `https://media.githubusercontent.com/media/${REPO}/refs/heads/${BRANCH}/archive/${encoded}`;
}

function slugId(...parts) {
  const raw = parts.join('/');
  const hash = createHash('sha1').update(raw).digest('hex').slice(0, 10);
  return `${parts.filter(Boolean).join('-').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase()}-${hash}`;
}

function titleFromFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function listImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      files.push(...(await listImages(full)));
    } else if (IMAGE_EXT.has(path.extname(ent.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

async function writeThumb(srcAbs, thumbAbs) {
  await ensureDir(path.dirname(thumbAbs));
  await sharp(srcAbs)
    .rotate()
    .resize({
      width: THUMB_MAX,
      height: THUMB_MAX,
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
    .toFile(thumbAbs);
}

/** Original file size + pixel dimensions (after EXIF orientation). */
async function originalMeta(srcAbs) {
  const [stat, meta] = await Promise.all([fs.stat(srcAbs), sharp(srcAbs).rotate().metadata()]);
  return {
    bytes: stat.size,
    width: meta.width ?? 0,
    height: meta.height ?? 0
  };
}

async function imageEntry({ idParts, filename, title, thumbRel, archiveRel, srcAbs }) {
  await writeThumb(srcAbs, path.join(outRoot, thumbRel));
  const meta = await originalMeta(srcAbs);
  return {
    id: slugId(...idParts),
    filename,
    title,
    thumb: `/${thumbRel}`,
    full: mediaUrl(archiveRel),
    width: meta.width,
    height: meta.height,
    bytes: meta.bytes
  };
}

async function readTextFiles(dir) {
  try {
    const entries = await fs.readdir(dir);
    const texts = [];
    for (const name of entries.sort()) {
      if (!name.endsWith('.md')) continue;
      const body = await fs.readFile(path.join(dir, name), 'utf8');
      texts.push({
        id: slugId('text', name),
        title: name.replace(/\.md$/, '').replace(/-/g, ' '),
        filename: name,
        body
      });
    }
    return texts;
  } catch (err) {
    if (err && err.code === 'ENOENT') return [];
    throw err;
  }
}

async function buildOriginalSite() {
  const base = path.join(archiveRoot, 'original-site');
  const manifest = JSON.parse(await fs.readFile(path.join(base, 'manifest.json'), 'utf8'));
  const groups = [];

  for (const [pageId, files] of Object.entries(manifest.pages || {})) {
    const images = [];
    for (const item of files) {
      if (!item.file) continue;
      const rel = String(item.file).replace(/\\/g, '/');
      const srcAbs = path.join(base, rel);
      try {
        await fs.access(srcAbs);
      } catch {
        console.warn('skip missing', rel);
        continue;
      }
      const thumbRel = `thumbs/original-site/${rel.replace(/\.[^.]+$/, '.jpg')}`;
      images.push(
        await imageEntry({
          idParts: ['original-site', rel],
          filename: path.basename(rel),
          title: titleFromFilename(path.basename(rel)),
          thumbRel,
          archiveRel: `original-site/${rel}`,
          srcAbs
        })
      );
    }
    groups.push({
      id: pageId,
      label: pageId.replace(/-/g, ' '),
      images,
      texts: []
    });
  }

  return {
    id: 'original-site',
    label: 'Sito .it',
    url: manifest.source || 'https://anticobagliosiciliano.it/',
    groups
  };
}

async function buildLodgify() {
  const base = path.join(archiveRoot, 'lodgify-com');
  const imagesDir = path.join(base, 'images');
  const files = await listImages(imagesDir);
  const images = [];

  for (const srcAbs of files) {
    const filename = path.basename(srcAbs);
    const thumbRel = `thumbs/lodgify-com/${filename.replace(/\.[^.]+$/, '.jpg')}`;
    images.push(
      await imageEntry({
        idParts: ['lodgify-com', filename],
        filename,
        title: titleFromFilename(filename),
        thumbRel,
        archiveRel: `lodgify-com/images/${filename}`,
        srcAbs
      })
    );
  }

  const texts = await readTextFiles(path.join(base, 'text'));

  return {
    id: 'lodgify-com',
    label: 'Lodgify .com',
    url: 'https://anticobagliosiciliano.com/',
    groups: [
      {
        id: 'images',
        label: 'Foto',
        images,
        texts: []
      },
      {
        id: 'texts',
        label: 'Testi',
        images: [],
        texts
      }
    ]
  };
}

async function buildVrbo() {
  const base = path.join(archiveRoot, 'vrbo');
  const imagesDir = path.join(base, 'images');
  const files = await listImages(imagesDir);
  const images = [];

  for (const srcAbs of files) {
    const filename = path.basename(srcAbs);
    const thumbRel = `thumbs/vrbo/${filename.replace(/\.[^.]+$/, '.jpg')}`;
    images.push(
      await imageEntry({
        idParts: ['vrbo', filename],
        filename,
        title: titleFromFilename(filename),
        thumbRel,
        archiveRel: `vrbo/images/${filename}`,
        srcAbs
      })
    );
  }

  return {
    id: 'vrbo',
    label: 'Vrbo',
    urls: [
      { label: 'Casa 1', url: 'https://www.vrbo.com/6088172' },
      { label: 'Casa 2', url: 'https://www.vrbo.com/6104472' },
      { label: 'Casa 3', url: 'https://www.vrbo.com/6963407' },
      { label: 'Casa 4', url: 'https://www.vrbo.com/6963226' }
    ],
    groups: [
      {
        id: 'images',
        label: 'Foto',
        images,
        texts: []
      }
    ]
  };
}

async function buildOldWordpress() {
  const base = path.join(archiveRoot, 'old-wordpress');
  const imagesDir = path.join(base, 'images');
  const files = await listImages(imagesDir);
  const images = [];

  for (const srcAbs of files) {
    const filename = path.basename(srcAbs);
    const thumbRel = `thumbs/old-wordpress/${filename.replace(/\.[^.]+$/, '.jpg')}`;
    images.push(
      await imageEntry({
        idParts: ['old-wordpress', filename],
        filename,
        title: titleFromFilename(filename),
        thumbRel,
        archiveRel: `old-wordpress/images/${filename}`,
        srcAbs
      })
    );
  }

  const texts = await readTextFiles(path.join(base, 'text'));

  return {
    id: 'old-wordpress',
    label: 'WordPress.com',
    url: 'https://anticobagliosiciliano.wordpress.com/',
    groups: [
      {
        id: 'images',
        label: 'Foto',
        images,
        texts: []
      },
      {
        id: 'texts',
        label: 'Testi',
        images: [],
        texts
      }
    ]
  };
}

async function latestSourceMtime() {
  const sourceNames = ['original-site', 'lodgify-com', 'old-wordpress', 'vrbo'];
  let max = 0;

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        await walk(full);
      } else {
        const stat = await fs.stat(full);
        max = Math.max(max, stat.mtimeMs);
      }
    }
  }

  for (const name of sourceNames) {
    try {
      await walk(path.join(archiveRoot, name));
    } catch (err) {
      if (err && err.code !== 'ENOENT') throw err;
    }
  }
  return max;
}

async function isUpToDate() {
  try {
    const [indexRaw, sourceMtime] = await Promise.all([
      fs.readFile(indexPath, 'utf8'),
      latestSourceMtime()
    ]);
    const generatedAt = new Date(JSON.parse(indexRaw).generatedAt).getTime();
    await fs.access(thumbsRoot);
    return generatedAt >= sourceMtime;
  } catch {
    return false;
  }
}

async function main() {
  if (await isUpToDate()) {
    console.log('archive build: up to date');
    return;
  }

  console.log('Cleaning', outRoot);
  await fs.rm(outRoot, { recursive: true, force: true });
  await ensureDir(thumbsRoot);

  console.log('Building original-site…');
  const original = await buildOriginalSite();
  console.log('Building lodgify-com…');
  const lodgify = await buildLodgify();
  console.log('Building old-wordpress…');
  const wordpress = await buildOldWordpress();
  console.log('Building vrbo…');
  const vrbo = await buildVrbo();

  const index = {
    generatedAt: new Date().toISOString(),
    repo: REPO,
    branch: BRANCH,
    note: 'Local owner archive browser. Thumbnails are generated under archive/browser/public; full-res opens from GitHub LFS media CDN.',
    sources: [original, lodgify, wordpress, vrbo]
  };

  await fs.writeFile(indexPath, JSON.stringify(index, null, 2) + '\n');

  const imageCount = index.sources.reduce(
    (n, s) => n + s.groups.reduce((m, g) => m + g.images.length, 0),
    0
  );
  const textCount = index.sources.reduce(
    (n, s) => n + s.groups.reduce((m, g) => m + g.texts.length, 0),
    0
  );
  console.log(`Done: ${imageCount} thumbs, ${textCount} texts → ${path.relative(repoRoot, indexPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
