<script lang="ts">
	let {
		el = $bindable(null),
		label,
		text,
		empty = false,
		open = false,
		invalid = false,
		controls,
		describedby,
		activedescendant,
		haspopup = 'dialog',
		onactivate,
		onkeydown,
		onfocus
	}: {
		el?: HTMLInputElement | null;
		label: string;
		text: string;
		empty?: boolean;
		open?: boolean;
		invalid?: boolean;
		controls: string;
		describedby?: string;
		activedescendant?: string;
		haspopup?: 'dialog' | 'listbox';
		onactivate: () => void;
		onkeydown?: (event: KeyboardEvent) => void;
		onfocus?: () => void;
	} = $props();

	function onKeyDown(event: KeyboardEvent) {
		onkeydown?.(event);
		if (event.defaultPrevented) return;
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		onactivate();
	}
</script>

<label class="field">
	<span>{label}</span>
	<input
		bind:this={el}
		bind:value={() => text, () => {}}
		class="trigger"
		class:empty
		class:open
		class:invalid
		type="text"
		readonly
		inputmode="none"
		autocomplete="off"
		role="combobox"
		aria-haspopup={haspopup}
		aria-expanded={open}
		aria-controls={open ? controls : undefined}
		aria-activedescendant={open ? activedescendant : undefined}
		aria-describedby={describedby}
		onclick={onactivate}
		onfocus={onfocus}
		onkeydown={onKeyDown}
	/>
</label>

<style>
	.field {
		display: grid;
		gap: 0.4rem;
	}

	.field span {
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

	.trigger.empty {
		color: var(--muted);
	}

	.trigger.invalid {
		border-color: color-mix(in srgb, var(--sea) 40%, #8a3b2a);
	}

	.trigger:focus,
	.trigger.open {
		outline: 2px solid color-mix(in srgb, var(--sea) 45%, transparent);
		outline-offset: 1px;
		background: #fff;
	}
</style>
