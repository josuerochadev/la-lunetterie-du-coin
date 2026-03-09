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
 * Desktop scroll choreography (section is sticky for ~150vh of scroll):
 *   - Title: glides right → left across the viewport (z-20, in front of photos)
 *   - Photos: full-height, glide left → right (opposite), behind title, different speeds
 *   - Info blocks: centered, slide up from bottom sequentially, stop below title
 *
 * Mobile: SimpleAnimation fallback, no scroll-linked parallax.
 * Reduced motion: everything shown immediately.
 */
const HomeHero = forwardRef<HTMLElement, HomeHeroProps>(({ onRevealNavbar, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [choreographyStarted, setChoreographyStarted] = useState(false);

  const { scrollY } = useScroll();

  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Sticky scroll range: hero enters at ~1vh spacer, stays for ~150vh
  const stickyStart = vh;
  const stickyEnd = vh * 2.5;
  const scrollRange = stickyEnd - stickyStart; // ~1.5vh of scroll distance

  // Trigger choreography when hero is fully visible
  useEffect(() => {
    if (prefersReducedMotion) return;

    const unsubscribe = scrollY.on('change', (v) => {
      if (!choreographyStarted && v > vh * 0.95) {
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

  // --- Scroll-linked parallax values (desktop only) ---

  // Spring config: smooth inertia for all scroll-linked motion
  const springConfig = { stiffness: 80, damping: 30, mass: 0.5 };

  // Title: starts off-screen RIGHT, glides left across full viewport, exits left
  const titleXRaw = useTransform(scrollY, [stickyStart, stickyEnd], ['100vw', '-100vw']);
  const titleX = useSpring(titleXRaw, springConfig);

  // Photos: "curtain" effect with 3 keyframes
  // Start far apart → converge at midpoint → separate again as they exit
  const stickyMid = stickyStart + scrollRange * 0.5;

  // Left photo — steady pace, smaller (25%)
  const photoLeftXRaw = useTransform(
    scrollY,
    [stickyStart, stickyMid, stickyEnd],
    ['-60vw', '20vw', '100vw'],
  );
  const photoLeftX = useSpring(photoLeftXRaw, springConfig);
  const photoLeftScale = useTransform(
    scrollY,
    [stickyStart, stickyStart + scrollRange * 0.4],
    [1.03, 1],
  );
  const photoLeftOpacity = useTransform(
    scrollY,
    [stickyStart, stickyMid, stickyEnd],
    [0.7, 1, 0.7],
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

  const block1Y = useTransform(scrollY, [blocksStart, blocksEnd], [120, 0]);
  const block1X = useTransform(scrollY, [blocksStart, blocksEnd], [-20, 0]);
  const block1Opacity = useTransform(scrollY, [blocksStart, blocksEnd], [0, 1]);

  const block2Start = blocksStart + scrollRange * 0.08;
  const block2Y = useTransform(scrollY, [block2Start, blocksEnd], [120, 0]);
  const block2X = useTransform(scrollY, [block2Start, blocksEnd], [20, 0]);
  const block2Opacity = useTransform(scrollY, [block2Start, blocksEnd], [0, 1]);

  // Scroll indicator: fades out when photos enter viewport
  const indicatorOpacity = useTransform(
    scrollY,
    [stickyStart, stickyStart + scrollRange * 0.15],
    [1, 0],
  );

  const c = choreographyStarted;

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-accent"
      aria-labelledby="hero-title"
      {...props}
    >
      {/* ===== Background ===== */}
      <div className="absolute inset-0 bg-accent" aria-hidden="true" />

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
          {/* Left photo — slower, smaller */}
          <m.div
            className="absolute left-0 top-0 z-10 hidden h-full w-[25%] overflow-hidden will-change-transform lg:block"
            initial={{ opacity: 0 }}
            animate={c ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            style={{
              x: photoLeftX,
              scale: photoLeftScale,
              opacity: photoLeftOpacity,
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
    </section>
  );
});

HomeHero.displayName = 'HomeHero';

export default HomeHero;
