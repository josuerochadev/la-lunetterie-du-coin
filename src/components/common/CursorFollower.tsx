import { useEffect } from 'react';
import { m, useSpring, useMotionValue } from 'framer-motion';

import LogoEye from '@/assets/logo/Logo_LLDC_Symbole_Noir.svg?react';
import { useIsLg } from '@/hooks/useIsLg';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SPRING_CONFIG_CURSOR } from '@/lib/motion';

export default function CursorFollower() {
  const isDesktop = useIsLg();
  const prefersReducedMotion = usePrefersReducedMotion();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const x = useSpring(cursorX, SPRING_CONFIG_CURSOR);
  const y = useSpring(cursorY, SPRING_CONFIG_CURSOR);

  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDesktop, prefersReducedMotion, cursorX, cursorY]);

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
      <LogoEye className="h-full w-full text-black" aria-hidden="true" />
    </m.div>
  );
}
