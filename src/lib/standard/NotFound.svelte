<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { site } from '$lib/data/content';
	import { localeFromPath } from '$lib/locale';
	import { pick, siteHref, ui, type Locale } from '$lib/standard/i18n';

	let { status, head = true }: { status?: number; head?: boolean } = $props();

	const locale = $derived(
		(page.data.locale ?? localeFromPath(page.url.pathname, base)) as Locale
	);
	const code = $derived(status ?? page.status);
	const is404 = $derived(code === 404);
	const heading = $derived(pick(is404 ? ui.notFoundTitle : ui.errorTitle, locale));
	const body = $derived(pick(is404 ? ui.notFoundBody : ui.errorBody, locale));
	const home = $derived(siteHref(locale, '', base));
</script>

<svelte:head>
	{#if head}
		<title>{heading} · {site.name}</title>
		<meta name="robots" content="noindex, nofollow" />
	{/if}
</svelte:head>

<section class="section">
	<div class="container">
		<p class="eyebrow">{is404 ? '404' : code}</p>
		<h1>{heading}</h1>
		<p class="lead">{body}</p>
		<a class="btn" href={home}>{pick(ui.navHome, locale)}</a>
	</div>
</section>

<style>
	h1 {
		margin: 0 0 0.85rem;
		font-size: clamp(2.4rem, 6vw, 3.8rem);
	}

	.lead {
		margin: 0 0 1.75rem;
		max-width: 34rem;
		font-size: 1.15rem;
		color: var(--ink-soft);
	}
</style>
