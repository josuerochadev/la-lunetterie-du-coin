// src/lib/cn.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn (className utility)', () => {
  it('should merge simple class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
  });

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'visible')).toBe('base visible');
  });

  it('should handle empty strings', () => {
    expect(cn('', 'class1', '', 'class2')).toBe('class1 class2');
  });

  it('should handle Tailwind class conflicts', () => {
    // Test que tailwind-merge résout les conflits
    expect(cn('p-4', 'p-2')).toBe('p-2'); // Le dernier padding gagne
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle complex object syntax', () => {
    expect(cn({
      'base-class': true,
      'conditional-class': false,
      'active': true
    })).toBe('base-class active');
  });

  it('should handle mixed array and string inputs', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });
});