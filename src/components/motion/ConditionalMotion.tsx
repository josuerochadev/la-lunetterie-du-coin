// src/components/motion/ConditionalMotion.tsx
import React, { ComponentProps, ReactNode, Suspense, lazy } from 'react';

import { shouldLoadHeavyAnimations } from '@/lib/deviceDetection';

// Lazy load Framer Motion components seulement si nécessaire
const MotionDiv = lazy(() =>
  import('framer-motion').then((module) => ({
    default: module.m.div,
  })),
);

const AnimatePresence = lazy(() =>
  import('framer-motion').then((module) => ({
    default: module.AnimatePresence,
  })),
);

interface ConditionalMotionProps {
  children: ReactNode;
  className?: string;
  // Props Framer Motion optionnelles
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  // Fallback si pas d'animations
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Wrapper intelligent qui charge Framer Motion seulement sur desktop
 * Utilise des divs simples sur mobile pour la performance
 */
export function ConditionalMotion({
  children,
  className,
  initial,
  animate,
  exit,
  transition,
  as = 'div',
  ...props
}: ConditionalMotionProps) {
  const shouldAnimate = shouldLoadHeavyAnimations();

  if (!shouldAnimate) {
    // Mobile/PRM: div simple sans animations
    const Component = as;
    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    );
  }

  // Desktop: Framer Motion avec lazy loading
  return (
    <Suspense fallback={<div className={className}>{children}</div>}>
      <MotionDiv
        className={className}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        {...props}
      >
        {children}
      </MotionDiv>
    </Suspense>
  );
}

/**
 * Wrapper pour AnimatePresence conditionnel
 */
export function ConditionalAnimatePresence({
  children,
  ...props
}: ComponentProps<typeof AnimatePresence>) {
  const shouldAnimate = shouldLoadHeavyAnimations();

  if (!shouldAnimate) {
    // Mobile: pas d'AnimatePresence, juste les children
    return <>{children}</>;
  }

  // Desktop: AnimatePresence complet
  return (
    <Suspense fallback={<>{children}</>}>
      <AnimatePresence {...props}>{children}</AnimatePresence>
    </Suspense>
  );
}
