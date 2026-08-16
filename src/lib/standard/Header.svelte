<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { housesSource, site } from '$lib/data/content';
	import { counterpartHref, pick, standardHref, ui, withBase, type Locale } from '$lib/i18n';

	let open = $state(false);

	const locale = $derived((page.data.locale ?? 'it') as Locale);

	// The enquiry page is reached through the CTA only — no duplicate plain link.
	const links = $derived([
		{ subpath: '', label: pick(ui.navHome, locale), hash: '' },
		{ subpath: '', label: pick(ui.navHouses, locale), hash: '#alloggi' },
		{ subpath: 'imperdibili', label: pick(ui.navImperdibili, locale), hash: '' }
	]);

	function hrefFor(subpath: string, hash = '') {
		return `${withBase(standardHref(locale, subpath), base)}${hash}`;
	}

	function isActive(subpath: string, hash = '') {
		const path = page.url.pathname.replace(new RegExp(`^${base}`), '').replace(/\/$/, '') || '/';
		const target = standardHref(locale, subpath).replace(/\/$/, '') || '/';
		if (hash === '#alloggi') return false;
		if (!subpath) return path === target;
		return path === target || path.startsWith(`${target}/`);
	}

	function close() {
		open = false;
	}

	function langHref(target: Locale) {
		return withBase(counterpartHref(page.url.pathname, target, base), base);
	}
</script>

<header class="header">
	<div class="container bar">
		<a class="brand" href={hrefFor('')} onclick={close}>
			<span class="brand-name">{site.name}</span>
			<span class="brand-tag">{site.tagline}</span>
		</a>

		<button
			class="menu-btn"
			type="button"
			aria-expanded={open}
			aria-controls="site-nav"
			onclick={() => (open = !open)}
		>
			<span class="sr-only">Menu</span>
			<span class="burger" class:open></span>
		</button>

		<nav id="site-nav" class="nav" class:open aria-label={pick(ui.mainNav, locale)}>
			{#each links as link}
				<a href={hrefFor(link.subpath, link.hash)} class:active={isActive(link.subpath, link.hash)} onclick={close}>
					{link.label}
				</a>
			{/each}
			<div class="nav-houses">
				<p>{pick(ui.housesGroup, locale)}</p>
				{#each housesSource as house}
					<a href={hrefFor(`case/${house.slug}`)} onclick={close}>{house.name}</a>
				{/each}
			</div>
			<a
				class="nav-cta"
				href={hrefFor('contatti')}
				class:active={isActive('contatti')}
				onclick={close}>{pick(ui.requestAvailability, locale)}</a
			>

			<div class="langs" aria-label={pick(ui.language, locale)}>
				<a
					href={langHref('it')}
					hreflang="it"
					class:active={locale === 'it'}
					onclick={close}
					aria-current={locale === 'it' ? 'true' : undefined}>IT</a
				>
				<span aria-hidden="true">·</span>
				<a
					href={langHref('en')}
					hreflang="en"
					class:active={locale === 'en'}
					onclick={close}
					aria-current={locale === 'en' ? 'true' : undefined}>EN</a
				>
			</div>
		</nav>
	</div>
</header>

{#if open}
	<button
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
		backdrop-filter: blur(14px);
		background: color-mix(in srgb, var(--paper) 86%, transparent);
		border-bottom: 1px solid var(--line);
	}

	.bar {
		min-height: var(--header-h);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		/* Clear fixed HubBack in the top-left corner */
		padding-left: 1.85rem;
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
		color: #fff !important;
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
