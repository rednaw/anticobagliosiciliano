<script lang="ts">
	import HubBack from '$lib/components/HubBack.svelte';

	let { children } = $props();
</script>

<HubBack />
{@render children()}
