<script lang="ts">
  import { page } from '$app/state';
  import { imageAsset } from '$lib/public-image';
  import AmbientVideo from '$lib/standard/AmbientVideo.svelte';
  import Reveal from '$lib/standard/Reveal.svelte';
  import SectionHead from '$lib/standard/SectionHead.svelte';
  import {
    amenities,
    awards,
    homeCopy,
    houses,
    places,
    site
  } from '$lib/data/content';
  import { localize, pick, siteHref, ui } from '$lib/standard/i18n';
  import { PORTRAIT_ASPECT_QUERY, REDUCE_MOTION_QUERY, subscribeMediaQuery } from '$lib/standard/media-query';

  /** Portone hero, then aerial video; desktop adds a scroll-driven Chi siamo card. */
  const locale = $derived(page.data.locale);
  const houseList = $derived(houses(locale));
  const placeList = $derived(places(locale));
  const amenityList = $derived(amenities(locale));
  const awardList = $derived(awards(locale));
  const contatti = $derived(siteHref(locale, 'contatti'));
  const imperdibili = $derived(siteHref(locale, 'imperdibili'));
  const home = $derived(localize(homeCopy, locale));

  let videoPlaying = $state(false);
  let videoEnded = $state(false);
  let videoStageReady = $state(false);
  let reduceMotion = $state(false);
  let portraitMobile = $state(false);
  let cinemaStageEl = $state<HTMLElement | null>(null);

  const cinemaActive = $derived(!reduceMotion);
  const cinemaScroll = $derived(cinemaActive && !portraitMobile);
  const cinemaPinned = $derived(cinemaScroll && (videoPlaying || videoEnded));
  const showAboutSection = $derived(reduceMotion || portraitMobile);

  $effect(() => subscribeMediaQuery(REDUCE_MOTION_QUERY, (matches) => {
    reduceMotion = matches;
  }));

  $effect(() => subscribeMediaQuery(PORTRAIT_ASPECT_QUERY, (matches) => {
    portraitMobile = matches;
  }));

  $effect(() => {
    const el = cinemaStageEl;
    if (!el || !cinemaActive) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) videoStageReady = true;
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  });
</script>

