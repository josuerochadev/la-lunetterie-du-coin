import { useCallback, useEffect, useRef, useState } from 'react';
import { m, useScroll, useSpring, useTransform } from 'framer-motion';

import ResponsiveImage from '@/components/common/ResponsiveImage';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** Typographic info accent — keyword in display font with colored underline */
function InfoAccent({
  color,
  keyword,
  detail,
}: {
  color: 'green' | 'orange';
  keyword: string;
  detail: string;
}) {
  const barColor = color === 'green' ? 'bg-secondary-green' : 'bg-secondary-orange';
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-title-sm uppercase leading-none text-black">
        {keyword}
      </span>
      <div className={`h-[3px] w-8 ${barColor}`} />
      <span className="text-body-sm text-black/70">{detail}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile content — bold maximalist stacked words with word-by-word reveal
// ---------------------------------------------------------------------------

/** Words config — fillWidth: true means the word stretches to viewport width */
const HERO_WORDS = [
  { text: 'POUR', fillWidth: true },
  { text: "L'AMOUR", fillWidth: true },
  { text: 'DES', fillWidth: false },
  { text: 'YEUX', fillWidth: true },
];

/** Base font size used for measurement */
const BASE_FONT_SIZE = 100;

/**
 * Calculates the exact font-size (in px) so that the text fills the target width.
 * Renders a hidden span at a known size, measures, then scales proportionally.
 */
function useFitFontSize(fillWidth: boolean) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<number>(0);

  const measure = useCallback(() => {
    const el = measureRef.current;
    if (!el) return;
    const targetWidth = fillWidth ? window.innerWidth : window.innerWidth * 0.4;
    const naturalWidth = el.offsetWidth;
    if (naturalWidth > 0) {
      setFontSize((targetWidth / naturalWidth) * BASE_FONT_SIZE);
    }
  }, [fillWidth]);

  useEffect(() => {
    // Wait for fonts + layout
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    } else {
      requestAnimationFrame(() => requestAnimationFrame(measure));
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return { measureRef, fontSize };
}

/** Single word — measures itself, scroll-driven reveal with TextReveal easing */
function FitWord({
  word,
  index,
  scrollY,
  revealStart,
}: {
  word: (typeof HERO_WORDS)[number];
  index: number;
  scrollY: ReturnType<typeof useScroll>['scrollY'];
  revealStart: number;
}) {
  const { measureRef, fontSize } = useFitFontSize(word.fillWidth);

  // Each word reveals over 150px of scroll, staggered by 60px per word
  const wordStart = revealStart + index * 60;
  const wordEnd = wordStart + 150;
  const y = useTransform(scrollY, [wordStart, wordEnd], ['110%', '0%']);
  const opacity = useTransform(scrollY, [wordStart, wordEnd], [0, 1]);

  return (
    <div className="relative w-full">
      {/* Hidden measurement span */}
      <span
        ref={measureRef}
        className="pointer-events-none absolute left-0 top-0 whitespace-nowrap font-display font-black uppercase opacity-0"
        style={{ fontSize: BASE_FONT_SIZE }}
        aria-hidden="true"
      >
        {word.text}
      </span>

      {/* Visible word — scroll-driven clip reveal */}
      <div className="overflow-hidden">
        <m.span className="block" style={{ y, opacity }}>
          <span
            className="block whitespace-nowrap font-display font-black uppercase leading-[0.82] text-black"
            style={{ fontSize: fontSize || undefined }}
            aria-hidden="true"
          >
            {word.text}
          </span>
        </m.span>
      </div>
    </div>
  );
}

/** Info accents stacked and centred below the title, scroll-driven */
function HeroMobileAccents({
  scrollY,
  revealStart,
}: {
  scrollY: ReturnType<typeof useScroll>['scrollY'];
  revealStart: number;
}) {
  // Accents appear well after all 4 words have revealed — generous delay + stagger
  const accentsStart = revealStart + HERO_WORDS.length * 60 + 250;

  const accent1Y = useTransform(scrollY, [accentsStart, accentsStart + 180], [40, 0]);
  const accent1Opacity = useTransform(scrollY, [accentsStart, accentsStart + 180], [0, 1]);
  const accent2Y = useTransform(scrollY, [accentsStart + 140, accentsStart + 320], [40, 0]);
  const accent2Opacity = useTransform(scrollY, [accentsStart + 140, accentsStart + 320], [0, 1]);

  return (
    <div className="mx-auto flex flex-1 flex-col items-start justify-center gap-4 lg:hidden">
      <m.div style={{ y: accent1Y, opacity: accent1Opacity }}>
        <InfoAccent color="green" keyword="Strasbourg" detail="Opticien depuis 2016." />
      </m.div>
      <m.div style={{ y: accent2Y, opacity: accent2Opacity }}>
        <InfoAccent color="orange" keyword="Neuf & Occasion" detail="Du neuf, du vécu, du style." />
      </m.div>
    </div>
  );
}

function HeroMobileContent({ titleId }: { titleId?: string }) {
  const { scrollY } = useScroll();
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Hero section starts after the 200vh spacer.
  // Words start revealing when the hero section is near the viewport center.
  const revealStart = vh * 1.4;

  return (
    <>
      {/* Title — stacked words pinned to top, each fills viewport width */}
      <div className="absolute inset-x-0 bottom-[calc(11vw+0.75rem)] top-0 z-10 -mt-[0.1em] flex flex-col lg:hidden">
        <h1 id={titleId} className="sr-only">
          POUR L&apos;AMOUR DES YEUX
        </h1>
        {HERO_WORDS.map((word, i) => (
          <FitWord
            key={word.text}
            word={word}
            index={i}
            scrollY={scrollY}
            revealStart={revealStart}
          />
        ))}

        {/* Info accents — right-aligned, stacked below title words */}
        <HeroMobileAccents scrollY={scrollY} revealStart={revealStart} />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Desktop animated — all scroll hooks live here
// ---------------------------------------------------------------------------

function HeroAnimated() {
  const [choreographyStarted, setChoreographyStarted] = useState(false);
  const [vh, setVh] = useState(() => (typeof window !== 'undefined' ? window.innerHeight : 800));
  const [isLg, setIsLg] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024,
  );

  useEffect(() => {
    const handleResize = () => {
      setVh(window.innerHeight);
      setIsLg(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollY } = useScroll();
  const springConfig = { stiffness: 80, damping: 30, mass: 0.5 };

  const stickyStart = vh * 0.5;
  const stickyEnd = vh * 3.5;
  const scrollRange = stickyEnd - stickyStart;
  const stickyMid = stickyStart + scrollRange * 0.5;

  // Trigger choreography when clip reveal is mostly done
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (v) => {
      if (!choreographyStarted && v > vh * 0.3) {
        setChoreographyStarted(true);
      }
    });
    return unsubscribe;
  }, [scrollY, choreographyStarted, vh]);

  // ClipPath reveal
  const clipRaw = useTransform(scrollY, [vh * 0.05, vh * 0.5], [100, 0]);
  const clipSmooth = useSpring(clipRaw, springConfig);
  const heroClip = useTransform(clipSmooth, (v: number) => `inset(0 ${v}% 0 0)`);

  // Title
  const titleXRaw = useTransform(scrollY, [stickyStart, stickyEnd], ['130vw', '-150vw']);
  const titleX = useSpring(titleXRaw, springConfig);

  // Left photo
  const photoLeftXRaw = useTransform(
    scrollY,
    [stickyStart, stickyStart + scrollRange * 0.35, stickyMid, stickyEnd],
    ['-30vw', '5vw', '20vw', '100vw'],
  );
  const photoLeftX = useSpring(photoLeftXRaw, springConfig);
  const photoLeftScale = useTransform(
    scrollY,
    [stickyStart, stickyStart + scrollRange * 0.4],
    [1.03, 1],
  );

  // Right photo
  const photoRightXRaw = useTransform(
    scrollY,
    [stickyStart + scrollRange * 0.08, stickyStart + scrollRange * 0.4, stickyMid, stickyEnd],
    ['-40vw', '40vw', '55vw', '130vw'],
  );
  const photoRightX = useSpring(photoRightXRaw, springConfig);
  const photoRightScale = useTransform(
    scrollY,
    [stickyStart, stickyStart + scrollRange * 0.3],
    [1.02, 1],
  );
  const photoRightOpacityRaw = useTransform(
    scrollY,
    [stickyStart + scrollRange * 0.08, stickyStart + scrollRange * 0.25, stickyMid, stickyEnd],
    [0, 1, 1, 0.7],
  );

  // Info blocks
  const blocksStart = stickyStart + scrollRange * 0.3;
  const blocksEnd = stickyStart + scrollRange * 0.6;

  // Fade out before Story
  const heroContentFadeOut = useTransform(
    scrollY,
    [stickyEnd - scrollRange * 0.25, stickyEnd - scrollRange * 0.05],
    [1, 0],
  );

  const photoLeftOpacity = heroContentFadeOut;
  const photoRightOpacity = useTransform(
    [photoRightOpacityRaw, heroContentFadeOut] as const,
    ([fadeIn, fadeOut]: number[]) => Math.min(fadeIn, fadeOut),
  );
  const titleOpacity = heroContentFadeOut;

  const block1Y = useTransform(scrollY, [blocksStart, blocksEnd], [120, 0]);
  const block1X = useTransform(scrollY, [blocksStart, blocksEnd], [-20, 0]);
  const block1OpacityIn = useTransform(scrollY, [blocksStart, blocksEnd], [0, 1]);
  const block1Opacity = useTransform(
    [block1OpacityIn, heroContentFadeOut] as const,
    ([fadeIn, fadeOut]: number[]) => Math.min(fadeIn, fadeOut),
  );

  const block2Start = blocksStart + scrollRange * 0.08;
  const block2Y = useTransform(scrollY, [block2Start, blocksEnd], [120, 0]);
  const block2X = useTransform(scrollY, [block2Start, blocksEnd], [20, 0]);
  const block2OpacityIn = useTransform(scrollY, [block2Start, blocksEnd], [0, 1]);
  const block2Opacity = useTransform(
    [block2OpacityIn, heroContentFadeOut] as const,
    ([fadeIn, fadeOut]: number[]) => Math.min(fadeIn, fadeOut),
  );

  const c = choreographyStarted;

  return (
    <m.section
      id="hero"
      className="relative h-[calc(100vh+8vw)] w-full overflow-hidden bg-accent lg:fixed lg:inset-0 lg:z-[10]"
      style={isLg ? { clipPath: heroClip } : undefined}
      aria-labelledby="hero-title"
      data-navbar-theme="dark"
    >
      {/* Desktop photos */}
      <m.div
        className="absolute inset-y-0 left-0 z-10 hidden w-[25%] overflow-hidden lg:block"
        style={{ x: photoLeftX, scale: photoLeftScale, opacity: photoLeftOpacity }}
      >
        <ResponsiveImage
          src="/images/hero-eyeglasses-left.jpg"
          alt="Lunettes elegantes - La Lunetterie du Coin"
          className="h-full w-full object-cover"
          loading="eager"
          sizes="25vw"
          widths={[384, 640, 768, 1024]}
        />
      </m.div>

      <m.div
        className="absolute left-0 top-0 z-10 hidden h-full w-[35%] overflow-hidden lg:block"
        style={{ x: photoRightX, scale: photoRightScale, opacity: photoRightOpacity }}
      >
        <ResponsiveImage
          src="/images/hero-eyeglasses-right.jpg"
          alt="Collection de montures - La Lunetterie du Coin"
          className="h-full w-full object-cover"
          loading="eager"
          sizes="30vw"
          widths={[384, 640, 768, 1024]}
        />
      </m.div>

      {/* Desktop title */}
      <m.div
        className="absolute bottom-[30%] left-0 z-20 hidden w-full lg:block"
        style={{ x: titleX, opacity: titleOpacity }}
      >
        <m.div
          initial={{ opacity: 0 }}
          animate={c ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
        >
          <h1
            id="hero-title"
            className="text-heading whitespace-nowrap text-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            style={{ fontSize: 'clamp(3rem, 10vw, 12rem)' }}
          >
            POUR L&apos;AMOUR DES YEUX
          </h1>
        </m.div>
      </m.div>

      {/* Desktop info accents */}
      <div className="absolute bottom-[12%] left-1/2 z-20 hidden -translate-x-1/2 gap-12 lg:flex">
        <m.div style={{ y: block1Y, x: block1X, opacity: block1Opacity }}>
          <InfoAccent color="green" keyword="Strasbourg" detail="Opticien depuis 2016." />
        </m.div>
        <m.div style={{ y: block2Y, x: block2X, opacity: block2Opacity }}>
          <InfoAccent
            color="orange"
            keyword="Neuf & Occasion"
            detail="Du neuf, du vécu, du style."
          />
        </m.div>
      </div>

      {/* Mobile */}
      <HeroMobileContent />
    </m.section>
  );
}

// ---------------------------------------------------------------------------
// Static fallback — reduced motion
// ---------------------------------------------------------------------------

function HeroStatic() {
  return (
    <section
      id="hero"
      className="relative h-[calc(100vh+8vw)] w-full overflow-hidden bg-accent lg:h-screen"
      aria-labelledby="hero-title"
      data-navbar-theme="dark"
    >
      <HeroMobileContent titleId="hero-title" />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function HomeHero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return <HeroStatic />;
  return <HeroAnimated />;
}

export default HomeHero;
