/** Client-side site gate (obscurity only — not real auth). */
export const GATE_STORAGE_KEY = 'abs-site-access';
export const GATE_STORAGE_VALUE = 'ok';
export const SITE_PASSWORD = 'cassatelle';

/** `?gate=1` puts the gate back in dev, so it can be exercised before deploying. */
function gateForced(): boolean {
	try {
		return new URLSearchParams(location.search).has('gate');
	} catch {
		return false;
	}
}

export function isUnlocked(): boolean {
	// The gate keeps the public deploy out of sight; on localhost it only costs a prompt.
	// `?gate=1` shows it anyway, ignoring any stored unlock, so it can still be tested.
	if (import.meta.env.DEV) return !gateForced();
	try {
		return localStorage.getItem(GATE_STORAGE_KEY) === GATE_STORAGE_VALUE;
	} catch {
		return false;
	}
}

export function unlock(): void {
	try {
		localStorage.setItem(GATE_STORAGE_KEY, GATE_STORAGE_VALUE);
	} catch {
		/* private mode / blocked storage — session-only unlock still works in memory */
	}
	if (typeof document !== 'undefined') {
		document.documentElement.setAttribute('data-access', 'ok');
	}
}

export function checkPassword(input: string): boolean {
	return input.trim() === SITE_PASSWORD;
}
