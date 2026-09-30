<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <meta name="robots" content="noindex" />
  <title>CMS — Antico Baglio Siciliano</title>
</svelte:head>

{@render children()}
