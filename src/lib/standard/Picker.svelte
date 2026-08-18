<script lang="ts">
	import { tick } from 'svelte';
	import { dismissable } from '$lib/standard/dismiss';
	import FieldTrigger from '$lib/standard/FieldTrigger.svelte';

	type Option = { value: string; label: string };

	let {
		value = $bindable(''),
		label,
		options
	}: {
		value: string;
		label: string;
		options: Option[];
	} = $props();

	const listId = $props.id();

	let open = $state(false);
	let rootEl = $state<HTMLDivElement | null>(null);
	let triggerEl = $state<HTMLInputElement | null>(null);

	const shown = $derived(options.find((option) => option.value === value)?.label ?? '');

	$effect(() => {
		if (!open || !rootEl) return;
		return dismissable(rootEl, close);
	});

	async function toggle() {
		if (open) {
			close(true);
			return;
		}
		open = true;
		await tick();
		rootEl?.querySelector<HTMLElement>('.option.selected')?.scrollIntoView({ block: 'nearest' });
	}

	function close(restoreFocus: boolean) {
		open = false;
		if (restoreFocus) triggerEl?.focus();
	}

	function select(option: Option) {
		value = option.value;
		close(true);
	}
</script>

<div class="picker" bind:this={rootEl}>
	<FieldTrigger
		bind:el={triggerEl}
		{label}
		{open}
		text={shown}
		controls={listId}
		onactivate={toggle}
	/>

	{#if open}
		<div class="menu" id={listId} role="dialog" aria-label={label}>
			{#each options as option}
				<button
					type="button"
					class="option"
					class:selected={option.value === value}
					onpointerdown={(event) => event.preventDefault()}
					onclick={() => select(option)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.picker {
		position: relative;
		display: grid;
	}

	.menu {
		position: absolute;
		z-index: 20;
		top: calc(100% + 0.45rem);
		left: 0;
		right: 0;
		max-height: 16rem;
		overflow: auto;
		overscroll-behavior: contain;
		padding: 0.35rem;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}

	.option {
		display: block;
		width: 100%;
		padding: 0.65rem 0.8rem;
		border: 0;
		border-radius: var(--radius);
		background: transparent;
		color: var(--ink);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.option:hover {
		background: color-mix(in srgb, var(--sea) 8%, var(--paper));
	}

	.option.selected,
	.option.selected:hover {
		background: var(--sea);
		color: #fff;
	}
</style>
