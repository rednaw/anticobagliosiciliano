<script lang="ts">
  import { page } from '$app/state';
  import Header from '$lib/standard/Header.svelte';
  import Footer from '$lib/standard/Footer.svelte';
  import NotFound from '$lib/standard/NotFound.svelte';
  import { localeFromPath } from '$lib/locale';
  import { pick, ui } from '$lib/standard/i18n';

  const locale = $derived(page.data.locale ?? localeFromPath(page.url.pathname));

  $effect(() => {
    document.documentElement.lang = locale;
  });
</script>

<a class="skip" href="#contenuto">{pick(ui.skipToContent, locale)}</a>
<Header />
<main id="contenuto">
  <NotFound />
</main>
<Footer />
