// src/components/motion/text/SectionTitleReveal.tsx
// Version simplifiée pour compatibilité

import React, { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface SectionTitleRevealProps {
  children?: ReactNode;
  className?: string;
  title?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Version ultra-simplifiée de SectionTitleReveal
 * Utilise des animations CSS au lieu de Framer Motion
 * Compatible avec les props title ET children
 */
export default function SectionTitleReveal({
  children,
  className,
  title,
  as: Component = 'div',
}: SectionTitleRevealProps) {
  const content = title || children;

  return <Component className={cn('simple-fade-in-up', className)}>{content}</Component>;
}
