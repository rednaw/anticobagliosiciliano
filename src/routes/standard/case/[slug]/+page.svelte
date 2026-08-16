<script lang="ts">
	import { asset, base } from '$app/paths';
	import { page } from '$app/state';
	import GalleryCarousel from '$lib/standard/GalleryCarousel.svelte';
	import Reveal from '$lib/standard/Reveal.svelte';
	import { houses, site } from '$lib/data/content';
	import { pick, standardHref, ui, withBase, type Locale } from '$lib/standard/i18n';

	let { data } = $props();
	const locale = $derived((page.data.locale ?? 'it') as Locale);
	const house = $derived(data.house);
	const others = $derived(houses(locale).filter((h) => h.slug !== house.slug));
	const contatti = $derived(withBase(standardHref(locale, 'contatti'), base));
</script>

<svelte:head>
	<title>{house.name} · {site.name}</title>
	<meta name="description" content={house.summary} />
</svelte:head>

<section class="hero">
	<img src={asset(house.image)} alt={house.name} />
	<div class="veil"></div>
	<div class="container copy">
		<p class="eyebrow">{pick(ui.accommodation, locale)}</p>
		<h1>{house.name}</h1>
		{#if house.tagline}
			<p class="tagline">{house.tagline}</p>
		{/if}
	</div>
</section>

<section class="section">
	<div class="container layout">
		<div>
			<Reveal>
				<div class="stats">
					<span>{house.guests}</span>
					<span>{house.size}</span>
					<span>{house.bedrooms}</span>
					<span>{house.bathrooms}</span>
				</div>
			</Reveal>
			{#each house.paragraphs as paragraph, i}
				<Reveal delay={i * 60}>
					<p class="body">{paragraph}</p>
				</Reveal>
			{/each}
		</div>
		<aside>
			<Reveal delay={80}>
				<div class="panel">
					<p class="eyebrow">{pick(ui.highlights, locale)}</p>
					<ul>
						{#each house.highlights as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			</Reveal>
		</aside>
	</div>
	<div class="container gallery">
		<Reveal delay={100}>
			<GalleryCarousel images={house.gallery} alt={house.name} />
		</Reveal>
		<Reveal delay={140}>
			<a class="btn cta" href={contatti}>{pick(ui.requestAvailability, locale)}</a>
		</Reveal>
	</div>
</section>

<section class="section more">
	<div class="container">
		<Reveal>
			<div class="section-head">
				<p class="eyebrow">{pick(ui.otherHouses, locale)}</p>
				<h2>{pick(ui.keepExploring, locale)}</h2>
			</div>
		</Reveal>
		<div class="grid">
			{#each others as other, i}
				<Reveal delay={i * 70}>
					<a href={withBase(standardHref(locale, `case/${other.slug}`), base)}>
						<img src={asset(other.image)} alt={other.name} loading="lazy" />
						<span>{other.name}</span>
					</a>
				</Reveal>
			{/each}
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: min(68vh, 36rem);
		display: grid;
		align-items: end;
		color: #fff;
		overflow: hidden;
	}

	.hero img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		animation: hero-zoom 7s var(--ease) both;
	}

	.veil {
		position: absolute;
		inset: 0;
		background: linear-gradient(0deg, color-mix(in srgb, var(--sea-deep) 80%, transparent), transparent 60%);
	}

	.copy {
		position: relative;
		z-index: 1;
		padding-bottom: 2.5rem;
	}

	.eyebrow {
		color: color-mix(in srgb, var(--sun) 80%, #fff);
	}

	h1 {
		margin: 0 0 0.5rem;
		font-size: clamp(2.6rem, 7vw, 4.5rem);
	}

	.tagline {
		margin: 0;
		max-width: 28rem;
		font-size: 1.15rem;
		opacity: 0.95;
	}

	.layout {
		display: grid;
		gap: 2.5rem;
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		margin-bottom: 1.5rem;
	}

	.stats span {
		padding: 0.45rem 0.75rem;
		border: 1px solid var(--line);
		background: #fff;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--olive);
	}

	.body {
		color: var(--ink-soft);
		font-size: 1.08rem;
		max-width: 40rem;
	}

	.panel {
		padding: 1.5rem;
		background: color-mix(in srgb, var(--olive) 8%, #fff);
		border: 1px solid var(--line);
	}

	.panel ul {
		margin: 0;
		padding-left: 1.1rem;
		display: grid;
		gap: 0.55rem;
		color: var(--ink-soft);
	}

	.gallery {
		margin-top: 2.5rem;
	}

	.cta {
		margin-top: 1.5rem;
	}

	.more {
		background: color-mix(in srgb, var(--sea) 5%, var(--paper));
		border-top: 1px solid var(--line);
	}

	.grid {
		display: grid;
		gap: 1rem;
	}

	.grid a {
		text-decoration: none;
		display: grid;
		gap: 0.65rem;
	}

	.grid img {
		width: 100%;
		aspect-ratio: 16 / 11;
		object-fit: cover;
	}

	.grid span {
		font-family: var(--font-display);
		font-size: 1.35rem;
	}

	@media (min-width: 800px) {
		.layout {
			grid-template-columns: 1.15fr 0.85fr;
			gap: 3.5rem;
			align-items: start;
		}

		.gallery {
			margin-top: 3rem;
		}

		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
