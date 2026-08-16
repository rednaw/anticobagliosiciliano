import type { LayoutLoad } from './$types';
import { localeFromPath } from '$lib/locale';
import { base } from '$app/paths';

export const load: LayoutLoad = ({ url }) => {
	return { locale: localeFromPath(url.pathname, base) };
};
