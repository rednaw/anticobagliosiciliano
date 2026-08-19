<script lang="ts">
	import { asset } from '$app/paths';
	import { imageAsset } from '$lib/public-image';
	import { page } from '$app/state';
	import { pick, ui } from '$lib/standard/i18n';

	let {
		src,
		poster,
		posterSrcset,
		posterSizes,
		label
	}: {
		src: string;
		poster: string;
		posterSrcset?: string;
		posterSizes?: string;
		label: string;
	} = $props();

	let el: HTMLVideoElement | undefined = $state();
	let wrap: HTMLDivElement | undefined = $state();

	const locale = $derived(page.data.locale);

	let ended = $state(false);
	let playing = $state(false);
	let started = $state(false);
	let reduceMotion = $state(false);

	const showControl = $derived(!playing && (reduceMotion || ended));
	const controlLabel = $derived(pick(ended ? ui.replayVideo : ui.playVideo, locale));

	async function attemptPlay() {
		if (!el || ended) return;
		try {
			await el.play();
		} catch {
			// iOS Low Power Mode and strict autoplay policies land here: leave the poster up.
		}
	}

	function holdLastFrame() {
		if (!el || ended) return;
		const duration = el.duration;
		if (!Number.isFinite(duration) || duration <= 0) return;
		if (duration - el.currentTime > 0.1) return;
		ended = true;
		playing = false;
		el.pause();
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
			/* ignore */
		}
	}

	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = mq.matches;
		const onChange = () => {
			reduceMotion = mq.matches;
		};
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	$effect(() => {
		const video = el;
		const container = wrap;
		if (!video || !container) return;

		if (reduceMotion) {
			video.pause();
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) attemptPlay();
				else video.pause();
			},
			{ threshold: 0.35 }
		);
		observer.observe(container);
		return () => observer.disconnect();
	});
</script>

<div class="ambient" bind:this={wrap}>
	{#if posterSrcset}
		<img
			class="poster"
			class:hide={started}
			src={imageAsset(poster)}
			srcset={posterSrcset}
			sizes={posterSizes}
			alt=""
			aria-hidden="true"
		/>
	{/if}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		bind:this={el}
		muted
		playsinline
		preload="none"
		poster={posterSrcset ? undefined : imageAsset(poster)}
		aria-label={label}
		onplay={() => {
			playing = true;
			started = true;
		}}
		onpause={() => (playing = false)}
		ontimeupdate={holdLastFrame}
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
</div>

<style>
	.ambient {
		position: relative;
		border-radius: var(--radius);
		overflow: hidden;
		box-shadow: var(--shadow);
	}

	video {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		background: #000;
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

	svg {
		width: 1.15rem;
		height: 1.15rem;
	}
</style>
