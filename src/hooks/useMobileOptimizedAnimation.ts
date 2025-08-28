// src/hooks/useMobileOptimizedAnimation.ts
import { shouldLoadHeavyAnimations } from '@/lib/deviceDetection';

/**
 * Hook pour remplacer facilement AnimatedItem existant
 */
export function useMobileOptimizedAnimation(index: number = 0) {
  const shouldAnimate = shouldLoadHeavyAnimations();
  
  if (!shouldAnimate) {
    const delay = Math.min(index, 5);
    return {
      className: `mobile-fade-in mobile-fade-in-${delay}`,
      isAnimated: true,
    };
  }
  
  return {
    className: '',
    isAnimated: false,
  };
}