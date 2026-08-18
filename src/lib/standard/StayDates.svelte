<script lang="ts">
	import { contactCopy } from '$lib/data/content';
	import { dismissable } from '$lib/standard/dismiss';
	import FieldTrigger from '$lib/standard/FieldTrigger.svelte';
	import { pick, type Locale } from '$lib/standard/i18n';

	const MIN_STAY = 2;

	let {
		checkIn = $bindable(''),
		checkOut = $bindable(''),
		locale,
		error = $bindable('')
	}: {
		checkIn: string;
		checkOut: string;
		locale: Locale;
		error?: string;
	} = $props();

	const uid = $props.id();
	const calendarId = `${uid}-calendar`;
	const errorId = `${uid}-error`;
	const today = isoDate(new Date());

	let open = $state(false);
	let picking = $state<'in' | 'out'>('in');
	let view = $state(monthStart(new Date()));
	let rootEl = $state<HTMLDivElement | null>(null);
	let inEl = $state<HTMLInputElement | null>(null);
	let outEl = $state<HTMLInputElement | null>(null);

	const intlLocale = $derived(locale === 'en' ? 'en-GB' : 'it-IT');
	const t = $derived((key: keyof typeof contactCopy) => pick(contactCopy[key], locale));
	const minCheckOut = $derived(addDays(checkIn || today, MIN_STAY));
	const weekdays = $derived(weekdayLabels(intlLocale));
	const monthTitle = $derived(
		new Intl.DateTimeFormat(intlLocale, { month: 'long', year: 'numeric' }).format(view)
	);
	const cells = $derived(monthCells(view));
	const canPrev = $derived(view > monthStart(parseIso(today)));

	$effect(() => {
		if (!open || !rootEl) return;
		return dismissable(rootEl, close);
	});

	function openFor(which: 'in' | 'out') {
		picking = which === 'out' && checkIn ? 'out' : 'in';
		view = monthStart(parseIso((which === 'out' && checkOut) || checkIn || today));
		open = true;
	}

	function close(restoreFocus: boolean) {
		open = false;
		if (restoreFocus) (picking === 'out' ? outEl : inEl)?.focus();
	}

	function selectDay(iso: string) {
		error = '';
		if (picking === 'in') {
			checkIn = iso;
			if (checkOut && checkOut < addDays(iso, MIN_STAY)) checkOut = '';
			picking = 'out';
			outEl?.focus();
			return;
		}
		checkOut = iso;
		close(true);
	}

	function dayDisabled(iso: string) {
		return picking === 'out' ? iso < minCheckOut : iso < today;
	}

	function formatDate(iso: string) {
		return new Intl.DateTimeFormat(intlLocale, {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(parseIso(iso));
	}

	function isoDate(date: Date) {
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${date.getFullYear()}-${month}-${day}`;
	}

	function parseIso(iso: string) {
		const [y, m, d] = iso.split('-').map(Number);
		return new Date(y, m - 1, d);
	}

	function addDays(iso: string, days: number) {
		const date = parseIso(iso);
		date.setDate(date.getDate() + days);
		return isoDate(date);
	}

	function monthStart(date: Date) {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}

	function shiftMonth(delta: number) {
		view = new Date(view.getFullYear(), view.getMonth() + delta, 1);
	}

	function weekdayLabels(tag: string) {
		const format = new Intl.DateTimeFormat(tag, { weekday: 'short' });
		return Array.from({ length: 7 }, (_, i) => format.format(new Date(2026, 7, 17 + i)));
	}

	/** Days of the shown month, padded with nulls so weeks start on Monday. */
	function monthCells(month: Date) {
		const year = month.getFullYear();
		const index = month.getMonth();
		const cells: (string | null)[] = Array.from({ length: (month.getDay() + 6) % 7 }, () => null);
		const days = new Date(year, index + 1, 0).getDate();
		for (let day = 1; day <= days; day++) cells.push(isoDate(new Date(year, index, day)));
		while (cells.length % 7) cells.push(null);
		return cells;
	}
</script>

<div class="stay" bind:this={rootEl}>
	<div class="row">
		<FieldTrigger
			bind:el={inEl}
			label={t('checkIn')}
			text={checkIn ? formatDate(checkIn) : t('datePlaceholder')}
			empty={!checkIn}
			open={open && picking === 'in'}
			invalid={Boolean(error)}
			controls={calendarId}
			describedby={error ? errorId : undefined}
			onactivate={() => openFor('in')}
		/>
		<FieldTrigger
			bind:el={outEl}
			label={t('checkOut')}
			text={checkOut ? formatDate(checkOut) : t('datePlaceholder')}
			empty={!checkOut}
			open={open && picking === 'out'}
			invalid={Boolean(error)}
			controls={calendarId}
			describedby={error ? errorId : undefined}
			onactivate={() => openFor('out')}
		/>
	</div>

	{#if error}
		<p id={errorId} class="error">{error}</p>
	{/if}

	{#if open}
		<div id={calendarId} class="cal" role="dialog" aria-label={t('dateCalendar')}>
			<div class="cal-nav">
				<button
					type="button"
					class="nav"
					disabled={!canPrev}
					aria-label={t('datePrevMonth')}
					onpointerdown={(event) => event.preventDefault()}
					onclick={() => shiftMonth(-1)}
				>
					‹
				</button>
				<p class="cal-title">{monthTitle}</p>
				<button
					type="button"
					class="nav"
					aria-label={t('dateNextMonth')}
					onpointerdown={(event) => event.preventDefault()}
					onclick={() => shiftMonth(1)}
				>
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
							class:start={iso === checkIn}
							class:end={iso === checkOut}
							class:range={Boolean(checkIn && checkOut && iso > checkIn && iso < checkOut)}
							class:today={iso === today}
							disabled={dayDisabled(iso)}
							aria-pressed={iso === checkIn || iso === checkOut}
							aria-label={formatDate(iso)}
							onpointerdown={(event) => event.preventDefault()}
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
