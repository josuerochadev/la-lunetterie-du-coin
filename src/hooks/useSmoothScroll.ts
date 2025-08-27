import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * Hook React optimisé pour un défilement fluide avec gestion intelligente des ressources.
 *
 * Ce hook initialise Lenis avec une gestion optimisée qui:
 * - Pause l'animation quand l'utilisateur n'interagit pas
 * - Respecte les préférences de mouvement réduit
 * - Réduit l'usage CPU/batterie sur mobile
 *
 * @example
 * useSmoothScroll();
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Skip smooth scroll if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1,
      easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
      wheelMultiplier: 1.15,
      touchMultiplier: 1.2,
      smoothWheel: true,
      gestureOrientation: 'vertical',
      infinite: false,
    });

    let animationFrame: number;
    let isIdle = false;
    let idleTimeout: ReturnType<typeof setTimeout>;

    // Performance-optimized RAF loop with idle detection
    const raf = (time: number) => {
      if (!isIdle) {
        lenis.raf(time);
        animationFrame = requestAnimationFrame(raf);
      }
    };

    // Start animation loop
    animationFrame = requestAnimationFrame(raf);

    // Idle detection to pause animation when not scrolling
    const handleScroll = () => {
      clearTimeout(idleTimeout);
      
      // Resume animation if idle
      if (isIdle) {
        isIdle = false;
        animationFrame = requestAnimationFrame(raf);
      }
      
      // Set idle timeout
      idleTimeout = setTimeout(() => {
        isIdle = true;
        cancelAnimationFrame(animationFrame);
      }, 150);
    };

    // Listen for scroll events to manage animation state
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    return () => {
      clearTimeout(idleTimeout);
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      lenis.destroy();
    };
  }, []);
}
