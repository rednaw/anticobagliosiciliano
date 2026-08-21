import occupancyJson from '../data/availability.json' with { type: 'json' };
import {
	addUtcDays,
	LODGIFY_HOUSE_SLUGS,
	type AvailabilitySnapshot,
	type LodgifyHouseSlug,
	type OccupiedRange
} from '../data/lodgify';

export const occupancySnapshot = occupancyJson as AvailabilitySnapshot;

function nightInRanges(iso: string, ranges: OccupiedRange[]): boolean {
	return ranges.some((range) => range.start <= iso && iso <= range.end);
}

function isHouseSlug(value: string): value is LodgifyHouseSlug {
	return (LODGIFY_HOUSE_SLUGS as readonly string[]).includes(value);
}

/** House selected → that room. Empty slug → occupied only when every house is taken. */
export function nightIsOccupied(
	snapshot: AvailabilitySnapshot,
	houseSlug: string,
	iso: string
): boolean {
	if (isHouseSlug(houseSlug)) return nightInRanges(iso, snapshot.houses[houseSlug]);
	return LODGIFY_HOUSE_SLUGS.every((slug) => nightInRanges(iso, snapshot.houses[slug]));
}

export function stayNights(checkIn: string, checkOut: string): string[] {
	if (!checkIn || !checkOut || checkOut <= checkIn) return [];
	const nights: string[] = [];
	for (let iso = checkIn; iso < checkOut; iso = addUtcDays(iso, 1)) nights.push(iso);
	return nights;
}

export function stayIsOccupied(
	snapshot: AvailabilitySnapshot,
	houseSlug: string,
	checkIn: string,
	checkOut: string
): boolean {
	return stayNights(checkIn, checkOut).some((iso) => nightIsOccupied(snapshot, houseSlug, iso));
}

export function freeHouses(
	snapshot: AvailabilitySnapshot,
	checkIn: string,
	checkOut: string
): LodgifyHouseSlug[] {
	return LODGIFY_HOUSE_SLUGS.filter((slug) => !stayIsOccupied(snapshot, slug, checkIn, checkOut));
}
