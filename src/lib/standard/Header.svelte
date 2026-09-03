<script lang="ts">
  import { page } from '$app/state';
  import { building } from '$app/environment';
  import { housesSource, site } from '$lib/data/content';
  import {
    contactHref,
    counterpartHref,
    houseSlugFromPath,
    navLinkActive,
    pick,
    siteHref,
    stripBase,
    ui,
    withBase,
    type Locale
  } from '$lib/standard/i18n';
  import {
    DEFAULT_SITE_THEME,
    SITE_THEMES,
    applySiteTheme,
    initSiteTheme,
    isSiteTheme,
    type SiteTheme
  } from '$lib/standard/theme';

  let open = $state(false);
  let menuBtn: HTMLButtonElement | undefined = $state();
  let navEl: HTMLElement | undefined = $state();
  let backdropEl: HTMLButtonElement | undefined = $state();
  let currentTheme = $state<SiteTheme>(DEFAULT_SITE_THEME);

  const locale = $derived(page.data.locale);

  $effect(() => {
    currentTheme = initSiteTheme();
  });

  function onThemePick(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value;
    if (!isSiteTheme(value)) return;
    currentTheme = applySiteTheme(value);
  }

  const links = $derived([
    { subpath: '', label: pick(ui.navHome, locale), hash: '' },
    { subpath: '', label: pick(ui.navHouses, locale), hash: '#houses' },
    { subpath: 'imperdibili', label: pick(ui.navImperdibili, locale), hash: '' },
    { subpath: 'come-arrivare', label: pick(ui.navArrive, locale), hash: '' }
  ]);

  const contactLink = $derived(contactHref(locale, houseSlugFromPath(page.url.pathname)));

  function hrefFor(subpath: string, hash = '') {
    return `${siteHref(locale, subpath)}${hash}`;
  }

  function isActive(subpath: string, hash = '') {
    return navLinkActive(page.url.pathname, locale, subpath, hash);
  }

  function isDrawer() {
    return window.matchMedia('(max-width: 959px)').matches;
  }

  function close() {
    if (!open) return;
    open = false;
    queueMicrotask(() => menuBtn?.focus());
  }

  function toggle() {
    open = !open;
    if (open) {
      queueMicrotask(() => {
        navEl?.querySelector<HTMLElement>('a, button')?.focus();
      });
    }
  }

  function trapFocus(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab' || !isDrawer()) return;

    const nodes = [menuBtn, ...(navEl ? [...navEl.querySelectorAll<HTMLElement>('a, button')] : []), backdropEl].filter(
      (el): el is HTMLElement => !!el
    );
    if (nodes.length === 0) return;

    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const current = document.activeElement as HTMLElement | null;

    if (e.shiftKey && current === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && current === last) {
      e.preventDefault();
      first.focus();
    }
  }

  $effect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      trapFocus(e);
    }
    function onResize() {
      if (!isDrawer()) open = false;
    }

    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    const prevOverflow = document.body.style.overflow;
    if (isDrawer()) document.body.style.overflow = 'hidden';

    const inertEls = [
      document.querySelector('.skip'),
      document.getElementById('contenuto'),
      document.querySelector('.footer')
    ].filter((el): el is HTMLElement => !!el);
    if (isDrawer()) inertEls.forEach((el) => el.setAttribute('inert', ''));

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = prevOverflow;
      inertEls.forEach((el) => el.removeAttribute('inert'));
    };
  });

  function langHref(target: Locale) {
    const path = stripBase(page.url.pathname).replace(/\/+$/, '') || '/';
    if (path.endsWith('404.html')) return siteHref(target);
    const search = building ? '' : page.url.search;
    return `${withBase(counterpartHref(page.url.pathname, target))}${search}`;
  }
</script>

