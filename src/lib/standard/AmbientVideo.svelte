<script lang="ts">
  import { asset } from '$app/paths';
  import { imageAsset } from '$lib/public-image';
  import { page } from '$app/state';
  import {
    homeCinemaSession,
    parkVideoAtEnd,
    showAmbientControl
  } from '$lib/standard/ambient-video';
  import { REDUCE_MOTION_QUERY, subscribeMediaQuery } from '$lib/standard/media-query';
  import { pick, ui } from '$lib/standard/i18n';

  let {
    src,
    poster,
    posterEnd,
    posterSrcset,
    posterSizes,
    label,
    fill = false,
    fetchPriority,
    playing = $bindable(false),
    ended = $bindable(false),
    ready = true,
    /** Still image only — no video fetch or playback (e.g. prefers-reduced-motion). */
    posterOnly = false,
    /** Persist playback off-screen; with homepage cinema, also once per SPA session. */
    playOnce = false
  }: {
    src: string;
    poster: string;
    /** Last frame still for posterOnly (e.g. reduced motion); falls back to poster. */
    posterEnd?: string;
    posterSrcset?: string;
    posterSizes?: string;
    label: string;
    /** Cover the parent box edge-to-edge (hero). */
    fill?: boolean;
    fetchPriority?: 'high' | 'low' | 'auto';
    playing?: boolean;
    ended?: boolean;
    /** When false, the clip stays paused until the parent sets this (gate-then-video intro). */
    ready?: boolean;
    posterOnly?: boolean;
    playOnce?: boolean;
  } = $props();

  let el: HTMLVideoElement | undefined = $state();
  let wrap: HTMLDivElement | undefined = $state();

  const locale = $derived(page.data.locale);

  let started = $state(false);
  let reduceMotion = $state(false);
  let playBlocked = $state(false);

  const sessionSpent = $derived(playOnce && homeCinemaSession.spent());

  const showControl = $derived(
    showAmbientControl({ playing, reduceMotion, ended, playBlocked, sessionSpent })
  );
  const controlLabel = $derived(pick(ended ? ui.replayVideo : ui.playVideo, locale));

  function syncEnded() {
    ended = true;
    playing = false;
  }

  async function attemptPlay() {
    if (!el || ended || (playOnce && homeCinemaSession.spent())) return;
    try {
      await el.play();
    } catch {
      playBlocked = true;
    }
  }

  function finishPlayback() {
    if (!el || ended) return;
    parkVideoAtEnd(el);
    syncEnded();
    if (playOnce) homeCinemaSession.markFinished();
  }

  async function playFromControl() {
    if (!el) return;
    if (ended) {
      ended = false;
      el.currentTime = 0;
    }
    try {
      await el.play();
    } catch {
      playBlocked = true;
    }
  }

  const stillPoster = $derived(posterEnd ?? poster);

  $effect(() => {
    if (posterOnly) return;
    return subscribeMediaQuery(REDUCE_MOTION_QUERY, (matches) => {
      reduceMotion = matches;
    });
  });

  $effect(() => {
    if (posterOnly) return;
    const video = el;
    if (!video || !playOnce || !homeCinemaSession.finished()) return;

    const restore = () => {
      parkVideoAtEnd(video);
      syncEnded();
      started = true;
    };

    if (video.readyState >= 1) restore();
    else video.addEventListener('loadedmetadata', restore, { once: true });
  });

  $effect(() => {
    if (posterOnly) return;
    const video = el;
    const container = wrap;
    if (!video || !container || !ready) return;

    if (reduceMotion) {
      video.pause();
      return;
    }

    if (playOnce && homeCinemaSession.spent()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) attemptPlay();
        else if (!playOnce) video.pause();
      },
      { threshold: fill ? 0 : 0.35 }
    );
    observer.observe(container);
    if (fill) attemptPlay();
    return () => observer.disconnect();
  });
</script>

<div class="ambient" class:fill bind:this={wrap}>
  {#if posterOnly}
    <img
      class="poster"
      src={imageAsset(stillPoster)}
      width="1280"
      height="720"
      alt={label}
      fetchpriority={fetchPriority}
    />
  {:else}
  {#if posterSrcset}
    <img
      class="poster"
      class:hide={started}
      src={imageAsset(poster)}
      srcset={posterSrcset}
      sizes={posterSizes}
      width="1600"
      height="900"
      alt=""
      aria-hidden="true"
      fetchpriority={fetchPriority}
    />
  {/if}
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    bind:this={el}
    muted
    playsinline
    preload={fill ? 'metadata' : 'none'}
    width="1600"
    height="900"
    poster={posterSrcset ? undefined : imageAsset(poster)}
    aria-label={label}
    onplay={() => {
      playing = true;
      started = true;
      playBlocked = false;
      if (playOnce) homeCinemaSession.markStarted();
    }}
    onpause={() => (playing = false)}
    onended={finishPlayback}
  >
    <source src={asset(src)} type="video/mp4" />
    {pick(ui.videoUnsupported, locale)}
  </video>

  {#if showControl}
    <button type="button" class="control" onclick={playFromControl} aria-label={controlLabel}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {#if ended}
          <path
            d="M12 5V2L8 6l4 4V7a5 5 0 11-4.9 4H5.05A7 7 0 1012 5z"
            fill="currentColor"
          />
        {:else}
          <path d="M8 5v14l11-7z" fill="currentColor" />
        {/if}
      </svg>
    </button>
  {/if}
  {/if}
</div>

<style>
  .ambient {
    position: relative;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  .ambient.fill {
    position: absolute;
    inset: 0;
    border-radius: 0;
    box-shadow: none;
  }

  video {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    background: #000;
  }

  .fill video,
  .fill .poster {
    width: 100%;
    height: 100%;
    aspect-ratio: unset;
    object-fit: cover;
  }

  .poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  .poster.hide {
    visibility: hidden;
  }

  .control {
    position: absolute;
    right: 0.75rem;
    bottom: 0.75rem;
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border: none;
    border-radius: 999px;
    background: color-mix(in srgb, var(--sea-deep) 68%, transparent);
    color: #fff;
    cursor: pointer;
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }

  .control:hover,
  .control:focus-visible {
    background: var(--sea-deep);
  }

  .fill .control {
    z-index: 2;
  }

  svg {
    width: 1.15rem;
    height: 1.15rem;
  }
</style>
