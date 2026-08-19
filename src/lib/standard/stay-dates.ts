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
