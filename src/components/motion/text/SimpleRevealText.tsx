import type { JSX } from 'react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

type Props = {
  text: string;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

/**
 * Lightweight text reveal using CSS animations instead of JS
 * Much more performant than word-by-word Framer Motion animations
 */
export default function SimpleRevealText({
  text,
  delay = 0,
  className = '',
  as: Component = 'div',
}: Props) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // No animation for users who prefer reduced motion
  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component
      className={cn(
        'animate-reveal-text opacity-0',
        className
      )}
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: 'forwards',
      }}
    >
      {text}
    </Component>
  );
}