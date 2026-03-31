// src/components/services/ServiceThumbnail.tsx
import type React from 'react';
import { useRef, useEffect } from 'react';
import clsx from 'clsx';

import Picture from '../common/Picture';

interface ServiceThumbnailProps {
  /** base path sans extension, ex: /illustrations/eyeframe */
  imageBase: string;
  title: string;
  isActive: boolean;
  index: number;
  totalCount: number;
  onClick: () => void;
  // eslint-disable-next-line no-unused-vars
  onNavigate: (index: number) => void;
}

/**
 * Composant React pour afficher une miniature de service sous forme de bouton accessible.
 *
 * @param {object} props - Les propriétés du composant.
 * @param {string} props.image - L'URL de l'image à afficher comme miniature.
 * @param {string} props.title - Le titre du service, utilisé pour l'accessibilité.
 * @param {boolean} props.isActive - Indique si la miniature est active (sélectionnée).
 * @param {number} props.index - L'index de la miniature, utilisé pour les attributs ARIA.
 * @param {() => void} props.onClick - Fonction appelée lors du clic sur la miniature.
 *
 * @returns {JSX.Element} Un bouton stylisé contenant l'image du service.
 */
export default function ServiceThumbnail({
  imageBase,
  title,
  isActive,
  index,
  totalCount,
  onClick,
  onNavigate,
}: ServiceThumbnailProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isActive && buttonRef.current && document.activeElement?.role === 'tab') {
      buttonRef.current.focus();
    }
  }, [isActive]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % totalCount;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + totalCount) % totalCount;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = totalCount - 1;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      onNavigate(nextIndex);
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      id={`tab-${index}`}
      aria-controls={`tabpanel-${index}`}
      aria-label={`Voir ${title}`}
      aria-selected={isActive ? 'true' : 'false'}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        'focus-style cursor-pointer transition-all duration-300 hover:scale-105',
        isActive ? 'scale-110 opacity-100' : 'opacity-70 hover:opacity-90',
      )}
    >
      <div className="relative h-24 w-24">
        <Picture
          srcBase={imageBase}
          alt={title}
          sizes="96px"
          className={clsx(
            'h-24 w-24 object-contain transition-all duration-300',
            isActive ? 'brightness-110' : 'brightness-95 hover:brightness-105',
          )}
        />
      </div>
    </button>
  );
}
