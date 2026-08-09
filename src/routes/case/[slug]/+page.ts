import { error } from '@sveltejs/kit';
import { houses, getHouse } from '$lib/data/content';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => houses.map((h) => ({ slug: h.slug }));

export const load: PageLoad = ({ params }) => {
	const house = getHouse(params.slug);
	if (!house) error(404, 'Casa non trovata');
	return { house };
};
