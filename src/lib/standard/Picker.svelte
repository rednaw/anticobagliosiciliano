<script lang="ts">
  import { tick } from 'svelte';
  import { dismissable } from '$lib/standard/dismiss';
  import FieldTrigger from '$lib/standard/FieldTrigger.svelte';
  import { optionIndexAfterKey } from '$lib/standard/picker';

  type Option = { value: string; label: string; disabled?: boolean };

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
  let activeIndex = $state(0);
  let rootEl = $state<HTMLDivElement | null>(null);
  let triggerEl = $state<HTMLInputElement | null>(null);

  const shown = $derived(options.find((option) => option.value === value)?.label ?? '');
  const activeId = $derived(`${listId}-${activeIndex}`);

  $effect(() => {
    if (!open || !rootEl) return;
    return dismissable(rootEl, close);
  });

  $effect(() => {
    if (!open) return;
    activeIndex;
    queueMicrotask(() => {
      rootEl?.querySelector<HTMLElement>('.option.active')?.scrollIntoView({ block: 'nearest' });
    });
  });

  const isDisabled = (i: number) => Boolean(options[i]?.disabled);

  function indexOfValue() {
    const index = options.findIndex((option) => option.value === value);
    return index < 0 ? 0 : index;
  }

  async function toggle() {
    if (open) {
      close(true);
      return;
    }
    activeIndex = indexOfValue();
    open = true;
    await tick();
  }

  function close(restoreFocus: boolean) {
    open = false;
    if (restoreFocus) triggerEl?.focus();
  }

  function select(option: Option) {
    if (option.disabled) return;
    value = option.value;
    close(true);
  }

  function onTriggerKey(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        activeIndex = indexOfValue();
        open = true;
        return;
      }
      const next = optionIndexAfterKey(event.key, activeIndex, options.length, isDisabled);
      if (next !== null) activeIndex = next;
      return;
    }
    if (!open) return;
    const jumped = optionIndexAfterKey(event.key, activeIndex, options.length, isDisabled);
    if (jumped !== null) {
      event.preventDefault();
      activeIndex = jumped;
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      const option = options[activeIndex];
      if (!option) return;
      event.preventDefault();
      select(option);
    }
  }
</script>

<div class="picker" bind:this={rootEl}>
  <FieldTrigger
    bind:el={triggerEl}
    {label}
    {open}
    text={shown}
    controls={listId}
    haspopup="listbox"
    activedescendant={activeId}
    onactivate={toggle}
    onkeydown={onTriggerKey}
  />

  {#if open}
    <div class="menu" id={listId} role="listbox" aria-label={label}>
      {#each options as option, i}
        <button
          id={`${listId}-${i}`}
          type="button"
          class="option"
          class:selected={option.value === value}
          class:active={i === activeIndex}
          role="option"
          tabindex="-1"
          disabled={option.disabled}
          aria-selected={option.value === value}
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
    background: var(--surface);
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

  .option:hover,
  .option.active:not(.selected) {
    background: color-mix(in srgb, var(--sea) 8%, var(--paper));
  }

  .option.active {
    outline: 2px solid var(--sea);
    outline-offset: -2px;
  }

  .option.selected,
  .option.selected:hover {
    background: var(--sea);
    color: var(--on-sea);
  }

  .option:disabled {
    color: var(--muted);
    cursor: default;
    background: transparent;
  }

  .option:disabled:hover,
  .option.active:disabled {
    background: transparent;
    outline: none;
  }
</style>
