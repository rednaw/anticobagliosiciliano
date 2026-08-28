<script lang="ts">
  import { onMount } from 'svelte';
  import { imageAsset } from '$lib/public-image';
  import { baglioLocation, site } from '$lib/data/content';
  import type { Map as LeafletMap } from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { ARRIVE_MAP } from './arrive-map';

  let {
    alt,
    attribution
  }: {
    alt: string;
    attribution: string;
  } = $props();

  let mapEl: HTMLDivElement | undefined = $state();
  let ready = $state(false);

  onMount(() => {
    let map: LeafletMap | undefined;
    let cancelled = false;
    const stop: Array<() => void> = [];

    void (async () => {
      const leaflet = await import('leaflet');
      const L = leaflet.default ?? leaflet;
      if (cancelled || !mapEl) return;

      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const center: [number, number] = [baglioLocation.lat, baglioLocation.lon];

      map = L.map(mapEl, {
        center,
        zoom: ARRIVE_MAP.zoom,
        minZoom: ARRIVE_MAP.minZoom,
        maxZoom: ARRIVE_MAP.maxZoom,
        maxBounds: ARRIVE_MAP.bounds,
        maxBoundsViscosity: 0.85,
        scrollWheelZoom: false,
        zoomAnimation: !calm,
        fadeAnimation: !calm,
        markerZoomAnimation: !calm
      });
      map.attributionControl.setPrefix(false);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: `<a href="https://www.openstreetmap.org/copyright">${escapeHtml(attribution)}</a>`
      }).addTo(map);

      L.marker(center, {
        title: site.name,
        alt: site.name,
        icon: L.divIcon({
          className: 'arrive-pin',
          iconSize: [28, 40],
          iconAnchor: [14, 40],
          html: '<span class="arrive-pin-mark" aria-hidden="true"><span class="arrive-pin-dot"></span></span>'
        })
      }).addTo(map);

      map.on('focus', () => map?.scrollWheelZoom.enable());
      map.on('blur', () => map?.scrollWheelZoom.disable());

      const container = map.getContainer();
      container.tabIndex = 0;

      if (coarse) {
        map.dragging.disable();
        function onTouch(e: TouchEvent) {
          if (!map) return;
          if (e.touches.length >= 2) map.dragging.enable();
          else map.dragging.disable();
        }
        container.addEventListener('touchstart', onTouch, { passive: true });
        container.addEventListener('touchend', onTouch);
        container.addEventListener('touchcancel', onTouch);
        stop.push(() => {
          container.removeEventListener('touchstart', onTouch);
          container.removeEventListener('touchend', onTouch);
          container.removeEventListener('touchcancel', onTouch);
        });
      }

      map.whenReady(() => {
        if (cancelled) return;
        ready = true;
        requestAnimationFrame(() => {
          if (!cancelled) map?.invalidateSize();
        });
      });
    })();

    return () => {
      cancelled = true;
      for (const off of stop) off();
      map?.remove();
    };
  });

  function escapeHtml(value: string) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }
</script>

<div class="frame">
  <div class="leaflet" bind:this={mapEl} role="region" aria-label={alt}></div>
  <img
    class="fallback"
    class:gone={ready}
    src={imageAsset(baglioLocation.map)}
    srcset="{imageAsset(baglioLocation.mapSm)} 800w, {imageAsset(baglioLocation.map)} 1536w"
    sizes="(min-width: 960px) 70rem, calc(100vw - 2.5rem)"
    alt={ready ? '' : alt}
    width="1536"
    height="1024"
    fetchpriority="high"
    aria-hidden={ready ? true : undefined}
  />
</div>

<style>
  .frame {
    position: relative;
    aspect-ratio: 3 / 2;
    overflow: hidden;
    background: var(--paper-deep);
  }

  .leaflet,
  .fallback {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .leaflet {
    z-index: 0;
  }

  .fallback {
    object-fit: cover;
    object-position: center;
    z-index: 2;
    transition: opacity 0.35s var(--ease);
  }

  .fallback.gone {
    opacity: 0;
    pointer-events: none;
  }

  :global(.arrive-pin) {
    background: none;
    border: none;
  }

  :global(.arrive-pin-mark) {
    position: relative;
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    margin: 0.2rem auto 0;
    background: var(--sea);
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 0.35rem 0.65rem color-mix(in srgb, var(--sea) 30%, transparent);
  }

  :global(.arrive-pin-dot) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.5rem;
    height: 0.5rem;
    background: var(--sun);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  :global(.leaflet-container) {
    font-family: var(--font-body);
    background: var(--paper-deep);
  }

  :global(.leaflet-control-attribution) {
    font-size: 0.72rem;
    background: color-mix(in srgb, var(--paper) 88%, transparent);
    color: var(--muted);
  }

  :global(.leaflet-control-attribution a) {
    color: inherit;
  }

  :global(.leaflet-bar a) {
    color: var(--sea);
    border-radius: var(--radius);
  }

  @media (prefers-reduced-motion: reduce) {
    .fallback {
      transition: none;
    }
  }
</style>
