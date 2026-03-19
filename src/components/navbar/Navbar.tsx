import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import LogoSymboleNoir from '@/assets/logo/Logo_LLDC_Symbole_Noir.svg?react';
import LogoSymboleJaune from '@/assets/logo/Logo_LLDC_Symbole_Jaune.svg?react';
import FullScreenMenu from '@/components/navbar/FullScreenMenu';
import { MENU_ANIMATION_DURATION, CALENDLY_URL } from '@/config/menu';
import { cn } from '@/lib/cn';

interface NavbarProps {
  /** Controls navbar visibility — used for splash/hero choreography. Default true. */
  revealed?: boolean;
}

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

const Navbar: React.FC<NavbarProps> = ({ revealed = true }) => {
  const [menuActive, setMenuActive] = useState(false);
  const [menuRendered, setMenuRendered] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [inSplashZone, setInSplashZone] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [scrollingUp, setScrollingUp] = useState(false);
  const lastScrollY = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  const isLight = theme === 'light';

  // Hide navbar when user scrolls back up into the splash zone (homepage only)
  useEffect(() => {
    if (location.pathname !== '/') {
      setInSplashZone(false);
      return;
    }

    const handleScroll = () => {
      const vh = window.innerHeight;
      // Splash zone = before the hero section starts (~0.85vh threshold)
      setInSplashZone(window.scrollY < vh * 0.85);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

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

  // Mobile: show navbar when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollingUp(currentY < lastScrollY.current && currentY > 0);
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isVisible = revealed && !inSplashZone && (hovered || scrollingUp || menuActive);

  // Detect navbar theme by sampling the element visually behind the navbar.
  // Uses elementFromPoint to handle sticky/z-index overlapping sections correctly.
  useEffect(() => {
    const detectTheme = () => {
      // Sample a point near the top center, behind the navbar
      const x = window.innerWidth / 2;
      const y = 60;

      // Temporarily hide the navbar so elementFromPoint hits the section behind it
      const header = document.querySelector('header');
      if (header) header.style.pointerEvents = 'none';

      const el = document.elementFromPoint(x, y);

      if (header) header.style.pointerEvents = '';

      if (!el) return;

      // Walk up to find the closest ancestor with data-navbar-theme
      const section = el.closest('[data-navbar-theme]');
      if (section) {
        const sectionTheme = (section as HTMLElement).dataset.navbarTheme;
        setTheme(sectionTheme === 'light' ? 'light' : 'dark');
      } else {
        setTheme('dark');
      }
    };

    detectTheme();
    window.addEventListener('scroll', detectTheme, { passive: true });
    return () => window.removeEventListener('scroll', detectTheme);
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
  const underlineColor = isLight ? 'bg-accent' : 'bg-black';
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
            aria-label="Accueil — La Lunetterie du Coin"
            className={cn(
              'rounded-full p-1.5 transition-transform duration-300 hover:scale-110',
              `focus-visible:outline-2 focus-visible:outline-offset-4 ${outlineColor}`,
            )}
          >
            <LogoSymbole className="h-9 w-auto sm:h-10 lg:h-12" aria-hidden="true" />
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
            href={CALENDLY_URL}
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
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover/nav:translate-x-1"
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
