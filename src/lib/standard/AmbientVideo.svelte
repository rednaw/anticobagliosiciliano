<script lang="ts">
	import { asset } from '$app/paths';
	import { page } from '$app/state';
	import { pick, ui, type Locale } from '$lib/i18n';

	let {
		src,
		poster,
		label
	}: {
		src: string;
		poster: string;
		label: string;
	} = $props();

	let el: HTMLVideoElement | undefined = $state();
	let wrap: HTMLDivElement | undefined = $state();

	const locale = $derived((page.data.locale ?? 'it') as Locale);

	let ended = $state(false);

	async function attemptPlay() {
		if (!el || ended) return;
		try {
			await el.play();
		} catch {
			// iOS Low Power Mode and strict autoplay policies land here: leave the poster up.
		}
	}

	async function replay() {
		if (!el) return;
		ended = false;
		el.currentTime = 0;
		try {
			await el.play();
		} catch {
			/* ignore */
		}
	}

	$effect(() => {
		const video = el;
		const container = wrap;
		if (!video || !container) return;

		const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (calm.matches) return;

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

<div class="ambient" class:finished={ended} bind:this={wrap}>
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		bind:this={el}
		muted
		playsinline
		preload="none"
		poster={asset(poster)}
		aria-label={label}
		onended={() => (ended = true)}
	>
		<source src={asset(src)} type="video/mp4" />
		{pick(ui.videoUnsupported, locale)}
	</video>

	{#if ended}
		<button
			type="button"
			class="replay"
			onclick={replay}
			aria-label={pick(ui.replayVideo, locale)}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path
					d="M12 5V2L8 6l4 4V7a5 5 0 11-4.9 4H5.05A7 7 0 1012 5z"
					fill="currentColor"
				/>
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

	.replay {
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
		backdrop-filter: blur(6px);
		opacity: 0;
		transform: translateY(0.35rem);
		transition:
			opacity 0.3s var(--ease),
			transform 0.3s var(--ease),
			background 0.25s var(--ease);
	}

	.ambient.finished:hover .replay,
	.ambient.finished:focus-within .replay {
		opacity: 1;
		transform: none;
	}

	/* Touch devices never hover — keep replay reachable once the clip has ended. */
	@media (hover: none) {
		.ambient.finished .replay {
			opacity: 1;
			transform: none;
		}
	}

	.replay:hover {
		background: var(--sea-deep);
	}

	svg {
		width: 1.15rem;
		height: 1.15rem;
	}
</style>
