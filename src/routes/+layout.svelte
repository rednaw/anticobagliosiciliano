<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { site } from '$lib/data/content';
	import { SITE_PUBLIC } from '$lib/site-config';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if !SITE_PUBLIC}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	<meta property="og:site_name" content={site.name} />
</svelte:head>

{@render children()}
