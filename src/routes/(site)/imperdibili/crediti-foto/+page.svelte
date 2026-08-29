<script lang="ts">
  import { page } from '$app/state';
  import { imperdibiliPhotoCreditsCopy, places } from '$lib/data/content';
  import PlaceImageCredit from '$lib/standard/PlaceImageCredit.svelte';
  import { pick, siteHref, ui } from '$lib/standard/i18n';

  const locale = $derived(page.data.locale);
  const creditedPlaces = $derived(places(locale).filter((place) => place.imageCredit));
  const copy = $derived((key: keyof typeof imperdibiliPhotoCreditsCopy) =>
    pick(imperdibiliPhotoCreditsCopy[key], locale)
  );
  const imperdibili = $derived(siteHref(locale, 'imperdibili'));
</script>

<section class="section">
  <div class="container">
    <p class="back">
      <a href={imperdibili}>← {pick(ui.navImperdibili, locale)}</a>
    </p>

    <h1>{pick(ui.photoCredits, locale)}</h1>
    <p class="lead">{copy('lead')}</p>

    <ul class="list">
      {#each creditedPlaces as place}
        <li>
          <span class="name">{place.name}</span>
          <PlaceImageCredit credit={place.imageCredit!} {locale} inline />
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .container {
    max-width: 40rem;
  }

  .back {
    margin: 0 0 1.5rem;
    font-size: 0.88rem;
  }

  .back a {
    color: var(--ink-soft);
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--ink-soft) 35%, transparent);
  }

  .back a:hover {
    color: var(--sea);
    border-bottom-color: var(--sea);
  }

  h1 {
    margin: 0 0 0.85rem;
    font-size: clamp(2rem, 5vw, 2.8rem);
  }

  .lead {
    margin: 0 0 2rem;
    font-size: 1.02rem;
    line-height: 1.6;
    color: var(--ink-soft);
  }

  .list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 1rem;
  }

  li {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.55;
    color: var(--ink-soft);
  }

  .name {
    font-weight: 600;
    color: var(--ink);
  }
</style>
