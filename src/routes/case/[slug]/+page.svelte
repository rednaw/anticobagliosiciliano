<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import Reveal from '$lib/components/Reveal.svelte';
	import { houses, site } from '$lib/data/content';

	let { data } = $props();
	const house = $derived(data.house);
	const others = $derived(houses.filter((h) => h.slug !== house.slug));
</script>

<svelte:head>
	<title>{house.name} · {site.name}</title>
	<meta name="description" content={house.summary} />
</svelte:head>

<section class="hero">
	<img src={asset(house.image)} alt={house.name} />
	<div class="veil"></div>
	<div class="container copy">
		<p class="eyebrow">Alloggio</p>
		<h1>{house.name}</h1>
		<p class="tagline">{house.tagline}</p>
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
			<Reveal>
				<a class="btn" href={resolve('/contatti')}>Richiesta disponibilità</a>
			</Reveal>
		</div>
		<aside>
			<Reveal delay={80}>
				<div class="panel">
					<p class="eyebrow">In evidenza</p>
					<ul>
						{#each house.highlights as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			</Reveal>
			<div class="gallery">
				{#each house.gallery as src, i}
					<Reveal delay={100 + i * 50}>
						<img src={asset(src)} alt={`${house.name} — foto ${i + 1}`} loading="lazy" />
					</Reveal>
				{/each}
			</div>
		</aside>
	</div>
</section>

<section class="section more">
	<div class="container">
		<Reveal>
			<div class="section-head">
				<p class="eyebrow">Altre case</p>
				<h2>Continua a esplorare</h2>
			</div>
		</Reveal>
		<div class="grid">
			{#each others as other, i}
				<Reveal delay={i * 70}>
					<a href={resolve(`/case/${other.slug}`)}>
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
		margin-bottom: 1.25rem;
	}

	.panel ul {
		margin: 0;
		padding-left: 1.1rem;
		display: grid;
		gap: 0.55rem;
		color: var(--ink-soft);
	}

	.gallery {
		display: grid;
		gap: 0.75rem;
	}

	.gallery img {
		width: 100%;
		aspect-ratio: 16 / 11;
		object-fit: cover;
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
		}

		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
