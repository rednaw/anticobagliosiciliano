import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { COPY_CSV_FILE, csvRowsToCopyRows, parseCsv, stringifyCsv } from '../src/lib/copy-catalog';

const root = resolve(import.meta.dirname, '..');
const overridesPath = resolve(root, 'src/lib/data/copy-overrides.json');
const csvPath = resolve(root, 'copy', COPY_CSV_FILE);

const emptyOverrides = '{}\n';
const originalOverrides = existsSync(overridesPath)
  ? readFileSync(overridesPath, 'utf8')
  : emptyOverrides;

beforeEach(() => {
  writeFileSync(overridesPath, emptyOverrides);
});

afterEach(() => {
  writeFileSync(overridesPath, originalOverrides);
});

describe('copy:export / copy:import', () => {
  it('writes one Italian-headed CSV with a stable id column', () => {
    execFileSync('node', ['scripts/export-copy.mjs'], { cwd: root, stdio: 'pipe' });

    const csv = parseCsv(readFileSync(csvPath, 'utf8'));

    expect(csv.header).toEqual(['pagina', 'italiano', 'inglese', 'id']);
    expect(csv.rows.length).toBeGreaterThan(100);

    const ids = csv.rows.map((row) => row.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('houses.casa-1.tagline');
    expect(ids).toContain('ui.navHouses');
    expect(ids).toContain('testimonials.0.name');
    expect(csv.rows.some((row) => row.pagina === '/case/casa-1/')).toBe(true);
    expect(csv.rows.some((row) => row.italiano.includes('Spaziosa, luminosa'))).toBe(true);
    expect(csv.rows.some((row) => row.italiano.includes('/images/'))).toBe(false);
  });

  it('imports an owner italiano change and shows it on the next export', () => {
    execFileSync('node', ['scripts/export-copy.mjs'], { cwd: root, stdio: 'pipe' });

    const rows = csvRowsToCopyRows(parseCsv(readFileSync(csvPath, 'utf8')).rows);
    const target = rows.find((row) => row.id === 'home.chiSiamo.title');
    expect(target).toBeDefined();
    target!.italiano = 'Chi siamo oggi';
    writeFileSync(csvPath, stringifyCsv(rows));

    execFileSync('node', ['scripts/import-copy.mjs'], { cwd: root, stdio: 'pipe' });
    const overrides = JSON.parse(readFileSync(overridesPath, 'utf8')) as Record<
      string,
      { it?: string; en?: string }
    >;
    expect(overrides['home.chiSiamo.title']).toEqual({ it: 'Chi siamo oggi' });

    execFileSync('node', ['scripts/export-copy.mjs'], { cwd: root, stdio: 'pipe' });
    const exported = csvRowsToCopyRows(parseCsv(readFileSync(csvPath, 'utf8')).rows);
    expect(exported.find((row) => row.id === 'home.chiSiamo.title')?.italiano).toBe(
      'Chi siamo oggi'
    );
  });

  it('imports a semicolon CSV and refuses a file with broken ids', () => {
    execFileSync('node', ['scripts/export-copy.mjs'], { cwd: root, stdio: 'pipe' });
    const rows = csvRowsToCopyRows(parseCsv(readFileSync(csvPath, 'utf8')).rows);
    const target = rows.find((row) => row.id === 'ui.navHome');
    expect(target).toBeDefined();
    target!.italiano = 'Inizio';
    const body = [
      'pagina;italiano;inglese;id',
      ...rows.map(
        (row) =>
          `${row.pagina};"${row.italiano.replaceAll('"', '""')}";"${row.inglese.replaceAll('"', '""')}";${row.id}`
      )
    ].join('\n');
    writeFileSync(csvPath, `\uFEFF${body}\n`);

    execFileSync('node', ['scripts/import-copy.mjs'], { cwd: root, stdio: 'pipe' });
    const overrides = JSON.parse(readFileSync(overridesPath, 'utf8')) as Record<
      string,
      { it?: string }
    >;
    expect(overrides['ui.navHome']).toEqual({ it: 'Inizio' });

    writeFileSync(csvPath, 'pagina,italiano,inglese,id\n/,x,y,not-a-key\n');
    expect(() =>
      execFileSync('node', ['scripts/import-copy.mjs'], { cwd: root, stdio: 'pipe' })
    ).toThrow(/no id matches/i);
    expect(JSON.parse(readFileSync(overridesPath, 'utf8'))['ui.navHome']).toEqual({ it: 'Inizio' });
  });
});
