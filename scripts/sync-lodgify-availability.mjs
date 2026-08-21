#!/usr/bin/env node
/**
 * Pull Lodgify occupancy and write src/lib/data/occupancy.json.
 * Fail closed: on error, leave the last good file alone.
 *
 *   LODGIFY_API_KEY=… npm run lodgify:sync
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { root } from './register-lib.mjs';

const lodgify = await import(pathToFileURL(path.join(root, 'src/lib/data/lodgify.ts')).href);

const key = process.env.LODGIFY_API_KEY;
if (!key) {
	throw new Error('lodgify:sync: set LODGIFY_API_KEY in the environment.');
}

const outPath = path.join(root, lodgify.OCCUPANCY_JSON);

async function lodgifyGet(urlPath) {
	const response = await fetch(`https://api.lodgify.com${urlPath}`, {
		headers: { 'X-ApiKey': key, Accept: 'application/json' },
		signal: AbortSignal.timeout(30_000)
	});
	const text = await response.text();
	if (!response.ok) {
		throw new Error(`lodgify:sync: HTTP ${response.status} ${urlPath}: ${text.slice(0, 400)}`);
	}
	return JSON.parse(text);
}

const from = lodgify.calendarDateInZone();
const to = lodgify.addUtcMonths(from, lodgify.LODGIFY_HORIZON_MONTHS);
const urlPath = `/v2/availability/${lodgify.LODGIFY_PROPERTY_ID}?start=${from}T00:00:00Z&end=${to}T23:59:59Z`;

let payload;
try {
	payload = await lodgifyGet(urlPath);
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}

let snapshot;
try {
	snapshot = lodgify.snapshotFromLodgifyAvailability(payload, {
		generatedAt: new Date().toISOString(),
		from,
		to
	});
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}

const nextBody = lodgify.stringifyAvailabilitySnapshot(snapshot);
let occupancyChanged = true;
if (existsSync(outPath)) {
	try {
		const previous = JSON.parse(readFileSync(outPath, 'utf8'));
		const window = { from, to };
		occupancyChanged =
			lodgify.occupancyFingerprint(previous, window) !==
			lodgify.occupancyFingerprint(snapshot, window);
	} catch {
		occupancyChanged = true;
	}
}

const counts = lodgify.LODGIFY_HOUSE_SLUGS.map(
	(slug) => `${slug}:${snapshot.houses[slug].length}`
).join(' ');

if (!occupancyChanged) {
	console.log(
		`invariato ${path.relative(root, outPath)}  ${from}→${to}  ${counts}  occupancy unchanged`
	);
	process.exit(0);
}

writeFileSync(outPath, nextBody);
console.log(
	`scritto ${path.relative(root, outPath)}  ${from}→${to}  ${counts}  occupancy changed`
);
