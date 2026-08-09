<script lang="ts">
	import { resolve } from '$app/paths';
	import { houses, site } from '$lib/data/content';
</script>

<footer class="footer">
	<div class="container grid">
		<div>
			<p class="brand">{site.name}</p>
			<p class="muted">{site.tagline} · {site.location}</p>
		</div>
		<nav aria-label="Footer">
			<a href={resolve('/')}>Home</a>
			{#each houses as house}
				<a href={resolve(`/case/${house.slug}`)}>{house.name}</a>
			{/each}
			<a href={resolve('/dintorni')}>Dintorni</a>
			<a href={resolve('/contatti')}>Contatti</a>
		</nav>
		<div class="end">
			<a href={`mailto:${site.email}`}>{site.email}</a>
			<p class="muted">© {new Date().getFullYear()} {site.name}</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		padding: 3.5rem 0 2.5rem;
		border-top: 1px solid var(--line);
		background: color-mix(in srgb, var(--sea) 6%, var(--paper));
	}

	.grid {
		display: grid;
		gap: 2rem;
	}

	.brand {
		font-family: var(--font-display);
		font-size: 1.35rem;
		margin: 0 0 0.35rem;
	}

	.muted {
		color: var(--muted);
		margin: 0;
		font-size: 0.95rem;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.25rem;
	}

	nav a,
	.end a {
		text-decoration: none;
		font-weight: 500;
		color: var(--ink-soft);
	}

	nav a:hover,
	.end a:hover {
		color: var(--sea);
	}

	.end {
		display: grid;
		gap: 0.5rem;
	}

	@media (min-width: 800px) {
		.grid {
			grid-template-columns: 1.4fr 1fr 1fr;
			align-items: start;
		}

		.end {
			justify-items: end;
			text-align: right;
		}
	}
</style>
