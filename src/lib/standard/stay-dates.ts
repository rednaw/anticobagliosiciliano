import { addDays } from '$lib/data/lodgify';

export { addDays };

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

export function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export type OccupiedNight = (iso: string) => boolean;

export function minCheckOut(checkIn: string, today: string): string {
  return addDays(checkIn || today, MIN_STAY);
}

/** True when `[from, to)` includes an occupied night. Checkout on that morning is `to`, so it stays free. */
function stayHitsOccupied(
  from: string,
  to: string,
  occupiedNight: OccupiedNight
): boolean {
  if (!from || !to || to <= from) return false;
  for (let iso = from; iso < to; iso = addDays(iso, 1)) {
    if (occupiedNight(iso)) return true;
  }
  return false;
}

export function isDayDisabled(
  iso: string,
  picking: 'in' | 'out',
  today: string,
  checkIn: string,
  occupiedNight: OccupiedNight = () => false
): boolean {
  if (picking === 'in') return iso < today || occupiedNight(iso);
  if (iso < minCheckOut(checkIn, today)) return true;
  return stayHitsOccupied(checkIn, iso, occupiedNight);
}

/** After a calendar day click: next range, which end is active, and whether the popover should close. */
export function applyDaySelection(
  iso: string,
  picking: 'in' | 'out',
  checkIn: string,
  checkOut: string,
  occupiedNight: OccupiedNight = () => false
): { checkIn: string; checkOut: string; picking: 'in' | 'out'; done: boolean } {
  if (picking === 'in') {
    let nextOut = checkOut && checkOut < addDays(iso, MIN_STAY) ? '' : checkOut;
    if (nextOut && stayHitsOccupied(iso, nextOut, occupiedNight)) nextOut = '';
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
  checkIn: string,
  occupiedNight: OccupiedNight
): string | null {
  let next = iso;
  for (let i = 0; i < 400; i++) {
    if (!isDayDisabled(next, picking, today, checkIn, occupiedNight)) return next;
    next = addDays(next, dir);
  }
  return null;
}

function sameMonth(iso: string, month: Date): boolean {
  const date = parseIso(iso);
  return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
}

/** First selectable day on or after `iso` that stays in that month. */
function nearestEnabledInMonth(
  iso: string,
  picking: 'in' | 'out',
  today: string,
  checkIn: string,
  occupiedNight: OccupiedNight = () => false
): string | null {
  const month = monthStart(parseIso(iso));
  const found = snapEnabled(iso, 1, picking, today, checkIn, occupiedNight);
  return found && sameMonth(found, month) ? found : null;
}

/** Cursor for a shown month: prefer an enabled day, otherwise stay on a day in that month. */
export function cursorForMonth(
  month: Date,
  preferredDay: number,
  picking: 'in' | 'out',
  today: string,
  checkIn: string,
  occupiedNight: OccupiedNight = () => false
): string {
  const year = month.getFullYear();
  const index = month.getMonth();
  const last = new Date(year, index + 1, 0).getDate();
  const day = Math.min(Math.max(preferredDay, 1), last);
  const preferred = isoDate(new Date(year, index, day));
  return (
    nearestEnabledInMonth(preferred, picking, today, checkIn, occupiedNight) ??
    nearestEnabledInMonth(isoDate(new Date(year, index, 1)), picking, today, checkIn, occupiedNight) ??
    preferred
  );
}

/** First selectable day on or after `iso`, else `iso` itself. */
export function nearestEnabled(
  iso: string,
  picking: 'in' | 'out',
  today: string,
  checkIn: string,
  occupiedNight: OccupiedNight = () => false
): string {
  return snapEnabled(iso, 1, picking, today, checkIn, occupiedNight) ?? iso;
}

/** Next calendar cursor, or null if the key is not a calendar move. */
export function cursorAfterKey(
  key: string,
  cursor: string,
  picking: 'in' | 'out',
  today: string,
  checkIn: string,
  occupiedNight: OccupiedNight = () => false
): string | null {
  const step = (delta: number) => {
    const sign: 1 | -1 = delta >= 0 ? 1 : -1;
    return snapEnabled(addDays(cursor, delta), sign, picking, today, checkIn, occupiedNight) ?? cursor;
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
    case 'PageUp': {
      const prev = monthStart(parseIso(addMonths(cursor, -1)));
      if (prev < monthStart(parseIso(today))) {
        return nearestEnabledInMonth(today, picking, today, checkIn, occupiedNight) ?? today;
      }
      return cursorForMonth(prev, parseIso(cursor).getDate(), picking, today, checkIn, occupiedNight);
    }
    case 'PageDown':
      return cursorForMonth(
        monthStart(parseIso(addMonths(cursor, 1))),
        parseIso(cursor).getDate(),
        picking,
        today,
        checkIn,
        occupiedNight
      );
    case 'Home': {
      const fromMonday = (parseIso(cursor).getDay() + 6) % 7;
      return snapEnabled(addDays(cursor, -fromMonday), 1, picking, today, checkIn, occupiedNight) ?? cursor;
    }
    case 'End': {
      const fromMonday = (parseIso(cursor).getDay() + 6) % 7;
      return snapEnabled(addDays(cursor, 6 - fromMonday), -1, picking, today, checkIn, occupiedNight) ?? cursor;
    }
    default:
      return null;
  }
}
