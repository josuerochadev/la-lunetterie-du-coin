import { forwardRef, useRef } from 'react';
import { Link } from 'react-router-dom';
import { m, useScroll, useSpring, useTransform } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Section HomeStory — 3-column editorial with scroll-driven parallax
 *
 * Desktop layout (scroll-driven):
 *   - Left column: title "La Lunetterie du Coin" — scrolls up (slightly slower)
 *   - Center column: photo — sticky, with slight zoom, expands fullscreen at end
 *   - Right column: body text + CTA — scrolls up
 *   - End: photo goes fullscreen, transition phrase fades in centered
 *
 * Mobile: stacked layout with SimpleAnimation entrance.
 * Reduced motion: static layout, no scroll effects.
 */
const HomeStory = forwardRef<HTMLElement>((_, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through the section
  const { scrollYProgress } = useScroll({
    target: prefersReducedMotion ? undefined : sectionRef,
    offset: ['start end', 'end start'],
  });

  // Spring for smooth motion
  const springConfig = { stiffness: 80, damping: 30, mass: 0.5 };

  // Title scrolls up slightly slower than body text (parallax offset)
  const titleYRaw = useTransform(scrollYProgress, [0.1, 0.7], [100, -300]);
  const titleY = useSpring(titleYRaw, springConfig);

  // Body text scrolls up at normal pace
  const textYRaw = useTransform(scrollYProgress, [0.1, 0.7], [150, -400]);
  const textY = useSpring(textYRaw, springConfig);

  // Photo: slight zoom during scroll
  const photoScale = useTransform(scrollYProgress, [0.1, 0.6], [1, 1.05]);

  // End sequence: photo expands to fullscreen, phrase fades in
  // Photo grows from its column size to fullscreen
  const photoExpandScale = useTransform(scrollYProgress, [0.65, 0.85], [1, 2.8]);
  const photoExpandOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0.6]);

  // Transition phrase fades in at the end
  const phraseOpacity = useTransform(scrollYProgress, [0.75, 0.88], [0, 1]);
  const phraseY = useTransform(scrollYProgress, [0.75, 0.88], [40, 0]);
  const phraseYSpring = useSpring(phraseY, springConfig);

  // Entrance opacity for all elements (scroll-triggered reveal)
  const entranceOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);

  return (
    <section
      ref={ref}
      id="story"
      className="relative w-full bg-black"
      aria-labelledby="story-title"
      data-navbar-theme="light"
    >
      {/* Integrated gradient: accent → black, no separate transition element */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[40vh]"
        style={{
          background:
            'linear-gradient(to bottom, #FDD835 0%, color-mix(in srgb, #FDD835 95%, black) 8%, color-mix(in srgb, #FDD835 80%, black) 20%, color-mix(in srgb, #FDD835 55%, black) 40%, color-mix(in srgb, #FDD835 30%, black) 60%, color-mix(in srgb, #FDD835 10%, black) 80%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div ref={sectionRef} className="relative">
        {/* ===== Mobile layout — stacked ===== */}
        <div className="flex flex-col gap-8 px-6 py-20 sm:px-10 sm:py-28 md:px-16 lg:hidden">
          <SimpleAnimation type="slide-up" delay={0} className="w-full">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <img
                src="/images/our-story-eyeglasses.jpg"
                alt="Lunettes artisanales - La Lunetterie du Coin"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <h2
              id="story-title"
              className="text-heading text-accent"
              style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
            >
              La Lunetterie du Coin
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={200}>
            <p className="text-body leading-relaxed text-accent/80">
              La Lunetterie du Coin a été ouverte avec une conviction&nbsp;: proposer des lunettes
              de qualité tout en donnant une seconde vie aux montures. Au c&oelig;ur du Faubourg de
              Pierre à Strasbourg, notre boutique indépendante allie expertise optique, style
              contemporain et engagement écologique. Chaque paire est sélectionnée avec soin,
              qu&apos;elle soit neuve ou d&apos;occasion.
            </p>

            <Link
              to="/a-propos"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-body-sm font-medium text-black transition-all duration-300 hover:brightness-110 active:scale-95 sm:mt-8"
            >
              Nous découvrir
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </SimpleAnimation>
        </div>

        {/* ===== Desktop layout — 3 columns, scroll-driven ===== */}
        <div className="hidden min-h-[250vh] lg:block">
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* 3-column grid */}
            <div className="relative flex h-full items-center px-16 xl:px-20">
              {/* Left column — title, scrolls up slightly slower */}
              {prefersReducedMotion ? (
                <div className="w-[22%] pr-8">
                  <h2
                    id="story-title"
                    className="text-heading text-accent"
                    style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2.5rem)' }}
                  >
                    La Lunetterie
                    <br />
                    du Coin
                  </h2>
                </div>
              ) : (
                <m.div
                  className="w-[22%] pr-8 will-change-transform"
                  style={{ y: titleY, opacity: entranceOpacity }}
                >
                  <h2
                    id="story-title"
                    className="text-heading text-accent"
                    style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2.5rem)' }}
                  >
                    La Lunetterie
                    <br />
                    du Coin
                  </h2>
                </m.div>
              )}

              {/* Center column — sticky photo with zoom + fullscreen expand */}
              {prefersReducedMotion ? (
                <div className="w-[32%] px-4">
                  <div className="overflow-hidden">
                    <img
                      src="/images/our-story-eyeglasses.jpg"
                      alt="Lunettes artisanales - La Lunetterie du Coin"
                      className="aspect-[3/4] w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <m.div
                  className="w-[32%] px-4 will-change-transform"
                  style={{
                    scale: photoExpandScale,
                    opacity: photoExpandOpacity,
                  }}
                >
                  <m.div className="overflow-hidden" style={{ opacity: entranceOpacity }}>
                    <m.img
                      src="/images/our-story-eyeglasses.jpg"
                      alt="Lunettes artisanales - La Lunetterie du Coin"
                      className="aspect-[3/4] w-full object-cover"
                      loading="lazy"
                      style={{ scale: photoScale }}
                    />
                  </m.div>
                </m.div>
              )}

              {/* Right column — body text + CTA, scrolls up */}
              {prefersReducedMotion ? (
                <div className="w-[46%] pl-8">
                  <p
                    className="text-accent/80"
                    style={{ fontSize: 'clamp(1rem, 1.5vw, 1.5rem)', lineHeight: 1.7 }}
                  >
                    La Lunetterie du Coin a été ouverte avec une conviction&nbsp;: proposer des
                    lunettes de qualité tout en donnant une seconde vie aux montures. Au c&oelig;ur
                    du Faubourg de Pierre à Strasbourg, notre boutique indépendante allie expertise
                    optique, style contemporain et engagement écologique. Chaque paire est
                    sélectionnée avec soin, qu&apos;elle soit neuve ou d&apos;occasion.
                  </p>
                  <Link
                    to="/a-propos"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-body font-medium text-black transition-all duration-300 hover:brightness-110 active:scale-95"
                  >
                    Nous découvrir
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <m.div
                  className="w-[46%] pl-8 will-change-transform"
                  style={{ y: textY, opacity: entranceOpacity }}
                >
                  <p
                    className="text-accent/80"
                    style={{ fontSize: 'clamp(1rem, 1.5vw, 1.5rem)', lineHeight: 1.7 }}
                  >
                    La Lunetterie du Coin a été ouverte avec une conviction&nbsp;: proposer des
                    lunettes de qualité tout en donnant une seconde vie aux montures. Au c&oelig;ur
                    du Faubourg de Pierre à Strasbourg, notre boutique indépendante allie expertise
                    optique, style contemporain et engagement écologique. Chaque paire est
                    sélectionnée avec soin, qu&apos;elle soit neuve ou d&apos;occasion.
                  </p>
                  <Link
                    to="/a-propos"
                    className="group/cta mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-body font-medium text-black transition-all duration-300 hover:brightness-110 active:scale-95"
                  >
                    Nous découvrir
                    <m.span
                      className="inline-block"
                      whileHover={{ x: 8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </m.span>
                  </Link>
                </m.div>
              )}
            </div>

            {/* Transition phrase — fades in as photo goes fullscreen */}
            {!prefersReducedMotion && (
              <m.div
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8"
                style={{ opacity: phraseOpacity }}
                aria-hidden="true"
              >
                <m.h3
                  className="text-heading text-center text-accent drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 4rem)',
                    y: phraseYSpring,
                  }}
                >
                  Une expertise complète pour
                  <br />
                  prendre soin de votre vue
                </m.h3>
              </m.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

HomeStory.displayName = 'HomeStory';

export default HomeStory;
