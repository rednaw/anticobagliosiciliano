<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/data/content';
	import { pick, type Locale } from '$lib/standard/i18n';

	const locale = $derived((page.data.locale ?? 'it') as Locale);
</script>

<footer class="footer">
	<div class="container inner">
		<span class="rule" aria-hidden="true"></span>

		<p class="brand">{site.name}</p>
		<p class="meta">{site.tagline} · {pick(site.location, locale)}</p>

		<a class="email" href={`mailto:${site.email}`}>{site.email}</a>

		<p class="copy">© {new Date().getFullYear()}</p>
	</div>
</footer>

<style>
	.footer {
		padding: clamp(2rem, 4vw, 2.75rem) 0 clamp(1.5rem, 2.5vw, 2rem);
		border-top: 1px solid var(--line);
		background:
			radial-gradient(
				ellipse 70% 100% at 50% 0%,
				color-mix(in srgb, var(--olive) 7%, transparent),
				transparent 70%
			),
			color-mix(in srgb, var(--sea) 5%, var(--paper));
	}

	.inner {
		display: grid;
		justify-items: center;
		text-align: center;
		gap: 0.3rem;
	}

	.rule {
		width: 2rem;
		height: 2px;
		margin-bottom: 0.85rem;
		background: var(--sun);
	}

	.brand {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 500;
		letter-spacing: -0.02em;
		font-size: clamp(1.35rem, 2.5vw, 1.65rem);
		color: var(--ink);
	}

	.meta {
		margin: 0;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.email {
		margin-top: 0.7rem;
		font-weight: 500;
		color: var(--sea);
		text-decoration: none;
		border-bottom: 1px solid color-mix(in srgb, var(--sea) 30%, transparent);
		padding-bottom: 0.15rem;
		transition:
			border-color 0.3s var(--ease),
			color 0.3s var(--ease);
	}

	.email:hover {
		color: var(--sea-deep);
		border-bottom-color: var(--sea);
	}

	.copy {
		margin: 1.25rem 0 0;
		padding-top: 0.9rem;
		width: min(100%, 22rem);
		border-top: 1px solid var(--line);
		font-size: 0.78rem;
		color: var(--muted);
	}
</style>
