import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const TEAM_BIO =
  "Opticien depuis plus de 15 ans, Romain a lancé la boutique en 2016 avec une idée fixe : de bonnes lunettes, un vrai conseil, et moins de gâchis. Spécialiste des verres progressifs et des fortes corrections, il aime surtout trouver la paire à laquelle vous n'auriez pas pensé.";

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };

// ---------------------------------------------------------------------------
// Desktop animated — portrait with contained aspect ratio + bio word reveal
//
//  300vh container
//
//  0.00 – 0.10  Label "L'OPTICIEN" fades in
//  0.02 – 0.20  Portrait clipPath reveal (bottom-to-top)
//  0.08 – 0.22  "ROMAIN" enters giant + Y slide
//  0.18 – 0.40  Bio text ScrollWordReveal
//  0.40 – 1.00  Hold
// ---------------------------------------------------------------------------

function TeamDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Portrait — clipPath reveal from bottom, gentle zoom
  const clipProgress = useTransform(scrollYProgress, [0.02, 0.2], [0, 1]);
  const portraitClip = useTransform(clipProgress, (v) => {
    const bottom = 100 - v * 100;
    return `inset(0% 0% ${bottom}% 0%)`;
  });
  const portraitScale = useTransform(scrollYProgress, [0.02, 0.6], [1, 1.04]);

  // Name — "ROMAIN"
  const nameOpacity = useTransform(scrollYProgress, [0.08, 0.16], [0, 1]);
  const nameYRaw = useTransform(scrollYProgress, [0.08, 0.16], [80, 0]);
  const nameY = useSpring(nameYRaw, SPRING_CONFIG);

  // Bio text
  const bioOpacity = useTransform(scrollYProgress, [0.18, 0.24], [0, 1]);

  return (
    <div ref={sectionRef} className="hidden h-[300vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full items-center px-16 xl:px-20">
          {/* Left — Portrait with contained aspect ratio */}
          <div className="relative w-[45%] overflow-hidden">
            <m.div style={{ clipPath: portraitClip }}>
              <m.div
                className="relative aspect-[3/4] w-full overflow-hidden"
                style={{ scale: portraitScale }}
              >
                <img
                  src="/images/about-team-romain.jpeg"
                  alt="Romain Corato, fondateur de La Lunetterie du Coin"
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </m.div>
            </m.div>
          </div>

          {/* Right — Name + Bio */}
          <div className="flex w-[55%] flex-col justify-center pl-16 xl:pl-20">
            <m.h2
              className="text-heading text-accent"
              style={{
                fontSize: 'clamp(3rem, 8vw, 10rem)',
                lineHeight: '0.95',
                opacity: nameOpacity,
                y: nameY,
              }}
            >
              L&apos;ŒIL DERRIÈRE
              <br />
              LA BOUTIQUE
            </m.h2>

            <m.div className="mt-8 max-w-lg" style={{ opacity: bioOpacity }}>
              <ScrollWordReveal
                as="p"
                scrollYProgress={scrollYProgress}
                revealStart={0.2}
                revealEnd={0.38}
                className="text-body-lg text-white/70"
              >
                {TEAM_BIO}
              </ScrollWordReveal>
            </m.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AboutTeam() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="equipe" className="relative w-full bg-black" data-navbar-theme="light">
      {/* Convex curve — transition from Values (yellow) */}
      <div
        className="pointer-events-none absolute -top-[11vw] left-1/2 h-[45vw] w-[140vw] -translate-x-1/2 rounded-[50%] bg-black"
        aria-hidden="true"
        data-navbar-theme="light"
      />

      {/* Desktop animated */}
      {!prefersReducedMotion && <TeamDesktop />}

      {/* Mobile / reduced-motion fallback */}
      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="mx-auto max-w-container px-container-x py-section">
          <SimpleAnimation type="slide-up" delay={0}>
            <div className="mb-8 text-center">
              <h2
                className="text-heading text-accent"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', lineHeight: '0.95' }}
              >
                L&apos;ŒIL DERRIÈRE
                <br />
                LA BOUTIQUE
              </h2>
            </div>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src="/images/about-team-romain.jpeg"
                  alt="Romain Corato, fondateur de La Lunetterie du Coin"
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-body-lg text-white/70">{TEAM_BIO}</p>
              </div>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
