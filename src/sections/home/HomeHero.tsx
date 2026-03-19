import { forwardRef, useEffect, useState } from 'react';
import { m, useScroll, useSpring, useTransform } from 'framer-motion';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface HomeHeroProps {
  /** Called ~200ms after choreography starts to reveal the navbar */
  onRevealNavbar?: () => void;
}

/**
 * HomeHero — "POUR L'AMOUR DES YEUX" with scroll-linked parallax
 *
 * Desktop: fixed overlay revealed via clipPath left → right (curtain effect).
 * No vertical movement — the section is always at the viewport, just clipped.
 *
 *   - ClipPath reveals the section from left to right during spacer scroll
 *   - Title: glides right → left across the viewport (z-20, in front of photos)
 *   - Photos: full-height, glide left → right, behind title, different speeds
 *   - Info blocks: centered, slide up from bottom sequentially
 *
 * Mobile: in-flow section with SimpleAnimation fallback, no scroll-linked parallax.
 * Reduced motion: everything shown immediately, in-flow.
 */
const HomeHero = forwardRef<HTMLElement, HomeHeroProps>(({ onRevealNavbar, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [choreographyStarted, setChoreographyStarted] = useState(false);

  const { scrollY } = useScroll();

  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const isLg = typeof window !== 'undefined' && window.innerWidth >= 1024;

  // Scroll range for parallax (same as before)
  const stickyStart = vh;
  const stickyEnd = vh * 3.5;
  const scrollRange = stickyEnd - stickyStart;

  // Trigger choreography when clip reveal is mostly done
  useEffect(() => {
    if (prefersReducedMotion) return;

    const unsubscribe = scrollY.on('change', (v) => {
      if (!choreographyStarted && v > vh * 0.7) {
        setChoreographyStarted(true);
      }
    });
    return unsubscribe;
  }, [scrollY, choreographyStarted, prefersReducedMotion, vh]);

  // Reveal navbar 200ms after choreography starts
  useEffect(() => {
    if (choreographyStarted && onRevealNavbar) {
      const timer = setTimeout(onRevealNavbar, 200);
      return () => clearTimeout(timer);
    }
  }, [choreographyStarted, onRevealNavbar]);

  // --- Scroll-linked values (desktop only) ---

  const springConfig = { stiffness: 50, damping: 40, mass: 0.8 };

  // ClipPath reveal: entire hero section wipes in from left → right
  const clipRaw = useTransform(scrollY, [vh * 0.2, vh * 1.0], [100, 0]);
  const clipSmooth = useSpring(clipRaw, springConfig);
  const heroClip = useTransform(clipSmooth, (v: number) => `inset(0 ${v}% 0 0)`);

  // Title: starts off-screen RIGHT, glides left across full viewport, exits left
  const titleXRaw = useTransform(scrollY, [stickyStart, stickyEnd], ['100vw', '-100vw']);
  const titleX = useSpring(titleXRaw, springConfig);

  const stickyMid = stickyStart + scrollRange * 0.5;

  // Left photo — parallax movement (entry is handled by clipPath)
  const photoLeftXRaw = useTransform(
    scrollY,
    [stickyStart + scrollRange * 0.3, stickyMid, stickyEnd],
    ['0vw', '20vw', '100vw'],
  );
  const photoLeftX = useSpring(photoLeftXRaw, springConfig);
  const photoLeftScale = useTransform(
    scrollY,
    [stickyStart, stickyStart + scrollRange * 0.4],
    [1.03, 1],
  );

  // Right photo — faster, larger (35%), converges then separates
  const photoRightXRaw = useTransform(
    scrollY,
    [stickyStart, stickyMid, stickyEnd],
    ['-10vw', '47vw', '140vw'],
  );
  const photoRightX = useSpring(photoRightXRaw, springConfig);
  const photoRightScale = useTransform(
    scrollY,
    [stickyStart, stickyStart + scrollRange * 0.3],
    [1.02, 1],
  );
  const photoRightOpacity = useTransform(
    scrollY,
    [stickyStart, stickyMid, stickyEnd],
    [0.7, 1, 0.7],
  );

  // Info blocks: slide up from bottom, staggered
  const blocksStart = stickyStart + scrollRange * 0.3;
  const blocksEnd = stickyStart + scrollRange * 0.6;

  // Fade out all hero content before Story section overlaps
  const heroContentFadeOut = useTransform(
    scrollY,
    [stickyEnd - scrollRange * 0.15, stickyEnd],
    [1, 0],
  );

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

  // Scroll indicator: fades out when parallax starts
  const indicatorOpacity = useTransform(
    scrollY,
    [stickyStart, stickyStart + scrollRange * 0.15],
    [1, 0],
  );

  const c = choreographyStarted;

  return (
    <m.section
      ref={ref}
      id="hero"
      className={
        prefersReducedMotion
          ? 'relative h-screen w-full overflow-hidden bg-[#FEEB09]'
          : 'relative h-screen w-full overflow-hidden bg-[#FEEB09] lg:fixed lg:inset-0 lg:z-[10]'
      }
      style={!prefersReducedMotion && isLg ? { clipPath: heroClip } : undefined}
      aria-labelledby="hero-title"
      {...props}
    >
      {/* ===== Desktop photos — full height, behind title, left → right ===== */}
      {prefersReducedMotion ? (
        <>
          <div className="absolute left-[5%] top-0 hidden h-full w-[25%] overflow-hidden lg:block">
            <ResponsiveImage
              src="/images/hero-eyeglasses-left.jpg"
              alt="Lunettes elegantes - La Lunetterie du Coin"
              className="h-full w-full object-cover"
              loading="eager"
              sizes="25vw"
              widths={[384, 640, 768, 1024]}
            />
          </div>
          <div className="absolute left-[32%] top-0 hidden h-full w-[35%] overflow-hidden lg:block">
            <ResponsiveImage
              src="/images/hero-eyeglasses-right.jpg"
              alt="Collection de montures - La Lunetterie du Coin"
              className="h-full w-full object-cover"
              loading="eager"
              sizes="30vw"
              widths={[384, 640, 768, 1024]}
            />
          </div>
        </>
      ) : (
        <>
          {/* Left photo — revealed by clipPath curtain, then parallax */}
          <m.div
            className="absolute inset-y-0 left-0 z-10 hidden w-[25%] overflow-hidden will-change-transform lg:block"
            style={{
              x: photoLeftX,
              scale: photoLeftScale,
            }}
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

          {/* Right photo — faster, larger */}
          <m.div
            className="absolute left-0 top-0 z-10 hidden h-full w-[35%] overflow-hidden will-change-transform lg:block"
            initial={{ opacity: 0 }}
            animate={c ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.55 }}
            style={{
              x: photoRightX,
              scale: photoRightScale,
              opacity: photoRightOpacity,
            }}
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
        </>
      )}

      {/* ===== Desktop title — in front of photos, right → left ===== */}
      {prefersReducedMotion ? (
        <div className="absolute bottom-[30%] left-0 z-20 hidden w-full lg:block">
          <h1
            id="hero-title"
            className="text-heading whitespace-nowrap text-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            style={{ fontSize: 'clamp(3rem, 10vw, 12rem)' }}
          >
            POUR L&apos;AMOUR DES YEUX
          </h1>
        </div>
      ) : (
        <m.div
          className="absolute bottom-[30%] left-0 z-20 hidden w-full will-change-transform lg:block"
          initial={{ opacity: 0 }}
          animate={c ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
          style={{ x: titleX }}
        >
          <h1
            id="hero-title"
            className="text-heading whitespace-nowrap text-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            style={{ fontSize: 'clamp(3rem, 10vw, 12rem)' }}
          >
            POUR L&apos;AMOUR DES YEUX
          </h1>
        </m.div>
      )}

      {/* ===== Desktop info blocks — centered, slide up sequentially ===== */}
      {prefersReducedMotion ? (
        <div className="absolute bottom-[12%] left-1/2 z-20 hidden -translate-x-1/2 gap-4 lg:flex">
          <div className="border border-secondary-green px-5 py-4">
            <p className="text-body-sm text-black">
              Opticien à<br />
              Strasbourg
              <br />
              depuis 2016.
            </p>
          </div>
          <div className="border border-secondary-orange px-5 py-4">
            <p className="text-body-sm text-black">
              Neuf &<br />
              Occasion.
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-[12%] left-1/2 z-20 hidden -translate-x-1/2 gap-4 will-change-transform lg:flex">
          <m.div
            className="border border-secondary-green px-5 py-4 transition-colors duration-300 hover:bg-secondary-green/10"
            style={{ y: block1Y, x: block1X, opacity: block1Opacity }}
          >
            <p className="text-body-sm text-black">
              Opticien à<br />
              Strasbourg
              <br />
              depuis 2016.
            </p>
          </m.div>
          <m.div
            className="border border-secondary-orange px-5 py-4 transition-colors duration-300 hover:bg-secondary-orange/10"
            style={{ y: block2Y, x: block2X, opacity: block2Opacity }}
          >
            <p className="text-body-sm text-black">
              Neuf &<br />
              Occasion.
            </p>
          </m.div>
        </div>
      )}

      {/* ===== Mobile content ===== */}
      <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-24 pt-20 sm:px-10 md:px-16 lg:hidden">
        <div className="w-full space-y-8 sm:space-y-10">
          <SimpleAnimation type="slide-up" delay={200} immediate={true}>
            <h1
              id="hero-title"
              className="text-heading text-black"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)' }}
            >
              POUR L&apos;AMOUR
              <br />
              DES YEUX
            </h1>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={400} immediate={true}>
            <div className="flex flex-wrap gap-4">
              <div className="border border-secondary-green px-5 py-4 transition-colors duration-300 hover:bg-secondary-green/10">
                <p className="text-body-sm text-black">
                  Opticien à<br />
                  Strasbourg
                  <br />
                  depuis 2016.
                </p>
              </div>
              <div className="border border-secondary-orange px-5 py-4 transition-colors duration-300 hover:bg-secondary-orange/10">
                <p className="text-body-sm text-black">
                  Neuf &<br />
                  Occasion.
                </p>
              </div>
            </div>
          </SimpleAnimation>
        </div>
      </div>

      {/* ===== Mobile images ===== */}
      <div className="absolute -right-[5%] top-[8%] h-[28%] w-[40%] overflow-hidden sm:w-[32%] md:h-[32%] md:w-[26%] lg:hidden">
        <SimpleAnimation type="slide-right" delay={500} immediate={true} className="h-full w-full">
          <ResponsiveImage
            src="/images/hero-eyeglasses-right.jpg"
            alt="Collection de montures"
            className="h-full w-full object-cover"
            loading="eager"
            sizes="40vw"
            widths={[384, 640]}
          />
        </SimpleAnimation>
      </div>

      <div className="absolute -left-[5%] bottom-[5%] h-[28%] w-[40%] overflow-hidden sm:w-[32%] md:h-[32%] md:w-[26%] lg:hidden">
        <SimpleAnimation type="slide-left" delay={600} immediate={true} className="h-full w-full">
          <ResponsiveImage
            src="/images/hero-eyeglasses-left.jpg"
            alt="Lunettes elegantes"
            className="h-full w-full object-cover"
            loading="eager"
            sizes="40vw"
            widths={[384, 640]}
          />
        </SimpleAnimation>
      </div>

      {/* ===== Scroll indicator ===== */}
      {!prefersReducedMotion && (
        <m.div
          className="absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-1 lg:flex"
          style={{ opacity: indicatorOpacity }}
          aria-hidden="true"
        >
          <span className="text-body-xs text-black/40">Défiler</span>
          <m.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5 text-black/40" />
          </m.div>
        </m.div>
      )}
    </m.section>
  );
});

HomeHero.displayName = 'HomeHero';

export default HomeHero;
