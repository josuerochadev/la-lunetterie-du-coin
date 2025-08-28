// src/hooks/useNativeScroll.ts
import { useEffect } from 'react';

/**
 * Hook ultra-léger pour smooth scroll natif
 * 
 * Remplace Lenis par du CSS scroll-behavior natif
 * 0kB de JavaScript - 100% CSS natif !
 */
export function useNativeScroll() {
  useEffect(() => {
    // Respecter les préférences utilisateur
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Activer le smooth scroll CSS natif
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Optionnel: Améliorer l'expérience avec scroll-padding
    document.documentElement.style.scrollPaddingTop = '2rem';

    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.documentElement.style.scrollPaddingTop = '';
    };
  }, []);
}

/**
 * Utilitaire pour smooth scroll vers un élément
 */
export function scrollToElement(elementId: string, offset: number = 0) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.offsetTop - offset;
  
  // Utiliser scrollTo avec behavior smooth natif
  window.scrollTo({
    top: elementPosition,
    behavior: 'smooth'
  });
}

/**
 * Utilitaire pour smooth scroll vers le top
 */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}