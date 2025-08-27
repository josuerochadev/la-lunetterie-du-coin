// src/components/common/RippleAnimation.tsx

import React, { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

interface RippleAnimationProps extends ComponentPropsWithoutRef<'div'> {
  scrollProgress: number;
  circleCount?: number;
  baseSize?: number;
  baseOpacity?: number;
}

const DEFAULTS = {
  circleCount: 15, // Reduced from 25 for Firefox performance
  baseSize: 300,
  baseOpacity: 0.3,
};

/**
 * Composant React optimisé pour afficher une animation de vagues concentriques ("ripple").
 *
 * @param scrollProgress - Progression du scroll (valeur entre 0 et 1) utilisée pour ajuster la position verticale des cercles.
 * @param circleCount - Nombre de cercles à afficher dans l'animation (par défaut : DEFAULTS.circleCount).
 * @param baseSize - Taille de base du premier cercle (par défaut : DEFAULTS.baseSize).
 * @param baseOpacity - Opacité de base du premier cercle (par défaut : DEFAULTS.baseOpacity).
 * @param className - Classe CSS personnalisée à appliquer au conteneur principal.
 * @param props - Autres propriétés passées au conteneur principal.
 *
 * Chaque cercle est animé avec un délai croissant, une taille et une opacité dégressives,
 * créant un effet visuel de propagation. Les styles sont calculés dynamiquement pour chaque cercle.
 *
 * @returns Un conteneur `<div>` positionné en absolu contenant plusieurs cercles animés.
 */
export const RippleAnimation = React.memo(function RippleAnimation({
  scrollProgress,
  circleCount = DEFAULTS.circleCount,
  baseSize = DEFAULTS.baseSize,
  baseOpacity = DEFAULTS.baseOpacity,
  className,
  ...props
}: RippleAnimationProps) {
  const top = 65 - scrollProgress * 55;
  const left = 75;

  const computeStyle = (i: number): React.CSSProperties => {
    const size = baseSize + i * 90;
    const opacity = Math.max(baseOpacity - i * 0.015, 0.03);
    const blur = (i / circleCount) * 15;
    const animationDelay = `${i * 0.5}s`;

    return {
      width: `${size}px`,
      height: `${size}px`,
      opacity,
      filter: `blur(${blur}px)`,
      animation: `ripple 8s ease-in-out ${animationDelay} infinite`,
      borderStyle: 'solid',
      borderWidth: '0.5px',
      borderColor: 'var(--purple)',
      top: `${top}%`,
      left: `${left}%`,
      transform: 'translate(-50%, -50%) scale(1)',
      // Allow custom CSS variable
      ['--i' as string]: i,
    };
  };

  return (
    <div className={cn('pointer-events-none absolute inset-0', className)} {...props}>
      {Array.from({ length: circleCount }).map((_, i) => (
        <div
          key={`ripple-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            i
          }`}
          className="absolute rounded-full border bg-orange/15 shadow-xl"
          style={computeStyle(i)}
        />
      ))}
    </div>
  );
});
