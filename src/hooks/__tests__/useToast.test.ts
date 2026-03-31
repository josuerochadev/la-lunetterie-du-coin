import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import React from 'react';

import { useToast } from '../useToast';

import { ToastContext, type ToastContextValue } from '@/lib/toastContext';

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw when used outside provider', () => {
    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within ToastProvider');
  });

  it('should return context value when inside provider', () => {
    const mockToast = vi.fn();
    const mockContextValue: ToastContextValue = { toast: mockToast };

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastContext.Provider, { value: mockContextValue }, children);

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(result.current).toBe(mockContextValue);
    expect(result.current.toast).toBe(mockToast);
  });
});
