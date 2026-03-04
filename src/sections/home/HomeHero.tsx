import { forwardRef, useEffect, useRef, useState } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface HomeHeroProps {
  /** Called ~300ms after choreography starts to reveal the navbar */
  onRevealNavbar?: () => void;
}

/**
 * HomeHero — Full-Screen Manifesto with scroll choreography
 *
 * Desktop: Choreographed entrance sequence triggered when hero becomes ~80% visible:
 *   t=0ms   — Title slides from right
 *   t=300ms — Navbar fades in (via onRevealNavbar callback)
 *   t=500ms — Info blocks slide from opposite sides
 *   t=700ms — Photos slide from right (staggered 100ms)
 *
 * After choreography: scroll-linked parallax (title slower, photos faster).
 * Mobile: SimpleAnimation fallback, no scroll-linked.
 * Reduced motion: everything shown immediately.
 */
const HomeHero = forwardRef<HTMLElement, HomeHeroProps>(({ onRevealNavbar, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [choreographyStarted, setChoreographyStarted] = useState(false);

  // Section scroll tracking (for parallax after choreography)
  const { scrollYProgress } = useScroll({
    target: prefersReducedMotion ? undefined : sectionRef,
    offset: ['start start', 'end start'],
  });

  // Window scroll tracking (for choreography trigger)
  const { scrollY } = useScroll();

  // Trigger choreography when hero is ~80% visible (~35vh scroll)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const unsubscribe = scrollY.on('change', (v) => {
      if (!choreographyStarted && v > window.innerHeight * 0.35) {
        setChoreographyStarted(true);
      }
    });
    return unsubscribe;
  }, [scrollY, choreographyStarted, prefersReducedMotion]);

  // Reveal navbar 300ms after choreography starts
  useEffect(() => {
    if (choreographyStarted && onRevealNavbar) {
      const timer = setTimeout(onRevealNavbar, 300);
      return () => clearTimeout(timer);
    }
  }, [choreographyStarted, onRevealNavbar]);

  // --- Parallax values ---
  // Content: normal speed
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  // Title offset inside content: counteracts for slower parallax (net: -100)
  const titleOffset = useTransform(scrollYProgress, [0, 1], [0, 100]);
  // Photos: faster parallax
  const photoLeftY = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const photoRightY = useTransform(scrollYProgress, [0, 1], [0, -280]);
  // Scroll indicator: fades out after 10% scroll
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Choreography shorthand
  const c = choreographyStarted;

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-accent"
      aria-labelledby="hero-title"
      {...props}
    >
      {/* Inner ref for scroll tracking */}
      <div ref={sectionRef} className="absolute inset-0" aria-hidden="true" />

      {/* ===== Desktop left image — choreography + fast parallax ===== */}
      {prefersReducedMotion ? (
        <div className="absolute -left-[2%] top-[28%] hidden h-[60%] w-[23%] lg:block">
          <div className="group relative h-full w-full cursor-default bg-secondary-stone p-2.5 transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="h-full w-full overflow-hidden">
              <ResponsiveImage
                src="/images/hero-eyeglasses-left.jpg"
                alt="Lunettes élégantes - La Lunetterie du Coin"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                sizes="23vw"
                widths={[384, 640, 768]}
              />
            </div>
          </div>
        </div>
      ) : (
        <m.div
          className="absolute -left-[2%] top-[28%] hidden h-[60%] w-[23%] will-change-transform lg:block"
          initial={{ x: 80, opacity: 0 }}
          animate={c ? { x: 0, opacity: 1 } : { x: 80, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.7 }}
          style={{ y: photoLeftY }}
        >
          <div className="group relative h-full w-full cursor-default bg-secondary-stone p-2.5 transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="h-full w-full overflow-hidden">
              <ResponsiveImage
                src="/images/hero-eyeglasses-left.jpg"
                alt="Lunettes élégantes - La Lunetterie du Coin"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                sizes="23vw"
                widths={[384, 640, 768]}
              />
            </div>
          </div>
        </m.div>
      )}

      {/* ===== Desktop right image — choreography + fast parallax ===== */}
      {prefersReducedMotion ? (
        <div className="absolute right-[3%] top-[6%] hidden h-[50%] w-[20%] lg:block">
          <div className="group relative h-full w-full cursor-default bg-secondary-blue p-2.5 transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="h-full w-full overflow-hidden">
              <ResponsiveImage
                src="/images/hero-eyeglasses-right.jpg"
                alt="Collection de montures - La Lunetterie du Coin"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                sizes="20vw"
                widths={[384, 640, 768, 1024]}
              />
            </div>
          </div>
        </div>
      ) : (
        <m.div
          className="absolute right-[3%] top-[6%] hidden h-[50%] w-[20%] will-change-transform lg:block"
          initial={{ x: 80, opacity: 0 }}
          animate={c ? { x: 0, opacity: 1 } : { x: 80, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.8 }}
          style={{ y: photoRightY }}
        >
          <div className="group relative h-full w-full cursor-default bg-secondary-blue p-2.5 transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="h-full w-full overflow-hidden">
              <ResponsiveImage
                src="/images/hero-eyeglasses-right.jpg"
                alt="Collection de montures - La Lunetterie du Coin"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                sizes="20vw"
                widths={[384, 640, 768, 1024]}
              />
            </div>
          </div>
        </m.div>
      )}

      {/* ===== Content — choreography + parallax ===== */}
      {prefersReducedMotion ? (
        <div className="relative z-10 flex h-full flex-col items-start justify-center px-6 pt-20 sm:px-10 md:px-16 lg:px-[27%]">
          <div className="w-full space-y-8 sm:space-y-10">
            <h1
              id="hero-title"
              className="text-heading text-black"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 7rem)' }}
            >
              Des lunettes qui ont du style, une démarche qui a du sens
            </h1>
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
          </div>
        </div>
      ) : (
        <m.div
          className="relative z-10 flex h-full flex-col items-start justify-center px-6 pt-20 will-change-transform sm:px-10 md:px-16 lg:px-[27%]"
          style={{ y: contentY }}
        >
          <div className="w-full space-y-8 sm:space-y-10">
            {/* Mobile title — SimpleAnimation (unchanged) */}
            <div className="lg:hidden">
              <SimpleAnimation type="slide-up" delay={200} immediate={true}>
                <h1
                  id="hero-title"
                  className="text-heading text-black"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 7rem)' }}
                >
                  Des lunettes qui ont du style, une démarche qui a du sens
                </h1>
              </SimpleAnimation>
            </div>

            {/* Desktop title — slides from right + slower parallax */}
            <m.div
              className="hidden will-change-transform lg:block"
              initial={{ x: '100%', opacity: 0 }}
              animate={c ? { x: 0, opacity: 1 } : { x: '100%', opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ y: titleOffset }}
            >
              <h1
                id="hero-title"
                className="text-heading text-black"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 7rem)' }}
              >
                Des lunettes qui ont du style, une démarche qui a du sens
              </h1>
            </m.div>

            {/* Mobile blocks — SimpleAnimation (unchanged) */}
            <div className="lg:hidden">
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

            {/* Desktop blocks — slide from opposite sides */}
            <div className="hidden flex-wrap gap-4 lg:flex">
              <m.div
                initial={{ x: -50, opacity: 0 }}
                animate={c ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
              >
                <div className="border border-secondary-green px-5 py-4 transition-colors duration-300 hover:bg-secondary-green/10">
                  <p className="text-body-sm text-black">
                    Opticien à<br />
                    Strasbourg
                    <br />
                    depuis 2016.
                  </p>
                </div>
              </m.div>
              <m.div
                initial={{ x: 50, opacity: 0 }}
                animate={c ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
              >
                <div className="border border-secondary-orange px-5 py-4 transition-colors duration-300 hover:bg-secondary-orange/10">
                  <p className="text-body-sm text-black">
                    Neuf &<br />
                    Occasion.
                  </p>
                </div>
              </m.div>
            </div>
          </div>
        </m.div>
      )}

      {/* ===== Scroll indicator ===== */}
      {!prefersReducedMotion && (
        <m.div
          className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1 lg:flex"
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

      {/* ===== Mobile images — unchanged ===== */}
      <div className="absolute -right-[5%] top-[8%] h-[28%] w-[40%] overflow-hidden sm:w-[32%] md:h-[32%] md:w-[26%] lg:hidden">
        <SimpleAnimation type="slide-right" delay={500} immediate={true} className="h-full w-full">
          <div className="group h-full w-full bg-secondary-blue p-2">
            <div className="h-full w-full overflow-hidden">
              <ResponsiveImage
                src="/images/hero-eyeglasses-right.jpg"
                alt="Collection de montures"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                sizes="40vw"
                widths={[384, 640]}
              />
            </div>
          </div>
        </SimpleAnimation>
      </div>

      <div className="absolute -left-[5%] bottom-[5%] h-[28%] w-[40%] overflow-hidden sm:w-[32%] md:h-[32%] md:w-[26%] lg:hidden">
        <SimpleAnimation type="slide-left" delay={600} immediate={true} className="h-full w-full">
          <div className="group h-full w-full bg-secondary-stone p-2">
            <div className="h-full w-full overflow-hidden">
              <ResponsiveImage
                src="/images/hero-eyeglasses-left.jpg"
                alt="Lunettes élégantes"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                sizes="40vw"
                widths={[384, 640]}
              />
            </div>
          </div>
        </SimpleAnimation>
      </div>
    </section>
  );
});

HomeHero.displayName = 'HomeHero';

export default HomeHero;
