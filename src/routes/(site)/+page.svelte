<script lang="ts">
	import { page } from '$app/state';
	import { imageAsset } from '$lib/public-image';
	import AmbientVideo from '$lib/standard/AmbientVideo.svelte';
	import Reveal from '$lib/standard/Reveal.svelte';
	import SectionHead from '$lib/standard/SectionHead.svelte';
	import {
		amenities,
		awards,
		homeCopy,
		houses,
		places,
		site,
		testimonials
	} from '$lib/data/content';
	import { localize, pick, siteHref, ui } from '$lib/standard/i18n';

	const locale = $derived(page.data.locale);
	const houseList = $derived(houses(locale));
	const placeList = $derived(places(locale));
	const amenityList = $derived(amenities(locale));
	const awardList = $derived(awards(locale));
	const quoteList = $derived(testimonials(locale));
	const contatti = $derived(siteHref(locale, 'contatti'));
	const imperdibili = $derived(siteHref(locale, 'imperdibili'));
	const home = $derived(localize(homeCopy, locale));
</script>

<section class="hero">
	<img
		class="hero-backdrop"
		src={imageAsset('/images/ambiance/hero-portone-wide.jpg')}
		alt=""
		aria-hidden="true"
		fetchpriority="high"
	/>
	<picture>
		<source media="(min-aspect-ratio: 7 / 10)" srcset={imageAsset('/images/ambiance/hero-portone-wide.jpg')} />
		<img
			class="hero-media"
			src={imageAsset('/images/ambiance/hero-portone-tall.jpg')}
			srcset="{imageAsset('/images/ambiance/hero-portone-tall-sm.jpg')} 763w, {imageAsset(
				'/images/ambiance/hero-portone-tall.jpg'
			)} 1248w"
			sizes="100vw"
			alt={home.alt.hero}
		/>
	</picture>
	<div class="hero-veil"></div>
	<div class="hero-copy">
		<h1>{site.name}</h1>
		<p class="hero-lead">{pick(site.description, locale)}</p>
		<div class="hero-actions">
			<a class="btn btn-light" href={contatti}>{pick(ui.requestAvailability, locale)}</a>
			<a class="btn btn-ghost" href="#houses">{pick(ui.discoverHouses, locale)}</a>
		</div>
	</div>
</section>

<section class="section about band-dark">
	<div class="container about-grid">
		<Reveal>
			<div>
				<h2>{home.chiSiamo.title}</h2>
				<p>{home.chiSiamo.body}</p>
			</div>
		</Reveal>
		<Reveal delay={120}>
			<AmbientVideo
				src="/videos/baglio-720.mp4"
				poster="/videos/baglio-poster.jpg"
				posterSrcset="{imageAsset('/videos/baglio-poster-sm.jpg')} 744w, {imageAsset(
					'/videos/baglio-poster.jpg'
				)} 1004w"
				posterSizes="(min-width: 960px) 58vw, calc(100vw - 2.5rem)"
				label={home.alt.video}
			/>
		</Reveal>
	</div>
</section>

