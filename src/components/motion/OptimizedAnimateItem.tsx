// src/components/motion/OptimizedAnimateItem.tsx
import React, { ReactNode, useEffect, useState, useRef } from 'react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

interface OptimizedAnimateItemProps {
  children: ReactNode;
  index?: number;
  className?: string;
  type?: 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'fade';
  as?: keyof React.JSX.IntrinsicElements;
  /** Threshold pour déclencher l'animation (0-1) */
  threshold?: number;
  /** Délai personnalisé en ms (override du stagger automatique) */
  customDelay?: number;
  /** Animation immédiate pour les éléments above-the-fold */
  immediate?: boolean;
}

/**
 * Composant d'animation smooth et minimaliste avec Intersection Observer
 *
 * ✅ Slides subtils et élégants (24px max)
 * ✅ Courbe cubic-bezier sophistiquée
 * ✅ Animation déclenchée uniquement quand visible
 * ✅ Support pour slide-up, slide-down, slide-left, slide-right, fade
 * ✅ Stagger delays optimisés et threshold configurable
 */
export function OptimizedAnimateItem({
  children,
  index = 0,
  className,
  type = 'slide-up',
  as: Component = 'div',
  threshold = 0.35,
  customDelay,
  immediate = false,
}: OptimizedAnimateItemProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false); // Toujours commencer invisible
  const [isIntersecting, setIsIntersecting] = useState(immediate);
  const targetRef = useRef<Element>(null);
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

  // Déclencher l'animation quand l'élément devient visible OU immédiatement
  useEffect(() => {
    if ((isIntersecting || immediate) && !shouldAnimate) {
      if (immediate && staggerDelay > 0) {
        // Pour les éléments immédiats avec délai, on attend le stagger delay
        const timeout = setTimeout(() => {
          setShouldAnimate(true);
        }, staggerDelay);
        return () => clearTimeout(timeout);
      }
      setShouldAnimate(true);
    }
  }, [isIntersecting, shouldAnimate, immediate, staggerDelay]);

  // Classes d'animation conditionnelles
  const getAnimationClass = () => {
    if (prefersReducedMotion) return ''; // Pas d'animation
    if (!shouldAnimate) return 'opacity-0'; // État initial invisible

    const baseClass = `simple-${type.replace('-', '-in-')}`;
    // Pour les éléments immédiats avec délai custom, pas de classe de délai CSS
    const delayClass =
      staggerDelay > 0 && !(immediate && customDelay)
        ? `animate-delay-${Math.min(Math.floor(staggerDelay / 80) + 1, 6)}`
        : '';

    return cn(baseClass, delayClass);
  };

  // Style conditionnel pour éviter les unions complexes
  const animationStyle: React.CSSProperties = {};
  if (shouldAnimate && !prefersReducedMotion && !(immediate && customDelay)) {
    animationStyle.animationDelay = `${staggerDelay}ms`;
  }
  if (prefersReducedMotion) {
    animationStyle.opacity = 1;
  }

  return (
    <Component
      ref={targetRef as any}
      className={cn('simple-animate-item transition-opacity', getAnimationClass(), className)}
      style={animationStyle}
    >
      {children}
    </Component>
  );
}
