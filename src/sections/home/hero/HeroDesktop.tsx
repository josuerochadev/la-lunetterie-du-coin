import { useEffect, useState } from 'react';
import { m, useScroll, useSpring, useTransform } from 'framer-motion';

import { InfoAccent, HeroMobileContent } from './HeroMobile';

import ResponsiveImage from '@/components/common/ResponsiveImage';
import { SPRING_CONFIG } from '@/lib/motion';

export function HeroDesktopAnimated() {
  const [choreographyStarted, setChoreographyStarted] = useState(false);
  const [vh, setVh] = useState(() => (typeof window !== 'undefined' ? window.innerHeight : 800));

  useEffect(() => {
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollY } = useScroll();

  const stickyStart = vh * 0.5;
  const stickyEnd = vh * 3.5;
  const scrollRange = stickyEnd - stickyStart;
  const stickyMid = stickyStart + scrollRange * 0.5;

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
  const clipSmooth = useSpring(clipRaw, SPRING_CONFIG);
  const heroClip = useTransform(clipSmooth, (v: number) => `inset(0 ${v}% 0 0)`);

  // Title
  const titleXRaw = useTransform(scrollY, [stickyStart, stickyEnd], ['130vw', '-150vw']);
  const titleX = useSpring(titleXRaw, SPRING_CONFIG);

  // Left photo
  const photoLeftXRaw = useTransform(
    scrollY,
    [stickyStart, stickyStart + scrollRange * 0.35, stickyMid, stickyEnd],
    ['-30vw', '5vw', '20vw', '100vw'],
  );
  const photoLeftX = useSpring(photoLeftXRaw, SPRING_CONFIG);
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
  const photoRightX = useSpring(photoRightXRaw, SPRING_CONFIG);
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
      className="fixed inset-0 z-[10] h-screen w-full overflow-hidden bg-accent"
      style={{ clipPath: heroClip }}
      aria-labelledby="hero-title"
      data-navbar-theme="dark"
    >
      {/* Desktop photos */}
      <m.div
        className="absolute inset-y-0 left-0 z-10 w-[25%] overflow-hidden"
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
        className="absolute left-0 top-0 z-10 h-full w-[35%] overflow-hidden"
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
        className="absolute bottom-[30%] left-0 z-20 w-full"
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
      <div className="absolute bottom-[12%] left-1/2 z-20 flex -translate-x-1/2 gap-12">
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
    </m.section>
  );
}

export function HeroMobileAnimated() {
  return (
    <section
      id="hero"
      className="sticky top-0 z-[11] h-[calc(100vh+8vw)] w-full overflow-hidden bg-accent"
      aria-labelledby="hero-title"
      data-navbar-theme="dark"
    >
      <HeroMobileContent />
    </section>
  );
}

export function HeroStatic() {
  return (
    <section
      id="hero"
      className="sticky top-0 z-[11] h-[calc(100vh+8vw)] w-full overflow-hidden bg-accent lg:relative lg:h-screen"
      aria-labelledby="hero-title"
      data-navbar-theme="dark"
    >
      <HeroMobileContent titleId="hero-title" />
    </section>
  );
}
