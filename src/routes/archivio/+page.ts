import index from '$lib/data/archivio-index.json';
import type { ArchivioIndex } from '$lib/data/archivio';

export function load() {
  return { index: index as ArchivioIndex };
}
