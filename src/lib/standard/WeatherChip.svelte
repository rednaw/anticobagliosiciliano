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

  /** Gap between Open-Meteo pill and OSM attribution (map shows through). */
  const ATTRIB_GAP_PX = 12;

  let reading = $state<WeatherReading | null>(null);
  let stageEl = $state<HTMLElement | null>(null);
  /** Distance from the right edge so the credit sits clear of Leaflet’s attribution. */
  let creditInsetPx = $state(180);

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

  $effect(() => {
    const root = stageEl;
    const show = Boolean(reading && tier === 'full');
    if (!root || !show) return;

    const stage = root.closest('.map-stage') ?? root.parentElement;
    if (!stage) return;
    const host = stage;

    let attrib: Element | null = null;
    let observer: ResizeObserver | undefined;
    let timer: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    function syncInset() {
      if (!attrib || !(attrib instanceof HTMLElement)) return;
      creditInsetPx = attrib.offsetWidth + ATTRIB_GAP_PX;
    }

    function watch(): boolean {
      attrib = host.querySelector('.leaflet-control-attribution');
      if (!attrib) return false;
      syncInset();
      observer = new ResizeObserver(syncInset);
      observer.observe(attrib);
      return true;
    }

    if (!watch()) {
      timer = setInterval(() => {
        if (cancelled) return;
        if (watch() && timer !== undefined) clearInterval(timer);
      }, 100);
    }

    return () => {
      cancelled = true;
      if (timer !== undefined) clearInterval(timer);
      observer?.disconnect();
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

<div class="weather-root" bind:this={stageEl}>
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
      target="_blank"
      style:right="{creditInsetPx}px">{pick(weatherCopy.credit, locale)}</a
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
    border: 2px solid rgba(0, 0, 0, 0.4);
    border-radius: var(--radius);
    background: #fff;
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
    color: color-mix(in srgb, var(--ink) 72%, #fff);
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
    margin: 0;
    padding: 0 0.4rem;
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: 400;
    line-height: 1.4;
    background: color-mix(in srgb, var(--paper) 88%, transparent);
    color: #0078a8;
    text-decoration: none;
    white-space: nowrap;
  }

  .credit:hover {
    color: #005d82;
    text-decoration: underline;
  }
</style>
