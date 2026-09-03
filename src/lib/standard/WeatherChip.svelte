<script lang="ts">
  import { asset } from '$app/paths';
  import { page } from '$app/state';
  import { weatherCopy } from '$lib/data/content';
  import { pick } from '$lib/standard/i18n';
  import { mediaTier } from '$lib/standard/network-tier';
  import {
    fetchBaglioWeather,
    weatherIconStem,
    type WeatherBucket,
    type WeatherReading
  } from '$lib/standard/weather';
  import type { Snippet } from 'svelte';

  let {
    portraitMobile = false,
    children
  }: {
    portraitMobile?: boolean;
    children: Snippet;
  } = $props();

  const locale = $derived(page.data.locale);
  const tier = $derived($mediaTier);

  let reading = $state<WeatherReading | null>(null);

  $effect(() => {
    if (tier !== 'full') {
      reading = null;
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    void fetchBaglioWeather({ signal: controller.signal }).then((next) => {
      if (!cancelled) reading = next;
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  });

  function bucketLabel(bucket: WeatherBucket): string {
    return pick(weatherCopy[bucket], locale);
  }

  const line = $derived(
    reading
      ? pick(weatherCopy.line, locale)
          .replace('{temp}', String(reading.temperatureC))
          .replace('{condition}', bucketLabel(reading.bucket))
      : ''
  );
  const label = $derived(
    reading
      ? pick(weatherCopy.aria, locale)
          .replace('{temp}', String(reading.temperatureC))
          .replace('{condition}', bucketLabel(reading.bucket))
      : ''
  );
  const iconSrc = $derived(
    reading
      ? asset(`/images/weather/${weatherIconStem(reading.bucket, reading.isDay)}.svg`)
      : ''
  );
</script>

<div class="map-stage">
  {@render children()}

  {#if reading}
    <a
      class="credit"
      href="https://open-meteo.com/"
      rel="noopener noreferrer"
      target="_blank"
      title={pick(weatherCopy.creditTitle, locale)}>{pick(weatherCopy.credit, locale)}</a
    >

    {#if !portraitMobile}
      <p class="weather weather--overlay" aria-label={label}>
        <span
          class="icon"
          style:mask-image="url('{iconSrc}')"
          style:-webkit-mask-image="url('{iconSrc}')"
          aria-hidden="true"
        ></span>
        <span class="text">
          <span class="place">{pick(weatherCopy.place, locale)}</span>
          <span class="reading">{line}</span>
        </span>
      </p>
    {/if}
  {/if}
</div>

{#if reading && portraitMobile}
  <p class="weather weather--inline" aria-label={label}>
    <span
      class="icon"
      style:mask-image="url('{iconSrc}')"
      style:-webkit-mask-image="url('{iconSrc}')"
      aria-hidden="true"
    ></span>
    <span><strong>{pick(weatherCopy.place, locale)}</strong> · {line}</span>
  </p>
{/if}

<style>
  .map-stage {
    position: relative;
    z-index: 0;
  }

  .weather {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 0.45rem;
    box-sizing: border-box;
    margin: 0;
    padding: 0.4rem 0.85rem 0.4rem 0.55rem;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--wash);
    line-height: 1.25;
    color: var(--ink);
  }

  .weather--overlay {
    position: absolute;
    top: 0.65rem;
    left: 50%;
    z-index: 1000;
    transform: translateX(-50%);
    max-width: min(16rem, calc(100% - 1.5rem));
    pointer-events: none;
  }

  .weather--inline {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    max-width: 40rem;
    margin: 1.25rem 0 0;
    padding: 0;
    border: none;
    border-radius: 0;
    background: none;
    font-size: 1.0625rem;
    line-height: 1.55;
    color: var(--ink-soft);
  }

  .weather--inline .icon {
    width: 1.75rem;
    height: 1.75rem;
    color: var(--ink);
  }

  .credit {
    pointer-events: auto;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1000;
    margin: 0;
    padding: 0 0.4rem;
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: 400;
    line-height: 1.4;
    background: var(--wash);
    color: #0078a8;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.18em;
    white-space: nowrap;
  }

  .credit:hover,
  .credit:focus {
    color: #0078a8;
    text-decoration: underline;
  }

  .icon {
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    background-color: currentColor;
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  .place {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--ink-soft);
  }

  .reading {
    font-size: 1.02rem;
    font-weight: 600;
    white-space: nowrap;
  }
</style>
