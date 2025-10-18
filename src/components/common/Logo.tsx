import type React from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

import LogoSvg from '@/assets/logo/logo-eye.svg?react';

type LogoProps = {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showWordmark?: boolean;
};

/**
 * Composant Logo
 *
 * Affiche le logo de La Lunetterie Du Coin avec options de taille et variante.
 *
 * @param variant - Type d'affichage: 'full' (logo + texte) ou 'icon' (logo seul)
 * @param size - Taille: 'sm', 'md', 'lg'
 * @param className - Classes CSS additionnelles
 * @param showWordmark - Afficher le wordmark à côté du logo (par défaut true si variant='full')
 */
const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showWordmark = variant === 'full',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-auto', // 32px pour navbar
    md: 'h-12 w-auto', // 48px
    lg: 'h-16 w-auto', // 64px
  };

  const wordmarkSizes = {
    sm: 'text-body-sm',
    md: 'text-body',
    lg: 'text-title-sm',
  };

  return (
    <Link
      to="/"
      className={clsx(
        'focus-style inline-flex items-center gap-3 transition-opacity duration-200 hover:opacity-80',
        className,
      )}
      aria-label="Retour à l'accueil - La Lunetterie Du Coin"
    >
      {/* Logo SVG */}
      <LogoSvg className={clsx(sizeClasses[size], 'flex-shrink-0')} aria-hidden="true" />

      {/* Wordmark */}
      {showWordmark && (
        <span
          className={clsx(
            'font-extrabold uppercase leading-tight tracking-tight',
            wordmarkSizes[size],
          )}
        >
          <span className="font-thin">LA</span>
          <br />
          LUNETTERIE
          <br />
          <span className="font-thin">DU</span> COIN
        </span>
      )}
    </Link>
  );
};

export default Logo;
