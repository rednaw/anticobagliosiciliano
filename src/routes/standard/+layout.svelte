<script lang="ts">
	import { page } from '$app/state';
	import HubBack from '$lib/components/HubBack.svelte';
	import Header from '$lib/standard/Header.svelte';
	import Footer from '$lib/standard/Footer.svelte';
	import { pick, ui, type Locale } from '$lib/i18n';

	let { children } = $props();

	const locale = $derived((page.data.locale ?? 'it') as Locale);

	$effect(() => {
		document.documentElement.lang = page.data.locale ?? 'it';
	});
</script>

<HubBack label={pick(ui.backToHub, locale)} />
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
