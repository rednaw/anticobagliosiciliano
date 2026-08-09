<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { site } from '$lib/data/content';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content={site.description} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={site.name} />
	<meta property="og:description" content={site.description} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<a class="skip" href="#contenuto">Vai al contenuto</a>
<Header />
<main id="contenuto">
	{@render children()}
</main>
<Footer />

<style>
	.skip {
		position: absolute;
		left: -999px;
		top: 0.5rem;
		z-index: 100;
		background: var(--sea);
		color: #fff;
		padding: 0.5rem 0.85rem;
		text-decoration: none;
	}

	.skip:focus {
		left: 0.5rem;
	}

	main {
		min-height: 60vh;
	}
</style>
