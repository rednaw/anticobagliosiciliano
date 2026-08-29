<script lang="ts">
  import type { Locale } from '$lib/locale';
  import { pick, ui } from '$lib/standard/i18n';

  type Credit = {
    author: string;
    sourceUrl: string;
    licenseUrl: string;
    license: string;
  };

  let {
    credit,
    locale,
    inline = false
  }: { credit: Credit; locale: Locale; inline?: boolean } = $props();
</script>

{#if inline}
  <span class="credit inline">
    {pick(ui.photoCredit, locale)}:
    {credit.author},
    <a href={credit.sourceUrl} rel="license noopener noreferrer" target="_blank"
      >Wikimedia Commons</a
    >,
    <a href={credit.licenseUrl} rel="license noopener noreferrer" target="_blank">{credit.license}</a>
  </span>
{:else}
  <p class="credit">
    {pick(ui.photoCredit, locale)}:
    {credit.author},
    <a href={credit.sourceUrl} rel="license noopener noreferrer" target="_blank"
      >Wikimedia Commons</a
    >,
    <a href={credit.licenseUrl} rel="license noopener noreferrer" target="_blank">{credit.license}</a>
  </p>
{/if}

<style>
  .credit {
    margin: 0.35rem 0 0;
    font-size: 0.72rem;
    line-height: 1.45;
    color: var(--ink-soft);
  }

  .credit.inline {
    margin: 0;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  .credit a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 0.12em;
  }

  .credit a:hover {
    color: var(--ink);
  }
</style>
