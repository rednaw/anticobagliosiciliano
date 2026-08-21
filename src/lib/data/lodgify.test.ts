import { describe, expect, it } from 'vitest';
import {
  addUtcDays,
  addUtcMonths,
  clipOccupiedRanges,
  mergeOccupiedRanges,
  occupancyFingerprint,
  periodIsOccupied,
  snapshotFromLodgifyAvailability,
  type AvailabilitySnapshot
} from './lodgify';

function houses(
  partial: Partial<AvailabilitySnapshot['houses']>
): AvailabilitySnapshot['houses'] {
  return {
    'casa-1': [],
    'casa-2': [],
    'casa-3': [],
    'casa-4': [],
    ...partial
  };
}

function snapshot(partial: Partial<AvailabilitySnapshot>): AvailabilitySnapshot {
  return {
    generatedAt: '2026-08-20T12:00:00.000Z',
    from: '2026-08-20',
    to: '2028-02-20',
    houses: houses({}),
    ...partial
  };
}

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
    const window = { from: '2026-08-20', to: '2028-02-20' };
    expect(occupancyFingerprint(snapshot, window)).not.toContain('generatedAt');
    expect(occupancyFingerprint(snapshot, window)).toBe(
      occupancyFingerprint(
        {
          ...snapshot,
          generatedAt: '2099-01-01T00:00:00.000Z',
          from: '2099-01-01',
          to: '2100-01-01'
        },
        window
      )
    );
  });

  it('clips occupied ranges to an inclusive window', () => {
    expect(
      clipOccupiedRanges([{ start: '2026-08-20', end: '2027-02-27' }], '2026-08-21', '2028-02-21')
    ).toEqual([{ start: '2026-08-21', end: '2027-02-27' }]);
    expect(
      clipOccupiedRanges([{ start: '2026-08-01', end: '2026-08-20' }], '2026-08-21', '2028-02-21')
    ).toEqual([]);
    expect(
      clipOccupiedRanges([{ start: '2028-03-01', end: '2028-03-10' }], '2026-08-21', '2028-02-21')
    ).toEqual([]);
    expect(
      clipOccupiedRanges([{ start: '2028-02-01', end: '2028-06-01' }], '2026-08-21', '2028-02-21')
    ).toEqual([{ start: '2028-02-01', end: '2028-02-21' }]);
  });

  it('treats a sliding range start as unchanged occupancy', () => {
    const window = { from: '2026-08-21', to: '2028-02-21' };
    const previous = snapshot({
      from: '2026-08-20',
      to: '2028-02-20',
      houses: houses({ 'casa-1': [{ start: '2026-08-20', end: '2027-02-27' }] })
    });
    const next = snapshot({
      generatedAt: '2026-08-21T05:00:00.000Z',
      from: '2026-08-21',
      to: '2028-02-21',
      houses: houses({ 'casa-1': [{ start: '2026-08-21', end: '2027-02-27' }] })
    });
    expect(occupancyFingerprint(previous, window)).toBe(occupancyFingerprint(next, window));
  });

  it('treats a new booking past the stored window as a change', () => {
    const window = { from: '2026-08-21', to: '2028-02-21' };
    const previous = snapshot({
      houses: houses({ 'casa-1': [{ start: '2026-08-20', end: '2027-02-27' }] })
    });
    const next = snapshot({
      houses: houses({
        'casa-1': [
          { start: '2026-08-21', end: '2027-02-27' },
          { start: '2028-02-10', end: '2028-02-21' }
        ]
      })
    });
    expect(occupancyFingerprint(previous, window)).not.toBe(occupancyFingerprint(next, window));
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
