<script lang="ts">
  let {
    eyebrow,
    title,
    lead
  }: {
    eyebrow: string;
    title: string;
    lead?: string;
  } = $props();
</script>

<div class="section-head">
  <p class="eyebrow">{eyebrow}</p>
  <h2>{title}</h2>
  {#if lead}
    <p>{lead}</p>
  {/if}
</div>
