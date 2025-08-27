// src/hooks/usePrefersReducedMotion.ts
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [prm, setPrm] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      setPrm((prev) => (prev !== e.matches ? e.matches : prev));
    };

    // Sync immédiat sans re-render inutile
    setPrm((prev) => (prev !== mq.matches ? mq.matches : prev));

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    if (typeof mq.addListener === 'function') {
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, []);

  return prm;
}
