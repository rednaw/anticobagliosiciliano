import copyOverridesJson from './data/copy-overrides.json' with { type: 'json' };

/** Optional per-id replacements. Seed copy in `content.ts` / `i18n.ts` stays; these win. */
export type CopyOverride = { it?: string; en?: string };
export type CopyOverrides = Record<string, CopyOverride>;

export type CopyRow = {
  pagina: string;
  italiano: string;
  inglese: string;
  id: string;
};

export const COPY_CSV_HEADER = ['pagina', 'italiano', 'inglese', 'id'] as const;
export const COPY_CSV_FILE = 'testi.csv';

export const copyOverrides = copyOverridesJson as CopyOverrides;

const LOC_KEYS = new Set(['it', 'en']);
const SKIP_STRING = new Set(['image', 'slug', 'href', 'map', 'mapSm', 'size', 'time', 'id', 'email']);

type LocString = { it: string; en: string };
type LocList = { it: string[]; en: string[] };

export type CopySources = {
  site: unknown;
  homeCopy: unknown;
  amenitiesSource: unknown;
  awardsSource: unknown;
  housesSource: Array<{ slug: string }>;
  imperdibiliMeta: unknown;
  imperdibiliLead: unknown;
  imperdibiliRouteCopy: unknown;
  imperdibiliPhotoCreditsCopy: unknown;
  placesSource: Array<{ slug: string }>;
  arriveCopy: unknown;
  baglioLocation: { links: unknown };
  contactCopy: unknown;
  privacyCopy: unknown;
};

function skipKey(key: string, value: unknown): boolean {
  if (key === 'imageCredit') return true;
  if (typeof value === 'function' || typeof value === 'number') return true;
  if (typeof value === 'string' && SKIP_STRING.has(key)) return true;
  return key === 'gallery' && Array.isArray(value);
}

function itemKey(item: unknown, index: number): string {
  if (item && typeof item === 'object') {
    const rec = item as Record<string, unknown>;
    if (typeof rec.slug === 'string') return rec.slug;
    if (typeof rec.id === 'string') return rec.id;
  }
  return String(index);
}

export function isLocString(value: unknown): value is LocString {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const rec = value as Record<string, unknown>;
  if (typeof rec.it !== 'string' || typeof rec.en !== 'string') return false;
  return Object.keys(rec).every((key) => LOC_KEYS.has(key));
}

export function isLocList(value: unknown): value is LocList {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const rec = value as Record<string, unknown>;
  if (!Array.isArray(rec.it) || !Array.isArray(rec.en)) return false;
  return Object.keys(rec).every((key) => LOC_KEYS.has(key));
}

function texts(id: string, italiano: string, inglese: string, overrides: CopyOverrides) {
  const o = overrides[id];
  return {
    italiano: o?.it ?? italiano,
    inglese: o?.en ?? inglese
  };
}

function collect(
  rows: CopyRow[],
  value: unknown,
  pagina: string,
  id: string,
  overrides: CopyOverrides
): void {
  if (isLocString(value)) {
    rows.push({
      pagina,
      id,
      ...texts(id, value.it, value.en, overrides)
    });
    return;
  }
  if (isLocList(value)) {
    const count = Math.max(value.it.length, value.en.length);
    for (let i = 0; i < count; i++) {
      const itemId = `${id}.${i}`;
      rows.push({
        pagina,
        id: itemId,
        ...texts(itemId, value.it[i] ?? '', value.en[i] ?? '', overrides)
      });
    }
    return;
  }
  if (typeof value === 'string') {
    rows.push({
      pagina,
      id,
      ...texts(id, value, value, overrides)
    });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collect(rows, item, pagina, `${id}.${itemKey(item, index)}`, overrides);
    });
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (skipKey(key, child)) continue;
      collect(rows, child, pagina, `${id}.${key}`, overrides);
    }
  }
}

