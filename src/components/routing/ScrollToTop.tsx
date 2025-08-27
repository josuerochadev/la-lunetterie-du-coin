// src/components/routing/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useMotionPreference } from '@/a11y/useMotionPreference';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prm = useMotionPreference();

  // biome-ignore lint/correctness/useExhaustiveDependencies: PRM + route change suffisent ici
  useEffect(() => {
    // Si navigation vers une ancre (#...), ne pas forcer le scroll top ni le focus main
    if (hash) return;

    // Focus sur <main> sans provoquer de scroll
    const main =
      (document.getElementById('main') as HTMLElement | null) ??
      (document.querySelector('main') as HTMLElement | null);
    main?.focus?.({ preventScroll: true });

    // Respect PRM : pas de smooth scroll si l'utilisateur réduit les animations
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prm ? 'auto' : 'smooth',
    });
  }, [pathname, hash, prm]);

  return null;
}
