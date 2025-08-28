// src/components/motion/variants/fade.ts
// Fallback minimal pour compatibilité - remplace les variants Framer Motion lourds

/**
 * Variant fade simple pour compatibilité
 * Ces variants ne sont plus utilisés avec le nouveau système SimpleAnimateItem
 */
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

// Transition par défaut
export const defaultTransition = {
  duration: 0.4,
  ease: "easeOut"
};