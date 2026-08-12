<script lang="ts">
	import { site } from '$lib/data/content';
</script>

<main class="stub">
	<div class="inner">
		<p class="eyebrow">Experimental</p>
		<h1>Design alternativo</h1>
		<p class="lead">In preparazione — torneremo qui con un look radicalmente diverso.</p>
		<p class="muted">{site.name}</p>
	</div>
</main>

<style>
	.stub {
		min-height: 100dvh;
		display: grid;
		place-items: center;
		padding: 1.5rem;
	}

	.inner {
		width: min(28rem, 100%);
	}

	h1 {
		margin: 0 0 0.75rem;
		font-size: clamp(1.75rem, 5vw, 2.5rem);
	}

	.lead {
		margin: 0 0 1rem;
		color: var(--ink-soft);
	}

	.muted {
		margin: 0;
		color: var(--muted);
		font-size: 0.95rem;
	}
</style>
