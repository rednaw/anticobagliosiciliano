/** Client-side site gate (obscurity only — not real auth). */
export const GATE_STORAGE_KEY = 'abs-site-access';
export const GATE_STORAGE_VALUE = 'ok';
export const SITE_PASSWORD = 'cassatelle';

export function isUnlocked(): boolean {
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
