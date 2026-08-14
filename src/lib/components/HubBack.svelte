<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<a class="hub-back" href={resolve('/')} aria-label="Torna all’indice">←</a>

<style>
	.hub-back {
		position: fixed;
		top: 0.65rem;
		left: 0.75rem;
		z-index: 50;
		font-size: 0.85rem;
		line-height: 1;
		padding: 0.35rem 0.4rem;
		color: var(--muted);
		text-decoration: none;
		opacity: 0.7;
		transition: opacity 0.15s var(--ease), color 0.15s var(--ease);
	}

	.hub-back:hover,
	.hub-back:focus-visible {
		opacity: 1;
		color: var(--sea);
		outline: none;
	}
</style>
