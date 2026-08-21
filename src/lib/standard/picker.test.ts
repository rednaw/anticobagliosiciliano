import { describe, expect, it } from 'vitest';
import { optionIndexAfterKey } from './picker';

describe('optionIndexAfterKey', () => {
  it('moves with arrows, Home, and End, wrapping at the ends', () => {
    expect(optionIndexAfterKey('ArrowDown', 0, 4)).toBe(1);
    expect(optionIndexAfterKey('ArrowDown', 3, 4)).toBe(0);
    expect(optionIndexAfterKey('ArrowUp', 0, 4)).toBe(3);
    expect(optionIndexAfterKey('Home', 2, 4)).toBe(0);
    expect(optionIndexAfterKey('End', 2, 4)).toBe(3);
    expect(optionIndexAfterKey('ArrowLeft', 2, 4)).toBeNull();
    expect(optionIndexAfterKey('ArrowDown', 0, 0)).toBeNull();
  });

  it('skips disabled options', () => {
    const disabled = (i: number) => i === 1 || i === 2;
    expect(optionIndexAfterKey('ArrowDown', 0, 4, disabled)).toBe(3);
    expect(optionIndexAfterKey('ArrowUp', 3, 4, disabled)).toBe(0);
    expect(optionIndexAfterKey('Home', 3, 4, disabled)).toBe(0);
    expect(optionIndexAfterKey('End', 0, 4, disabled)).toBe(3);
  });
});
