<script lang="ts">
  import { imageAsset } from '$lib/public-image';
  import { page } from '$app/state';
  import { arriveCopy, baglioLocation } from '$lib/data/content';
  import { pick, ui } from '$lib/standard/i18n';

  const locale = $derived(page.data.locale);
  const heading = $derived(pick(ui.navArrive, locale));
  const t = $derived((key: keyof typeof arriveCopy) => pick(arriveCopy[key], locale));
  const coords = `${baglioLocation.lat.toFixed(5)}, ${baglioLocation.lon.toFixed(5)}`;
</script>

<section class="hero">
  <div class="container">
    <h1>{heading}</h1>
    <p class="lead">{t('lead')}</p>
  </div>
</section>

<section class="section map-block">
  <div class="container">
    <figure class="map">
      <img
        src={imageAsset(baglioLocation.map)}
        srcset="{imageAsset(baglioLocation.mapSm)} 800w, {imageAsset(baglioLocation.map)} 1536w"
        sizes="(min-width: 960px) 70rem, calc(100vw - 2.5rem)"
        alt={t('mapAlt')}
        width="1536"
        height="1024"
        fetchpriority="high"
      />
      <figcaption>
    		<a href="https://www.openstreetmap.org/copyright">{t('attribution')}</a>
			</figcaption>
		</figure>

		<div class="actions">
			<ul class="apps">
				{#each baglioLocation.links as link}
					<li>
						<a href={link.href} rel="noopener noreferrer" target="_blank"
							>{pick(link.label, locale)}</a
						>
					</li>
				{/each}
			</ul>
			<p class="coords">
				<span>{t('coordsLabel')}</span>
				{coords}
			</p>
		</div>

		<div class="copy">
			<h2>{t('airTitle')}</h2>
			<p>{t('air')}</p>

			<h2>{t('roadTitle')}</h2>
			<p>{t('road')}</p>
		</div>
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
		max-width: 38rem;
		font-size: 1.15rem;
		line-height: 1.55;
		color: var(--ink-soft);
	}

	.map-block {
		padding-top: 1.25rem;
	}

	.map {
		margin: 0 0 2.5rem;
	}

	.map img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		object-position: center;
		background: var(--paper-deep);
	}

	.map figcaption {
		margin-top: 0.55rem;
		font-size: 0.8rem;
		color: var(--muted);
	}

	.map a {
		color: inherit;
		text-decoration: none;
		border-bottom: 1px solid color-mix(in srgb, var(--muted) 45%, transparent);
	}

	.map a:hover {
		color: var(--sea);
		border-bottom-color: var(--sea);
	}

	.copy {
		max-width: 40rem;
	}

	h2 {
		margin: 2rem 0 0.65rem;
		font-size: 1.15rem;
	}

	.copy p {
		margin: 0;
		color: var(--ink-soft);
	}

	.coords {
		margin-top: 1.15rem;
		font-variant-numeric: tabular-nums;
		color: var(--ink-soft);
	}

	.coords span {
		display: block;
		margin-bottom: 0.15rem;
		font-size: 0.78rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 600;
		color: var(--olive);
	}

	.apps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
	}

	.apps a {
		display: inline-flex;
		white-space: nowrap;
		padding: 0.55rem 0.95rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		color: var(--sea);
		font-weight: 600;
		text-decoration: none;
		transition:
			border-color 0.3s var(--ease),
			color 0.3s var(--ease),
			background 0.3s var(--ease);
	}

	.apps a:hover {
		border-color: var(--sea);
		background: color-mix(in srgb, var(--sea) 6%, transparent);
	}
</style>
