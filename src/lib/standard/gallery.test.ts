import { describe, expect, it } from 'vitest';
import { indexAfterKey, photoAlt, wrapIndex } from './gallery';

describe('wrapIndex', () => {
  it('wraps forward and backward', () => {
    expect(wrapIndex(4, 4)).toBe(0);
    expect(wrapIndex(-1, 4)).toBe(3);
    expect(wrapIndex(2, 4)).toBe(2);
    expect(wrapIndex(0, 0)).toBeNull();
  });
});

describe('indexAfterKey', () => {
  it('moves with arrows, Home, and End', () => {
    expect(indexAfterKey('ArrowLeft', 0, 12)).toBe(11);
    expect(indexAfterKey('ArrowRight', 11, 12)).toBe(0);
    expect(indexAfterKey('Home', 7, 12)).toBe(0);
    expect(indexAfterKey('End', 7, 12)).toBe(11);
    expect(indexAfterKey('ArrowUp', 7, 12)).toBeNull();
    expect(indexAfterKey('ArrowLeft', 0, 0)).toBeNull();
  });
});

describe('photoAlt', () => {
  it('numbers the photo in the page language', () => {
    expect(photoAlt('Casa 1', 1, 12, 'it')).toBe('Casa 1 — foto 2 di 12');
    expect(photoAlt('Casa 1', 1, 12, 'en')).toBe('Casa 1 — photo 2 of 12');
  });
});
