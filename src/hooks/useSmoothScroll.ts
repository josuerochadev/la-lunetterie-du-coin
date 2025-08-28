import { useEffect } from 'react';

/**
 * Hook React ultra-léger pour mobile - plus de smooth scroll lourd
 *
 * Sur mobile, le smooth scroll natif est suffisant et plus performant
 * Lenis est désactivé pour éviter les 76kB de JS inutilisé
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Skip smooth scroll if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Skip Lenis on mobile - use native smooth scroll instead
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      // Enable native smooth scrolling only
      document.documentElement.style.scrollBehavior = 'smooth';
      return () => {
        document.documentElement.style.scrollBehavior = '';
      };
    }

    // For desktop, we can lazy load Lenis if needed
    let cleanup: (() => void) | undefined;

    const initLenis = async () => {
      try {
        const Lenis = (await import('@studio-freight/lenis')).default;

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

        const raf = (time: number) => {
          lenis.raf(time);
          animationFrame = requestAnimationFrame(raf);
        };

        animationFrame = requestAnimationFrame(raf);

        cleanup = () => {
          cancelAnimationFrame(animationFrame);
          lenis.destroy();
        };
      } catch (error) {
        console.warn('Failed to load Lenis:', error);
      }
    };

    // Initialize after a delay to not block initial render
    const timeoutId = setTimeout(initLenis, 1000);

    return () => {
      clearTimeout(timeoutId);
      cleanup?.();
    };
  }, []);
}
