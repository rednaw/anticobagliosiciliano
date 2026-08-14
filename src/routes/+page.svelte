<script lang="ts">
	import { resolve } from '$app/paths';
	import { site } from '$lib/data/content';
</script>

<svelte:head>
	<title>Indice · {site.name}</title>
</svelte:head>

<main class="hub">
	<div class="hub-inner">
		<p class="eyebrow">Benvenuti</p>
		<h1>{site.name}</h1>
		<p class="lead">Scegli una versione del sito da esplorare.</p>

		<nav class="choices" aria-label="Destinazioni">
			<a class="choice" href={resolve('/standard/')}>
				<span class="choice-label">Standard</span>
				<span class="choice-desc">Design attuale</span>
			</a>
			<a class="choice" href={resolve('/experimental/')}>
				<span class="choice-label">Experimental</span>
				<span class="choice-desc">Design alternativo (in lavorazione)</span>
			</a>
			<a class="choice" href={resolve('/archivio/')}>
				<span class="choice-label">Archivio</span>
				<span class="choice-desc">Foto e testi dei siti precedenti</span>
			</a>
		</nav>
	</div>
</main>

<style>
	.hub {
		min-height: 100dvh;
		display: grid;
		place-items: center;
		padding: 1.5rem;
	}

	.hub-inner {
		width: min(36rem, 100%);
	}

	h1 {
		margin: 0 0 0.75rem;
		font-size: clamp(2rem, 6vw, 3rem);
	}

	.lead {
		margin: 0 0 2rem;
		color: var(--ink-soft);
	}

	.choices {
		display: grid;
		gap: 0.85rem;
	}

	.choice {
		display: grid;
		gap: 0.25rem;
		padding: 1.15rem 1.25rem;
		text-decoration: none;
		color: inherit;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--paper) 70%, white);
		border-radius: var(--radius);
		transition:
			border-color 0.2s var(--ease),
			background 0.2s var(--ease);
	}

	.choice:hover,
	.choice:focus-visible {
		border-color: var(--sea);
		background: #fff;
		outline: 2px solid var(--sea);
		outline-offset: 2px;
	}

	.choice-label {
		font-family: var(--font-display);
		font-size: 1.35rem;
	}

	.choice-desc {
		color: var(--muted);
		font-size: 0.95rem;
	}
</style>
