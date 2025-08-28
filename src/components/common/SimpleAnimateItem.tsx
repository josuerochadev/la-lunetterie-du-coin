// src/components/common/SimpleAnimateItem.tsx
import React, { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface SimpleAnimateItemProps {
  children: ReactNode;
  index?: number;
  className?: string;
  type?: 'fade' | 'fade-up' | 'scale';
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Composant d'animation ultra-simple et performant
 * 
 * Utilise uniquement du CSS natif, pas de JS
 * Parfait pour remplacer tous les AnimatedItem lourds
 */
export function SimpleAnimateItem({
  children,
  index = 0,
  className,
  type = 'fade',
  as: Component = 'div',
}: SimpleAnimateItemProps) {
  // Limiter l'index pour éviter des délais trop longs
  const staggerIndex = Math.min(index, 10);
  
  // Construction de la classe d'animation
  const animationClass = staggerIndex > 0 
    ? `simple-${type}-in simple-${type}-in-${staggerIndex}`
    : `simple-${type}-in`;
  
  return (
    <Component 
      className={cn('simple-animate-item', animationClass, className)}
    >
      {children}
    </Component>
  );
}

