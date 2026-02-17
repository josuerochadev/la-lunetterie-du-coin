import type React from 'react';
import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';

import { MENU_ANIMATION_DURATION } from '@/config/menu';
import { useActiveSection } from '@/hooks/useActiveSection';

type MenuLinkItemProps = {
  label: string;
  href: string;
  onClick: () => void;
  featured?: boolean;
};

// Helpers
const isHash = (s: string) => s.startsWith('#');
const isExternal = (s: string) => /^https?:\/\//i.test(s);
const isInternalPath = (s: string) => s.startsWith('/') && !s.startsWith('//');

/**
 * Composant MenuLinkItem — Rebranding 2026
 *
 * Lien de navigation dans le menu plein écran.
 *
 * @param label - Texte du lien
 * @param href - URL de destination
 * @param onClick - Callback pour fermer le menu
 * @param featured - Si true, affiche le lien comme CTA principal
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

  const isActive = isHash(href) && href === `#${activeSection}`;

  const linkClasses = featured
    ? 'button-primary inline-block text-center'
    : 'group relative inline-block text-title-md font-medium transition-colors duration-200 hover:text-accent focus-visible:text-accent focus-ring';

  const activeIndicator = isActive && !featured && (
    <span className="ml-2 text-accent" aria-hidden="true">
      &bull;
    </span>
  );

  const hoverUnderline = !featured && (
    <span
      className="absolute bottom-0 left-0 h-[1px] w-0 bg-accent transition-all duration-200 group-hover:w-full"
      aria-hidden="true"
    />
  );

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
      <span className={isActive && !featured ? 'text-accent' : ''}>{label}</span>
      {activeIndicator}
      {hoverUnderline}
    </>
  );

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

  if (isInternalPath(href)) {
    return (
      <Link to={href} onClick={onClick} className={linkClasses}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} onClick={onClick} className={linkClasses}>
      {content}
    </a>
  );
}
