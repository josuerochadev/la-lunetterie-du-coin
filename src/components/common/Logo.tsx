import type React from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/cn';
import LogoFullNoir from '@/assets/logo/Logo_LLDC_Noir.svg?react';
import LogoFullBlanc from '@/assets/logo/Logo_LLDC_Blanc.svg?react';
import LogoFullJaune from '@/assets/logo/Logo_LLDC_Jaune.svg?react';
import LogoSymboleNoir from '@/assets/logo/Logo_LLDC_Symbole_Noir.svg?react';
import LogoSymboleBlanc from '@/assets/logo/Logo_LLDC_Symbole_Blanc.svg?react';
import LogoSymboleJaune from '@/assets/logo/Logo_LLDC_Symbole_Jaune.svg?react';

type LogoVariant = 'full' | 'symbol';
type LogoColor = 'noir' | 'blanc' | 'jaune';
type LogoSize = 'sm' | 'md' | 'lg';

type LogoProps = {
  variant?: LogoVariant;
  color?: LogoColor;
  size?: LogoSize;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const logoMap = {
  full: {
    noir: LogoFullNoir,
    blanc: LogoFullBlanc,
    jaune: LogoFullJaune,
  },
  symbol: {
    noir: LogoSymboleNoir,
    blanc: LogoSymboleBlanc,
    jaune: LogoSymboleJaune,
  },
} as const;

const sizeClasses: Record<LogoSize, string> = {
  sm: 'h-8 w-auto',
  md: 'h-12 w-auto',
  lg: 'h-16 w-auto',
};

/**
 * Composant Logo — Rebranding 2026
 *
 * Affiche le logo La Lunetterie du Coin (version complète ou symbole seul).
 *
 * @param variant - 'full' (logo + texte) ou 'symbol' (œil seul)
 * @param color - 'noir', 'blanc', ou 'jaune'
 * @param size - 'sm', 'md', 'lg'
 * @param className - Classes CSS additionnelles
 */
const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  color = 'noir',
  size = 'md',
  className = '',
  onClick,
}) => {
  const SvgComponent = logoMap[variant][color];

  return (
    <Link
      to="/"
      className={cn(
        'focus-style inline-flex items-center transition-opacity duration-200 hover:opacity-80',
        className,
      )}
      aria-label="Retour à l'accueil - La Lunetterie Du Coin"
      onClick={onClick}
    >
      <SvgComponent className={cn(sizeClasses[size], 'flex-shrink-0')} aria-hidden="true" />
    </Link>
  );
};

export default Logo;
