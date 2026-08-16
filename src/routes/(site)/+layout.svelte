<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import Header from '$lib/standard/Header.svelte';
	import Footer from '$lib/standard/Footer.svelte';
	import { SITE_ORIGIN } from '$lib/site-config';
	import {
		absoluteUrl,
		counterpartHref,
		pick,
		ui,
		type Locale
	} from '$lib/standard/i18n';

	let { children } = $props();

	const locale = $derived((page.data.locale ?? 'it') as Locale);
	const canonical = $derived(absoluteUrl(page.url.pathname, SITE_ORIGIN));
	const hrefIt = $derived(absoluteUrl(counterpartHref(page.url.pathname, 'it', base), SITE_ORIGIN, base));
	const hrefEn = $derived(absoluteUrl(counterpartHref(page.url.pathname, 'en', base), SITE_ORIGIN, base));

	$effect(() => {
		document.documentElement.lang = page.data.locale ?? 'it';
	});
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	<link rel="alternate" hreflang="it" href={hrefIt} />
	<link rel="alternate" hreflang="en" href={hrefEn} />
	<link rel="alternate" hreflang="x-default" href={hrefIt} />
</svelte:head>

<a class="skip" href="#contenuto">{pick(ui.skipToContent, locale)}</a>
<Header />
<main id="contenuto">
	{@render children()}
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
