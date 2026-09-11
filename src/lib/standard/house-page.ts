import { error } from '@sveltejs/kit';
import { accommodationCopy, getHouse, housesSource } from '$lib/data/content';
import { pick, type Locale } from '$lib/standard/i18n';

export const houseEntries = () => housesSource.map((h) => ({ slug: h.slug }));

export async function loadHouse({
  params,
  parent
}: {
  params: { slug: string };
  parent: () => Promise<{ locale: Locale }>;
}) {
  const { locale } = await parent();
  const house = getHouse(params.slug, locale);
  if (!house) error(404, pick(accommodationCopy.notFound, locale));
  return { house };
}
