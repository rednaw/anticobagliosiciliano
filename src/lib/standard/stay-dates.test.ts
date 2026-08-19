import { describe, expect, it } from 'vitest';
import {
	MIN_STAY,
	addDays,
	applyDaySelection,
	isoDate,
	isDayDisabled,
	minCheckOut,
	monthCells,
	monthStart,
	parseIso,
	weekdayLabels
} from './stay-dates';

const today = '2026-08-19';

describe('isoDate / addDays', () => {
	it('round-trips local calendar dates and crosses month ends', () => {
		expect(isoDate(new Date(2026, 7, 19))).toBe('2026-08-19');
		expect(isoDate(parseIso('2026-08-19'))).toBe('2026-08-19');
		expect(addDays('2026-08-31', 2)).toBe('2026-09-02');
		expect(MIN_STAY).toBe(2);
	});
});

describe('isDayDisabled', () => {
	it('blocks past days when picking check-in', () => {
		expect(isDayDisabled('2026-08-18', 'in', today, '')).toBe(true);
		expect(isDayDisabled('2026-08-19', 'in', today, '')).toBe(false);
	});

	it('requires two nights after check-in', () => {
		expect(minCheckOut('2026-08-20', today)).toBe('2026-08-22');
		expect(isDayDisabled('2026-08-21', 'out', today, '2026-08-20')).toBe(true);
		expect(isDayDisabled('2026-08-22', 'out', today, '2026-08-20')).toBe(false);
	});
});

describe('applyDaySelection', () => {
	it('moves to check-out after picking check-in', () => {
		expect(applyDaySelection('2026-08-20', 'in', '', '')).toEqual({
			checkIn: '2026-08-20',
			checkOut: '',
			picking: 'out',
			done: false
		});
	});

	it('clears a check-out that is too close to the new check-in', () => {
		expect(applyDaySelection('2026-08-20', 'in', '2026-08-10', '2026-08-21')).toEqual({
			checkIn: '2026-08-20',
			checkOut: '',
			picking: 'out',
			done: false
		});
	});

	it('keeps a check-out that still meets the minimum stay', () => {
		expect(applyDaySelection('2026-08-20', 'in', '2026-08-10', '2026-08-24')).toEqual({
			checkIn: '2026-08-20',
			checkOut: '2026-08-24',
			picking: 'out',
			done: false
		});
	});

	it('closes the calendar after picking check-out', () => {
		expect(applyDaySelection('2026-08-22', 'out', '2026-08-20', '')).toEqual({
			checkIn: '2026-08-20',
			checkOut: '2026-08-22',
			picking: 'out',
			done: true
		});
	});
});

describe('monthCells', () => {
	it('pads so weeks start on Monday', () => {
		const june = monthCells(monthStart(new Date(2026, 5, 1)));
		expect(june[0]).toBe('2026-06-01');
		expect(june.filter(Boolean).at(-1)).toBe('2026-06-30');
		expect(june.length % 7).toBe(0);

		const august = monthCells(new Date(2026, 7, 1));
		expect(august.slice(0, 5)).toEqual([null, null, null, null, null]);
		expect(august[5]).toBe('2026-08-01');
	});
});

describe('weekdayLabels', () => {
	it('starts the week on Monday in Italian and English', () => {
		expect(weekdayLabels('it-IT')[0].toLowerCase()).toMatch(/^lun/);
		expect(weekdayLabels('en-GB')[0].toLowerCase()).toMatch(/^mon/);
	});
});
