/** Lodgify occupancy snapshot. Ids are not secret; the API key never lives here. */

export const LODGIFY_PROPERTY_ID = 129476;

export const LODGIFY_HOUSE_SLUGS = ['casa-1', 'casa-2', 'casa-3', 'casa-4'] as const;
export type LodgifyHouseSlug = (typeof LODGIFY_HOUSE_SLUGS)[number];

/** Public site houses only. Casa #5 and Tutte are omitted on purpose. */
export const LODGIFY_ROOM_TYPE_BY_SLUG: Record<LodgifyHouseSlug, number> = {
	'casa-1': 150204,
	'casa-2': 150205,
	'casa-3': 159913,
	'casa-4': 159914
};

export type OccupiedRange = { start: string; end: string };

export type AvailabilitySnapshot = {
	generatedAt: string;
	from: string;
	to: string;
	houses: Record<LodgifyHouseSlug, OccupiedRange[]>;
};

type LodgifyPeriod = {
	start?: string;
	end?: string;
	available?: number | boolean;
	closed_period?: unknown;
};

type LodgifyRoomAvailability = {
	property_id?: number;
	room_type_id?: number;
	periods?: LodgifyPeriod[];
};

export const OCCUPANCY_JSON = 'src/lib/data/occupancy.json';
export const LODGIFY_HORIZON_MONTHS = 18;
export const LODGIFY_TIME_ZONE = 'Europe/Rome';

function ymd(value: string): string {
	const day = value.slice(0, 10);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
		throw new Error(`Lodgify period date is not YYYY-MM-DD: ${value}`);
	}
	return day;
}

export function calendarDateInZone(date = new Date(), timeZone = LODGIFY_TIME_ZONE): string {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(date);
}

export function addUtcMonths(ymdValue: string, months: number): string {
	const day = ymd(ymdValue);
	const [year, month, date] = day.split('-').map(Number);
	const next = new Date(Date.UTC(year, month - 1 + months, date));
	return next.toISOString().slice(0, 10);
}

export function addUtcDays(ymdValue: string, days: number): string {
	const day = ymd(ymdValue);
	const [year, month, date] = day.split('-').map(Number);
	const next = new Date(Date.UTC(year, month - 1, date + days));
	return next.toISOString().slice(0, 10);
}

export function periodIsOccupied(period: LodgifyPeriod): boolean {
	if (period.closed_period != null && period.closed_period !== false) return true;
	return period.available === 0 || period.available === false;
}

/** Merge overlapping/adjacent occupied ranges. Also fill a single free night between two bookings:
 * that gap cannot be a stay under a 2+ night minimum, while checkout on the morning of that date
 * still uses `[checkIn, checkOut)`. */
export function mergeOccupiedRanges(ranges: OccupiedRange[]): OccupiedRange[] {
	const sorted = [...ranges].sort(
		(a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end)
	);
	const out: OccupiedRange[] = [];
	for (const range of sorted) {
		if (range.end < range.start) {
			throw new Error(`Occupied range ends before it starts: ${range.start}…${range.end}`);
		}
		const last = out.at(-1);
		if (last && addUtcDays(last.end, 2) >= range.start) {
			if (range.end > last.end) last.end = range.end;
			continue;
		}
		out.push({ start: range.start, end: range.end });
	}
	return out;
}

/** Inclusive clip. Ranges that do not overlap `[from, to]` are dropped. */
export function clipOccupiedRanges(
	ranges: OccupiedRange[],
	from: string,
	to: string
): OccupiedRange[] {
	const windowFrom = ymd(from);
	const windowTo = ymd(to);
	const out: OccupiedRange[] = [];
	for (const range of ranges) {
		const start = range.start > windowFrom ? range.start : windowFrom;
		const end = range.end < windowTo ? range.end : windowTo;
		if (end < start) continue;
		out.push({ start, end });
	}
	return out;
}

/** Occupied nights in `[from, to]`. Sliding starts, `generatedAt`, and the stored window do not count. */
export function occupancyFingerprint(
	snapshot: AvailabilitySnapshot,
	window: { from: string; to: string }
): string {
	const houses = {} as AvailabilitySnapshot['houses'];
	for (const slug of LODGIFY_HOUSE_SLUGS) {
		houses[slug] = clipOccupiedRanges(snapshot.houses[slug] ?? [], window.from, window.to);
	}
	return JSON.stringify(houses);
}

/** Drop bookings / guest fields. Keep occupied night ranges for the four public houses. */
export function snapshotFromLodgifyAvailability(
	payload: unknown,
	meta: { generatedAt: string; from: string; to: string }
): AvailabilitySnapshot {
	if (!Array.isArray(payload)) {
		throw new Error('Lodgify availability response is not an array.');
	}
	const rooms = payload as LodgifyRoomAvailability[];
	const byRoom = new Map<number, LodgifyRoomAvailability>();
	for (const room of rooms) {
		if (typeof room.room_type_id === 'number') byRoom.set(room.room_type_id, room);
	}

	const houses = {} as AvailabilitySnapshot['houses'];
	for (const slug of LODGIFY_HOUSE_SLUGS) {
		const roomTypeId = LODGIFY_ROOM_TYPE_BY_SLUG[slug];
		const room = byRoom.get(roomTypeId);
		if (!room) {
			throw new Error(`Lodgify availability is missing room_type_id ${roomTypeId} (${slug}).`);
		}
		if (room.property_id != null && room.property_id !== LODGIFY_PROPERTY_ID) {
			throw new Error(
				`Lodgify property_id ${room.property_id} does not match ${LODGIFY_PROPERTY_ID}.`
			);
		}
		houses[slug] = mergeOccupiedRanges(
			(room.periods ?? [])
				.filter(periodIsOccupied)
				.map((period) => ({
					start: ymd(String(period.start ?? '')),
					end: ymd(String(period.end ?? ''))
				}))
		);
	}

	return {
		generatedAt: meta.generatedAt,
		from: meta.from,
		to: meta.to,
		houses
	};
}

export function stringifyAvailabilitySnapshot(snapshot: AvailabilitySnapshot): string {
	return `${JSON.stringify(snapshot, null, '\t')}\n`;
}
