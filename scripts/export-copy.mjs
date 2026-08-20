#!/usr/bin/env node
/**
 * Export site copy to UTF-8 CSV (`copy/testi.csv`).
 *
 *   npm run copy:export
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { root } from './register-lib.mjs';

const catalog = await import(pathToFileURL(path.join(root, 'src/lib/copy-catalog.ts')).href);
const content = await import(pathToFileURL(path.join(root, 'src/lib/data/content.ts')).href);
const { ui } = await import(pathToFileURL(path.join(root, 'src/lib/standard/i18n.ts')).href);

const rows = catalog.collectCopyRows(content, ui, catalog.copyOverrides);

const outDir = path.join(root, 'copy');
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, catalog.COPY_CSV_FILE);
writeFileSync(outPath, catalog.stringifyCsv(rows));

console.log(`scritti ${rows.length} testi → ${path.relative(root, outPath)}`);
