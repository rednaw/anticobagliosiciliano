import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
	asset: (path: string) => `/anticobagliosiciliano${path}`
}));

import { imageAsset, publicImage } from './public-image';

describe('publicImage', () => {
	it('keeps originals in development', () => {
		expect(publicImage('/images/houses/casa-1/00.jpg', false)).toBe(
			'/images/houses/casa-1/00.jpg'
		);
		expect(publicImage('/images/awards/traveller-review.png')).toBe(
			'/images/awards/traveller-review.png'
		);
	});

	it('rewrites JPEG and PNG to WebP in production', () => {
		expect(publicImage('/images/houses/casa-1/00.jpg', true)).toBe(
			'/images/houses/casa-1/00.webp'
		);
		expect(publicImage('/images/patio.jpeg', true)).toBe('/images/patio.webp');
		expect(publicImage('/images/awards/traveller-review.PNG', true)).toBe(
			'/images/awards/traveller-review.webp'
		);
		expect(publicImage('/images/mappa.webp', true)).toBe('/images/mappa.webp');
	});

	it('leaves the Open Graph share card as JPEG', () => {
		expect(publicImage('/images/og-share.jpg', true)).toBe('/images/og-share.jpg');
		expect(publicImage('/images/og-share.jpeg', true)).toBe('/images/og-share.jpeg');
	});
});

describe('imageAsset', () => {
	it('prefixes the site base in development', () => {
		expect(imageAsset('/images/houses/casa-1/00.jpg')).toBe(
			'/anticobagliosiciliano/images/houses/casa-1/00.jpg'
		);
	});
});
