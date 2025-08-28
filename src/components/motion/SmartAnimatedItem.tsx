// src/components/motion/SmartAnimatedItem.tsx
import React, { ReactNode } from 'react';

import { shouldLoadHeavyAnimations } from '@/lib/deviceDetection';
import { cn } from '@/lib/cn';

interface SmartAnimatedItemProps {
  children: ReactNode;
  index?: number;
  className?: string;
  animationType?: 'fade' | 'scale' | 'slide';
}

/**
 * Composant intelligent qui utilise:
 * - CSS animations légères sur mobile
 * - Import dynamique de Framer Motion sur desktop
 */
export function SmartAnimatedItem({
  children,
  index = 0,
  className,
  animationType = 'fade',
}: SmartAnimatedItemProps) {
  const shouldAnimate = shouldLoadHeavyAnimations();

  if (!shouldAnimate) {
    // Mobile: CSS animations natives
    const delay = Math.min(index, 5); // Max 5 délais
    const mobileClass = `mobile-${animationType}-in mobile-${animationType}-in-${delay}`;

    return <div className={cn(mobileClass, className)}>{children}</div>;
  }

  // Desktop: Import dynamique de l'ancien AnimatedItem
  // Pour l'instant, on utilise une div simple - on peut importer l'ancien plus tard
  return <div className={className}>{children}</div>;
}