<section id="houses" class="section">
	<div class="container">
		<Reveal>
			<SectionHead
				eyebrow={pick(ui.ourHouses, locale)}
				title={home.houses.title}
				lead={home.houses.lead}
			/>
		</Reveal>

		<div class="house-list">
			{#each houseList as house, i}
				<Reveal delay={i * 80}>
					<a class="house" href={siteHref(locale, `case/${house.slug}`)}>
						<img src={imageAsset(house.image)} alt={house.name} loading="lazy" />
						<div class="house-body">
							<div class="house-meta">
								<span>{house.guests}</span>
								<span>{house.size}</span>
							</div>
							<h3>{house.name}</h3>
							<p>{house.summary}</p>
							<span class="more">{home.houses.more}</span>
						</div>
					</a>
				</Reveal>
			{/each}
		</div>
	</div>
</section>

<section class="feature">
	<img src={imageAsset('/images/ambiance/cortile.jpg')} alt={home.alt.cortile} loading="lazy" />
	<div class="feature-panel">
		<Reveal>
			<p class="eyebrow">{home.cortile.eyebrow}</p>
			<h2>{home.cortile.title}</h2>
			<p class="lead">{home.cortile.lead}</p>
			<p>{home.cortile.body}</p>
		</Reveal>
	</div>
</section>

<section class="section garden">
	<div class="container garden-grid">
		<Reveal>
			<p class="eyebrow">{home.giardino.eyebrow}</p>
			<h2>{home.giardino.title}</h2>
			<p>{home.giardino.p1}</p>
			<p>{home.giardino.p2}</p>
			<p>{home.giardino.p3}</p>
		</Reveal>
		<Reveal delay={100}>
			<div class="garden-photos">
				<img src={imageAsset('/images/ambiance/giardino.jpg')} alt={home.alt.giardino} loading="lazy" />
				<img src={imageAsset('/images/ambiance/agrumeto.jpg')} alt={home.alt.agrumeto} loading="lazy" />
			</div>
		</Reveal>
	</div>
</section>

<section class="section band-dark">
	<div class="container">
		<Reveal>
			<SectionHead eyebrow={home.comfort.eyebrow} title={home.comfort.title} />
		</Reveal>
		<ul class="amenity-list">
			{#each amenityList as item, i}
				<Reveal as="li" delay={i * 40}>
					<strong>{item.title}</strong>
					<span>{item.detail}</span>
				</Reveal>
			{/each}
		</ul>
	</div>
</section>

<section class="section">
	<div class="container">
		<Reveal>
			<SectionHead eyebrow={pick(ui.awards, locale)} title={home.awards.title} />
		</Reveal>
		<div class="award-grid">
			{#each awardList as award, i}
				<Reveal delay={i * 70}>
					<figure>
						<img src={imageAsset(award.image)} alt={award.title} loading="lazy" />
						<figcaption>
							<strong>{award.title}</strong>
							<span>{award.text}</span>
						</figcaption>
					</figure>
				</Reveal>
			{/each}
		</div>
	</div>
</section>

<section class="section band-dark">
	<div class="container">
		<Reveal>
			<SectionHead eyebrow={home.quotes.eyebrow} title={home.quotes.title} />
		</Reveal>
		<div class="quote-grid">
			{#each quoteList as t, i}
				<Reveal delay={i * 90}>
					<blockquote>
						<p>“{t.quote}”</p>
						<footer>
							<strong>{t.name}</strong>
							<span>{t.source}</span>
						</footer>
					</blockquote>
				</Reveal>
			{/each}
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<Reveal>
			<SectionHead
				eyebrow={pick(ui.navImperdibili, locale)}
				title={home.places.title}
				lead={home.places.lead}
			/>
		</Reveal>
		<div class="place-grid">
			{#each placeList as place, i}
				<Reveal delay={i * 50}>
					<a class="place" href="{imperdibili}#{place.slug}">
						<img src={imageAsset(place.image)} alt={place.name} loading="lazy" />
						<div>
							<span>{place.time}</span>
							<h3>{place.name}</h3>
						</div>
					</a>
				</Reveal>
			{/each}
		</div>
	</div>
</section>

<section class="cta">
	<div class="container cta-inner">
		<Reveal>
			<h2>{home.cta.title}</h2>
			<p>{home.cta.body}</p>
			<a class="btn btn-light" href={contatti}>{pick(ui.requestAvailability, locale)}</a>
		</Reveal>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: min(92vh, 54rem);
		display: grid;
		align-items: end;
		overflow: hidden;
		color: #fff;
		background: var(--sea-deep);
	}

	/* Fills the frame at any aspect ratio; the sharp image sits on top of it.
	   Stays scaled up so the blurred edges never reach the hero border. */
	.hero-backdrop {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		filter: blur(2.5rem) brightness(0.82) saturate(1.1);
		animation: backdrop-zoom 8s var(--ease) both;
	}

	@keyframes backdrop-zoom {
		from {
			transform: scale(1.24);
		}
		to {
			transform: scale(1.14);
		}
	}

	/* `contain` keeps the whole portone — sky above, road below — visible on wide screens. */
	.hero-media {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center;
		animation: soft-fade 1.2s var(--ease) both;
	}

	/* Taller than the photo: fill the frame, the portone stays centred. */
	@media (max-aspect-ratio: 7 / 10) {
		.hero-media {
			object-fit: cover;
		}
	}

	.hero-veil {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, color-mix(in srgb, var(--sea-deep) 42%, transparent) 0%, transparent 38%),
			linear-gradient(
				0deg,
				color-mix(in srgb, var(--sea-deep) 92%, transparent) 0%,
				color-mix(in srgb, var(--sea-deep) 55%, transparent) 38%,
				transparent 68%
			);
	}

	.hero-copy {
		position: relative;
		z-index: 1;
		width: min(1120px, calc(100% - 2.5rem));
		margin: 0 auto;
		padding: clamp(5rem, 12vh, 8rem) 0 clamp(3rem, 7vh, 4.5rem);
		animation: fade-up 1s var(--ease) both;
		text-shadow: 0 2px 24px color-mix(in srgb, var(--sea-deep) 45%, transparent);
	}

	.hero h1 {
		margin: 0 0 0.85rem;
		font-size: clamp(2.8rem, 8vw, 5.4rem);
		max-width: 12ch;
		text-wrap: balance;
	}

	.hero-lead {
		margin: 0 0 1.75rem;
		max-width: 28rem;
		font-size: clamp(1.05rem, 2.2vw, 1.25rem);
		opacity: 0.95;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.about-grid {
		display: grid;
		gap: 2rem;
		align-items: center;
	}

	.about h2 {
		margin: 0 0 1rem;
		font-size: clamp(2rem, 4vw, 3.1rem);
	}

	.about p {
		margin: 0;
		font-size: 1.15rem;
		color: color-mix(in srgb, #fff 80%, transparent);
		max-width: 36rem;
	}

	.house-list {
		display: grid;
		gap: 1.5rem;
	}

	.house {
		display: grid;
		text-decoration: none;
		background: #fff;
		border: 1px solid var(--line);
		overflow: hidden;
		transition:
			transform 0.45s var(--ease),
			box-shadow 0.45s var(--ease);
	}

	.house:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow);
	}

	.house img {
		width: 100%;
		aspect-ratio: 16 / 11;
		object-fit: cover;
	}

	.house-body {
		padding: 1.35rem 1.35rem 1.5rem;
	}

	.house-meta {
		display: flex;
		gap: 1rem;
		margin-bottom: 0.55rem;
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--olive);
		font-weight: 600;
	}

	.house h3 {
		margin: 0 0 0.45rem;
		font-size: 1.65rem;
	}

	.house p {
		margin: 0 0 1rem;
		color: var(--ink-soft);
	}

	.more {
		font-weight: 600;
		color: var(--sea);
	}

	.feature {
		display: grid;
		background: var(--sea-deep);
		color: #fff;
	}

	.feature img {
		width: 100%;
		min-height: 18rem;
		height: 100%;
		object-fit: cover;
	}

	.feature-panel {
		padding: clamp(2.5rem, 6vw, 4.5rem);
		display: grid;
		align-content: center;
	}

	.feature .eyebrow {
		color: color-mix(in srgb, var(--sun) 85%, #fff);
	}

	.feature h2 {
		margin: 0 0 0.75rem;
		font-size: clamp(2rem, 4vw, 3rem);
	}

	.feature .lead {
		font-size: 1.15rem;
		opacity: 0.95;
	}

	.feature p {
		max-width: 34rem;
		color: color-mix(in srgb, #fff 88%, transparent);
	}

	.garden-grid {
		display: grid;
		gap: 2rem;
		align-items: center;
	}

	.garden-photos {
		display: grid;
		gap: 0.85rem;
	}

	.garden-photos img {
		width: 100%;
		object-fit: cover;
	}

	.garden-photos img:first-child {
		aspect-ratio: 4 / 3;
	}

	.garden-photos img:last-child {
		aspect-ratio: 3 / 2;
	}

	.garden h2 {
		margin: 0 0 1rem;
		font-size: clamp(2rem, 4vw, 2.8rem);
	}

	.garden p {
		color: var(--ink-soft);
	}

	.amenity-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0;
		border-top: 1px solid var(--line);
	}

	.amenity-list :global(li) {
		display: grid;
		gap: 0.25rem;
		padding: 1.15rem 0;
		border-bottom: 1px solid var(--line);
	}

	.amenity-list strong {
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 500;
	}

	.amenity-list span {
		color: var(--muted);
	}

	.band-dark {
		background: color-mix(in srgb, var(--sea-deep) 92%, black);
		color: #fff;
	}

	.band-dark :global(.eyebrow) {
		color: color-mix(in srgb, var(--sun) 85%, #fff);
	}

	.band-dark :global(.section-head p) {
		color: color-mix(in srgb, #fff 78%, transparent);
	}

	.band-dark .amenity-list {
		border-top-color: color-mix(in srgb, #fff 18%, transparent);
	}

	.band-dark .amenity-list :global(li) {
		border-bottom-color: color-mix(in srgb, #fff 18%, transparent);
	}

	.band-dark .amenity-list span {
		color: color-mix(in srgb, #fff 68%, transparent);
	}

	.band-dark blockquote {
		background: color-mix(in srgb, #fff 8%, transparent);
		border-left-color: var(--sun);
	}

	.band-dark blockquote strong {
		color: #fff;
	}

	.band-dark blockquote footer {
		color: color-mix(in srgb, #fff 68%, transparent);
	}

	.award-grid {
		display: grid;
		gap: 1.5rem;
	}

	.award-grid figure {
		margin: 0;
		display: grid;
		gap: 1rem;
	}

	.award-grid img {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: contain;
		background: #fff;
		border: 1px solid var(--line);
		padding: 1rem;
	}

	.award-grid figcaption {
		display: grid;
		gap: 0.35rem;
	}

	.award-grid strong {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 500;
	}

	.award-grid span {
		color: var(--ink-soft);
	}

	.quote-grid {
		display: grid;
		gap: 1.25rem;
	}

	blockquote {
		margin: 0;
		padding: 1.75rem;
		background: #fff;
		border-left: 3px solid var(--olive);
	}

	blockquote p {
		font-family: var(--font-display);
		font-size: 1.25rem;
		line-height: 1.45;
		margin-bottom: 1.25rem;
	}

	blockquote footer {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		color: var(--muted);
		font-size: 0.95rem;
	}

	blockquote strong {
		color: var(--ink);
	}

	.place-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.place-grid .place {
		position: relative;
		display: block;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		color: #fff;
		text-decoration: none;
	}

	.place-grid img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
		transition: transform 1.1s var(--ease);
	}

	.place-grid .place:hover img {
		transform: scale(1.05);
	}

	.place-grid div {
		position: absolute;
		inset: 0;
		z-index: 1;
		display: grid;
		align-content: end;
		padding: 1.25rem;
		background: linear-gradient(0deg, color-mix(in srgb, var(--sea-deep) 75%, transparent), transparent 70%);
	}

	.place-grid span {
		font-size: 0.78rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 600;
	}

	.place-grid h3 {
		margin: 0.25rem 0 0;
		font-size: clamp(1.05rem, 2.5vw, 1.45rem);
	}

	.cta {
		padding: clamp(4rem, 8vw, 6rem) 0;
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--sea) 92%, #000), var(--olive)),
			var(--sea);
		color: #fff;
	}

	.cta-inner {
		max-width: 40rem;
	}

	.cta h2 {
		margin: 0 0 0.75rem;
		font-size: clamp(2rem, 4vw, 3rem);
	}

	.cta p {
		margin: 0 0 1.5rem;
		opacity: 0.92;
		font-size: 1.1rem;
	}

	@media (min-width: 720px) {
		.house-list {
			grid-template-columns: 1fr 1fr;
		}

		.amenity-list {
			grid-template-columns: 1fr 1fr;
			gap: 0 2rem;
		}

		.award-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.quote-grid {
			grid-template-columns: 1fr 1fr;
		}

		.place-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 960px) {
		.about-grid {
			grid-template-columns: 0.85fr 1.15fr;
			gap: 3.5rem;
		}

		.feature {
			grid-template-columns: 1.1fr 0.9fr;
			min-height: 32rem;
		}

		.garden-grid {
			grid-template-columns: 0.95fr 1.05fr;
			gap: 3.5rem;
		}
	}
</style>