/** Page copy. Combined with UI labels into one CSV; this split is walk order only. */
export function collectPagineRows(content: CopySources, overrides: CopyOverrides = {}): CopyRow[] {
  const rows: CopyRow[] = [];
  const tutto = 'tutto il sito';

  collect(rows, content.site, tutto, 'site', overrides);
  for (const row of rows) {
    if (row.id === 'site.description') row.pagina = '/';
  }

  collect(rows, content.homeCopy, '/', 'home', overrides);

  collect(rows, content.amenitiesSource, '/', 'amenities', overrides);
  collect(rows, content.awardsSource, '/', 'awards', overrides);

  for (const house of content.housesSource) {
    collect(rows, house, `/case/${house.slug}/`, `houses.${house.slug}`, overrides);
  }

  collect(rows, content.imperdibiliMeta, '/imperdibili/', 'imperdibili.meta', overrides);
  collect(rows, content.imperdibiliLead, '/imperdibili/', 'imperdibili.lead', overrides);
  collect(rows, content.imperdibiliRouteCopy, '/imperdibili/', 'imperdibili.route', overrides);
  collect(rows, content.imperdibiliPhotoCreditsCopy, '/imperdibili/crediti-foto/', 'imperdibili.photoCredits', overrides);

  for (const place of content.placesSource) {
    collect(rows, place, `/imperdibili/#${place.slug}`, `places.${place.slug}`, overrides);
  }

  collect(rows, content.arriveCopy, '/come-arrivare/', 'arrive', overrides);
  collect(rows, content.baglioLocation.links, '/come-arrivare/', 'arrive.maps', overrides);
  collect(rows, content.contactCopy, '/contatti/', 'contact', overrides);
  collect(rows, content.privacyCopy, '/privacy/', 'privacy', overrides);

  return rows;
}

export function collectEtichetteRows(
  ui: Record<string, unknown>,
  overrides: CopyOverrides = {}
): CopyRow[] {
  const rows: CopyRow[] = [];
  collect(rows, ui, 'tutto il sito', 'ui', overrides);
  return rows;
}

export function collectCopyRows(
  content: CopySources,
  ui: Record<string, unknown>,
  overrides: CopyOverrides = {}
): CopyRow[] {
  return [...collectPagineRows(content, overrides), ...collectEtichetteRows(ui, overrides)];
}

export function overlayValue<T>(value: T, id: string, overrides: CopyOverrides): T {
  if (Object.keys(overrides).length === 0) return value;
  if (isLocString(value)) {
    const o = overrides[id];
    if (!o) return value;
    return {
      it: o.it ?? value.it,
      en: o.en ?? value.en
    } as T;
  }
  if (isLocList(value)) {
    const count = Math.max(value.it.length, value.en.length);
    const it: string[] = [];
    const en: string[] = [];
    for (let i = 0; i < count; i++) {
      const itemId = `${id}.${i}`;
      const o = overrides[itemId];
      it.push(o?.it ?? value.it[i] ?? '');
      en.push(o?.en ?? value.en[i] ?? '');
    }
    return { it, en } as T;
  }
  if (typeof value === 'string') {
    return (overrides[id]?.it ?? value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      overlayValue(item, `${id}.${itemKey(item, index)}`, overrides)
    ) as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      if (skipKey(key, child)) {
        out[key] = child;
        continue;
      }
      out[key] = overlayValue(child, `${id}.${key}`, overrides);
    }
    return out as T;
  }
  return value;
}

/** Apply committed owner-CSV overrides onto seed copy. */
export function liveCopy<T>(id: string, value: T): T {
  return overlayValue(value, id, copyOverrides);
}

/** Blank / whitespace-only cells mean “leave this language as it is”, not “wipe it”. */
function importedField(
  csv: string,
  live: string | undefined,
  prev: string | undefined
): string | undefined {
  const text = csv.trim();
  if (!text) return prev;
  if (text !== (live ?? text)) return text;
  return prev;
}

/**
 * Store only languages that differ from current site text (`liveById`).
 * Unlisted ids keep their existing overrides (partial CSV). Empty cells do not blank copy.
 */
