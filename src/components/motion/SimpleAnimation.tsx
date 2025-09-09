import React, { useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

interface SimpleAnimationProps {
  children: ReactNode;
  type?: 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'fade';
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav';
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
  const [isVisible, setIsVisible] = useState(false); // Always start hidden
  const ref = useRef<Element>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    if (immediate) {
      // For immediate animations, apply delay directly
      if (delay > 0) {
        setTimeout(() => setIsVisible(true), delay);
      } else {
        setIsVisible(true);
      }
      return;
    }

    // For non-immediate animations, use intersection observer
    const element = ref.current;
    if (!element) return;

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
      { threshold },
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [delay, immediate, prefersReducedMotion, threshold]);

  const animationClass =
    !prefersReducedMotion && isVisible ? `simple-${type.replace('-', '-in-')}` : '';

  const initialClass = !prefersReducedMotion && !isVisible ? 'opacity-0' : '';

  return React.createElement(
    Component,
    {
      ref,
      className: cn(
        'simple-animate-item transition-opacity',
        animationClass,
        initialClass,
        className,
      ),
      style: prefersReducedMotion ? { opacity: 1 } : undefined,
      'data-testid': 'simple-animation',
      'data-type': type,
      'data-immediate': immediate.toString(),
      'data-delay': delay.toString(),
    },
    children,
  );
}
