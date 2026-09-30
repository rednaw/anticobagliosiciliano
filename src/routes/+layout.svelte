<script lang="ts">
  import favicon from '$lib/assets/favicon.svg?no-inline';
  import { homeCopy } from '$lib/data/content';
  import { SITE_PUBLIC } from '$lib/site-config';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  {#if !SITE_PUBLIC}
    <meta name="robots" content="noindex, nofollow" />
  {/if}
  <meta property="og:site_name" content={homeCopy.brand.name} />
</svelte:head>

{@render children()}
