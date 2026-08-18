<script lang="ts">
	import { contactCopy } from '$lib/data/content';
	import { pick, type Locale } from '$lib/standard/i18n';

	const MIN_STAY = 2;

	let {
		checkIn = $bindable(''),
		checkOut = $bindable(''),
		locale,
		today,
		error = ''
	}: {
		checkIn: string;
		checkOut: string;
		locale: Locale;
		today: string;
		error?: string;
	} = $props();

	let open = $state(false);
	let picking = $state<'in' | 'out'>('in');
	let view = $state({ y: 0, m: 0 });
	let rootEl = $state<HTMLDivElement | null>(null);
	let inBtn = $state<HTMLButtonElement | null>(null);
	let outBtn = $state<HTMLButtonElement | null>(null);

	const intlLocale = $derived(locale === 'en' ? 'en-GB' : 'it-IT');
	const t = $derived((key: keyof typeof contactCopy) => pick(contactCopy[key], locale));
	const minCheckOut = $derived(checkIn ? addDaysIso(checkIn, MIN_STAY) : addDaysIso(today, MIN_STAY));
	const weekdays = $derived(weekdayLabels(intlLocale));
	const monthTitle = $derived(
		new Intl.DateTimeFormat(intlLocale, { month: 'long', year: 'numeric' }).format(
			new Date(view.y, view.m, 1)
		)
	);
	const cells = $derived(monthCells(view.y, view.m));
	const canPrev = $derived(view.y > yearOf(today) || (view.y === yearOf(today) && view.m > monthOf(today)));

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

	function openFor(which: 'in' | 'out') {
		picking = which === 'out' && checkIn ? 'out' : 'in';
		const seed = (which === 'out' && checkOut) || checkIn || today;
		view = { y: yearOf(seed), m: monthOf(seed) };
		open = true;
	}

	function close() {
		open = false;
		(picking === 'out' ? outBtn : inBtn)?.focus();
	}

	function selectDay(iso: string) {
		if (dayDisabled(iso)) return;
		if (picking === 'in') {
			checkIn = iso;
			if (checkOut && checkOut < addDaysIso(iso, MIN_STAY)) checkOut = '';
			picking = 'out';
			return;
		}
		checkOut = iso;
		open = false;
		outBtn?.focus();
	}

	function dayDisabled(iso: string) {
		if (iso < today) return true;
		if (picking === 'out') return iso < minCheckOut;
		return false;
	}

	function formatShown(iso: string) {
		if (!iso) return t('datePlaceholder');
		return new Intl.DateTimeFormat(intlLocale, {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(parseIso(iso));
	}

	function shiftMonth(delta: number) {
		const next = new Date(view.y, view.m + delta, 1);
		view = { y: next.getFullYear(), m: next.getMonth() };
	}

	function localIsoDate(d: Date) {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}

	function parseIso(iso: string) {
		const [y, m, d] = iso.split('-').map(Number);
		return new Date(y, m - 1, d);
	}

	function addDaysIso(iso: string, days: number) {
		const d = parseIso(iso);
		d.setDate(d.getDate() + days);
		return localIsoDate(d);
	}

	function yearOf(iso: string) {
		return Number(iso.slice(0, 4));
	}

	function monthOf(iso: string) {
		return Number(iso.slice(5, 7)) - 1;
	}

	function weekdayLabels(tag: string) {
		const fmt = new Intl.DateTimeFormat(tag, { weekday: 'short' });
		return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2026, 7, 17 + i)));
	}

	function monthCells(year: number, month: number) {
		const pad = (new Date(year, month, 1).getDay() + 6) % 7;
		const count = new Date(year, month + 1, 0).getDate();
		const out: (string | null)[] = Array.from({ length: pad }, () => null);
		for (let d = 1; d <= count; d++) out.push(localIsoDate(new Date(year, month, d)));
		while (out.length % 7) out.push(null);
		return out;
	}
</script>

