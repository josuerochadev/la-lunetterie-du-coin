import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useIsLg } from '@/hooks/useIsLg';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SPRING_CONFIG_SLOW } from '@/lib/motion';

// ── Desktop ─────────────────────────────────────────────────────────────────
//
//  300vh container. VOIR IS the transition between sections.
//  Yellow bg throughout. VOIR zooms fast (Story rhythm).
//  Footer (z-20) covers Contact (z-16) while it stays sticky.
//
//  scroll distance = 200vh
//
//  0.00 – 0.20  "VOIR" zooms scale 12 → 1 (fast, Story rhythm)
//  0.14 – 0.22  "PASSEZ" slides up
//  0.19 – 0.27  "NOUS" slides up
//  0.26 – 0.34  CTA fades in
//  0.34 – 1.00  Hold — footer (z-20) scrolls up and covers this section
// ─────────────────────────────────────────────────────────────────────────────

function ContactDesktop() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  // ── Motif — scale grows through the hold phase ──────────────────────
  const motifScale = useTransform(scrollYProgress, [0.2, 1], [1, 1.4]);

  // ── "VOIR" zoom — scale 12→1, Story-matching pace & spring ────────────
  const voirScaleRaw = useTransform(scrollYProgress, [0.0, 0.2], [12, 1]);
  const voirScale = useSpring(voirScaleRaw, SPRING_CONFIG_SLOW);

  // ── "PASSEZ NOUS" — line 1 ────────────────────────────────────────────
  const passez = useScrollEntrance(scrollYProgress, 0.14, 0.22);

  // ── CTA ──────────────────────────────────────────────────────────────────
  const cta = useScrollEntrance(scrollYProgress, 0.26, 0.34, 30);

  return (
    <div ref={ref} className="hidden h-[300vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden bg-accent">
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
      </div>
    </div>
  );
}

// ── Mobile animated ─────────────────────────────────────────────────────────

function ContactMobileAnimated() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // ── "VOIR" zoom — scale 3→1 (lighter than desktop's 12→1) ──
  const voirScale = useTransform(scrollYProgress, [0.0, 0.2], [3, 1]);
  const voirOpacity = useTransform(scrollYProgress, [0.0, 0.15], [0, 1]);

  // ── "PASSEZ NOUS" — slide up ──
  const passezY = useTransform(scrollYProgress, [0.1, 0.25], [30, 0]);
  const passezOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

  // ── CTA ──
  const ctaOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);

  // ── Motif — subtle scale ──
  const motifScale = useTransform(scrollYProgress, [0.0, 0.5], [1, 1.15]);

  return (
    <div ref={ref} className="relative lg:hidden">
      {/* Circle motif */}
      <m.img
        src="/images/motif-cercle.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
        style={{ scale: motifScale }}
      />

      <div className="relative z-10 mx-auto max-w-container px-container-x py-section">
        <div className="mx-auto max-w-5xl text-center">
          <h2
            className="text-heading text-fluid-hero-sub mb-10 text-black"
            style={{ lineHeight: '0.95' }}
          >
            <m.span className="block" style={{ opacity: passezOpacity, y: passezY }}>
              PASSEZ NOUS
            </m.span>
            <m.span
              className="block origin-center will-change-transform"
              style={{ scale: voirScale, opacity: voirOpacity }}
            >
              VOIR
            </m.span>
          </h2>

          <m.div style={{ opacity: ctaOpacity }} className="will-change-transform">
            <LinkCTA to="/contact" theme="accent">
              Nous contacter
            </LinkCTA>
          </m.div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

/**
 * Section HomeContact — Yellow Punchline
 *
 * Desktop: Sticky viewport with scroll-linked entrance + hold for footer.
 * Mobile animated: Scroll-driven VOIR zoom + motif scale.
 * Reduced-motion: Static layout.
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

      {/* Mobile animated */}
      {!prefersReducedMotion && !isLg && <ContactMobileAnimated />}

      {/* Reduced-motion — static layout */}
      {prefersReducedMotion && (
        <div className="mx-auto max-w-container px-container-x py-section">
          <div className="mx-auto max-w-5xl text-center">
            <h2 id="contact-title" className="text-heading text-fluid-hero-sub mb-10 text-black">
              Passez
              <br />
              nous voir
            </h2>
            <LinkCTA to="/contact" theme="accent">
              Nous contacter
            </LinkCTA>
          </div>
        </div>
      )}
    </section>
  );
}
