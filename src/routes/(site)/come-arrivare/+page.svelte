<script lang="ts">
  import { page } from '$app/state';
  import { arriveCopy, baglioLocation } from '$lib/data/content';
  import ArriveMap from '$lib/standard/ArriveMap.svelte';
  import { googleMapsLinkWithLocale } from '$lib/standard/place-directions';
  import { pick, ui } from '$lib/standard/i18n';

  const locale = $derived(page.data.locale);
  const heading = $derived(pick(ui.navArrive, locale));
  const t = $derived((key: keyof typeof arriveCopy) => pick(arriveCopy[key], locale));

  function mapLinkHref(link: (typeof baglioLocation.links)[number]) {
    return link.id === 'google' ? googleMapsLinkWithLocale(link.href, locale) : link.href;
  }
</script>

<section class="arrive">
  <div class="container">
    <h1>{heading}</h1>
    <p class="lead">{t('lead')}</p>

    <div class="map">
      <ArriveMap alt={t('mapAlt')} attribution={t('attribution')} />
    </div>

    <div class="copy">
      <h2>{t('airTitle')}</h2>
      <p>{t('air')}</p>

      <h2>{t('roadTitle')}</h2>
      <p>{t('road')}</p>
    </div>

    <ul class="apps">
      {#each baglioLocation.links as link}
        <li>
          <a href={mapLinkHref(link)} rel="noopener noreferrer" target="_blank"
            >{pick(link.label, locale)}</a
          >
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .arrive {
    padding: clamp(3.5rem, 8vw, 5.5rem) 0 clamp(4rem, 8vw, 7rem);
  }

  h1 {
    margin: 0 0 0.75rem;
    font-size: clamp(2.5rem, 6vw, 4rem);
  }

  .lead {
    margin: 0 0 2.5rem;
    max-width: 38rem;
    font-size: 1.15rem;
    line-height: 1.55;
    color: var(--ink-soft);
  }

  .map {
    margin: 0 0 2rem;
  }

  .copy {
    max-width: 40rem;
  }

  h2 {
    margin: 2rem 0 0.65rem;
    font-size: 1.15rem;
  }

  .copy h2:first-child {
    margin-top: 0;
  }

  .copy p {
    margin: 0;
    color: var(--ink-soft);
  }

  .apps {
    list-style: none;
    margin: 2rem 0 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
  }

  .apps a {
    display: inline-flex;
    white-space: nowrap;
    padding: 0.55rem 0.95rem;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    color: var(--sea);
    font-weight: 600;
    text-decoration: none;
    transition:
      border-color 0.3s var(--ease),
      color 0.3s var(--ease),
      background 0.3s var(--ease);
  }

  .apps a:hover {
    border-color: var(--sea);
    background: color-mix(in srgb, var(--sea) 6%, transparent);
  }
</style>
