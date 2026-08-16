import { houseEntries, loadHouse } from '$lib/standard/house-page';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = houseEntries;
export const load: PageLoad = loadHouse;
