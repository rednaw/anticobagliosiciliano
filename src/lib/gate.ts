/** Client-side site gate (obscurity only — not real auth). */
export const GATE_STORAGE_KEY = 'abs-site-access';
export const GATE_STORAGE_VALUE = 'ok';
export const SITE_PASSWORD = 'cassatelle';

/** In dev, `?gate` shows the gate even if already unlocked. */
function gateForced(): boolean {
	try {
		return new URLSearchParams(location.search).has('gate');
	} catch {
		return false;
	}
}

export function isUnlocked(): boolean {
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
		/* private mode: unlock is in-memory only */
	}
	if (typeof document !== 'undefined') {
		document.documentElement.setAttribute('data-access', 'ok');
	}
}

export function checkPassword(input: string): boolean {
	return input.trim() === SITE_PASSWORD;
}
