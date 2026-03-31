import { m, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SPRING_CONFIG } from '@/lib/motion';

const TEAM_BIO =
  "Opticien depuis plus de 15 ans, Romain a lancé la boutique en 2016 avec une idée fixe : de bonnes lunettes, un vrai conseil, et moins de gâchis. Spécialiste des verres progressifs et des fortes corrections, il aime surtout trouver la paire à laquelle vous n'auriez pas pensé.";

// ---------------------------------------------------------------------------
// Desktop animated — portrait with contained aspect ratio + bio word reveal
//
//  300vh container
//
//  0.02 – 0.20  Portrait clipPath reveal (bottom-to-top)
//  0.08 – 0.20  Name ScrollWordReveal + Y slide
//  0.18 – 0.40  Bio text ScrollWordReveal
//  0.40 – 0.65  Hold
//  0.65 – 0.80  Exit — fade out + Y drift
// ---------------------------------------------------------------------------

function TeamDesktop() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  // Portrait — clipPath reveal from bottom, gentle zoom
  const clipProgress = useTransform(scrollYProgress, [0.02, 0.2], [0, 1]);
  const portraitClip = useTransform(clipProgress, (v) => {
    const bottom = 100 - v * 100;
    return `inset(0% 0% ${bottom}% 0%)`;
  });
  const portraitScale = useTransform(scrollYProgress, [0.02, 0.6], [1, 1.04]);

  // Name — entrance gate hides ScrollWordReveal's 0.15 base opacity
  const nameEntrance = useTransform(scrollYProgress, [0.06, 0.1], [0, 1]);
  const nameYRaw = useTransform(scrollYProgress, [0.08, 0.16], [80, 0]);
  const nameY = useSpring(nameYRaw, SPRING_CONFIG);

  // Bio text — entrance gate hides ScrollWordReveal's 0.15 base opacity
  const bioEntrance = useTransform(scrollYProgress, [0.16, 0.2], [0, 1]);

  // Exit — fade out all content
  const exitOpacity = useTransform(scrollYProgress, [0.65, 0.8], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0.65, 0.8], [0, -40]);

  return (
    <div ref={ref} className="hidden h-[300vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <m.div
          className="flex h-full items-center px-16 xl:px-20"
          style={{ opacity: exitOpacity, y: exitY }}
        >
          {/* Left — Portrait with contained aspect ratio */}
          <div className="relative w-[45%] overflow-hidden">
            <m.div style={{ clipPath: portraitClip }}>
              <m.div
                className="relative aspect-[3/4] w-full overflow-hidden"
                style={{ scale: portraitScale }}
              >
                <ResponsiveImage
                  src="/images/about-team-romain.jpeg"
                  alt="Romain Corato, fondateur de La Lunetterie du Coin"
                  className="h-full w-full object-cover object-top"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </m.div>
            </m.div>
          </div>

          {/* Right — Name + Bio */}
          <div className="flex w-[55%] flex-col justify-center pl-16 xl:pl-20">
            <m.div style={{ y: nameY, opacity: nameEntrance }}>
              <ScrollWordReveal
                as="h2"
                scrollYProgress={scrollYProgress}
                revealStart={0.08}
                revealEnd={0.2}
                className="text-heading text-accent"
                style={{ fontSize: 'clamp(3rem, 8vw, 10rem)', lineHeight: '0.95' }}
              >
                L&apos;ŒIL DERRIÈRE LA BOUTIQUE
              </ScrollWordReveal>
            </m.div>

            <m.div className="mt-8 max-w-lg" style={{ opacity: bioEntrance }}>
              <ScrollWordReveal
                as="p"
                scrollYProgress={scrollYProgress}
                revealStart={0.2}
                revealEnd={0.38}
                className="text-body-lg text-white"
              >
                {TEAM_BIO}
              </ScrollWordReveal>
            </m.div>
          </div>
        </m.div>
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
    <section
      id="equipe"
      aria-label="Notre équipe"
      className="relative w-full bg-black"
      data-navbar-theme="light"
    >
      {/* Gradient dissolve — long smooth fade from yellow (Values) to black (Team) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[40vh]"
        style={{
          background: 'linear-gradient(to bottom, rgb(var(--color-yellow-rgb)), transparent)',
        }}
        aria-hidden="true"
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
                <ResponsiveImage
                  src="/images/about-team-romain.jpeg"
                  alt="Romain Corato, fondateur de La Lunetterie du Coin"
                  className="h-full w-full object-cover object-top"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div>
                <p className="text-body-lg text-white">{TEAM_BIO}</p>
              </div>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
}
