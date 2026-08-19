/** @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { dismissable } from './dismiss';

function mountAnchor() {
	const anchor = document.createElement('div');
	const inside = document.createElement('button');
	inside.textContent = 'inside';
	anchor.append(inside);
	const outside = document.createElement('button');
	outside.textContent = 'outside';
	document.body.append(anchor, outside);
	return { anchor, inside, outside };
}

describe('dismissable', () => {
	afterEach(() => {
		document.body.innerHTML = '';
		vi.useRealTimers();
	});

	it('closes on an outside pointerdown without restoring focus', () => {
		const { anchor, inside, outside } = mountAnchor();
		const close = vi.fn();
		const stop = dismissable(anchor, close);

		inside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
		expect(close).not.toHaveBeenCalled();

		outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
		expect(close).toHaveBeenCalledOnce();
		expect(close).toHaveBeenCalledWith(false);
		stop();
	});

	it('closes on Escape and restores focus', () => {
		const { anchor } = mountAnchor();
		const close = vi.fn();
		const stop = dismissable(anchor, close);

		const other = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
		document.dispatchEvent(other);
		expect(close).not.toHaveBeenCalled();
		expect(other.defaultPrevented).toBe(false);

		const escape = new KeyboardEvent('keydown', {
			key: 'Escape',
			bubbles: true,
			cancelable: true
		});
		document.dispatchEvent(escape);
		expect(escape.defaultPrevented).toBe(true);
		expect(close).toHaveBeenCalledOnce();
		expect(close).toHaveBeenCalledWith(true);
		stop();
	});

	it('closes when focus leaves the anchor, not when it moves inside', () => {
		vi.useFakeTimers();
		const { anchor, inside, outside } = mountAnchor();
		const inside2 = document.createElement('button');
		inside2.textContent = 'also inside';
		anchor.append(inside2);
		const close = vi.fn();
		const stop = dismissable(anchor, close);

		inside.focus();
		inside2.focus();
		vi.runAllTimers();
		expect(close).not.toHaveBeenCalled();

		outside.focus();
		vi.runAllTimers();
		expect(close).toHaveBeenCalledOnce();
		expect(close).toHaveBeenCalledWith(false);
		stop();
	});

	it('drops listeners after teardown', () => {
		const { anchor, outside } = mountAnchor();
		const close = vi.fn();
		const stop = dismissable(anchor, close);
		stop();

		outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
		document.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
		);
		expect(close).not.toHaveBeenCalled();
	});
});
