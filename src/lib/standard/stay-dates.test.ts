import { describe, expect, it } from 'vitest';
import {
	MIN_STAY,
	addDays,
	addMonths,
	applyDaySelection,
	cursorAfterKey,
	cursorForMonth,
	isoDate,
	isDayDisabled,
	minCheckOut,
	monthCells,
	monthStart,
	nearestEnabled,
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

	it('blocks occupied nights, but allows checkout on that morning', () => {
		const occupied = (iso: string) => iso === '2026-08-22' || iso === '2026-08-23';
		expect(isDayDisabled('2026-08-22', 'in', today, '', occupied)).toBe(true);
		expect(isDayDisabled('2026-08-21', 'in', today, '', occupied)).toBe(false);
		expect(isDayDisabled('2026-08-22', 'out', today, '2026-08-20', occupied)).toBe(false);
		expect(isDayDisabled('2026-08-23', 'out', today, '2026-08-20', occupied)).toBe(true);
		expect(isDayDisabled('2026-08-24', 'out', today, '2026-08-20', occupied)).toBe(true);
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

	it('clears a check-out that now overlaps an occupied night', () => {
		const occupied = (iso: string) => iso === '2026-08-22';
		expect(applyDaySelection('2026-08-20', 'in', '2026-08-10', '2026-08-24', occupied)).toEqual({
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

describe('addMonths', () => {
	it('clamps the day when the next month is shorter', () => {
		expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
		expect(addMonths('2026-03-31', -1)).toBe('2026-02-28');
	});
});

describe('nearestEnabled', () => {
	it('skips past days and the night after check-in', () => {
		expect(nearestEnabled('2026-08-10', 'in', today, '')).toBe('2026-08-19');
		expect(nearestEnabled('2026-08-21', 'out', today, '2026-08-20')).toBe('2026-08-22');
		expect(nearestEnabled('2026-08-24', 'out', today, '2026-08-20')).toBe('2026-08-24');
	});

	it('skips occupied nights when finding the next enabled day', () => {
		const occupied = (iso: string) => iso === '2026-08-22' || iso === '2026-08-23';
		expect(nearestEnabled('2026-08-22', 'in', today, '', occupied)).toBe('2026-08-24');
		expect(nearestEnabled('2026-08-21', 'out', today, '2026-08-20', occupied)).toBe('2026-08-22');
	});

	it('keeps a fully occupied month instead of jumping to the next free day', () => {
		const occupied = (iso: string) => iso >= '2026-09-01' && iso <= '2026-09-30';
		expect(nearestEnabled('2026-09-19', 'in', today, '', occupied)).toBe('2026-10-01');
		expect(
			cursorForMonth(monthStart(new Date(2026, 8, 1)), 19, 'in', today, '', occupied)
		).toBe('2026-09-19');
	});
});

describe('cursorAfterKey', () => {
	it('moves by day and week, and stops at today when picking check-in', () => {
		expect(cursorAfterKey('ArrowRight', today, 'in', today, '')).toBe('2026-08-20');
		expect(cursorAfterKey('ArrowLeft', today, 'in', today, '')).toBe(today);
		expect(cursorAfterKey('ArrowDown', today, 'in', today, '')).toBe('2026-08-26');
		expect(cursorAfterKey('Enter', today, 'in', today, '')).toBeNull();
	});

	it('snaps Home to the first selectable day of the week', () => {
		expect(cursorAfterKey('Home', '2026-08-21', 'in', today, '')).toBe(today);
		expect(cursorAfterKey('End', '2026-08-19', 'in', today, '')).toBe('2026-08-23');
	});

	it('turns the page by month without landing on a disabled day', () => {
		expect(cursorAfterKey('PageDown', today, 'in', today, '')).toBe('2026-09-19');
		expect(cursorAfterKey('PageUp', today, 'in', today, '')).toBe(today);
		expect(cursorAfterKey('PageUp', '2026-09-05', 'in', today, '')).toBe(today);
	});

	it('still shows a fully occupied month on PageDown', () => {
		const occupied = (iso: string) => iso >= '2026-09-01' && iso <= '2026-09-30';
		expect(cursorAfterKey('PageDown', today, 'in', today, '', occupied)).toBe('2026-09-19');
	});

	it('skips occupied nights with arrow keys', () => {
		const occupied = (iso: string) => iso === '2026-08-22' || iso === '2026-08-23';
		expect(cursorAfterKey('ArrowRight', '2026-08-21', 'in', today, '', occupied)).toBe('2026-08-24');
		expect(cursorAfterKey('ArrowLeft', '2026-08-24', 'in', today, '', occupied)).toBe('2026-08-21');
	});
});
