import { describe, expect, it } from 'vitest';
import type { AvailabilitySnapshot } from '../data/lodgify';
import { freeHouses, nightIsOccupied, stayIsOccupied, stayNights } from './occupancy';

const snapshot: AvailabilitySnapshot = {
	generatedAt: '2026-08-20T12:00:00.000Z',
	from: '2026-08-20',
	to: '2028-02-20',
	houses: {
		'casa-1': [{ start: '2026-08-20', end: '2026-08-25' }],
		'casa-2': [{ start: '2026-08-20', end: '2026-08-25' }],
		'casa-3': [{ start: '2026-08-20', end: '2026-08-22' }],
		'casa-4': []
	}
};

describe('stayNights', () => {
	it('uses [checkIn, checkOut) so checkout on a booked morning stays valid', () => {
		expect(stayNights('2026-08-24', '2026-08-26')).toEqual(['2026-08-24', '2026-08-25']);
		expect(stayNights('2026-08-26', '2026-08-26')).toEqual([]);
	});
});

describe('nightIsOccupied', () => {
	it('uses the selected house, and all-houses only when every room is taken', () => {
		expect(nightIsOccupied(snapshot, 'casa-1', '2026-08-25')).toBe(true);
		expect(nightIsOccupied(snapshot, 'casa-1', '2026-08-26')).toBe(false);
		expect(nightIsOccupied(snapshot, 'casa-4', '2026-08-21')).toBe(false);
		expect(nightIsOccupied(snapshot, '', '2026-08-21')).toBe(false);
		expect(nightIsOccupied(snapshot, '', '2026-08-24')).toBe(false);

		const full: AvailabilitySnapshot = {
			...snapshot,
			houses: {
				'casa-1': [{ start: '2026-08-21', end: '2026-08-21' }],
				'casa-2': [{ start: '2026-08-21', end: '2026-08-21' }],
				'casa-3': [{ start: '2026-08-21', end: '2026-08-21' }],
				'casa-4': [{ start: '2026-08-21', end: '2026-08-21' }]
			}
		};
		expect(nightIsOccupied(full, '', '2026-08-21')).toBe(true);
		expect(nightIsOccupied(full, '', '2026-08-22')).toBe(false);
	});
});

describe('stayIsOccupied / freeHouses', () => {
	it('flags a house stay that overlaps occupied nights', () => {
		expect(stayIsOccupied(snapshot, 'casa-1', '2026-08-24', '2026-08-26')).toBe(true);
		expect(stayIsOccupied(snapshot, 'casa-1', '2026-08-26', '2026-08-28')).toBe(false);
		expect(stayIsOccupied(snapshot, 'casa-1', '2026-08-18', '2026-08-20')).toBe(false);
		expect(stayIsOccupied(snapshot, '', '2026-08-24', '2026-08-26')).toBe(false);
	});

	it('with no house preference, flags the stay only when every house is taken on a night', () => {
		const full: AvailabilitySnapshot = {
			...snapshot,
			houses: {
				'casa-1': [{ start: '2026-08-21', end: '2026-08-22' }],
				'casa-2': [{ start: '2026-08-21', end: '2026-08-22' }],
				'casa-3': [{ start: '2026-08-21', end: '2026-08-22' }],
				'casa-4': [{ start: '2026-08-21', end: '2026-08-22' }]
			}
		};
		expect(stayIsOccupied(full, '', '2026-08-21', '2026-08-23')).toBe(true);
		expect(stayIsOccupied(full, '', '2026-08-23', '2026-08-25')).toBe(false);
	});

	it('lists houses that are free for the stay', () => {
		expect(freeHouses(snapshot, '2026-08-24', '2026-08-26')).toEqual(['casa-3', 'casa-4']);
		expect(freeHouses(snapshot, '2026-08-20', '2026-08-22')).toEqual(['casa-4']);
	});
});
