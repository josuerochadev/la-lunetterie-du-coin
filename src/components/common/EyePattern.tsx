import type React from 'react';

import { cn } from '@/lib/cn';
import motifUrl from '@/assets/patterns/motif-eye-pattern.svg';

type EyePatternVariant = 'noir' | 'blanc' | 'jaune';

type EyePatternProps = {
  variant?: EyePatternVariant;
  opacity?: number;
  className?: string;
};

const colorMap: Record<EyePatternVariant, string> = {
  noir: '#000',
  blanc: '#fff',
  jaune: '#FEEB09',
};

/**
 * Composant EyePattern — Motif yeux récurrent de la charte graphique
 *
 * Affiche le motif eyes en fond de section avec opacité contrôlable.
 * Positionné en absolute, nécessite un parent relative.
 * Utilise mask-image avec un seul SVG pour les 3 variantes couleur.
 *
 * @param variant - 'noir', 'blanc', ou 'jaune'
 * @param opacity - Opacité du motif (0 à 1), défaut 0.05
 * @param className - Classes CSS additionnelles
 */
const EyePattern: React.FC<EyePatternProps> = ({ variant = 'noir', opacity = 0.05, className }) => {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden print:hidden', className)}
      aria-hidden="true"
      style={{
        opacity,
        backgroundColor: colorMap[variant],
        maskImage: `url(${motifUrl})`,
        WebkitMaskImage: `url(${motifUrl})`,
        maskRepeat: 'repeat',
        WebkitMaskRepeat: 'repeat',
        maskSize: '400px',
        WebkitMaskSize: '400px',
      }}
    />
  );
};

export default EyePattern;
