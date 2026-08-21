<script lang="ts">
  import Page from '../../../case/[slug]/+page.svelte';
  let { data } = $props();
</script>

<Page {data} />
