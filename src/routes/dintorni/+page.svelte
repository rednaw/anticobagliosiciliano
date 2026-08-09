<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import Reveal from '$lib/components/Reveal.svelte';
	import { places, site } from '$lib/data/content';
</script>

<svelte:head>
	<title>Dintorni · {site.name}</title>
	<meta
		name="description"
		content="Mare, natura e borghi autentici a pochi minuti dall’Antico Baglio Siciliano."
	/>
</svelte:head>

<section class="hero">
	<div class="container">
		<p class="eyebrow">Imperdibili</p>
		<h1>Balestrate e dintorni</h1>
		<p class="lead">Tra mare, natura e borghi autentici — tutto a portata di baglio.</p>
	</div>
</section>

<section class="section">
	<div class="container list">
		{#each places as place, i}
			<Reveal delay={(i % 3) * 60}>
				<article>
					<img src={asset(place.image)} alt={place.name} loading="lazy" />
					<div>
						<span class="time">{place.time} dal baglio</span>
						<h2>{place.name}</h2>
						<p>{place.text}</p>
					</div>
				</article>
			</Reveal>
		{/each}
	</div>
</section>

<section class="cta">
	<div class="container">
		<Reveal>
			<h2>Vieni a scoprirli da qui</h2>
			<a class="btn btn-light" href={resolve('/contatti')}>Prenota il soggiorno</a>
		</Reveal>
	</div>
</section>

<style>
	.hero {
		padding: clamp(3.5rem, 8vw, 5.5rem) 0 1rem;
	}

	h1 {
		margin: 0 0 0.75rem;
		font-size: clamp(2.5rem, 6vw, 4rem);
	}

	.lead {
		margin: 0;
		max-width: 32rem;
		font-size: 1.15rem;
		color: var(--ink-soft);
	}

	.list {
		display: grid;
		gap: 2rem;
	}

	article {
		display: grid;
		gap: 1.25rem;
		align-items: center;
	}

	article img {
		width: 100%;
		aspect-ratio: 16 / 11;
		object-fit: cover;
	}

	.time {
		display: inline-block;
		font-size: 0.78rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 600;
		color: var(--olive);
		margin-bottom: 0.5rem;
	}

	h2 {
		margin: 0 0 0.65rem;
		font-size: clamp(1.6rem, 3vw, 2.2rem);
	}

	p {
		margin: 0;
		color: var(--ink-soft);
	}

	.cta {
		padding: 4rem 0;
		background: var(--sea);
		color: #fff;
	}

	.cta h2 {
		margin: 0 0 1.25rem;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
	}

	@media (min-width: 800px) {
		.list {
			gap: 3rem;
		}

		article {
			grid-template-columns: 1.1fr 0.9fr;
			gap: 2.5rem;
		}

		article:nth-child(even) img {
			order: 2;
		}
	}
</style>
