import type React from 'react';
import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';

import { MENU_ANIMATION_DURATION } from '@/config/constants';
import { useActiveSection } from '@/hooks/useActiveSection';

type MenuLinkItemProps = {
  label: string;
  href: string;
  index: number;
  onClick: () => void; // <- ferme le menu (FullScreenMenu reçoit onClose)
};

// Helpers
const isHash = (s: string) => s.startsWith('#');
const isExternal = (s: string) => /^https?:\/\//i.test(s);
const isInternalPath = (s: string) => s.startsWith('/') && !s.startsWith('//');

export default function MenuLinkItem({ label, href, index, onClick }: MenuLinkItemProps) {
  const prefersReduced = useReducedMotion();
  const { pathname } = useLocation();
  const activeSection = useActiveSection(['hero', 'offers', 'services', 'concept', 'contact']);

  const [first, ...rest] = label.split(' ');
  const last = rest.join(' ');

  // Vérifie si ce lien correspond à la section active
  const isActive = isHash(href) && href === `#${activeSection}`;

  // Classes communes pour tous les liens (scale géré par Framer Motion)
  const linkClasses =
    'flex items-baseline uppercase transition-all duration-200 ease-out hover:text-orange focus-visible:text-orange focus-ring';

  // Smooth scroll vers l’ancre si on est déjà sur la Home
  const handleHashClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isHash(href)) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      // 1) Ferme le menu
      onClick();
      // 2) Scroll après l’animation de fermeture pour éviter le jank
      const delay = prefersReduced ? 0 : MENU_ANIMATION_DURATION;
      window.setTimeout(() => {
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        // Optionnel: corriger un offset top (ex. navbar) :
        // window.scrollBy({ top: -24, behavior: 'auto' });
      }, delay);
    },
    [href, onClick, prefersReduced],
  );

  const content = (
    <>
      <span className={`mr-4 text-body sm:text-title-sm font-thin ${isActive ? 'text-orange' : ''}`}>
        {index + 1}.
      </span>
      <span className="flex flex-wrap gap-x-1 text-title-md sm:text-title-lg">
        <span className={`font-thin ${isActive ? 'text-orange' : ''}`}>{first}</span>
        {last && <span className={`font-extrabold ${isActive ? 'text-orange' : ''}`}>{last}</span>}
      </span>
      {isActive && (
        <span className="ml-2 text-orange" aria-hidden="true">
          •
        </span>
      )}
    </>
  );

  // 1) Lien externe (Calendly)
  if (isExternal(href)) {
    return (
      <m.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={linkClasses}
        whileHover={{ scale: prefersReduced ? 1 : 1.1 }}
        whileFocus={{ scale: prefersReduced ? 1 : 1.1 }}
      >
        {content}
      </m.a>
    );
  }

  // 2) Ancre interne
  if (isHash(href)) {
    // Si déjà sur la Home → smooth scroll
    if (pathname === '/') {
      return (
        <m.a
          href={href}
          onClick={handleHashClick}
          className={linkClasses}
          whileHover={{ scale: prefersReduced ? 1 : 1.1 }}
          whileFocus={{ scale: prefersReduced ? 1 : 1.1 }}
        >
          {content}
        </m.a>
      );
    }
    // Sinon, on route vers "/" + hash (le scroll natif s’appliquera)
    return (
      <m.div
        whileHover={{ scale: prefersReduced ? 1 : 1.1 }}
        whileFocus={{ scale: prefersReduced ? 1 : 1.1 }}
      >
        <Link to={{ pathname: '/', hash: href }} onClick={onClick} className={linkClasses}>
          {content}
        </Link>
      </m.div>
    );
  }

  // 3) Route interne (au cas où tu en ajoutes plus tard)
  if (isInternalPath(href)) {
    return (
      <m.div
        whileHover={{ scale: prefersReduced ? 1 : 1.1 }}
        whileFocus={{ scale: prefersReduced ? 1 : 1.1 }}
      >
        <Link to={href} onClick={onClick} className={linkClasses}>
          {content}
        </Link>
      </m.div>
    );
  }

  // Fallback (devrait être inutile)
  return (
    <m.a
      href={href}
      onClick={onClick}
      className={linkClasses}
      whileHover={{ scale: prefersReduced ? 1 : 1.1 }}
    >
      {content}
    </m.a>
  );
}
