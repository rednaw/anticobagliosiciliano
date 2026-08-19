import { describe, expect, it } from 'vitest';
import { showAmbientControl } from './ambient-video';

describe('showAmbientControl', () => {
	const idle = { playing: false, reduceMotion: false, ended: false, playBlocked: false };

	it('hides while the video is playing', () => {
		expect(showAmbientControl({ ...idle, playing: true })).toBe(false);
		expect(
			showAmbientControl({ playing: true, reduceMotion: true, ended: true, playBlocked: true })
		).toBe(false);
	});

	it('hides when idle with nothing to recover from', () => {
		expect(showAmbientControl(idle)).toBe(false);
	});

	it('shows when autoplay or play() was blocked', () => {
		expect(showAmbientControl({ ...idle, playBlocked: true })).toBe(true);
	});

	it('shows for reduced motion and after the clip ends', () => {
		expect(showAmbientControl({ ...idle, reduceMotion: true })).toBe(true);
		expect(showAmbientControl({ ...idle, ended: true })).toBe(true);
	});
});
