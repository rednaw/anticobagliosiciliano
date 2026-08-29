<script lang="ts">
  import { page } from '$app/state';
  import { privacyCopy, site } from '$lib/data/content';
  import { pick, ui } from '$lib/standard/i18n';

  const locale = $derived(page.data.locale);
  const heading = $derived(pick(ui.privacy, locale));
  const t = $derived((key: keyof typeof privacyCopy) => pick(privacyCopy[key], locale));

</script>

<section class="section">
  <div class="container">
    <header class="intro">
      <h1>{heading}</h1>
      <p class="lead">{t('lead')}</p>
    </header>

    <section class="block">
      <h2>{t('controllerTitle')}</h2>
      <p>
        {t('controller')}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </section>

    <section class="block">
      <h2>{t('groupContact')}</h2>
      <p>{t('contact')}</p>
    </section>

    <section class="block">
      <h2>{t('groupBrowse')}</h2>

      <article class="item">
        <h3>{t('cookiesTitle')}</h3>
        <p>{t('cookies')}</p>
      </article>

      <article class="item">
        <h3>{t('analyticsTitle')}</h3>
        <p>
          {t('analytics')}<a href="https://www.simpleanalytics.com/data-collection">{t('analyticsPolicy')}</a>.
        </p>
      </article>

      <article class="item">
        <h3>{t('hostingTitle')}</h3>
        <p>
          {t('hosting')}<a
            href="https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection"
            >{t('hostingPolicy')}</a
          >.
        </p>
      </article>

      <article class="item">
        <h3>{t('mapsTitle')}</h3>
        <p>
          {t('maps')}<a
            href="https://osmfoundation.org/wiki/Privacy_Policy#Personal_data_we_receive_automatically"
            >{t('mapsPolicy')}</a
          >.
        </p>
      </article>
    </section>

    <section class="block">
      <h2>{t('rightsTitle')}</h2>
      <p>{t('rights')}</p>
    </section>
  </div>
</section>

<style>
  .container {
    max-width: 40rem;
  }

  .intro {
    margin-bottom: 0.5rem;
  }

  h1 {
    margin: 0 0 0.85rem;
    font-size: clamp(2.4rem, 6vw, 3.8rem);
  }

  .lead {
    margin: 0 0 1.75rem;
    font-size: 1.15rem;
    line-height: 1.55;
    color: var(--ink-soft);
  }

  .block {
    padding-top: 2.25rem;
    margin-top: 2.25rem;
    border-top: 1px solid var(--line);
  }

  .block:first-of-type {
    margin-top: 2rem;
  }

  .block > h2 {
    margin: 0 0 1.1rem;
    font-size: clamp(1.35rem, 3vw, 1.65rem);
    font-family: var(--font-display);
    font-weight: 500;
    letter-spacing: -0.02em;
  }

  .item {
    margin-top: 1.35rem;
  }

  .item:first-of-type {
    margin-top: 0;
  }

  .item h3 {
    margin: 0 0 0.45rem;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--olive);
  }

  .block > p,
  .item p {
    margin: 0;
    color: var(--ink-soft);
    line-height: 1.65;
  }

  a {
    color: var(--sea);
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--sea) 25%, transparent);
  }

  a:hover {
    border-bottom-color: var(--sea);
  }
</style>
