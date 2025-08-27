// src/components/services/ServiceThumbnail.tsx
import clsx from 'clsx';

import Picture from '../common/Picture';

interface ServiceThumbnailProps {
  /** base path sans extension, ex: /illustrations/eyeframe */
  imageBase: string;
  title: string;
  isActive: boolean;
  index: number;
  onClick: () => void;
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
  onClick,
}: ServiceThumbnailProps) {
  return (
    <button
      type="button"
      role="tab"
      id={`tab-${index}`}
      aria-controls={`tabpanel-${index}`}
      aria-label={`Voir ${title}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={onClick}
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
