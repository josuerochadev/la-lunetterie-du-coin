import type React from 'react';
import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';

import { MENU_ANIMATION_DURATION } from '@/config/constants';
import { useActiveSection } from '@/hooks/useActiveSection';

type MenuLinkItemProps = {
  label: string;
  href: string;
  onClick: () => void;
  featured?: boolean; // Lien mis en avant (ex: "Prendre rendez-vous")
};

// Helpers
const isHash = (s: string) => s.startsWith('#');
const isExternal = (s: string) => /^https?:\/\//i.test(s);
const isInternalPath = (s: string) => s.startsWith('/') && !s.startsWith('//');

/**
 * Composant MenuLinkItem
 *
 * Lien de navigation dans le menu plein écran.
 * Design éditorial minimaliste sans numérotation, hover subtil avec soulignement.
 *
 * @param label - Texte du lien
 * @param href - URL de destination
 * @param onClick - Callback pour fermer le menu
 * @param featured - Si true, affiche le lien comme CTA principal (bouton orange)
 */
export default function MenuLinkItem({
  label,
  href,
  onClick,
  featured = false,
}: MenuLinkItemProps) {
  const prefersReduced = useReducedMotion();
  const { pathname } = useLocation();
  const activeSection = useActiveSection(['hero', 'offers', 'services', 'concept', 'contact']);

  // Vérifie si ce lien correspond à la section active
  const isActive = isHash(href) && href === `#${activeSection}`;

  // Classes pour les liens normaux
  const linkClasses = featured
    ? 'button-primary inline-block text-center' // CTA style bouton
    : 'group relative inline-block text-title-sm font-medium transition-colors duration-200 hover:text-orange focus-visible:text-orange focus-ring';

  // Indicateur actif
  const activeIndicator = isActive && !featured && (
    <span className="ml-2 text-orange" aria-hidden="true">
      •
    </span>
  );

  // Underline au hover pour les liens normaux
  const hoverUnderline = !featured && (
    <span
      className="absolute bottom-0 left-0 h-[1px] w-0 bg-orange transition-all duration-200 group-hover:w-full"
      aria-hidden="true"
    />
  );

  // Smooth scroll vers l'ancre si on est déjà sur la Home
  const handleHashClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isHash(href)) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      onClick();
      const delay = prefersReduced ? 0 : MENU_ANIMATION_DURATION;
      window.setTimeout(() => {
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      }, delay);
    },
    [href, onClick, prefersReduced],
  );

  const content = (
    <>
      <span className={isActive && !featured ? 'text-orange' : ''}>{label}</span>
      {activeIndicator}
      {hoverUnderline}
    </>
  );

  // 1) Lien externe (Calendly)
  if (isExternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={linkClasses}
      >
        {content}
      </a>
    );
  }

  // 2) Ancre interne
  if (isHash(href)) {
    if (pathname === '/') {
      return (
        <a href={href} onClick={handleHashClick} className={linkClasses}>
          {content}
        </a>
      );
    }
    return (
      <Link to={{ pathname: '/', hash: href }} onClick={onClick} className={linkClasses}>
        {content}
      </Link>
    );
  }

  // 3) Route interne
  if (isInternalPath(href)) {
    return (
      <Link to={href} onClick={onClick} className={linkClasses}>
        {content}
      </Link>
    );
  }

  // Fallback
  return (
    <a href={href} onClick={onClick} className={linkClasses}>
      {content}
    </a>
  );
}
