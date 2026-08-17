<script lang="ts">
	import { onMount } from 'svelte';

	let {
		children,
		delay = 0,
		as = 'div'
	}: {
		children: import('svelte').Snippet;
		delay?: number;
		as?: 'div' | 'li';
	} = $props();

	let visible = $state(false);
	let el: HTMLElement | undefined = $state();

	onMount(() => {
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
		);
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<svelte:element
	this={as}
	bind:this={el}
	class="reveal"
	class:visible
	style={`--delay: ${delay}ms`}
>
	{@render children()}
</svelte:element>

<style>
	.reveal {
		opacity: 0;
		transform: translateY(1.35rem);
		transition:
			opacity 0.9s var(--ease),
			transform 0.9s var(--ease);
		transition-delay: var(--delay);
	}

	.reveal.visible {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
