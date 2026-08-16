<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Gate from '$lib/components/Gate.svelte';
	import { site } from '$lib/data/content';
	import { isUnlocked } from '$lib/gate';
	import { SITE_PUBLIC } from '$lib/site-config';

	let { children } = $props();

	let unlocked = $state(browser && isUnlocked());

	function handleUnlock() {
		unlocked = true;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if !SITE_PUBLIC}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	<meta property="og:site_name" content={site.name} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{#if !unlocked}
	<Gate onunlock={handleUnlock} />
{:else}
	{@render children()}
{/if}
