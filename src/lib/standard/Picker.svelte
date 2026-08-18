<script lang="ts">
	import { tick } from 'svelte';

	type Option = { value: string; label: string };

	let {
		value = $bindable(''),
		label,
		options,
		id
	}: {
		value: string;
		label: string;
		options: Option[];
		id: string;
	} = $props();

	let open = $state(false);
	let rootEl = $state<HTMLDivElement | null>(null);
	let triggerEl = $state<HTMLInputElement | null>(null);

	const shown = $derived(options.find((option) => option.value === value)?.label ?? '');
	const listId = $derived(`${id}-list`);

	$effect(() => {
		if (!open) return;
		function onPointer(event: PointerEvent) {
			if (!rootEl?.contains(event.target as Node)) open = false;
		}
		function onKey(event: KeyboardEvent) {
			if (event.key !== 'Escape') return;
			event.preventDefault();
			close();
		}
		document.addEventListener('pointerdown', onPointer);
		window.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', onPointer);
			window.removeEventListener('keydown', onKey);
		};
	});

	async function toggle() {
		if (open) {
			close();
			return;
		}
		open = true;
		await tick();
		rootEl?.querySelector<HTMLElement>('.option.selected')?.scrollIntoView({ block: 'nearest' });
	}

	function close() {
		open = false;
		triggerEl?.focus();
	}

	function select(option: Option) {
		value = option.value;
		close();
	}

	function onTriggerKey(event: KeyboardEvent) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		toggle();
	}

	function onFocusOut(event: FocusEvent) {
		const next = event.relatedTarget;
		if (next instanceof Node && rootEl?.contains(next)) return;
		queueMicrotask(() => {
			if (!rootEl?.contains(document.activeElement)) open = false;
		});
	}
</script>

<div class="picker" bind:this={rootEl} onfocusout={onFocusOut}>
	<label class="field">
		<span id={`${id}-label`}>{label}</span>
		<input
			bind:this={triggerEl}
			class="trigger"
			class:active={open}
			type="text"
			readonly
			inputmode="none"
			autocomplete="off"
			role="combobox"
			value={shown}
			aria-haspopup="dialog"
			aria-expanded={open}
			aria-controls={open ? listId : undefined}
			aria-labelledby={`${id}-label`}
			onclick={toggle}
			onkeydown={onTriggerKey}
		/>
	</label>

	{#if open}
		<div class="menu" id={listId} role="dialog" aria-label={label}>
			{#each options as option}
				<button
					type="button"
					class="option"
					class:selected={option.value === value}
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

	.field {
		display: grid;
		gap: 0.4rem;
	}

	.field > span {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink-soft);
	}

	.trigger {
		width: 100%;
		padding: 0.8rem 0.9rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper);
		color: var(--ink);
		font: inherit;
		text-align: left;
		cursor: pointer;
		appearance: none;
		caret-color: transparent;
	}

	.trigger:focus,
	.trigger.active,
	.trigger:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--sea) 45%, transparent);
		outline-offset: 1px;
		background: #fff;
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
