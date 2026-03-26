import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
const ZOOM_SPRING = { stiffness: 60, damping: 30, mass: 0.5 };

function HeroDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // "VOIR" zooms: scale 12 → 1
  const voirScaleRaw = useTransform(scrollYProgress, [0.0, 0.2], [12, 1]);
  const voirScale = useSpring(voirScaleRaw, ZOOM_SPRING);

  // "PASSEZ" slides up
  const passezOpacity = useTransform(scrollYProgress, [0.14, 0.22], [0, 1]);
  const passezYRaw = useTransform(scrollYProgress, [0.14, 0.22], [40, 0]);
  const passezY = useSpring(passezYRaw, SPRING_CONFIG);

  // "NOUS" slides up
  const nousOpacity = useTransform(scrollYProgress, [0.19, 0.27], [0, 1]);
  const nousYRaw = useTransform(scrollYProgress, [0.19, 0.27], [40, 0]);
  const nousY = useSpring(nousYRaw, SPRING_CONFIG);

  return (
    <div ref={sectionRef} className="hidden h-[300vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <EyePattern variant="jaune" opacity={0.03} />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-10 px-8">
          <h1
            className="text-heading text-center text-black"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 14rem)', lineHeight: '0.95' }}
          >
            <m.span className="block" style={{ opacity: passezOpacity, y: passezY }}>
              PASSEZ
            </m.span>
            <m.span className="block" style={{ opacity: nousOpacity, y: nousY }}>
              NOUS
            </m.span>
            <m.span className="block origin-center" style={{ scale: voirScale }}>
              VOIR
            </m.span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default function ContactHero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();

  return (
    <section id="hero" className="relative w-full bg-accent" data-navbar-theme="dark">
      {!prefersReducedMotion && isLg && <HeroDesktop />}

      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="relative flex min-h-[70vh] items-center py-section">
          <EyePattern variant="jaune" opacity={0.03} />
          <div className="relative z-10 mx-auto max-w-container px-container-x">
            <div className="flex flex-col items-center justify-center text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h1
                  className="text-heading text-black"
                  style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', lineHeight: '0.95' }}
                >
                  Passez
                  <br />
                  nous voir
                </h1>
              </SimpleAnimation>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
