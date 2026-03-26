import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const STORY_TITLE = 'Notre Histoire';
const STORY_BODY =
  'Romain ouvre La Lunetterie du Coin avec une conviction forte : proposer des lunettes de qualité tout en respectant la planète. Le concept ? Donner une seconde vie aux montures en les restaurant avec soin, tout en proposant une sélection pointue de créateurs indépendants.';
const STORY_BODY_2 =
  "Aujourd'hui, la boutique est devenue une référence à Strasbourg pour celles et ceux qui cherchent des lunettes uniques, un service personnalisé et une démarche qui a du sens.";

// ---------------------------------------------------------------------------
// Desktop animated — scroll-driven photo reveal + text + expansion
//
//  400vh container
//
//  0.00 – 0.10  Photo appears with clipPath reveal (grows from center)
//  0.05 – 0.12  Title "Notre Histoire" enters with Y slide
//  0.10 – 0.30  Photo height grows 60% → 100%, continuous zoom
//  0.12 – 0.30  Body text ScrollWordReveal
//  0.30 – 0.40  Text fades out
//  0.35 – 0.50  Photo expands fullscreen (left + width)
//  0.50 – 0.62  Transition phrase "UNE VISION DIFFÉRENTE" appears
//  0.65 – 0.80  Yellow overlay fills screen
//  0.80 – 1.00  Hold
// ---------------------------------------------------------------------------

function HistoryDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const springConfig = { stiffness: 80, damping: 30, mass: 0.5 };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Phase 1: Photo clipPath reveal + grow
  const photoClipProgress = useTransform(scrollYProgress, [0.02, 0.12], [0, 1]);
  const photoClip = useTransform(photoClipProgress, (v) => {
    const inset = 50 - v * 50;
    return `inset(${inset}% ${inset}% ${inset}% ${inset}%)`;
  });
  const photoHeight = useTransform(scrollYProgress, [0.05, 0.35], ['60%', '100%']);
  const photoScale = useTransform(scrollYProgress, [0.05, 0.45], [1, 1.15]);
  const photoEntranceOpacity = useTransform(scrollYProgress, [0.02, 0.08], [0, 1]);

  // Phase 2: Title + text
  const textOpacity = useTransform(scrollYProgress, [0.08, 0.14], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.08, 0.16], [100, 0]);
  const titleY = useSpring(titleYRaw, springConfig);
  const contentFadeOut = useTransform(scrollYProgress, [0.32, 0.38], [1, 0]);

  // Combined opacities
  const titleCombinedOpacity = useTransform(
    [textOpacity, contentFadeOut] as const,
    ([a, b]: number[]) => Math.min(a, b),
  );
  const textCombinedOpacity = useTransform(
    [textOpacity, contentFadeOut] as const,
    ([a, b]: number[]) => Math.min(a, b),
  );

  // Phase 3: Photo expands fullscreen
  const photoLeft = useTransform(scrollYProgress, [0.38, 0.5], ['28%', '0%']);
  const photoWidth = useTransform(scrollYProgress, [0.38, 0.5], ['36%', '100%']);
  const photoPadding = useTransform(scrollYProgress, [0.38, 0.5], [16, 0]);
  const photoExpandOpacity = useTransform(scrollYProgress, [0.45, 0.55], [1, 0.6]);

  // Phase 4: Transition phrase
  const phraseOpacity = useTransform(scrollYProgress, [0.5, 0.58], [0, 1]);
  const phraseYRaw = useTransform(scrollYProgress, [0.5, 0.58], [40, 0]);
  const phraseY = useSpring(phraseYRaw, springConfig);
  const phraseFadeOut = useTransform(scrollYProgress, [0.68, 0.74], [1, 0]);
  const phrasePointer = useTransform(phraseOpacity, (v) => (v > 0.1 ? 'auto' : 'none'));

  // Phase 5: Yellow overlay — starts right as phrase fades out
  const yellowOverlay = useTransform(scrollYProgress, [0.65, 0.76], [0, 1]);

  // Navbar theme strip — toggle data-navbar-theme attribute via ref
  // IO detects the attribute change on the next scroll-driven resolveTheme()
  const stripRef = useRef<HTMLDivElement>(null);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!stripRef.current) return;
    if (v >= 0.65) {
      stripRef.current.setAttribute('data-navbar-theme', 'dark');
    } else {
      stripRef.current.removeAttribute('data-navbar-theme');
    }
  });

  return (
    <div ref={sectionRef} className="hidden min-h-[400vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative flex h-full items-start px-16 pt-[12vh] xl:px-20">
          {/* Left — title */}
          <m.div
            className="w-[28%] pr-8 will-change-transform"
            style={{ y: titleY, opacity: titleCombinedOpacity }}
          >
            <ScrollWordReveal
              as="h2"
              scrollYProgress={scrollYProgress}
              revealStart={0.08}
              revealEnd={0.18}
              className="heading-section text-white"
            >
              {STORY_TITLE}
            </ScrollWordReveal>
          </m.div>

          {/* Center — photo with clipPath reveal */}
          <m.div
            className="absolute top-1/2 -translate-y-1/2 will-change-transform"
            style={{
              left: photoLeft,
              width: photoWidth,
              height: photoHeight,
              paddingLeft: photoPadding,
              paddingRight: photoPadding,
              opacity: photoExpandOpacity,
            }}
          >
            <m.div
              className="h-full overflow-hidden"
              style={{ opacity: photoEntranceOpacity, clipPath: photoClip }}
            >
              <m.img
                src="/images/about-history-shop-indoors.png"
                alt="Intérieur de La Lunetterie du Coin"
                className="h-full w-full object-cover"
                loading="eager"
                style={{ scale: photoScale }}
              />
            </m.div>
          </m.div>

          {/* Right — body text */}
          <m.div
            className="ml-[36%] w-[36%] pl-8 will-change-transform"
            style={{ opacity: textCombinedOpacity }}
          >
            <ScrollWordReveal
              as="p"
              scrollYProgress={scrollYProgress}
              revealStart={0.12}
              revealEnd={0.25}
              className="text-body-xl text-white/80"
            >
              {STORY_BODY}
            </ScrollWordReveal>

            <m.div className="mt-8" style={{ opacity: textCombinedOpacity }}>
              <ScrollWordReveal
                as="p"
                scrollYProgress={scrollYProgress}
                revealStart={0.22}
                revealEnd={0.32}
                className="text-body-lg text-white/50"
              >
                {STORY_BODY_2}
              </ScrollWordReveal>
            </m.div>
          </m.div>
        </div>

        {/* Transition phrase — "UNE VISION DIFFÉRENTE" */}
        <m.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-8"
          style={{ opacity: phraseOpacity, pointerEvents: phrasePointer }}
        >
          <m.div className="text-center" style={{ y: phraseY, opacity: phraseFadeOut }}>
            <ScrollWordReveal
              as="h3"
              scrollYProgress={scrollYProgress}
              revealStart={0.52}
              revealEnd={0.62}
              className="text-heading text-title-xl text-accent"
            >
              UNE VISION DIFFÉRENTE
            </ScrollWordReveal>
          </m.div>

          <m.div style={{ opacity: phraseFadeOut }}>
            <LinkCTA to="/services" theme="dark">
              Découvrir nos services
            </LinkCTA>
          </m.div>
        </m.div>

        {/* Yellow overlay — transition to Values section */}
        <m.div
          className="pointer-events-none absolute inset-0 z-30 bg-accent"
          style={{ opacity: yellowOverlay }}
          aria-hidden="true"
        />

        {/* Navbar theme override — attribute toggled via ref when yellow
            overlay is visible. IO picks it up as the most nested element. */}
        <div
          ref={stripRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-40 h-20"
          data-navbar-theme-dynamic=""
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AboutHistory() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="histoire"
      className="relative w-full bg-black"
      aria-labelledby="histoire-title"
      data-navbar-theme="light"
    >
      {/* Convex eyelid curve — seamless transition from Hero */}
      <div
        className="pointer-events-none absolute -top-[11vw] left-1/2 h-[45vw] w-[140vw] -translate-x-1/2 rounded-[50%] bg-black"
        aria-hidden="true"
      />

      {/* Desktop animated */}
      {!prefersReducedMotion && <HistoryDesktop />}

      {/* Mobile / reduced-motion fallback */}
      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="relative w-full">
          <SimpleAnimation type="fade" delay={0} immediate>
            <img
              src="/images/about-history-shop-indoors.png"
              alt="Intérieur de La Lunetterie du Coin"
              className="max-h-[80vh] min-h-[50vh] w-full object-cover"
              loading="lazy"
            />
          </SimpleAnimation>

          <div className="absolute bottom-0 left-0 right-0 flex justify-center px-4 pb-8 sm:px-8 sm:pb-12">
            <SimpleAnimation type="slide-up" delay={200}>
              <div className="w-full max-w-4xl space-y-4 bg-black/90 px-container-x py-container-y backdrop-blur-sm">
                <span className="text-body-sm font-medium uppercase tracking-wider text-accent/60">
                  Notre histoire
                </span>
                <h2 id="histoire-title" className="heading-section text-white">
                  Un peu d&apos;histoire
                </h2>
                <p className="text-body-lg leading-relaxed text-white/80">{STORY_BODY}</p>
                <p className="text-body leading-relaxed text-white/50">{STORY_BODY_2}</p>
                <LinkCTA to="/services" theme="dark" className="mt-4">
                  Découvrir nos services
                </LinkCTA>
              </div>
            </SimpleAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