<div class="stay" class:invalid={Boolean(error)} bind:this={rootEl}>
	<div class="row">
		<div class="field">
			<span>{t('checkIn')}</span>
			<button
				bind:this={inBtn}
				class="trigger"
				class:empty={!checkIn}
				class:active={open && picking === 'in'}
				type="button"
				aria-expanded={open}
				aria-controls="stay-calendar"
				aria-describedby={error ? 'stay-date-error' : undefined}
				onclick={() => openFor('in')}
			>
				{formatShown(checkIn)}
			</button>
		</div>
		<div class="field">
			<span>{t('checkOut')}</span>
			<button
				bind:this={outBtn}
				class="trigger"
				class:empty={!checkOut}
				class:active={open && picking === 'out'}
				type="button"
				aria-expanded={open}
				aria-controls="stay-calendar"
				aria-describedby={error ? 'stay-date-error' : undefined}
				onclick={() => openFor('out')}
			>
				{formatShown(checkOut)}
			</button>
		</div>
	</div>

	{#if error}
		<p id="stay-date-error" class="error">{error}</p>
	{/if}

	{#if open}
		<div id="stay-calendar" class="cal" role="dialog" aria-label={t('dateCalendar')} aria-modal="false">
			<div class="cal-nav">
				<button
					type="button"
					class="nav"
					disabled={!canPrev}
					aria-label={t('datePrevMonth')}
					onclick={() => shiftMonth(-1)}
				>
					‹
				</button>
				<p class="cal-title">{monthTitle}</p>
				<button type="button" class="nav" aria-label={t('dateNextMonth')} onclick={() => shiftMonth(1)}>
					›
				</button>
			</div>
			<div class="dow" aria-hidden="true">
				{#each weekdays as day}
					<span>{day}</span>
				{/each}
			</div>
			<div class="grid">
				{#each cells as iso}
					{#if iso}
						<button
							type="button"
							class="day"
							class:muted={dayDisabled(iso)}
							class:start={iso === checkIn}
							class:end={iso === checkOut}
							class:range={Boolean(checkIn && checkOut && iso > checkIn && iso < checkOut)}
							class:today={iso === today}
							disabled={dayDisabled(iso)}
							aria-pressed={iso === checkIn || iso === checkOut}
							aria-label={formatShown(iso)}
							onclick={() => selectDay(iso)}
						>
							{Number(iso.slice(8))}
						</button>
					{:else}
						<span class="pad"></span>
					{/if}
				{/each}
			</div>
			<p class="hint">{t('dateMinStayHint')}</p>
		</div>
	{/if}
</div>

<style>
	.stay {
		position: relative;
		display: grid;
		gap: 0.45rem;
	}

	.row {
		display: grid;
		gap: 1rem;
	}

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
	}

	.trigger.empty {
		color: var(--muted);
	}

	.trigger.active,
	.trigger:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--sea) 45%, transparent);
		outline-offset: 1px;
		background: #fff;
	}

	.invalid .trigger {
		border-color: color-mix(in srgb, var(--sea) 40%, #8a3b2a);
	}

	.error {
		margin: 0;
		font-size: 0.85rem;
		color: var(--sea-deep);
	}

	.cal {
		position: absolute;
		z-index: 20;
		top: calc(100% + 0.45rem);
		left: 0;
		right: 0;
		padding: 1rem 1rem 0.85rem;
		background: #fff;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}

	.cal-nav {
		display: grid;
		grid-template-columns: 2.25rem 1fr 2.25rem;
		align-items: center;
		gap: 0.35rem;
		margin-bottom: 0.75rem;
	}

	.cal-title {
		margin: 0;
		text-align: center;
		font-family: var(--font-display);
		font-size: 1.05rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		text-transform: capitalize;
	}

	.nav {
		width: 2.25rem;
		height: 2.25rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper);
		color: var(--sea);
		font-size: 1.35rem;
		line-height: 1;
		cursor: pointer;
	}

	.nav:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.dow,
	.grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.15rem;
	}

	.dow span,
	.pad {
		display: grid;
		place-items: center;
		min-height: 1.75rem;
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.day {
		min-height: 2.35rem;
		border: 0;
		border-radius: var(--radius);
		background: transparent;
		color: var(--ink);
		font: inherit;
		font-variant-numeric: tabular-nums;
		cursor: pointer;
	}

	.day:hover:not(:disabled) {
		background: color-mix(in srgb, var(--sea) 8%, var(--paper));
	}

	.day.today:not(.start):not(.end) {
		box-shadow: inset 0 0 0 1px var(--line);
	}

	.day.range {
		background: color-mix(in srgb, var(--sea) 10%, var(--paper));
		border-radius: 0;
	}

	.day.start,
	.day.end {
		background: var(--sea);
		color: #fff;
	}

	.day.muted,
	.day:disabled {
		color: color-mix(in srgb, var(--muted) 55%, var(--paper));
		cursor: default;
		background: transparent;
	}

	.hint {
		margin: 0.65rem 0 0;
		text-align: center;
		font-size: 0.78rem;
		letter-spacing: 0.04em;
		color: var(--muted);
	}

	@media (min-width: 720px) {
		.row {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