{#snippet chiSiamo()}
  <h2>{home.chiSiamo.title}</h2>
  <p>{home.chiSiamo.body}</p>
{/snippet}

<section class="cinema">
  <div class="gate-chapter">
    <div class="gate">
      <img
        class="gate-backdrop"
        src={imageAsset('/images/ambiance/hero-portone-wide.jpg')}
        alt=""
        aria-hidden="true"
        width="1248"
        height="1229"
        fetchpriority="high"
      />
      <picture>
        <source
          media="(min-aspect-ratio: 7 / 10)"
          srcset={imageAsset('/images/ambiance/hero-portone-wide.jpg')}
        />
        <img
          class="gate-media"
          src={imageAsset('/images/ambiance/hero-portone-tall.jpg')}
          srcset="{imageAsset('/images/ambiance/hero-portone-tall-sm.jpg')} 763w, {imageAsset(
            '/images/ambiance/hero-portone-tall.jpg'
          )} 1248w"
          sizes="100vw"
          width="1248"
          height="1690"
          alt={home.alt.hero}
        />
      </picture>
    </div>
    <div class="gate-veil"></div>
    <div class="hero-copy">
      <h1>{site.name}</h1>
      <p class="hero-lead">{pick(site.description, locale)}</p>
    </div>
  </div>

  {#if cinemaActive}
    <div
      class="cinema-stage"
      class:cinema-stage--live={cinemaPinned}
      class:cinema-stage--portrait={portraitMobile}
      bind:this={cinemaStageEl}
    >
      <div class="cinema-pin">
        <AmbientVideo
          fill
          playOnce
          ready={videoStageReady}
          bind:playing={videoPlaying}
          bind:ended={videoEnded}
          src="/videos/baglio-720.mp4"
          poster="/videos/baglio-poster.jpg"
          posterSrcset="{imageAsset('/videos/baglio-poster-sm.jpg')} 744w, {imageAsset(
            '/videos/baglio-poster.jpg'
          )} 1004w"
          posterSizes="100vw"
          label={home.alt.video}
        />
      </div>

      {#if cinemaPinned}
        <div class="cinema-script">
          <div class="cinema-step cinema-step--breathe" aria-hidden="true"></div>

          <div class="cinema-step cinema-step--about">
            <div class="cinema-card">
              {@render chiSiamo()}
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</section>

{#if showAboutSection}
  <section class="section about band-dark">
    <div class="container about-inner">
      <Reveal>
        <div>
          {@render chiSiamo()}
        </div>
      </Reveal>
    </div>
  </section>
{/if}

<section id="houses" class="section houses-section">
  <div class="container">
    <Reveal>
      <div id="houses-intro">
        <SectionHead
          eyebrow={pick(ui.ourHouses, locale)}
          title={home.houses.title}
          lead={home.houses.lead}
        />
      </div>
    </Reveal>

    <div class="house-list">
      {#each houseList as house, i}
        <Reveal delay={i * 80}>
          <a class="house" href={siteHref(locale, `case/${house.slug}`)}>
            <img
              src={imageAsset(house.image)}
              alt={house.name}
              width="1600"
              height="1100"
              loading="lazy"
            />
            <div class="house-body">
              <div class="house-meta">
                <span>{house.guests}</span>
                <span>{house.size}</span>
              </div>
              <h3>{house.name}</h3>
              <p>{house.summary}</p>
              <span class="more">{home.houses.more}</span>
            </div>
          </a>
        </Reveal>
      {/each}
    </div>
  </div>
</section>

<section class="feature">
  <img
    src={imageAsset('/images/ambiance/cortile.jpg')}
    alt={home.alt.cortile}
    width="1400"
    height="1867"
    loading="lazy"
  />
  <div class="feature-panel">
    <Reveal>
      <SectionHead
        eyebrow={home.cortile.eyebrow}
        title={home.cortile.title}
        lead={home.cortile.lead}
      />
      <p>{home.cortile.body}</p>
    </Reveal>
  </div>
</section>

<section class="section garden">
  <div class="container garden-grid">
    <Reveal>
      <SectionHead eyebrow={home.giardino.eyebrow} title={home.giardino.title} />
      <p>{home.giardino.p1}</p>
      <p>{home.giardino.p2}</p>
      <p>{home.giardino.p3}</p>
    </Reveal>
    <Reveal delay={100}>
      <div class="garden-photos">
        <img
          src={imageAsset('/images/ambiance/giardino.jpg')}
          alt={home.alt.giardino}
          width="1024"
          height="768"
          loading="lazy"
        />
        <img
          src={imageAsset('/images/ambiance/agrumeto.jpg')}
          alt={home.alt.agrumeto}
          width="1600"
          height="1067"
          loading="lazy"
        />
      </div>
    </Reveal>
  </div>
</section>

<section class="section band-dark">
  <div class="container">
    <Reveal>
      <SectionHead eyebrow={home.comfort.eyebrow} title={home.comfort.title} />
    </Reveal>
    <ul class="amenity-list">
      {#each amenityList as item, i}
        <Reveal as="li" delay={i * 40}>
          <strong>{item.title}</strong>
          <span>{item.detail}</span>
        </Reveal>
      {/each}
    </ul>
  </div>
</section>

<section class="section">
  <div class="container">
    <Reveal>
      <SectionHead
        eyebrow={pick(ui.navImperdibili, locale)}
        title={home.places.title}
        lead={home.places.lead}
      />
    </Reveal>
    <div class="place-grid">
      {#each placeList as place, i}
        <Reveal delay={i * 50}>
          <a class="place" href="{imperdibili}#{place.slug}">
            <img
              src={imageAsset(place.image)}
              alt={place.name}
              width="1600"
              height="1200"
              loading="lazy"
            />
            <div>
              <span>{place.time}</span>
              <h3>{place.name}</h3>
            </div>
          </a>
        </Reveal>
      {/each}
    </div>
  </div>
</section>

<section class="section band-dark">
  <div class="container">
    <Reveal>
      <SectionHead eyebrow={pick(ui.awards, locale)} title={home.awards.title} />
    </Reveal>
    <div class="award-grid">
      {#each awardList as award, i}
        <Reveal delay={i * 70}>
          <figure>
            <img
              src={imageAsset(award.image)}
              alt={award.title}
              width="1600"
              height="1000"
              loading="lazy"
            />
            <figcaption>
              <strong>{award.title}</strong>
              <span>{award.text}</span>
              {#if award.proofUrl && award.proofLabel}
                <a
                  class="award-proof"
                  href={award.proofUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {award.proofLabel}
                </a>
              {/if}
            </figcaption>
          </figure>
        </Reveal>
      {/each}
    </div>
  </div>
</section>

<section class="cta">
  <div class="container cta-inner">
    <Reveal>
      <h2>{home.cta.title}</h2>
      <p>{home.cta.body}</p>
      <a class="btn btn-light" href={contatti}>{pick(ui.requestAvailability, locale)}</a>
    </Reveal>
  </div>
</section>

<style>
  .cinema {
    position: relative;
    margin-top: calc(-1 * var(--header-h));
    color: #fff;
    background: var(--sea-deep);
  }

  .gate-chapter {
    position: relative;
    min-height: 100svh;
    padding-top: var(--header-h);
    overflow: hidden;
    display: grid;
    align-items: end;
    background: var(--sea-deep);
  }

  .gate {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .gate-backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    filter: blur(2.5rem) brightness(0.82) saturate(1.1);
    animation: gate-backdrop-zoom 8s var(--ease) both;
  }

  @keyframes gate-backdrop-zoom {
    from {
      transform: scale(1.24);
    }
    to {
      transform: scale(1.14);
    }
  }

  .gate-media {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    animation: soft-fade 1.2s var(--ease) both;
  }

  @media (max-aspect-ratio: 7 / 10) {
    .gate-media {
      object-fit: cover;
    }
  }

  .gate-veil {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--sea-deep) 42%, transparent) 0%, transparent 38%),
      linear-gradient(
        0deg,
        color-mix(in srgb, var(--sea-deep) 92%, transparent) 0%,
        color-mix(in srgb, var(--sea-deep) 55%, transparent) 38%,
        transparent 68%
      );
  }

  .gate-chapter .hero-copy {
    position: relative;
    z-index: 2;
  }

  .cinema-stage {
    position: relative;
    background: var(--sea-deep);
  }

  .cinema-pin {
    position: relative;
    height: 100svh;
    overflow: hidden;
  }

  .cinema-stage--live .cinema-pin {
    position: sticky;
    top: 0;
    z-index: 0;
  }

  .cinema-script {
    position: relative;
    margin-top: -100svh;
    z-index: 2;
    pointer-events: auto;
  }

  .cinema-step {
    min-height: 100svh;
    padding: var(--header-h) 0 clamp(3rem, 8vh, 5rem);
    display: grid;
    align-items: center;
    justify-items: start;
  }

  .cinema-step--breathe {
    min-height: 18svh;
  }

  .cinema-step--about {
    --cinema-card-h: clamp(18rem, 48vh, 32rem);
    display: block;
    min-height: auto;
    padding: 0;
  }

  /* Scroll room before and after the card: bottom entry, top hold. */
  .cinema-step--about::before,
  .cinema-step--about::after {
    content: '';
    display: block;
    height: calc(100svh - var(--cinema-card-h));
  }

  .cinema-step--about .cinema-card {
    position: sticky;
    top: clamp(2rem, 8vh, 3.5rem);
    width: min(15rem, calc(24vw - 0.75rem));
    max-width: calc(100% - 2.5rem);
    margin: 0 auto 0 clamp(1rem, 2.5vw, 1.75rem);
    padding: clamp(1.5rem, 4vh, 2.35rem) clamp(1rem, 2.2vw, 1.25rem);
    border-radius: var(--radius);
    background: color-mix(in srgb, var(--sea-deep) 68%, transparent);
    -webkit-backdrop-filter: blur(14px) brightness(0.88);
    backdrop-filter: blur(14px) brightness(0.88);
    box-shadow: 0 1rem 3rem color-mix(in srgb, var(--sea-deep) 35%, transparent);
  }

  /* Portrait: short aerial chapter, then Chi siamo below (no traveling card). */
  @media (max-aspect-ratio: 7 / 10) {
    .cinema-stage--portrait .cinema-pin {
      height: 65svh;
    }

    .cinema-stage--portrait.cinema-stage--live .cinema-pin {
      position: sticky;
      top: 0;
    }

    .cinema-stage--portrait :global(.ambient.fill video),
    .cinema-stage--portrait :global(.ambient.fill .poster) {
      object-fit: cover;
      object-position: 50% 28%;
    }
  }

  .cinema-step--about .cinema-card h2 {
    margin: 0 0 0.85rem;
    font-size: clamp(1.55rem, 2.8vw, 2rem);
    line-height: 1.15;
    max-width: 14ch;
  }

  .cinema-step--about .cinema-card p {
    margin: 0;
    font-size: 1rem;
    line-height: 1.55;
    color: color-mix(in srgb, #fff 82%, transparent);
    max-width: none;
  }

  @supports (animation-range: exit 0% exit 100%) {
    @media (prefers-reduced-motion: no-preference) {
      .cinema-script .cinema-step--about .cinema-card {
        animation: cinema-card-exit auto ease-in-out both;
        animation-timeline: view();
        animation-range: exit 0% exit 85%;
      }
    }
  }

  @keyframes cinema-card-exit {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-1.75rem);
    }
  }

  .cinema-script .cinema-step--about {
    pointer-events: auto;
  }

  .houses-section {
    position: relative;
    z-index: 3;
    background: var(--paper);
    box-shadow: 0 -1.5rem 2.5rem color-mix(in srgb, var(--sea-deep) 12%, transparent);
  }

  #houses-intro {
    scroll-margin-top: var(--header-h);
  }

  .hero-copy {
    position: relative;
    z-index: 2;
    width: min(1120px, calc(100% - 2.5rem));
    margin: 0 auto;
    padding: clamp(5rem, 12vh, 8rem) 0 clamp(3rem, 7vh, 4.5rem);
    animation: fade-up 1s var(--ease) both;
    text-shadow: 0 2px 24px color-mix(in srgb, var(--sea-deep) 45%, transparent);
    pointer-events: auto;
    background: none;
    backdrop-filter: none;
    box-shadow: none;
    border-radius: 0;
  }

  .hero-copy h1 {
    margin: 0 0 0.85rem;
    font-size: clamp(2.8rem, 8vw, 5.4rem);
    max-width: 12ch;
    text-wrap: balance;
  }

  .hero-lead {
    margin: 0 0 1.75rem;
    max-width: 28rem;
    font-size: clamp(1.05rem, 2.2vw, 1.25rem);
    opacity: 0.95;
  }

  .about-inner {
    max-width: 40rem;
  }

  .about h2 {
    margin: 0 0 1rem;
    font-size: clamp(2rem, 4vw, 3.1rem);
  }

  .about p {
    margin: 0;
    font-size: 1.15rem;
    color: color-mix(in srgb, #fff 80%, transparent);
    max-width: 36rem;
  }

  .house-list {
    display: grid;
    gap: 1.5rem;
  }

  .house {
    display: grid;
    text-decoration: none;
    background: #fff;
    border: 1px solid var(--line);
    overflow: hidden;
    transition:
      transform 0.45s var(--ease),
      box-shadow 0.45s var(--ease);
  }

  .house:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
  }

  .house img {
    width: 100%;
    aspect-ratio: 16 / 11;
    object-fit: cover;
  }

  .house-body {
    padding: 1.35rem 1.35rem 1.5rem;
  }

  .house-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.55rem;
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--olive);
    font-weight: 600;
  }

  .house h3 {
    margin: 0 0 0.45rem;
    font-size: 1.65rem;
  }

  .house p {
    margin: 0 0 1rem;
    color: var(--ink-soft);
  }

  .more {
    font-weight: 600;
    color: var(--sea);
  }

  .feature {
    display: grid;
    background: var(--sea-deep);
    color: #fff;
  }

  .feature img {
    width: 100%;
    min-height: 18rem;
    height: 100%;
    object-fit: cover;
  }

  .feature-panel {
    padding: clamp(2.5rem, 6vw, 4.5rem);
    display: grid;
    align-content: center;
  }

  .feature :global(.section-head) {
    margin-bottom: 1rem;
  }

  .feature :global(.eyebrow),
  .band-dark :global(.eyebrow) {
    color: color-mix(in srgb, #fff 72%, transparent);
  }

  .feature :global(.section-head h2) {
    margin: 0 0 0.75rem;
    font-size: clamp(2rem, 4vw, 3rem);
  }

  .feature :global(.section-head p) {
    max-width: 34rem;
    font-size: 1.15rem;
    color: color-mix(in srgb, #fff 88%, transparent);
    opacity: 0.95;
  }

  .feature p {
    max-width: 34rem;
    color: color-mix(in srgb, #fff 88%, transparent);
  }

  .garden-grid {
    display: grid;
    gap: 2rem;
    align-items: center;
  }

  .garden-photos {
    display: grid;
    gap: 0.85rem;
  }

  .garden-photos img {
    width: 100%;
    object-fit: cover;
  }

  .garden-photos img:first-child {
    aspect-ratio: 4 / 3;
  }

  .garden-photos img:last-child {
    aspect-ratio: 3 / 2;
  }

  .garden :global(.section-head) {
    margin-bottom: 0.25rem;
  }

  .garden p {
    color: var(--ink-soft);
  }

  .amenity-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0;
    border-top: 1px solid var(--line);
  }

  .amenity-list :global(li) {
    display: grid;
    gap: 0.25rem;
    padding: 1.15rem 0;
    border-bottom: 1px solid var(--line);
  }

  .amenity-list strong {
    font-family: var(--font-display);
    font-size: 1.2rem;
    font-weight: 500;
  }

  .amenity-list span {
    color: var(--muted);
  }

  .band-dark {
    background: color-mix(in srgb, var(--sea-deep) 92%, black);
    color: #fff;
  }

  .band-dark :global(.section-head p) {
    color: color-mix(in srgb, #fff 78%, transparent);
  }

  .band-dark .amenity-list {
    border-top-color: color-mix(in srgb, #fff 18%, transparent);
  }

  .band-dark .amenity-list :global(li) {
    border-bottom-color: color-mix(in srgb, #fff 18%, transparent);
  }

  .band-dark .amenity-list span {
    color: color-mix(in srgb, #fff 68%, transparent);
  }

  .band-dark .award-grid strong {
    color: #fff;
  }

  .band-dark .award-grid span {
    color: color-mix(in srgb, #fff 68%, transparent);
  }

  .band-dark .award-proof {
    color: color-mix(in srgb, #fff 78%, transparent);
  }

  .band-dark .award-proof:hover {
    color: #fff;
  }

  .award-grid {
    display: grid;
    gap: 1.5rem;
  }

  .award-grid figure {
    margin: 0;
    display: grid;
    gap: 1rem;
  }

  .award-grid img {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: contain;
    background: #fff;
    border: 1px solid var(--line);
    padding: 1rem;
  }

  .award-grid figcaption {
    display: grid;
    gap: 0.35rem;
  }

  .award-grid strong {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 500;
  }

  .award-grid span {
    color: var(--ink-soft);
  }

  .award-proof {
    width: fit-content;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 0.18em;
  }

  .place-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .place-grid .place {
    position: relative;
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    color: #fff;
    text-decoration: none;
  }

  .place-grid img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    transition: transform 1.1s var(--ease);
  }

  .place-grid .place:hover img {
    transform: scale(1.05);
  }

  .place-grid div {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: grid;
    align-content: end;
    padding: 1.25rem;
    background: linear-gradient(0deg, color-mix(in srgb, var(--sea-deep) 75%, transparent), transparent 70%);
  }

  .place-grid span {
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 600;
  }

  .place-grid h3 {
    margin: 0.25rem 0 0;
    font-size: clamp(1.05rem, 2.5vw, 1.45rem);
  }

  .cta {
    padding: clamp(4rem, 8vw, 6rem) 0;
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--sea) 92%, #000), var(--olive)),
      var(--sea);
    color: #fff;
  }

  .cta-inner {
    max-width: 40rem;
  }

  .cta h2 {
    margin: 0 0 0.75rem;
    font-size: clamp(2rem, 4vw, 3rem);
  }

  .cta p {
    margin: 0 0 1.5rem;
    opacity: 0.92;
    font-size: 1.1rem;
  }

  @media (min-width: 720px) {
    .house-list {
      grid-template-columns: 1fr 1fr;
    }

    .amenity-list {
      grid-template-columns: 1fr 1fr;
      gap: 0 2rem;
    }

    .award-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .place-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (min-width: 960px) {
    .feature {
      grid-template-columns: 1.1fr 0.9fr;
      min-height: 32rem;
    }

    .garden-grid {
      grid-template-columns: 0.95fr 1.05fr;
      gap: 3.5rem;
    }
  }
</style>
