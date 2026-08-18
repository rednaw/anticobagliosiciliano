<script lang="ts">
	import { page } from '$app/state';
	import { privacyCopy, site } from '$lib/data/content';
	import { pick, ui, type Locale } from '$lib/standard/i18n';

	const locale = $derived((page.data.locale ?? 'it') as Locale);
	const heading = $derived(pick(ui.privacy, locale));
	const t = $derived((key: keyof typeof privacyCopy) => pick(privacyCopy[key], locale));
</script>

<section class="section">
	<div class="container">
		<h1>{heading}</h1>
		<p class="lead">{t('lead')}</p>

		<h2>{t('controllerTitle')}</h2>
		<p>
			{t('controller')}
			<a href={`mailto:${site.email}`}>{site.email}</a>.
		</p>

		<h2>{t('contactTitle')}</h2>
		<p>{t('contact')}</p>

		<h2>{t('analyticsTitle')}</h2>
		<p>
			{t('analytics')}<a href="https://www.simpleanalytics.com/data-collection">{t('analyticsPolicy')}</a>.
		</p>

		<h2>{t('cookiesTitle')}</h2>
		<p>{t('cookies')}</p>

		<h2>{t('hostingTitle')}</h2>
		<p>
			{t('hosting')}<a href="https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection">{t('hostingPolicy')}</a>.
		</p>

		<h2>{t('rightsTitle')}</h2>
		<p>{t('rights')}</p>
	</div>
</section>

<style>
	.container {
		max-width: 40rem;
	}

	h1 {
		margin: 0 0 0.85rem;
		font-size: clamp(2.4rem, 6vw, 3.8rem);
	}

	.lead {
		margin: 0 0 2.5rem;
		font-size: 1.15rem;
		color: var(--ink-soft);
	}

	h2 {
		margin: 2rem 0 0.65rem;
		font-size: 1.15rem;
	}

	p {
		margin: 0;
		color: var(--ink-soft);
	}

	a {
		color: var(--sea);
		font-weight: 600;
		text-decoration: none;
	}
</style>
