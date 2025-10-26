// src/a11y/MotionProvider.tsx
import type React from 'react';
import { useEffect } from 'react';

import { MotionContext } from './MotionContext';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const prm = usePrefersReducedMotion();

  useEffect(() => {
    document.documentElement.setAttribute('data-prm', prm ? 'reduce' : 'no-preference');
  }, [prm]);

  return <MotionContext.Provider value={prm}>{children}</MotionContext.Provider>;
}
