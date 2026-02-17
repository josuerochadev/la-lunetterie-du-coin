import type React from 'react';
import { clsx } from 'clsx';

import motifNoir from '@/assets/patterns/motif-noir.svg';
import motifBlanc from '@/assets/patterns/motif-blanc.svg';
import motifJaune from '@/assets/patterns/motif-jaune.svg';

type EyePatternVariant = 'noir' | 'blanc' | 'jaune';

type EyePatternProps = {
  variant?: EyePatternVariant;
  opacity?: number;
  className?: string;
};

const patternMap: Record<EyePatternVariant, string> = {
  noir: motifNoir,
  blanc: motifBlanc,
  jaune: motifJaune,
};

/**
 * Composant EyePattern — Motif yeux récurrent de la charte graphique
 *
 * Affiche le motif eyes en fond de section avec opacité contrôlable.
 * Positionné en absolute, nécessite un parent relative.
 *
 * @param variant - 'noir', 'blanc', ou 'jaune'
 * @param opacity - Opacité du motif (0 à 1), défaut 0.05
 * @param className - Classes CSS additionnelles
 */
const EyePattern: React.FC<EyePatternProps> = ({ variant = 'noir', opacity = 0.05, className }) => {
  return (
    <div
      className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
      style={{
        opacity,
        backgroundImage: `url(${patternMap[variant]})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '400px',
      }}
    />
  );
};

export default EyePattern;
