import { error } from '@sveltejs/kit';
import { housesSource, getHouse } from '$lib/data/content';
import type { Locale } from '$lib/i18n';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => housesSource.map((h) => ({ slug: h.slug }));

export const load: PageLoad = async ({ params, parent }) => {
	const { locale } = (await parent()) as { locale: Locale };
	const house = getHouse(params.slug, locale);
	if (!house) error(404, 'Casa non trovata');
	return { house };
};
