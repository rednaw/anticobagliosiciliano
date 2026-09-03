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

<div class="weather-root">
  {#if reading}
    <p class="weather" aria-label={label}>
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
    <a
      class="credit"
      href="https://open-meteo.com/"
      rel="noopener noreferrer"
      target="_blank">{pick(weatherCopy.credit, locale)}</a
    >
  {/if}
</div>

<style>
  .weather-root {
    position: absolute;
    inset: 0;
    z-index: 1000;
    pointer-events: none;
  }

  .weather {
    position: absolute;
    top: 0.65rem;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 0.45rem;
    box-sizing: border-box;
    max-width: min(16rem, calc(100% - 1.5rem));
    margin: 0;
    padding: 0.4rem 0.85rem 0.4rem 0.55rem;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--wash);
    line-height: 1.25;
    color: var(--ink);
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

  /* Own pill — same wash as .leaflet-control-attribution in ArriveMap. */
  .credit {
    pointer-events: auto;
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0;
    padding: 0 0.4rem;
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: 400;
    line-height: 1.4;
    background: var(--wash);
    color: var(--muted);
    text-decoration: none;
    white-space: nowrap;
  }

  .credit:hover {
    color: var(--ink-soft);
    text-decoration: underline;
  }
</style>
