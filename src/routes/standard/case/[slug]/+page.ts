import { error } from '@sveltejs/kit';
import { housesSource, getHouse } from '$lib/data/content';
import { pick, ui, type Locale } from '$lib/i18n';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => housesSource.map((h) => ({ slug: h.slug }));

export const load: PageLoad = async ({ params, parent }) => {
	const { locale } = (await parent()) as { locale: Locale };
	const house = getHouse(params.slug, locale);
	if (!house) error(404, pick(ui.houseNotFound, locale));
	return { house };
};
