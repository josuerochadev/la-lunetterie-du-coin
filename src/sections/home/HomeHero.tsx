import { useEffect, useState } from 'react';
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
// Mobile content — choreographed entrance mirroring desktop energy
// ---------------------------------------------------------------------------

function HeroMobileContent() {
  const ease = [0.25, 0.1, 0.25, 1] as const;

  return (
    <>
      {/* Photo top-right — slides in from right with scale */}
      <m.div
        className="absolute -right-[3%] top-[6%] z-[5] h-[30%] w-[44%] overflow-hidden sm:w-[36%] md:h-[34%] md:w-[30%] lg:hidden"
        initial={{ x: '60%', opacity: 0, scale: 1.08 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease, delay: 0.3 }}
      >
        <ResponsiveImage
          src="/images/hero-eyeglasses-right.jpg"
          alt="Collection de montures"
          className="h-full w-full object-cover"
          loading="eager"
          sizes="44vw"
          widths={[384, 640]}
        />
      </m.div>

      {/* Photo bottom-left — slides in from left with scale */}
      <m.div
        className="absolute -left-[3%] bottom-[18%] z-[5] h-[30%] w-[44%] overflow-hidden sm:w-[36%] md:h-[34%] md:w-[30%] lg:hidden"
        initial={{ x: '-60%', opacity: 0, scale: 1.08 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease, delay: 0.5 }}
      >
        <ResponsiveImage
          src="/images/hero-eyeglasses-left.jpg"
          alt="Lunettes elegantes"
          className="h-full w-full object-cover"
          loading="eager"
          sizes="44vw"
          widths={[384, 640]}
        />
      </m.div>

      {/* Title — centred, slides up with fade */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-container-x lg:hidden">
        <m.h1
          id="hero-title"
          className="text-heading text-center text-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
          style={{ fontSize: 'clamp(2.4rem, 9vw, 4.5rem)' }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.15 }}
        >
          POUR L&apos;AMOUR
          <br />
          DES YEUX
        </m.h1>
      </div>

      {/* Info accents — staggered cascade at the bottom */}
      <div className="absolute bottom-[6%] left-0 z-10 flex w-full justify-center gap-10 px-container-x lg:hidden">
        <m.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease, delay: 0.7 }}
        >
          <InfoAccent color="green" keyword="Strasbourg" detail="Opticien depuis 2016." />
        </m.div>
        <m.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease, delay: 0.85 }}
        >
          <InfoAccent color="orange" keyword="Neuf & Occasion" detail="Montures pour tous." />
        </m.div>
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
      className="relative h-screen w-full overflow-hidden bg-accent lg:fixed lg:inset-0 lg:z-[10]"
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
          <InfoAccent color="orange" keyword="Neuf & Occasion" detail="Montures pour tous." />
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
      className="relative h-screen w-full overflow-hidden bg-accent"
      aria-labelledby="hero-title"
      data-navbar-theme="dark"
    >
      <HeroMobileContent />
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
