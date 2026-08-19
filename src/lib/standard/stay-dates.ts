export const MIN_STAY = 2;

export function isoDate(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
}

export function parseIso(iso: string): Date {
	const [y, m, d] = iso.split('-').map(Number);
	return new Date(y, m - 1, d);
}

export function addDays(iso: string, days: number): string {
	const date = parseIso(iso);
	date.setDate(date.getDate() + days);
	return isoDate(date);
}

export function monthStart(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function minCheckOut(checkIn: string, today: string): string {
	return addDays(checkIn || today, MIN_STAY);
}

export function isDayDisabled(
	iso: string,
	picking: 'in' | 'out',
	today: string,
	checkIn: string
): boolean {
	return picking === 'out' ? iso < minCheckOut(checkIn, today) : iso < today;
}

/** After a calendar day click: next range, which end is active, and whether the popover should close. */
export function applyDaySelection(
	iso: string,
	picking: 'in' | 'out',
	checkIn: string,
	checkOut: string
): { checkIn: string; checkOut: string; picking: 'in' | 'out'; done: boolean } {
	if (picking === 'in') {
		const nextOut = checkOut && checkOut < addDays(iso, MIN_STAY) ? '' : checkOut;
		return { checkIn: iso, checkOut: nextOut, picking: 'out', done: false };
	}
	return { checkIn, checkOut: iso, picking, done: true };
}

export function weekdayLabels(tag: string): string[] {
	const format = new Intl.DateTimeFormat(tag, { weekday: 'short' });
	return Array.from({ length: 7 }, (_, i) => format.format(new Date(2026, 7, 17 + i)));
}

/** Days of the shown month, padded with nulls so weeks start on Monday. */
export function monthCells(month: Date): (string | null)[] {
	const year = month.getFullYear();
	const index = month.getMonth();
	const cells: (string | null)[] = Array.from({ length: (month.getDay() + 6) % 7 }, () => null);
	const days = new Date(year, index + 1, 0).getDate();
	for (let day = 1; day <= days; day++) cells.push(isoDate(new Date(year, index, day)));
	while (cells.length % 7) cells.push(null);
	return cells;
}

export function addMonths(iso: string, months: number): string {
	const date = parseIso(iso);
	const day = date.getDate();
	date.setDate(1);
	date.setMonth(date.getMonth() + months);
	const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	date.setDate(Math.min(day, last));
	return isoDate(date);
}

function snapEnabled(
	iso: string,
	dir: 1 | -1,
	picking: 'in' | 'out',
	today: string,
	checkIn: string
): string | null {
	let next = iso;
	for (let i = 0; i < 400; i++) {
		if (!isDayDisabled(next, picking, today, checkIn)) return next;
		next = addDays(next, dir);
	}
	return null;
}

/** First selectable day on or after `iso`, else `iso` itself. */
export function nearestEnabled(
	iso: string,
	picking: 'in' | 'out',
	today: string,
	checkIn: string
): string {
	return snapEnabled(iso, 1, picking, today, checkIn) ?? iso;
}

/** Next calendar cursor, or null if the key is not a calendar move. */
export function cursorAfterKey(
	key: string,
	cursor: string,
	picking: 'in' | 'out',
	today: string,
	checkIn: string
): string | null {
	const step = (delta: number) => {
		const sign: 1 | -1 = delta >= 0 ? 1 : -1;
		return snapEnabled(addDays(cursor, delta), sign, picking, today, checkIn) ?? cursor;
	};

	switch (key) {
		case 'ArrowLeft':
			return step(-1);
		case 'ArrowRight':
			return step(1);
		case 'ArrowUp':
			return step(-7);
		case 'ArrowDown':
			return step(7);
		case 'PageUp':
			return nearestEnabled(addMonths(cursor, -1), picking, today, checkIn);
		case 'PageDown':
			return nearestEnabled(addMonths(cursor, 1), picking, today, checkIn);
		case 'Home': {
			const fromMonday = (parseIso(cursor).getDay() + 6) % 7;
			return snapEnabled(addDays(cursor, -fromMonday), 1, picking, today, checkIn) ?? cursor;
		}
		case 'End': {
			const fromMonday = (parseIso(cursor).getDay() + 6) % 7;
			return snapEnabled(addDays(cursor, 6 - fromMonday), -1, picking, today, checkIn) ?? cursor;
		}
		default:
			return null;
	}
}
