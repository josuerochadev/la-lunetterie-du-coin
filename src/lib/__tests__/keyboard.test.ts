import { describe, it, expect } from 'vitest';
import type React from 'react';

import { isToggleKey } from '@/lib/keyboard';

function createKeyEvent(key: string): React.KeyboardEvent {
  return { key } as React.KeyboardEvent;
}

describe('isToggleKey', () => {
  it('returns true for Enter key', () => {
    expect(isToggleKey(createKeyEvent('Enter'))).toBe(true);
  });

  it('returns true for Space key', () => {
    expect(isToggleKey(createKeyEvent(' '))).toBe(true);
  });

  it('returns false for Tab key', () => {
    expect(isToggleKey(createKeyEvent('Tab'))).toBe(false);
  });

  it('returns false for Escape key', () => {
    expect(isToggleKey(createKeyEvent('Escape'))).toBe(false);
  });

  it('returns false for letter keys', () => {
    expect(isToggleKey(createKeyEvent('a'))).toBe(false);
    expect(isToggleKey(createKeyEvent('z'))).toBe(false);
  });

  it('returns false for ArrowDown key', () => {
    expect(isToggleKey(createKeyEvent('ArrowDown'))).toBe(false);
  });
});
