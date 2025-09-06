// src/components/motion/OptimizedAnimateItem.tsx
import React, { ReactNode, useEffect, useState, useRef } from 'react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

interface OptimizedAnimateItemProps {
  children: ReactNode;
  index?: number;
  className?: string;
  type?: 'fade' | 'fade-up' | 'fade-down' | 'scale';
  as?: keyof React.JSX.IntrinsicElements;
  /** Threshold pour déclencher l'animation (0-1) */
  threshold?: number;
  /** Délai personnalisé en ms (override du stagger automatique) */
  customDelay?: number;
  /** Animation immédiate pour les éléments above-the-fold */
  immediate?: boolean;
}

/**
 * Composant d'animation optimisé avec Intersection Observer
 *
 * ✅ Ne se déclenche que quand l'élément est visible
 * ✅ Stagger delays optimisés (50ms au lieu de 100ms)
 * ✅ Support animation immédiate pour hero sections
 * ✅ Threshold configurable pour un contrôle précis
 */
export function OptimizedAnimateItem({
  children,
  index = 0,
  className,
  type = 'fade',
  as: Component = 'div',
  threshold = 0.3,
  customDelay,
  immediate = false,
}: OptimizedAnimateItemProps) {
  const [shouldAnimate, setShouldAnimate] = useState(immediate);
  const [isIntersecting, setIsIntersecting] = useState(immediate);
  const targetRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Calcul du délai optimisé pour plus de visibilité
  const staggerDelay = customDelay ?? Math.min(index * 80, 400); // Max 400ms

  // Setup Intersection Observer
  useEffect(() => {
    const currentTarget = targetRef.current;
    if (!currentTarget || immediate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(currentTarget);
        }
      },
      { threshold },
    );

    observer.observe(currentTarget);
    return () => observer.unobserve(currentTarget);
  }, [threshold, immediate]);

  // Déclencher l'animation quand l'élément devient visible
  useEffect(() => {
    if (isIntersecting && !shouldAnimate) {
      setShouldAnimate(true);
    }
  }, [isIntersecting, shouldAnimate]);

  // Classes d'animation conditionnelles
  const getAnimationClass = () => {
    if (prefersReducedMotion) return ''; // Pas d'animation
    if (!shouldAnimate) return 'opacity-0'; // État initial invisible

    const baseClass = `simple-${type}-in`;
    const delayClass =
      staggerDelay > 0 ? `animate-delay-${Math.min(Math.floor(staggerDelay / 80) + 1, 6)}` : '';

    return cn(baseClass, delayClass);
  };

  return (
    <Component
      ref={targetRef as any}
      className={cn('simple-animate-item transition-opacity', getAnimationClass(), className)}
      style={{
        animationDelay: shouldAnimate && !prefersReducedMotion ? `${staggerDelay}ms` : undefined,
        opacity: prefersReducedMotion ? 1 : undefined,
      }}
    >
      {children}
    </Component>
  );
}
