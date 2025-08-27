// src/components/motion/AnimatedItem.tsx
import type React from 'react';
import { m, type Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import { fadeInUp } from './variants/fade';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export type AnimatedItemProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  index?: number;
  variant?: Variants;
  viewport?: object;
  /** Quand true, n'applique pas d'état 'hidden' avant la 1re peinture (ne bloque pas le LCP) */
  nonBlocking?: boolean;
};

const DEFAULT_EASE = [0.25, 0.46, 0.45, 0.94];
const DEFAULT_STAGGER = 0.12; // 120ms entre chaque élément
const DEFAULT_STIFFNESS = 60;
const DEFAULT_DAMPING = 20;

/**
 * Composant React pour animer un élément enfant avec Framer Motion.
 * Optimisé pour ne pas bloquer le LCP et respecter `prefers-reduced-motion`.
 *
 * @example
 * <AnimatedItem index={1} nonBlocking>
 *   <h1>La Lunetterie du Coin</h1>
 * </AnimatedItem>
 */
export default function AnimatedItem({
  children,
  className,
  delay = 0,
  duration = 0.6,
  index = 0,
  variant = fadeInUp,
  viewport = { once: true, amount: 0.4 },
  nonBlocking = false,
}: AnimatedItemProps) {
  const calculatedDelay = delay + index * DEFAULT_STAGGER;
  const reduce = usePrefersReducedMotion();
  const location = useLocation();

  // Fix pour la home page : permettre aux animations de se rejouer après navigation
  const shouldReplayOnce = location.pathname === '/' ? false : (viewport.once ?? true);
  const adjustedViewport = { ...viewport, once: shouldReplayOnce };

  // Mode accessibilité : pas d’animation
  if (reduce) return <div className={className}>{children}</div>;

  if (nonBlocking) {
    // ✅ Mode non-bloquant : visible immédiatement puis animation subtile
    return (
      <m.div
        initial={{ opacity: 1, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: DEFAULT_STIFFNESS,
          damping: DEFAULT_DAMPING,
          duration,
          delay: calculatedDelay,
          ease: DEFAULT_EASE,
        }}
        className={className}
      >
        {children}
      </m.div>
    );
  }

  // ✅ Mode standard : animation classique
  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={adjustedViewport}
      variants={variant}
      transition={{
        type: 'spring',
        stiffness: DEFAULT_STIFFNESS,
        damping: DEFAULT_DAMPING,
        duration,
        delay: calculatedDelay,
        ease: DEFAULT_EASE,
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
