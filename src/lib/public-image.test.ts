import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/paths', () => ({
  asset: (path: string) => `/anticobagliosiciliano${path}`
}));

vi.mock('$lib/standard/network-tier', async () => {
  const actual = await vi.importActual<typeof import('$lib/standard/network-tier')>(
    '$lib/standard/network-tier'
  );
  return {
    ...actual,
    getMediaTier: () => 'full' as const
  };
});

import { imageAsset, publicImage, responsiveImage } from './public-image';

describe('publicImage', () => {
  it('keeps originals in development', () => {
    expect(publicImage('/images/houses/casa-1/00.jpg', false)).toBe(
      '/images/houses/casa-1/00.jpg'
    );
    expect(publicImage('/images/awards/traveller-review.png')).toBe(
      '/images/awards/traveller-review.png'
    );
  });

  it('rewrites JPEG and PNG to WebP in production (full tier)', () => {
    expect(publicImage('/images/houses/casa-1/00.jpg', true)).toBe(
      '/images/houses/casa-1/00.webp'
    );
    expect(publicImage('/images/patio.jpeg', true)).toBe('/images/patio.webp');
    expect(publicImage('/images/awards/traveller-review.PNG', true)).toBe(
      '/images/awards/traveller-review.webp'
    );
    expect(publicImage('/images/mappa.webp', true)).toBe('/images/mappa.webp');
  });

  it('rewrites to -light.webp for light tier in production', () => {
    expect(publicImage('/images/ambiance/cortile.jpg', true, 'light')).toBe(
      '/images/ambiance/cortile-light.webp'
    );
    expect(publicImage('/videos/baglio-movie-end.jpg', true, 'light')).toBe(
      '/videos/baglio-movie-end-light.webp'
    );
  });
});

describe('imageAsset', () => {
  it('prefixes the site base in development', () => {
    expect(imageAsset('/images/houses/casa-1/00.jpg')).toBe(
      '/anticobagliosiciliano/images/houses/casa-1/00.jpg'
    );
  });
});

describe('responsiveImage', () => {
  it('uses committed originals in development regardless of tier', () => {
    expect(responsiveImage('/images/ambiance/cortile.jpg', { tier: 'light' })).toBe(
      '/anticobagliosiciliano/images/ambiance/cortile.jpg'
    );
  });
});
