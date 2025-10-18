import { useEffect, useState } from 'react';
import { m, useSpring, useMotionValue } from 'framer-motion';

import LogoEye from '@/assets/logo/logo-eye.svg?react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Composant CursorFollower
 *
 * Affiche le logo de l'œil qui suit le curseur avec un effet smooth.
 * Activé uniquement sur desktop et respecte les préférences de mouvement réduit.
 *
 * @component
 * @example
 * <CursorFollower />
 *
 * @returns {JSX.Element | null} Le logo suiveur ou null si désactivé
 */
export default function CursorFollower() {
  const [isDesktop, setIsDesktop] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Motion values pour la position du curseur
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring config pour un suivi fluide et naturel
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Vérifier si on est sur desktop (largeur > 1024px)
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Offset pour centrer le logo sur le curseur (ajuster selon taille du logo)
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDesktop, prefersReducedMotion, cursorX, cursorY]);

  // Ne rien afficher sur mobile/tablette ou si motion réduit activé
  if (!isDesktop || prefersReducedMotion) return null;

  return (
    <m.div
      className="z-cursor pointer-events-none fixed left-0 top-0 mix-blend-difference"
      style={{
        x,
        y,
        width: '32px',
        height: '32px',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ duration: 0.3 }}
    >
      <LogoEye className="h-full w-full text-charcoal" aria-hidden="true" />
    </m.div>
  );
}
