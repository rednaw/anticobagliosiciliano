<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import Header from '$lib/standard/Header.svelte';
	import Footer from '$lib/standard/Footer.svelte';
	import NotFound from '$lib/standard/NotFound.svelte';
	import { localeFromPath } from '$lib/locale';
	import { pick, ui, type Locale } from '$lib/standard/i18n';

	const locale = $derived(
		(page.data.locale ?? localeFromPath(page.url.pathname, base)) as Locale
	);

	$effect(() => {
		document.documentElement.lang = locale;
	});
</script>

<a class="skip" href="#contenuto">{pick(ui.skipToContent, locale)}</a>
<Header />
<main id="contenuto">
	<NotFound />
</main>
<Footer />

<style>
	.skip {
		position: absolute;
		left: -999px;
		top: 0.5rem;
		z-index: 100;
		background: var(--sea);
		color: #fff;
		padding: 0.5rem 0.85rem;
		text-decoration: none;
	}

	.skip:focus {
		left: 0.5rem;
	}

	main {
		min-height: 60vh;
	}
</style>
