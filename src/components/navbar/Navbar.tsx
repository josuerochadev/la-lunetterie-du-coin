import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import LogoSymboleNoir from '@/assets/logo/Logo_LLDC_Symbole_Noir.svg?react';
import LogoSymboleJaune from '@/assets/logo/Logo_LLDC_Symbole_Jaune.svg?react';
import FullScreenMenu from '@/components/navbar/FullScreenMenu';
import { MENU_ANIMATION_DURATION } from '@/config/menu';
import { BOOKING_URL } from '@/config/endpoints';
import { cn } from '@/lib/cn';

/**
 * Composant Navbar — Barre horizontale complète
 *
 * Adapts colors based on `data-navbar-theme` attribute on sections:
 *   - data-navbar-theme="light" → light text/icons (for dark backgrounds)
 *   - default → dark text/icons (for light backgrounds)
 *
 * Uses IntersectionObserver to detect which section is at the top of the viewport.
 */
const HOVER_ZONE_HEIGHT = 80;

const Navbar: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [menuRendered, setMenuRendered] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [hovered, setHovered] = useState(false);
  const [hiddenByScroll, setHiddenByScroll] = useState(true);
  const [hiddenByFooter, setHiddenByFooter] = useState(false);
  const lastScrollY = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  const isLight = theme === 'light';

  // Auto-reveal navbar shortly after page load, then hide on scroll down
  useEffect(() => {
    const timer = setTimeout(() => setHiddenByScroll(false), 1500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 50) {
        setHiddenByScroll(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Desktop: show navbar when mouse enters top zone
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setHovered(e.clientY <= HOVER_ZONE_HEIGHT);
    };
    const handleMouseLeave = () => setHovered(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const isVisible = !hiddenByFooter && (!hiddenByScroll || hovered || menuActive);

  // Detect navbar theme via IntersectionObserver on a thin band at the top
  // of the viewport. Unlike elementFromPoint, IO detects elements regardless
  // of pointer-events, so decorative curves and overlays are properly handled.
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
  }, [location.pathname]);

  useEffect(() => {
    if (menuActive) {
      setMenuRendered(true);
    } else {
      const timeout = setTimeout(() => setMenuRendered(false), MENU_ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [menuActive]);

  function shouldBlockToggle(menuActive: boolean, menuRendered: boolean): boolean {
    return !menuActive && menuRendered;
  }

  const handleToggle = () => {
    if (shouldBlockToggle(menuActive, menuRendered)) return;
    setMenuActive(!menuActive);
  };

  const handleClose = () => {
    setMenuActive(false);
    buttonRef.current?.focus();
  };

  // Color classes based on theme
  const textColor = isLight ? 'text-accent' : 'text-black';
  const underlineColor = 'bg-secondary-orange';
  const outlineColor = isLight ? 'focus-visible:outline-accent' : 'focus-visible:outline-black';
  const LogoSymbole = isLight ? LogoSymboleJaune : LogoSymboleNoir;

  return (
    <>
      {/* Navbar horizontale — fixe en haut */}
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-navbar flex items-center px-4 pt-4 sm:px-6 sm:pt-6',
          'transition-all duration-500 ease-out',
          isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-5 opacity-0',
        )}
      >
        <nav
          className="flex w-full items-center justify-center gap-3 sm:gap-4"
          aria-label="Navigation principale"
        >
          {/* Logo symbole */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Accueil — La Lunetterie du Coin"
            className={cn(
              'rounded-full p-1.5 transition-transform duration-300 hover:scale-110',
              `focus-visible:outline-2 focus-visible:outline-offset-4 ${outlineColor}`,
            )}
          >
            <LogoSymbole className="h-6 w-auto sm:h-7 lg:h-8" aria-hidden="true" />
          </Link>

          {/* "Menu" — ouvre le FullScreenMenu */}
          <button
            ref={buttonRef}
            type="button"
            onClick={handleToggle}
            aria-label={menuActive ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuActive}
            aria-controls="main-menu"
            className={cn(
              'group/nav relative cursor-pointer text-body-sm font-normal transition-[font-weight] duration-300 hover:font-semibold',
              textColor,
              `focus-visible:outline-2 focus-visible:outline-offset-4 ${outlineColor}`,
            )}
          >
            {/* Invisible bold duplicate to reserve width and prevent layout shift */}
            <span className="invisible block h-0 font-semibold" aria-hidden="true">
              Menu
            </span>
            Menu
            <span
              className={cn(
                'absolute -bottom-0.5 left-0 h-[1.5px] w-0 transition-all duration-300 group-hover/nav:w-full',
                underlineColor,
              )}
              aria-hidden="true"
            />
          </button>

          {/* CTA Prendre RDV — text + arrow, same underline pattern */}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'group/nav relative hidden items-center gap-1.5 text-body-sm font-normal transition-[font-weight] duration-300 hover:font-semibold sm:inline-flex',
              textColor,
              `focus-visible:outline-2 focus-visible:outline-offset-4 ${outlineColor}`,
            )}
          >
            Prendre RDV
            <ArrowRight
              className="h-3.5 w-3.5 text-secondary-green transition-transform duration-300 group-hover/nav:translate-x-1"
              aria-hidden="true"
            />
            {/* Invisible bold duplicate to reserve width */}
            <span
              className="invisible absolute inset-0 flex items-center gap-1.5 font-semibold"
              aria-hidden="true"
            >
              <span>Prendre RDV</span>
              <span className="h-3.5 w-3.5 shrink-0" />
            </span>
            <span
              className={cn(
                'absolute -bottom-0.5 left-0 h-[1.5px] w-0 transition-all duration-300 group-hover/nav:w-full',
                underlineColor,
              )}
              aria-hidden="true"
            />
          </a>
        </nav>
      </header>

      {/* Menu plein écran */}
      {menuRendered && <FullScreenMenu isOpen={menuActive} onClose={handleClose} />}
    </>
  );
};

export default Navbar;
