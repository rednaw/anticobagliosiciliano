import { localeFromPath } from '$lib/locale';
import type { LayoutLoad } from './$types';

export const prerender = true;
export const trailingSlash = 'always';

export const load: LayoutLoad = ({ url }) => {
  return { locale: localeFromPath(url.pathname) };
};
