import { useRef, useCallback, useEffect } from 'react';
import { m, useTransform, useSpring, useMotionValue, useMotionValueEvent } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useIsLg } from '@/hooks/useIsLg';
import { SPRING_CONFIG_SLOW } from '@/lib/motion';

// ── Desktop ─────────────────────────────────────────────────────────────────
//
//  300vh container. VOIR IS the transition between sections.
//  Starts black (seamless with Testimonials), yellow reveals instantly,
//  VOIR zooms fast (Story rhythm). Footer (z-20) covers Contact (z-16)
//  while it stays sticky.
//
//  scroll distance = 200vh
//
//  0.00 – 0.02  Black overlay fades out (yellow base revealed)
//  0.00 – 0.20  "VOIR" zooms scale 12 → 1 (fast, Story rhythm)
//  0.14 – 0.22  "PASSEZ" slides up
//  0.19 – 0.27  "NOUS" slides up
//  0.26 – 0.34  CTA fades in
//  0.34 – 1.00  Hold — footer (z-20) scrolls up and covers this section
// ─────────────────────────────────────────────────────────────────────────────

function ContactDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // ── Manual scroll progress — bypasses framer-motion useScroll bug ────────
  // useScroll({ target, offset }) returns broken values for deep-page
  // elements behind stacked sticky sections. We compute progress manually
  // from the global scroll position and the element's bounding rect.
  const scrollProgress = useMotionValue(0);

  const updateProgress = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const totalScroll = el.offsetHeight - viewportH;
    // progress 0 = top of section at viewport top
    // progress 1 = bottom of section at viewport bottom
    const raw = -rect.top / totalScroll;
    scrollProgress.set(Math.max(0, Math.min(1, raw)));
  }, [scrollProgress]);

  useEffect(() => {
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [updateProgress]);

  // ── Black overlay — fades out to reveal yellow base ────────────────────
  const blackOverlay = useTransform(scrollProgress, [0.0, 0.02], [1, 0]);

  // ── Motif — scale grows through the hold phase ──────────────────────
  const motifScale = useTransform(scrollProgress, [0.2, 1], [1, 1.4]);

  // ── "VOIR" zoom — scale 12→1, Story-matching pace & spring ────────────
  const voirScaleRaw = useTransform(scrollProgress, [0.0, 0.2], [12, 1]);
  const voirScale = useSpring(voirScaleRaw, SPRING_CONFIG_SLOW);

  // ── "PASSEZ NOUS" — line 1 ────────────────────────────────────────────
  const passez = useScrollEntrance(scrollProgress, 0.14, 0.22);

  // ── CTA ──────────────────────────────────────────────────────────────────
  const cta = useScrollEntrance(scrollProgress, 0.26, 0.34, 30);

  // Navbar theme strip — starts "light" (black bg) then removes when yellow reveals
  const contactStripRef = useRef<HTMLDivElement>(null);
  useMotionValueEvent(blackOverlay, 'change', (v) => {
    if (!contactStripRef.current) return;
    if (v > 0.5) {
      contactStripRef.current.setAttribute('data-navbar-theme', 'light');
    } else {
      contactStripRef.current.removeAttribute('data-navbar-theme');
    }
  });

  return (
    <div ref={sectionRef} className="hidden h-[300vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden bg-accent">
        {/* Black overlay — fades out to reveal yellow base */}
        <m.div
          className="absolute inset-0 z-[1] bg-black"
          style={{ opacity: blackOverlay }}
          aria-hidden="true"
        />

        {/* Circle motif — scale grows through hold phase */}
        <m.img
          src="/images/motif-cercle.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover opacity-20 mix-blend-multiply"
          style={{ scale: motifScale }}
        />

        {/* Content — stacked column, shifted up to clear footer dome */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-10 px-8 pb-[15vh]">
          <h2
            id="contact-title"
            className="text-heading text-center text-black"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 14rem)', lineHeight: '0.95' }}
          >
            <m.span className="block" style={{ opacity: passez.opacity, y: passez.y }}>
              PASSEZ NOUS
            </m.span>
            <m.span className="block origin-center" style={{ scale: voirScale }}>
              VOIR
            </m.span>
          </h2>

          <m.div style={{ opacity: cta.opacity, y: cta.y }}>
            <LinkCTA to="/contact" theme="accent">
              Nous contacter
            </LinkCTA>
          </m.div>
        </div>
        {/* Navbar theme override — light on initial black bg, removed when yellow reveals */}
        <div
          ref={contactStripRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-40 h-20"
          data-navbar-theme-dynamic=""
          data-navbar-theme="light"
        />
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

/**
 * Section HomeContact — Yellow Punchline
 *
 * Desktop: Sticky viewport with scroll-linked entrance + hold for footer.
 * Mobile/reduced-motion: SimpleAnimation fallback.
 *
 * @component
 */
export default function HomeContact() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();

  return (
    <section
      id="contact"
      className="relative w-full bg-accent"
      aria-labelledby="contact-title"
      data-navbar-theme="dark"
    >
      {/* Desktop */}
      {!prefersReducedMotion && isLg && <ContactDesktop />}

      {/* Mobile / reduced-motion — stacked layout */}
      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="mx-auto max-w-container px-container-x py-section">
          <div className="mx-auto max-w-5xl text-center">
            <SimpleAnimation type="slide-up" delay={0}>
              <h2
                id={prefersReducedMotion ? 'contact-title' : undefined}
                className="text-heading text-fluid-hero-sub mb-10 text-black"
              >
                Passez
                <br />
                nous voir
              </h2>
            </SimpleAnimation>

            <SimpleAnimation type="fade" delay={100}>
              <LinkCTA to="/contact" theme="accent">
                Nous contacter
              </LinkCTA>
            </SimpleAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
