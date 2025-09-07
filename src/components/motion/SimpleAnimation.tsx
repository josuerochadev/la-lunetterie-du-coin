import type React from 'react';
import { ReactNode, useEffect, useState, useRef } from 'react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

interface SimpleAnimationProps {
  children: ReactNode;
  type?: 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'fade';
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  threshold?: number;
  immediate?: boolean;
}

/**
 * Animation component simplifié pour un meilleur maintainabilité
 * 
 * Usage: <SimpleAnimation type="slide-up" delay={200}>content</SimpleAnimation>
 */
export function SimpleAnimation({
  children,
  type = 'slide-up',
  delay = 0,
  className,
  as: Component = 'div',
  threshold = 0.35,
  immediate = false,
}: SimpleAnimationProps) {
  const [isVisible, setIsVisible] = useState(immediate);
  const ref = useRef<Element>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || immediate || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [delay, immediate, prefersReducedMotion, threshold]);

  const animationClass = !prefersReducedMotion && isVisible 
    ? `simple-${type.replace('-', '-in-')}`
    : '';

  const initialClass = !prefersReducedMotion && !isVisible ? 'opacity-0' : '';

  return (
    <Component
      ref={ref as any}
      className={cn('simple-animate-item transition-opacity', animationClass, initialClass, className)}
      style={prefersReducedMotion ? { opacity: 1 } : undefined}
    >
      {children}
    </Component>
  );
}