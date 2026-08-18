/** Closes a popover on an outside click, Escape, or focus leaving the anchor. */
export function dismissable(anchor: HTMLElement, close: (restoreFocus: boolean) => void) {
	function onPointerDown(event: PointerEvent) {
		if (!anchor.contains(event.target as Node)) close(false);
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		event.preventDefault();
		close(true);
	}

	function onFocusOut() {
		queueMicrotask(() => {
			if (!anchor.contains(document.activeElement)) close(false);
		});
	}

	document.addEventListener('pointerdown', onPointerDown);
	document.addEventListener('keydown', onKeyDown);
	anchor.addEventListener('focusout', onFocusOut);

	return () => {
		document.removeEventListener('pointerdown', onPointerDown);
		document.removeEventListener('keydown', onKeyDown);
		anchor.removeEventListener('focusout', onFocusOut);
	};
}
