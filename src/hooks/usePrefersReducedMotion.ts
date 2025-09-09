// src/hooks/usePrefersReducedMotion.ts
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [prm, setPrm] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return false;

    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;

    let mq: MediaQueryList;
    try {
      mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    } catch {
      return;
    }

    const handler = (e: MediaQueryListEvent | MediaQueryList | null) => {
      const matches = e?.matches ?? false;
      setPrm((prev) => (prev !== matches ? matches : prev));
    };

    // Sync immédiat sans re-render inutile
    setPrm((prev) => (prev !== mq.matches ? mq.matches : prev));

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    if (typeof mq.addListener === 'function') {
      mq.addListener(handler);
      return () => {
        if (typeof mq.removeListener === 'function') {
          mq.removeListener(handler);
        }
      };
    }
  }, []);

  return prm;
}
