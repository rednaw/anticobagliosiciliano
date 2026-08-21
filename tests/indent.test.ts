import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const trees = ['src', 'tests', 'scripts', '.github', '.devcontainer'];

const SKIP_DIRS = new Set(['.svelte-kit']);
const EXTS = new Set(['.css', '.html', '.js', '.json', '.mjs', '.svelte', '.ts', '.yml']);

function walk(dir: string, acc: string[] = []): string[] {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full, acc);
      continue;
    }
    if (EXTS.has(extname(ent.name))) acc.push(full);
  }
  return acc;
}

describe('indent', () => {
  it('uses spaces, not tabs, in project source', () => {
    const hits = trees
      .flatMap((dir) => walk(join(root, dir)))
      .filter((file) => readFileSync(file, 'utf8').includes('\t'))
      .map((file) => relative(root, file));

    expect(hits).toEqual([]);
  });
});