<header class="header">
  <div class="container bar">
    <a class="brand" href={hrefFor('')} onclick={close}>
      <span class="brand-name">{site.name}</span>
      <span class="brand-tag">{site.tagline}</span>
    </a>

    <button
      bind:this={menuBtn}
      class="menu-btn"
      type="button"
      aria-expanded={open}
      aria-controls="site-nav"
      onclick={toggle}
    >
      <span class="sr-only">{pick(open ? ui.closeMenu : ui.menu, locale)}</span>
      <span class="burger" class:open></span>
    </button>

    <nav bind:this={navEl} id="site-nav" class="nav" class:open aria-label={pick(ui.mainNav, locale)}>
      {#each links as link}
        <a
          href={hrefFor(link.subpath, link.hash)}
          class:active={isActive(link.subpath, link.hash)}
          aria-current={isActive(link.subpath, link.hash) ? 'page' : undefined}
          onclick={close}
        >
          {link.label}
        </a>
      {/each}
      <div class="nav-houses">
        <p>{pick(ui.housesGroup, locale)}</p>
        <ul>
          {#each housesSource as house}
            <li>
              <a
                href={hrefFor(`case/${house.slug}`)}
                aria-current={isActive(`case/${house.slug}`) ? 'page' : undefined}
                onclick={close}>{house.name}</a
              >
            </li>
          {/each}
        </ul>
      </div>
      <a
        class="nav-cta"
        href={contactLink}
        class:active={isActive('contatti')}
        aria-current={isActive('contatti') ? 'page' : undefined}
        onclick={close}>{pick(ui.requestAvailability, locale)}</a
      >

      <div class="langs" role="group" aria-label={pick(ui.language, locale)}>
        <a
          href={langHref('it')}
          hreflang="it"
          lang="it"
          class:active={locale === 'it'}
          onclick={close}
          aria-current={locale === 'it' ? 'page' : undefined}>IT</a
        >
        <span aria-hidden="true">·</span>
        <a
          href={langHref('en')}
          hreflang="en"
          lang="en"
          class:active={locale === 'en'}
          onclick={close}
          aria-current={locale === 'en' ? 'page' : undefined}>EN</a
        >
      </div>
    </nav>
  </div>
  <select class="theme-pick" aria-label="Site theme" value={currentTheme} onchange={onThemePick}>
    {#each SITE_THEMES as theme}
      <option value={theme}>{theme}</option>
    {/each}
  </select>
</header>

{#if open}
  <button
    bind:this={backdropEl}
    class="backdrop"
    type="button"
    aria-label={pick(ui.closeMenu, locale)}
    onclick={close}
  ></button>
{/if}

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 40;
    /* Solid fallback: Safari drops `color-mix`+`backdrop-filter` without the -webkit prefix. */
    background: var(--paper);
    background: color-mix(in srgb, var(--paper) 86%, transparent);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--line);
  }

  /* Temporary probe control — invisible until hovered/focused. */
  .theme-pick {
    position: absolute;
    top: 0.35rem;
    right: 0.35rem;
    z-index: 2;
    font: inherit;
    font-size: 0.75rem;
    opacity: 0;
  }

  .theme-pick:hover,
  .theme-pick:focus {
    opacity: 1;
  }

  .bar {
    min-height: var(--header-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .brand {
    display: grid;
    text-decoration: none;
    line-height: 1.15;
  }

  .brand-name {
    font-family: var(--font-display);
    font-size: 1.2rem;
    font-weight: 500;
    letter-spacing: -0.02em;
  }

  .brand-tag {
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .menu-btn {
    width: 2.75rem;
    height: 2.75rem;
    border: 1px solid var(--line);
    background: transparent;
    border-radius: var(--radius);
    display: grid;
    place-items: center;
    cursor: pointer;
  }

  .burger,
  .burger::before,
  .burger::after {
    width: 1.15rem;
    height: 1.5px;
    background: var(--ink);
    display: block;
    position: relative;
    transition: transform 0.3s var(--ease);
  }

  .burger::before,
  .burger::after {
    content: '';
    position: absolute;
    left: 0;
  }

  .burger::before {
    top: -6px;
  }

  .burger::after {
    top: 6px;
  }

  .burger.open {
    background: transparent;
  }

  .burger.open::before {
    top: 0;
    transform: rotate(45deg);
  }

  .burger.open::after {
    top: 0;
    transform: rotate(-45deg);
  }

  .nav {
    display: none;
  }

  .nav.open {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    /* backdrop-filter on .header makes it the fixed containing block */
    position: fixed;
    top: 100%;
    right: 0;
    width: min(20rem, 100%);
    height: calc(100dvh - var(--header-h));
    padding: 1.25rem;
    background: var(--paper);
    border-left: 1px solid var(--line);
    box-shadow: var(--shadow);
    overflow: auto;
    z-index: 50;
  }

  .nav a {
    text-decoration: none;
    padding: 0.65rem 0.4rem;
    font-weight: 500;
    color: var(--ink-soft);
  }

  .nav a.active,
  .nav a:hover {
    color: var(--sea);
  }

  .nav-houses {
    display: grid;
    gap: 0.15rem;
    padding: 0.75rem 0;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    margin: 0.5rem 0;
  }

  .nav-houses ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.15rem;
  }

  .nav-houses p {
    margin: 0;
    padding: 0.35rem 0.4rem;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .nav-cta {
    margin-top: 0.5rem;
    background: var(--sea);
    color: var(--on-sea) !important;
    text-align: center;
    border-radius: var(--radius);
  }

  .langs {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 1rem;
    padding: 0.5rem 0.4rem 0;
    border-top: 1px solid var(--line);
    font-size: 0.85rem;
    letter-spacing: 0.06em;
  }

  .langs a {
    padding: 0.25rem 0.15rem;
    font-weight: 700;
    color: var(--muted);
  }

  .langs a.active {
    color: var(--sea);
  }

  .langs span {
    color: var(--line);
  }

  .backdrop {
    position: fixed;
    inset: var(--header-h) 0 0 0;
    border: 0;
    background: color-mix(in srgb, var(--ink) 35%, transparent);
    z-index: 30;
  }

  @media (min-width: 960px) {
    .menu-btn,
    .backdrop,
    .nav-houses {
      display: none;
    }

    .nav {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      position: static;
      width: auto;
      padding: 0;
      background: transparent;
      border: 0;
      box-shadow: none;
      overflow: visible;
    }

    .nav a {
      padding: 0.45rem 0.7rem;
      font-size: 0.95rem;
    }

    .nav-cta {
      margin: 0 0 0 0.5rem;
      padding: 0.65rem 1rem !important;
    }

    .langs {
      margin: 0 0 0 0.75rem;
      padding: 0;
      border: 0;
    }
  }
</style>
