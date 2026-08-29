<script lang="ts">
  import { imageAsset } from '$lib/public-image';
  import { page } from '$app/state';
  import { imperdibiliLead, places } from '$lib/data/content';
  import Reveal from '$lib/standard/Reveal.svelte';
  import { pick, siteHref, ui } from '$lib/standard/i18n';

  const locale = $derived(page.data.locale);
  const placeList = $derived(places(locale));
  const pageTitle = $derived(pick(ui.navImperdibili, locale));
  const photoCredits = $derived(siteHref(locale, 'imperdibili/crediti-foto'));
  const hasPhotoCredits = $derived(placeList.some((place) => place.imageCredit));
</script>

<section class="hero">
  <div class="container">
    <h1>{pageTitle}</h1>
    <p class="lead">{pick(imperdibiliLead, locale)}</p>
  </div>
</section>

<section class="section">
  <div class="container list">
    {#each placeList as place, i}
      <Reveal delay={(i % 3) * 50}>
        <article id={place.slug}>
          <figure class="media">
            <img
              src={imageAsset(place.image)}
              alt={place.name}
              width="1600"
              height="1100"
              loading="lazy"
            />
          </figure>
          <div class="body">
            <span class="time">{place.time}</span>
            <h2>{place.name}</h2>
            <p>{place.text}</p>
          </div>
        </article>
      </Reveal>
    {/each}
  </div>
</section>

{#if hasPhotoCredits}
  <section class="credits-link">
    <div class="container">
      <p><a href={photoCredits}>{pick(ui.photoCredits, locale)}</a></p>
    </div>
  </section>
{/if}

<style>
  .hero {
    padding: clamp(3.5rem, 8vw, 5.5rem) 0 1rem;
  }

  h1 {
    margin: 0 0 0.75rem;
    font-size: clamp(2.5rem, 6vw, 4rem);
  }

  .lead {
    margin: 0;
    max-width: 36rem;
    font-size: 1.15rem;
    line-height: 1.55;
    color: var(--ink-soft);
  }

  .list {
    display: grid;
    gap: 2.75rem;
  }

  article {
    display: grid;
    gap: 1.25rem;
    align-items: start;
    scroll-margin-top: calc(var(--header-h) + 1.25rem);
  }

  .media {
    margin: 0;
  }

  .media img {
    width: 100%;
    aspect-ratio: 16 / 11;
    object-fit: cover;
  }

  .body {
    max-width: 40rem;
  }

  .time {
    display: inline-block;
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--olive);
    margin-bottom: 0.5rem;
  }

  h2 {
    margin: 0 0 0.75rem;
    font-size: clamp(1.6rem, 3vw, 2.2rem);
  }

  .body p {
    margin: 0;
    color: var(--ink-soft);
    line-height: 1.65;
    font-size: 1.02rem;
  }

  .credits-link {
    padding: 0 0 clamp(2.5rem, 5vw, 3.5rem);
  }

  .credits-link p {
    margin: 0;
    text-align: center;
    font-size: 0.78rem;
  }

  .credits-link a {
    color: var(--muted);
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--muted) 45%, transparent);
    padding-bottom: 0.05rem;
  }

  .credits-link a:hover {
    color: var(--sea);
    border-bottom-color: var(--sea);
  }

  @media (min-width: 800px) {
    .list {
      gap: 3.5rem;
    }

    article {
      grid-template-columns: 1fr 1.15fr;
      gap: 2.75rem;
      align-items: center;
    }

    .list :global(.reveal:nth-child(even) .media) {
      order: 2;
    }
  }
</style>
