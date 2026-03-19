import { forwardRef, useRef } from 'react';
import { Link } from 'react-router-dom';
import { m, useScroll, useSpring, useTransform } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import TextReveal from '@/components/motion/TextReveal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Section HomeStory — 3-column editorial with scroll-driven parallax
 *
 * Desktop layout (scroll-driven):
 *   - Left column: title — scrolls up (slightly slower)
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

  // Title scrolls up and exits before photo expand starts
  const titleYRaw = useTransform(scrollYProgress, [0.1, 0.45], [80, -200]);
  const titleY = useSpring(titleYRaw, springConfig);
  const titleOpacity = useTransform(scrollYProgress, [0.35, 0.45], [1, 0]);

  // Body text scrolls up and exits before photo expand starts
  const textYRaw = useTransform(scrollYProgress, [0.1, 0.45], [100, -250]);
  const textY = useSpring(textYRaw, springConfig);
  const textOpacity = useTransform(scrollYProgress, [0.35, 0.45], [1, 0]);

  // Photo: slight zoom during scroll
  const photoScale = useTransform(scrollYProgress, [0.1, 0.6], [1, 1.05]);

  // End sequence: photo expands to fullscreen by animating position/size
  const photoLeft = useTransform(scrollYProgress, [0.5, 0.65], ['22%', '0%']);
  const photoWidth = useTransform(scrollYProgress, [0.5, 0.65], ['38%', '100%']);
  const photoPadding = useTransform(scrollYProgress, [0.5, 0.65], [16, 0]);
  const photoExpandOpacity = useTransform(scrollYProgress, [0.55, 0.65], [1, 0.7]);

  // Transition phrase fades in, holds for a while, then stays
  const phraseOpacity = useTransform(scrollYProgress, [0.58, 0.68], [0, 1]);
  const phraseY = useTransform(scrollYProgress, [0.58, 0.68], [40, 0]);
  const phraseYSpring = useSpring(phraseY, springConfig);

  // Entrance opacity for all elements (scroll-triggered reveal)
  const entranceOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);

  // Combined opacity: fade in + fade out before photo expand
  const titleCombinedOpacity = useTransform(
    [entranceOpacity, titleOpacity] as const,
    ([a, b]: number[]) => Math.min(a, b),
  );
  const textCombinedOpacity = useTransform(
    [entranceOpacity, textOpacity] as const,
    ([a, b]: number[]) => Math.min(a, b),
  );

  return (
    <section
      ref={ref}
      id="story"
      className="relative w-full bg-black pt-[35vh]"
      aria-labelledby="story-title"
      data-navbar-theme="light"
    >
      {/* Integrated gradient: accent → black, smooth blend with hero behind */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-[25vh] h-[75vh]"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(254,235,9,0.3) 10%, rgba(254,235,9,0.6) 18%, #FEEB09 27%, color-mix(in srgb, #FEEB09 90%, black) 35%, color-mix(in srgb, #FEEB09 65%, black) 48%, color-mix(in srgb, #FEEB09 35%, black) 62%, color-mix(in srgb, #FEEB09 12%, black) 78%, black 100%)',
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
              Notre Histoire
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={200}>
            <p className="text-body leading-relaxed text-accent/80">
              Tout a commencé avec une conviction&nbsp;: proposer des lunettes de qualité tout en
              donnant une seconde vie aux montures. Au c&oelig;ur du Faubourg de Pierre à
              Strasbourg, notre boutique indépendante allie expertise optique, style contemporain et
              engagement écologique. Chaque paire est sélectionnée avec soin, qu&apos;elle soit
              neuve ou d&apos;occasion.
            </p>

            <Link
              to="/a-propos"
              className="group/cta relative mt-6 inline-flex items-center gap-2 text-body-sm font-normal text-accent transition-[font-weight] duration-300 hover:font-semibold sm:mt-8"
            >
              Nous découvrir
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1"
                aria-hidden="true"
              />
              <span
                className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-accent transition-all duration-300 group-hover/cta:w-full"
                aria-hidden="true"
              />
            </Link>
          </SimpleAnimation>
        </div>

        {/* ===== Desktop layout — 3 columns, scroll-driven ===== */}
        <div className="hidden min-h-[350vh] lg:block">
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* 3-column grid */}
            <div className="relative flex h-full items-start px-16 pt-[12vh] xl:px-20">
              {/* Left column — title, scrolls up slightly slower */}
              {prefersReducedMotion ? (
                <div className="w-[22%] pr-8">
                  <h2 id="story-title" className="heading-section text-accent">
                    Notre Histoire
                  </h2>
                </div>
              ) : (
                <m.div
                  className="w-[22%] pr-8 will-change-transform"
                  style={{ y: titleY, opacity: titleCombinedOpacity }}
                >
                  <TextReveal
                    as="h2"
                    mode="scroll"
                    splitBy="words"
                    className="heading-section text-accent"
                  >
                    Notre Histoire
                  </TextReveal>
                </m.div>
              )}

              {/* Center column — sticky photo with zoom + fullscreen expand */}
              {prefersReducedMotion ? (
                <div className="absolute inset-y-0 left-[22%] w-[38%] px-4">
                  <div className="h-full overflow-hidden">
                    <img
                      src="/images/our-story-eyeglasses.jpg"
                      alt="Lunettes artisanales - La Lunetterie du Coin"
                      className="h-full w-full object-cover transition-all duration-500 ease-out hover:scale-105 hover:brightness-110"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <m.div
                  className="absolute inset-y-0 will-change-transform"
                  style={{
                    left: photoLeft,
                    width: photoWidth,
                    paddingLeft: photoPadding,
                    paddingRight: photoPadding,
                    opacity: photoExpandOpacity,
                  }}
                >
                  <m.div className="h-full overflow-hidden" style={{ opacity: entranceOpacity }}>
                    <div className="h-full transition-transform duration-500 ease-out hover:scale-105">
                      <m.img
                        src="/images/our-story-eyeglasses.jpg"
                        alt="Lunettes artisanales - La Lunetterie du Coin"
                        className="h-full w-full object-cover transition-[filter] duration-500 ease-out hover:brightness-110"
                        loading="lazy"
                        style={{ scale: photoScale }}
                      />
                    </div>
                  </m.div>
                </m.div>
              )}

              {/* Right column — body text + CTA, scrolls up */}
              {prefersReducedMotion ? (
                <div className="ml-[38%] w-[40%] pl-8">
                  <p
                    className="text-accent/80"
                    style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.75rem)', lineHeight: 1.7 }}
                  >
                    Tout a commencé avec une conviction&nbsp;: proposer des lunettes de qualité tout
                    en donnant une seconde vie aux montures. Au c&oelig;ur du Faubourg de Pierre à
                    Strasbourg, notre boutique indépendante allie expertise optique, style
                    contemporain et engagement écologique. Chaque paire est sélectionnée avec soin,
                    qu&apos;elle soit neuve ou d&apos;occasion.
                  </p>
                  <Link
                    to="/a-propos"
                    className="group/cta relative mt-8 inline-flex items-center gap-2 text-body font-normal text-accent transition-[font-weight] duration-300 hover:font-semibold"
                  >
                    Nous découvrir
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1"
                      aria-hidden="true"
                    />
                    <span
                      className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-accent transition-all duration-300 group-hover/cta:w-full"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              ) : (
                <m.div
                  className="ml-[38%] w-[40%] pl-8 will-change-transform"
                  style={{ y: textY, opacity: textCombinedOpacity }}
                >
                  <TextReveal
                    as="p"
                    mode="scroll"
                    splitBy="words"
                    className="text-accent/80"
                    style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.75rem)', lineHeight: 1.7 }}
                  >
                    Tout a commencé avec une conviction : proposer des lunettes de qualité tout en
                    donnant une seconde vie aux montures. Au cœur du Faubourg de Pierre à
                    Strasbourg, notre boutique indépendante allie expertise optique, style
                    contemporain et engagement écologique. Chaque paire est sélectionnée avec soin,
                    qu&apos;elle soit neuve ou d&apos;occasion.
                  </TextReveal>
                  <Link
                    to="/a-propos"
                    className="group/cta relative mt-8 inline-flex items-center gap-2 text-body font-normal text-accent transition-[font-weight] duration-300 hover:font-semibold"
                  >
                    Nous découvrir
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1"
                      aria-hidden="true"
                    />
                    <span
                      className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-accent transition-all duration-300 group-hover/cta:w-full"
                      aria-hidden="true"
                    />
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
