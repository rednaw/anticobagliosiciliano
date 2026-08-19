<script lang="ts">
	import { contactCopy } from '$lib/data/content';
	import { dismissable } from '$lib/standard/dismiss';
	import FieldTrigger from '$lib/standard/FieldTrigger.svelte';
	import {
		applyDaySelection,
		cursorAfterKey,
		isoDate,
		isDayDisabled,
		addMonths,
		minCheckOut,
		monthCells,
		monthStart,
		nearestEnabled,
		parseIso,
		weekdayLabels
	} from '$lib/standard/stay-dates';
	import { pick, type Locale } from '$lib/standard/i18n';

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
	let cursor = $state(today);
	let rootEl = $state<HTMLDivElement | null>(null);
	let inEl = $state<HTMLInputElement | null>(null);
	let outEl = $state<HTMLInputElement | null>(null);

	const intlLocale = $derived(locale === 'en' ? 'en-GB' : 'it-IT');
	const t = $derived((key: keyof typeof contactCopy) => pick(contactCopy[key], locale));
	const weekdays = $derived(weekdayLabels(intlLocale));
	const monthTitle = $derived(
		new Intl.DateTimeFormat(intlLocale, { month: 'long', year: 'numeric' }).format(view)
	);
	const cells = $derived(monthCells(view));
	const weeks = $derived(
		Array.from({ length: cells.length / 7 }, (_, week) => cells.slice(week * 7, week * 7 + 7))
	);
	const canPrev = $derived(view > monthStart(parseIso(today)));
	const cursorId = $derived(`${calendarId}-${cursor}`);

	$effect(() => {
		if (!open || !rootEl) return;
		return dismissable(rootEl, close);
	});

	function setCursor(iso: string) {
		cursor = iso;
		view = monthStart(parseIso(iso));
	}

	function openFor(which: 'in' | 'out') {
		picking = which === 'out' && checkIn ? 'out' : 'in';
		const start = (which === 'out' && checkOut) || checkIn || today;
		setCursor(nearestEnabled(start, picking, today, checkIn));
		open = true;
	}

	function close(restoreFocus: boolean) {
		open = false;
		if (restoreFocus) (picking === 'out' ? outEl : inEl)?.focus();
	}

	function selectDay(iso: string) {
		error = '';
		const next = applyDaySelection(iso, picking, checkIn, checkOut);
		checkIn = next.checkIn;
		checkOut = next.checkOut;
		picking = next.picking;
		if (next.done) {
			close(true);
			return;
		}
		setCursor(nearestEnabled(next.checkOut || minCheckOut(next.checkIn, today), 'out', today, next.checkIn));
		outEl?.focus();
	}

	function dayDisabled(iso: string) {
		return isDayDisabled(iso, picking, today, checkIn);
	}

	function formatDate(iso: string) {
		return new Intl.DateTimeFormat(intlLocale, {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(parseIso(iso));
	}

	function shiftMonth(delta: number) {
		setCursor(nearestEnabled(addMonths(cursor, delta), picking, today, checkIn));
	}

	function onFocusField(which: 'in' | 'out') {
		if (open && picking !== which) openFor(which);
	}

	function onTriggerKey(which: 'in' | 'out', event: KeyboardEvent) {
		if (!open) {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault();
				openFor(which);
			}
			return;
		}
		if (picking !== which) openFor(which);
		const next = cursorAfterKey(event.key, cursor, picking, today, checkIn);
		if (next !== null) {
			event.preventDefault();
			setCursor(next);
			return;
		}
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (!dayDisabled(cursor)) selectDay(cursor);
		}
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
			activedescendant={cursorId}
			onactivate={() => openFor('in')}
			onfocus={() => onFocusField('in')}
			onkeydown={(event) => onTriggerKey('in', event)}
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
			activedescendant={cursorId}
			onactivate={() => openFor('out')}
			onfocus={() => onFocusField('out')}
			onkeydown={(event) => onTriggerKey('out', event)}
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
					tabindex="-1"
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
					tabindex="-1"
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
			<div class="grid" role="grid" aria-readonly="true">
				{#each weeks as week}
					<div class="week" role="row">
						{#each week as iso}
							{#if iso}
								<button
									id={`${calendarId}-${iso}`}
									type="button"
									class="day"
									class:start={iso === checkIn}
									class:end={iso === checkOut}
									class:range={Boolean(checkIn && checkOut && iso > checkIn && iso < checkOut)}
									class:today={iso === today}
									class:cursor={iso === cursor}
									tabindex="-1"
									role="gridcell"
									disabled={dayDisabled(iso)}
									aria-selected={iso === checkIn || iso === checkOut}
									aria-label={formatDate(iso)}
									onpointerdown={(event) => event.preventDefault()}
									onclick={() => selectDay(iso)}
								>
									{Number(iso.slice(8))}
								</button>
							{:else}
								<span class="pad" role="gridcell"></span>
							{/if}
						{/each}
					</div>
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
		gap: 0.15rem;
	}

	.dow,
	.week {
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

	.day.cursor:not(.start):not(.end) {
		outline: 2px solid var(--sea);
		outline-offset: -2px;
	}

	.day.cursor.start,
	.day.cursor.end {
		outline: 2px solid #fff;
		outline-offset: -3px;
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
