<script lang="ts">
	import HubBack from '$lib/components/HubBack.svelte';
	import { site } from '$lib/data/content';

	let { children } = $props();
</script>

<svelte:head>
	<title>Experimental · {site.name}</title>
</svelte:head>

<HubBack />
{@render children()}
