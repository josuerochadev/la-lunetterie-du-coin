import { useState, useEffect } from 'react';

/**
 * Detects the navbar theme and footer visibility using IntersectionObserver.
 *
 * Observes elements with `[data-navbar-theme]`, `[data-navbar-theme-dynamic]`,
 * and `#footer` within a thin band at the top of the viewport.
 * Re-observes on route change (pathname) and window resize.
 *
 * @param pathname - Current route pathname, used to re-observe after navigation.
 * @returns `{ theme, hiddenByFooter }` — theme is `'dark'` or `'light'`,
 *   hiddenByFooter is `true` when the footer enters the detection band.
 */
export function useNavbarTheme(pathname: string) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [hiddenByFooter, setHiddenByFooter] = useState(false);

  useEffect(() => {
    const BAND_TOP = 40;
    const BAND_BOTTOM = 80;

    const intersecting = new Set<Element>();

    const resolveTheme = () => {
      // Check if footer is in the detection band
      for (const el of intersecting) {
        if (el.closest('#footer')) {
          setHiddenByFooter(true);
          return;
        }
      }
      setHiddenByFooter(false);

      // Collect themed elements with their current attribute value
      const themed: { el: Element; theme: string }[] = [];
      for (const el of intersecting) {
        const t = (el as HTMLElement).dataset.navbarTheme;
        if (t) themed.push({ el, theme: t });
      }

      if (themed.length === 0) {
        setTheme('dark');
        return;
      }

      // Last in document order = visually on top (StickySection z-index pattern)
      // Descendants also come after their ancestors, so nested overrides win.
      themed.sort((a, b) => {
        const pos = a.el.compareDocumentPosition(b.el);
        return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });

      setTheme(themed[themed.length - 1].theme === 'light' ? 'light' : 'dark');
    };

    const createObserver = () => {
      const bottomMargin = Math.max(0, window.innerHeight - BAND_BOTTOM);
      return new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) intersecting.add(entry.target);
            else intersecting.delete(entry.target);
          }
          resolveTheme();
        },
        { rootMargin: `-${BAND_TOP}px 0px -${bottomMargin}px 0px` },
      );
    };

    let observer = createObserver();

    const observeAll = () => {
      observer.disconnect();
      intersecting.clear();
      observer = createObserver();
      document
        .querySelectorAll('[data-navbar-theme], [data-navbar-theme-dynamic], #footer')
        .forEach((el) => {
          observer.observe(el);
        });
    };

    // Small delay to ensure DOM is ready after route change
    const timer = setTimeout(observeAll, 50);

    // Re-read attributes on scroll (handles dynamic data-navbar-theme changes)
    window.addEventListener('scroll', resolveTheme, { passive: true });

    // Recreate observer on resize (rootMargin depends on viewport height)
    const onResize = () => observeAll();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('scroll', resolveTheme);
      window.removeEventListener('resize', onResize);
    };
  }, [pathname]);

  return { theme, hiddenByFooter };
}
