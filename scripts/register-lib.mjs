import { existsSync, readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse as parseYaml } from 'yaml';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const libRoot = path.join(root, 'src', 'lib');

function existingFile(base) {
  for (const candidate of [base, `${base}.ts`, `${base}.js`, path.join(base, 'index.ts')]) {
    if (existsSync(candidate)) return pathToFileURL(candidate).href;
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('$lib')) {
      const rest =
        specifier === '$lib' || specifier === '$lib/' ? '' : specifier.slice('$lib/'.length);
      const resolved = existingFile(path.join(libRoot, rest));
      if (resolved) {
        return { url: resolved, shortCircuit: true, importAttributes: context.importAttributes };
      }
    }
    if (specifier.startsWith('.') && context.parentURL) {
      const from = path.dirname(fileURLToPath(context.parentURL));
      const resolved = existingFile(path.resolve(from, specifier));
      if (resolved) {
        return { url: resolved, shortCircuit: true, importAttributes: context.importAttributes };
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (!url.startsWith('file:')) return nextLoad(url, context);
    const file = fileURLToPath(url);
    if (!file.endsWith('.yml') && !file.endsWith('.yaml')) return nextLoad(url, context);
    const data = parseYaml(readFileSync(file, 'utf8'));
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${JSON.stringify(data)};`
    };
  }
});
