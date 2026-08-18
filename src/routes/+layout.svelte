<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import figtree from '@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2?url';
	import fraunces from '@fontsource-variable/fraunces/files/fraunces-latin-standard-normal.woff2?url';
	import { site } from '$lib/data/content';
	import { SITE_PUBLIC } from '$lib/site-config';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preload" as="font" type="font/woff2" href={fraunces} crossorigin="anonymous" />
	<link rel="preload" as="font" type="font/woff2" href={figtree} crossorigin="anonymous" />
	<link rel="icon" href={favicon} />
	{#if !SITE_PUBLIC}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	<meta property="og:site_name" content={site.name} />
</svelte:head>

{@render children()}
