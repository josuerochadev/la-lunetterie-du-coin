import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import LogoSymboleNoir from '@/assets/logo/Logo_LLDC_Symbole_Noir.svg?react';
import LogoSymboleJaune from '@/assets/logo/Logo_LLDC_Symbole_Jaune.svg?react';
import FullScreenMenu from '@/components/navbar/FullScreenMenu';
import { MENU_ANIMATION_DURATION } from '@/config/menu';
import { BOOKING_URL } from '@/config/endpoints';
import { TIMING } from '@/config/design';
import { useNavbarTheme } from '@/hooks/useNavbarTheme';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
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
const HOVER_ZONE_HEIGHT_PX = 80;

const Navbar: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [menuRendered, setMenuRendered] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hiddenByScroll, setHiddenByScroll] = useState(true);
  const lastScrollY = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const { theme, hiddenByFooter } = useNavbarTheme(location.pathname);
  const prefersReducedMotion = usePrefersReducedMotion();

  const isLight = theme === 'light';

  // Auto-reveal navbar shortly after page load, then hide on scroll down
  useEffect(() => {
    const timer = setTimeout(() => setHiddenByScroll(false), TIMING.navbarReshow);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 50) {
        setHiddenByScroll(true);
      } else if (currentY < lastScrollY.current) {
        setHiddenByScroll(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Desktop: show navbar when mouse enters top zone (RAF-throttled)
  useEffect(() => {
    let rafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setHovered(e.clientY <= HOVER_ZONE_HEIGHT_PX);
      });
    };
    const handleMouseLeave = () => setHovered(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const isVisible = !hiddenByFooter && (!hiddenByScroll || hovered || menuActive);

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
          'fixed left-0 right-0 top-0 z-navbar flex items-center px-4 pt-4 sm:px-6 sm:pt-6 print:hidden',
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
            onClick={() =>
              window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
            }
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

          {/* CTA Prendre RDV — lien externe vers Calendly */}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Prendre rendez-vous (s'ouvre dans un nouvel onglet)"
            className={cn(
              'group/nav relative inline-flex items-center gap-1.5 text-body-sm font-normal transition-[font-weight] duration-300 hover:font-semibold',
              textColor,
              `focus-visible:outline-2 focus-visible:outline-offset-4 ${outlineColor}`,
            )}
          >
            Prendre RDV
            <ExternalLink
              className="h-3 w-3 text-secondary-orange transition-transform duration-300 group-hover/nav:translate-x-0.5"
              aria-hidden="true"
            />
            {/* Invisible bold duplicate to reserve width */}
            <span
              className="invisible absolute inset-0 flex items-center gap-1.5 font-semibold"
              aria-hidden="true"
            >
              <span>Prendre RDV</span>
              <span className="h-3 w-3 shrink-0" />
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
