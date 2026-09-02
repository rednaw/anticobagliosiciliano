<script lang="ts">
  import { page } from '$app/state';
  import Header from '$lib/standard/Header.svelte';
  import Footer from '$lib/standard/Footer.svelte';
  import { SITE_ORIGIN } from '$lib/site-config';
  import {
    absoluteUrl,
    counterpartHref,
    pick,
    ui
  } from '$lib/standard/i18n';
  import { publicImage } from '$lib/public-image';
  import { OG_IMAGE_HEIGHT, OG_IMAGE_PATH, OG_IMAGE_WIDTH, pageSeo } from '$lib/standard/seo';
  import { jsonLdScriptContent, pageJsonLd } from '$lib/standard/json-ld';
  import { initMediaTier } from '$lib/standard/network-tier';

  let { children } = $props();

  const locale = $derived(page.data.locale);
  const seo = $derived(pageSeo(page.url.pathname, locale));
  const jsonLd = $derived(pageJsonLd(page.url.pathname, locale));
  const jsonLdText = $derived(jsonLd ? jsonLdScriptContent(jsonLd) : '');
  const canonical = $derived(absoluteUrl(page.url.pathname, SITE_ORIGIN));
  const hrefIt = $derived(absoluteUrl(counterpartHref(page.url.pathname, 'it'), SITE_ORIGIN));
  const hrefEn = $derived(absoluteUrl(counterpartHref(page.url.pathname, 'en'), SITE_ORIGIN));
  const ogLocale = $derived(locale === 'en' ? 'en_GB' : 'it_IT');
  const ogLocaleAlt = $derived(locale === 'en' ? 'it_IT' : 'en_GB');
  const ogDefaultImage = $derived(
    seo.image === absoluteUrl(publicImage(OG_IMAGE_PATH), SITE_ORIGIN)
  );

  $effect(() => {
    document.documentElement.lang = locale;
  });

  $effect(() => {
    void initMediaTier();
  });
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  {#if seo.robots}
    <meta name="robots" content={seo.robots} />
  {/if}
  <link rel="canonical" href={canonical} />
  {#if !seo.robots}
    <link rel="alternate" hreflang="it" href={hrefIt} />
    <link rel="alternate" hreflang="en" href={hrefEn} />
    <link rel="alternate" hreflang="x-default" href={hrefIt} />
  {/if}
  <meta property="og:type" content="website" />
  <meta property="og:locale" content={ogLocale} />
  <meta property="og:locale:alternate" content={ogLocaleAlt} />
  <meta property="og:title" content={seo.title} />
  <meta property="og:description" content={seo.description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={seo.image} />
  <meta property="og:image:alt" content={seo.imageAlt} />
  {#if ogDefaultImage}
    <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
    <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
  {/if}
  {#if jsonLdText}
    {@html `<script type="application/ld+json">${jsonLdText}</script>`}
  {/if}
</svelte:head>

<a class="skip" href="#contenuto">{pick(ui.skipToContent, locale)}</a>
<Header />
<main id="contenuto">
  {@render children()}
</main>
<Footer />
