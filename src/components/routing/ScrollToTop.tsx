// src/components/routing/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useMotionPreference } from '@/a11y/useMotionPreference';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prm = useMotionPreference();

  // biome-ignore lint/correctness/useExhaustiveDependencies: PRM + route change suffisent ici
  useEffect(() => {
    // Si navigation vers une ancre (#...), scroller vers l'élément ciblé
    if (hash) {
      // Retirer le # pour obtenir l'ID
      const id = hash.replace('#', '');

      // Fonction pour trouver et scroller vers l'élément
      const scrollToElement = () => {
        const element = document.getElementById(id);

        if (element) {
          // Utiliser requestAnimationFrame pour s'assurer que le DOM est prêt
          requestAnimationFrame(() => {
            element.scrollIntoView({
              behavior: prm ? 'auto' : 'smooth',
              block: 'start',
            });
          });
          return true;
        }
        return false;
      };

      // Essayer immédiatement
      if (!scrollToElement()) {
        // Si l'élément n'existe pas encore, réessayer avec des délais progressifs
        // pour gérer le lazy loading
        const timeouts = [100, 300, 600];
        timeouts.forEach((delay) => {
          setTimeout(() => {
            if (scrollToElement()) {
              return;
            }
          }, delay);
        });
      }
      return;
    }

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
