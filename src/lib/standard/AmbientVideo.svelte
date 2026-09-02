<script lang="ts">
  import { asset } from '$app/paths';
  import { responsiveImage } from '$lib/public-image';
  import { page } from '$app/state';
  import {
    AUTOPLAY_PREPARE_MS,
    AUTOPLAY_STALL_MS,
    abortVideoLoad,
    hasBufferProgress,
    hasMinimumBuffer,
    homeCinemaSession,
    parkVideoAtEnd,
    showAmbientControl
  } from '$lib/standard/ambient-video';
  import { mediaTier, markLight } from '$lib/standard/network-tier';
  import { REDUCE_MOTION_QUERY, subscribeMediaQuery } from '$lib/standard/media-query';
  import { pick, ui } from '$lib/standard/i18n';

  let {
    src,
    poster,
    posterEnd,
    label,
    fill = false,
    fetchPriority,
    playing = $bindable(false),
    ended = $bindable(false),
    ready = true,
    /** Still image only — no video fetch or playback (reduced motion or light tier). */
    posterOnly = false,
    /** Persist playback off-screen; with homepage cinema, also once per SPA session. */
    playOnce = false
  }: {
    src: string;
    poster: string;
    /** Last frame still for posterOnly; falls back to poster. */
    posterEnd?: string;
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
  let sourceAttached = $state(false);

  const locale = $derived(page.data.locale);
  const tier = $derived($mediaTier);

  let reduceMotion = $state(false);
  let playBlocked = $state(false);

  const sessionSpent = $derived(playOnce && homeCinemaSession.spent());

  const showControl = $derived(
    showAmbientControl({ playing, reduceMotion, ended, playBlocked, sessionSpent })
  );
  const controlLabel = $derived(pick(ended ? ui.replayVideo : ui.playVideo, locale));
  const stillPoster = $derived(posterEnd ?? poster);
  /** Hide the element (and its start poster) until playback or a recovery UI is needed. */
  const awaitingPlayback = $derived(!playing && !ended && !playBlocked && !sessionSpent);

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

  function failPrepareToLight(video: HTMLVideoElement) {
    abortVideoLoad(video);
    sourceAttached = false;
    markLight();
  }

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
    };

    if (video.readyState >= 1) restore();
    else video.addEventListener('loadedmetadata', restore, { once: true });
  });

  /** Buffer-gated attach + autoplay when cinema is ready and tier is full. */
  $effect(() => {
    if (posterOnly || !ready || tier === 'light') return;
    const video = el;
    const container = wrap;
    if (!video || !container) return;

    if (reduceMotion) {
      video.pause();
      return;
    }

    if (playOnce && homeCinemaSession.spent()) return;

    let cancelled = false;
    let prepareStarted = false;
    let prepareTimer: ReturnType<typeof setTimeout> | undefined;
    let stallTimer: ReturnType<typeof setTimeout> | undefined;
    let intersecting = fill;

    const clearTimers = () => {
      if (prepareTimer !== undefined) clearTimeout(prepareTimer);
      if (stallTimer !== undefined) clearTimeout(stallTimer);
      prepareTimer = undefined;
      stallTimer = undefined;
    };

    const onProgress = () => {
      if (cancelled) return;
      if (hasBufferProgress(video) && stallTimer !== undefined) {
        clearTimeout(stallTimer);
        stallTimer = undefined;
      }
      if (!hasMinimumBuffer(video)) return;
      clearTimers();
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('canplaythrough', onProgress);
      void attemptPlay();
    };

    const startPrepare = () => {
      if (cancelled || prepareStarted) return;
      prepareStarted = true;
      sourceAttached = true;
      video.preload = 'auto';

      queueMicrotask(() => {
        if (cancelled || !el) return;
        video.load();
        stallTimer = setTimeout(() => {
          if (cancelled || hasBufferProgress(video) || hasMinimumBuffer(video)) return;
          clearTimers();
          failPrepareToLight(video);
        }, AUTOPLAY_STALL_MS);
        prepareTimer = setTimeout(() => {
          if (cancelled || hasMinimumBuffer(video)) return;
          clearTimers();
          failPrepareToLight(video);
        }, AUTOPLAY_PREPARE_MS);
        video.addEventListener('progress', onProgress);
        video.addEventListener('canplaythrough', onProgress);
        if (hasMinimumBuffer(video)) onProgress();
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        if (entry.isIntersecting) startPrepare();
        else if (!playOnce) video.pause();
      },
      { threshold: fill ? 0 : 0.35 }
    );
    observer.observe(container);
    if (intersecting) startPrepare();

    return () => {
      cancelled = true;
      clearTimers();
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('canplaythrough', onProgress);
      observer.disconnect();
    };
  });
</script>

<div class="ambient" class:fill bind:this={wrap}>
  {#if posterOnly}
    <img
      class="poster"
      src={responsiveImage(stillPoster, { tier })}
      width="1280"
      height="720"
      alt={label}
      fetchpriority={fetchPriority}
    />
  {:else}
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    bind:this={el}
    class:awaiting-playback={awaitingPlayback}
    muted
    playsinline
    preload="none"
    width="1600"
    height="900"
    poster={playBlocked ? responsiveImage(poster, { tier }) : undefined}
    aria-label={label}
    onplay={() => {
      playing = true;
      playBlocked = false;
      if (playOnce) homeCinemaSession.markStarted();
    }}
    onpause={() => (playing = false)}
    onended={finishPlayback}
  >
    {#if sourceAttached}
      <source src={asset(src)} type="video/mp4" />
    {/if}
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

  video.awaiting-playback {
    opacity: 0;
    background: transparent;
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
