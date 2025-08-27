// src/a11y/MotionProvider.tsx
import type React from 'react';
import { useEffect } from 'react';

import { MotionCtx } from './MotionContext';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const prm = usePrefersReducedMotion();

  useEffect(() => {
    document.documentElement.setAttribute('data-prm', prm ? 'reduce' : 'no-preference');
  }, [prm]);

  return <MotionCtx.Provider value={prm}>{children}</MotionCtx.Provider>;
}
