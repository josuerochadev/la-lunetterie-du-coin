// src/components/motion/variants/fade.ts

type FadeInOptions = {
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
};

/**
 * Génère des variantes d'animation pour un effet de fondu en entrée (fade-in).
 *
 * @param options - Options pour personnaliser l'animation de fondu.
 * @param options.y - Décalage vertical initial (en pixels). Par défaut à 30.
 * @param options.x - Décalage horizontal initial (en pixels). Par défaut à 0.
 * @param options.opacity - Opacité initiale. Par défaut à 0.
 * @param options.scale - Échelle initiale (optionnelle).
 * @returns Un objet contenant les états `hidden` (caché) et `visible` (visible) pour l'animation.
 *
 * @example
 * const variants = makeFadeIn({ y: 50, opacity: 0.2 });
 * // Utilisez `variants.hidden` et `variants.visible` dans vos composants animés.
 */
export function makeFadeIn({ y = 30, x = 0, opacity = 0, scale }: FadeInOptions = {}) {
  const hidden: {
    opacity: number;
    y: number;
    x: number;
    scale?: number;
  } = { opacity, y, x };
  if (scale !== undefined) hidden.scale = scale;

  const visible: {
    opacity: number;
    y: number;
    x: number;
    scale?: number;
  } = {
    opacity: 1,
    y: 0,
    x: 0,
  };
  if (scale !== undefined) visible.scale = 1;

  return { hidden, visible };
}

// Prêts à l’emploi pour usages courants
export const fadeInUp = makeFadeIn({ y: 30 });
export const menuFade = makeFadeIn({ y: 40 });
export const fadeInDown = makeFadeIn({ y: -30 });
export const fadeInLeft = makeFadeIn({ x: -30 });
export const fadeInRight = makeFadeIn({ x: 30 });
