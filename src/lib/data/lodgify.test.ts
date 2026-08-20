import { describe, expect, it } from 'vitest';
import {
	addUtcDays,
	addUtcMonths,
	mergeOccupiedRanges,
	occupancyFingerprint,
	periodIsOccupied,
	snapshotFromLodgifyAvailability
} from './lodgify';

describe('lodgify occupancy snapshot', () => {
	it('treats available 0 and closed periods as occupied', () => {
		expect(periodIsOccupied({ available: 1, closed_period: null })).toBe(false);
		expect(periodIsOccupied({ available: 0, closed_period: null })).toBe(true);
		expect(periodIsOccupied({ available: 1, closed_period: { start: '2026-08-20' } })).toBe(true);
	});

	it('merges adjacent occupied nights and fills a one-night hole', () => {
		expect(
			mergeOccupiedRanges([
				{ start: '2026-08-20', end: '2026-08-28' },
				{ start: '2026-08-29', end: '2026-08-31' },
				{ start: '2026-09-10', end: '2026-09-12' }
			])
		).toEqual([
			{ start: '2026-08-20', end: '2026-08-31' },
			{ start: '2026-09-10', end: '2026-09-12' }
		]);
		expect(
			mergeOccupiedRanges([
				{ start: '2026-08-20', end: '2026-08-21' },
				{ start: '2026-08-23', end: '2026-10-29' }
			])
		).toEqual([{ start: '2026-08-20', end: '2026-10-29' }]);
		expect(
			mergeOccupiedRanges([
				{ start: '2026-10-19', end: '2026-10-28' },
				{ start: '2026-11-01', end: '2026-12-30' }
			])
		).toEqual([
			{ start: '2026-10-19', end: '2026-10-28' },
			{ start: '2026-11-01', end: '2026-12-30' }
		]);
		expect(addUtcDays('2026-08-31', 1)).toBe('2026-09-01');
		expect(addUtcMonths('2026-08-20', 18)).toBe('2028-02-20');
	});

	it('keeps the four public houses and strips bookings', () => {
		const snapshot = snapshotFromLodgifyAvailability(
			[
				{
					user_id: 1,
					property_id: 129476,
					room_type_id: 150203,
					periods: [{ start: '2026-08-20', end: '2026-12-30', available: 0, bookings: [{ id: 1 }] }]
				},
				{
					property_id: 129476,
					room_type_id: 150204,
					periods: [
						{
							start: '2026-08-20',
							end: '2026-08-21',
							available: 0,
							bookings: [{ id: 99, status: null }]
						},
						{ start: '2026-08-22', end: '2026-08-22', available: 1, bookings: [] }
					]
				},
				{
					property_id: 129476,
					room_type_id: 150205,
					periods: [{ start: '2026-08-20', end: '2026-08-20', available: 0 }]
				},
				{
					property_id: 129476,
					room_type_id: 159913,
					periods: [{ start: '2026-08-20', end: '2026-08-20', available: 0 }]
				},
				{
					property_id: 129476,
					room_type_id: 159914,
					periods: [{ start: '2026-08-20', end: '2026-08-20', available: 0 }]
				},
				{
					property_id: 129476,
					room_type_id: 223104,
					periods: [{ start: '2026-08-20', end: '2028-02-20', available: 1 }]
				}
			],
			{ generatedAt: '2026-08-20T12:00:00.000Z', from: '2026-08-20', to: '2028-02-20' }
		);

		expect(Object.keys(snapshot.houses)).toEqual(['casa-1', 'casa-2', 'casa-3', 'casa-4']);
		expect(JSON.stringify(snapshot)).not.toMatch(/bookings|user_id|150203|223104/);
		expect(snapshot.houses['casa-1']).toEqual([{ start: '2026-08-20', end: '2026-08-21' }]);
		expect(occupancyFingerprint(snapshot)).not.toContain('generatedAt');
		expect(occupancyFingerprint(snapshot)).toBe(
			occupancyFingerprint({
				...snapshot,
				generatedAt: '2099-01-01T00:00:00.000Z',
				from: '2099-01-01',
				to: '2100-01-01'
			})
		);
	});

	it('refuses a payload that is missing a mapped house', () => {
		expect(() =>
			snapshotFromLodgifyAvailability([], {
				generatedAt: '2026-08-20T12:00:00.000Z',
				from: '2026-08-20',
				to: '2028-02-20'
			})
		).toThrow(/150204/);
	});
});
