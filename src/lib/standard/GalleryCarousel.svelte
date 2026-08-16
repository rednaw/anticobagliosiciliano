<script lang="ts">
	import { asset } from '$app/paths';
	import { page } from '$app/state';
	import { pick, ui, type Locale } from '$lib/i18n';

	let {
		images,
		alt
	}: {
		images: string[];
		alt: string;
	} = $props();

	let index = $state(0);
	let thumbsEl: HTMLDivElement | undefined = $state();

	const locale = $derived((page.data.locale ?? 'it') as Locale);
	const count = $derived(images.length);
	const current = $derived(images[index] ?? images[0]);
	const photoAlt = $derived(
		locale === 'it'
			? `${alt} — foto ${index + 1} di ${count}`
			: `${alt} — photo ${index + 1} of ${count}`
	);

	function go(next: number) {
		if (count === 0) return;
		index = ((next % count) + count) % count;
		queueMicrotask(() => scrollThumbIntoView());
	}

	function prev() {
		go(index - 1);
	}

	function next() {
		go(index + 1);
	}

	function scrollThumbIntoView() {
		const strip = thumbsEl;
		if (!strip) return;
		const thumb = strip.children[index] as HTMLElement | undefined;
		thumb?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prev();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			next();
		}
	}
</script>

{#if count > 0}
	<div
		class="carousel"
		role="region"
		aria-roledescription="carousel"
		aria-label={`${pick(ui.gallery, locale)} ${alt}`}
	>
		<div class="stage">
			<img src={asset(current)} alt={photoAlt} />
			{#if count > 1}
				<button
					type="button"
					class="nav prev"
					onclick={prev}
					onkeydown={onKeydown}
					aria-label={pick(ui.previousPhoto, locale)}
				>
					‹
				</button>
				<button
					type="button"
					class="nav next"
					onclick={next}
					onkeydown={onKeydown}
					aria-label={pick(ui.nextPhoto, locale)}
				>
					›
				</button>
				<p class="counter" aria-live="polite">{index + 1} / {count}</p>
			{/if}
		</div>

		{#if count > 1}
			<div
				class="thumbs"
				bind:this={thumbsEl}
				role="tablist"
				aria-label={pick(ui.thumbnails, locale)}
			>
				{#each images as src, i}
					<button
						type="button"
						class="thumb"
						class:active={i === index}
						role="tab"
						aria-selected={i === index}
						aria-label={`${pick(ui.goToPhoto, locale)} ${i + 1}`}
						onclick={() => go(i)}
						onkeydown={onKeydown}
					>
						<img src={asset(src)} alt="" loading="lazy" />
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.stage {
		position: relative;
		background: color-mix(in srgb, var(--ink) 6%, var(--paper));
		overflow: hidden;
	}

	.stage img {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 11;
		object-fit: cover;
	}

	.nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 2.5rem;
		height: 2.5rem;
		border: none;
		border-radius: 999px;
		background: color-mix(in srgb, var(--paper) 88%, transparent);
		color: var(--sea-deep);
		font-size: 1.6rem;
		line-height: 1;
		cursor: pointer;
		display: grid;
		place-items: center;
		transition:
			background 0.25s var(--ease),
			transform 0.25s var(--ease);
	}

	.nav:hover {
		background: #fff;
	}

	.nav:active {
		transform: translateY(-50%) scale(0.96);
	}

	.prev {
		left: 0.75rem;
	}

	.next {
		right: 0.75rem;
	}

	.counter {
		position: absolute;
		right: 0.75rem;
		bottom: 0.75rem;
		margin: 0;
		padding: 0.3rem 0.65rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--sea-deep) 72%, transparent);
		color: #fff;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.thumbs {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.75rem;
		overflow-x: auto;
		padding-bottom: 0.25rem;
		scroll-snap-type: x proximity;
		scrollbar-width: thin;
	}

	.thumb {
		flex: 0 0 auto;
		width: 5.5rem;
		padding: 0;
		border: 2px solid transparent;
		background: transparent;
		cursor: pointer;
		scroll-snap-align: center;
		opacity: 0.72;
		transition:
			opacity 0.25s var(--ease),
			border-color 0.25s var(--ease);
	}

	.thumb img {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 11;
		object-fit: cover;
	}

	.thumb:hover {
		opacity: 1;
	}

	.thumb.active {
		opacity: 1;
		border-color: var(--sea);
	}

	@media (min-width: 800px) {
		.thumb {
			width: 6.5rem;
		}
	}
</style>
