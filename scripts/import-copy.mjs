#!/usr/bin/env node
/**
 * Apply the owner CSV onto src/lib/data/copy-overrides.json.
 * Italiano / inglese from the CSV win when they differ from current site text.
 * Blank cells are left unchanged.
 *
 *   npm run copy:import
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { root } from './register-lib.mjs';

const catalog = await import(pathToFileURL(path.join(root, 'src/lib/copy-catalog.ts')).href);
const content = await import(pathToFileURL(path.join(root, 'src/lib/data/content.ts')).href);
const { ui } = await import(pathToFileURL(path.join(root, 'src/lib/standard/i18n.ts')).href);

const required = ['italiano', 'inglese', 'id'];
const csvPath = path.join(root, 'copy', catalog.COPY_CSV_FILE);

if (!existsSync(csvPath)) {
  throw new Error(
    `copy:import: missing ${path.relative(root, csvPath)} — run copy:export first, or put the owner CSV at copy/${catalog.COPY_CSV_FILE}.`
  );
}

const parsed = catalog.parseCsv(readFileSync(csvPath, 'utf8'));
const missing = required.filter((name) => !parsed.header.map((h) => h.toLowerCase()).includes(name));
if (missing.length) {
  throw new Error(
    `copy:import: ${path.relative(root, csvPath)} is missing column(s) ${missing.join(', ')}. Keep headers pagina,italiano,inglese,id.`
  );
}

const records = catalog.csvRowsToCopyRows(parsed.rows);
const knownRows = catalog.collectCopyRows(content, ui);
const known = new Set(knownRows.map((row) => row.id));
const problem = catalog.copyImportProblem(records, known);
if (problem) throw new Error(problem);
// content / ui are already liveCopy'd, so these texts are what the site shows now.
const liveById = Object.fromEntries(
  knownRows.map((row) => [row.id, { italiano: row.italiano, inglese: row.inglese }])
);

const overridesPath = path.join(root, 'src/lib/data/copy-overrides.json');
const existing = JSON.parse(readFileSync(overridesPath, 'utf8'));
const { overrides, unknown } = catalog.mergeImportedRows(
  existing,
  records,
  known,
  liveById
);

writeFileSync(overridesPath, `${JSON.stringify(overrides, null, '\t')}\n`);

const applied = records.length - unknown.length;
console.log(`importati ${applied} testi → ${path.relative(root, overridesPath)}`);
if (unknown.length) {
  console.warn(`ignorati ${unknown.length} id sconosciuti:\n  ${unknown.join('\n  ')}`);
}