export function mergeImportedRows(
  existing: CopyOverrides,
  rows: Array<Pick<CopyRow, 'id' | 'italiano' | 'inglese'>>,
  knownIds: Set<string>,
  liveById: Record<string, Pick<CopyRow, 'italiano' | 'inglese'>> = {}
): { overrides: CopyOverrides; unknown: string[] } {
  const overrides: CopyOverrides = { ...existing };
  const unknown: string[] = [];

  for (const row of rows) {
    const id = row.id.trim();
    if (!id) continue;
    if (!knownIds.has(id)) {
      unknown.push(id);
      continue;
    }
    const prev = existing[id] ?? {};
    const live = liveById[id];
    const next: CopyOverride = {};
    const it = importedField(row.italiano, live?.italiano, prev.it);
    const en = importedField(row.inglese, live?.inglese, prev.en);
    if (it !== undefined) next.it = it;
    if (en !== undefined) next.en = en;
    if (Object.keys(next).length) overrides[id] = next;
    else delete overrides[id];
  }

  const sorted = Object.fromEntries(
    Object.keys(overrides)
      .sort()
      .map((id) => [id, overrides[id]])
  );
  return { overrides: sorted, unknown };
}

function csvField(value: string): string {
  if (/[",;\t\n\r]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

export function stringifyCsv(
  rows: CopyRow[],
  header: readonly string[] = COPY_CSV_HEADER
): string {
  const lines = [
    header.join(','),
    ...rows.map((row) => header.map((key) => csvField(row[key as keyof CopyRow] ?? '')).join(','))
  ];
  return `\uFEFF${lines.join('\n')}\n`;
}

function parseCsvRows(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let i = 0;
  let inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (c === delimiter) {
      row.push(field);
      field = '';
      i += 1;
      continue;
    }
    if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i += 1;
      continue;
    }
    if (c === '\r') {
      i += 1;
      continue;
    }
    field += c;
    i += 1;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function parseCsv(text: string): { header: string[]; rows: Record<string, string>[] } {
  const body = text.replace(/^\uFEFF/, '').replace(/^sep=.*\r?\n/i, '');
  for (const delimiter of [',', ';', '\t'] as const) {
    const table = parseCsvRows(body, delimiter).filter((cells) =>
      cells.some((cell) => cell.length > 0)
    );
    if (table.length === 0) continue;
    const header = table[0].map((name) => name.trim());
    const names = header.map((name) => name.toLowerCase());
    if (!names.includes('id') || !names.includes('italiano') || !names.includes('inglese')) {
      continue;
    }
    return {
      header,
      rows: table.slice(1).map((cells) => {
        const rec: Record<string, string> = {};
        for (const [index, name] of header.entries()) {
          rec[name.toLowerCase()] = cells[index] ?? '';
        }
        return rec;
      })
    };
  }
  return { header: [], rows: [] };
}

export function csvRowsToCopyRows(records: Record<string, string>[]): CopyRow[] {
  return records.map((rec) => ({
    pagina: rec.pagina ?? '',
    italiano: rec.italiano ?? '',
    inglese: rec.inglese ?? '',
    id: (rec.id ?? '').trim()
  }));
}

/** Refuse a smashed spreadsheet before it becomes site copy. */
export function copyImportProblem(rows: CopyRow[], knownIds: Set<string>): string | null {
  if (rows.length === 0) return 'copy:import: the CSV has no data rows.';
  const ids = rows.map((row) => row.id.trim());
  const missingId = ids.filter((id) => !id).length;
  if (missingId) {
    return `copy:import: ${missingId} row(s) have no id. Leave the file structure as it is.`;
  }
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  if (duplicates.size) {
    return `copy:import: duplicate id(s): ${[...duplicates].join(', ')}.`;
  }
  const matched = ids.filter((id) => knownIds.has(id)).length;
  if (matched === 0) {
    return 'copy:import: no id matches the site. The file was probably saved with the wrong separator or the id column was dropped.';
  }
  if (rows.length >= 10 && matched < rows.length / 2) {
    return `copy:import: only ${matched} of ${rows.length} id(s) match the site. The columns likely shifted. Headers must be pagina,italiano,inglese,id.`;
  }
  return null;
}
