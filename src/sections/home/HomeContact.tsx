import { m, useTransform, useSpring } from 'framer-motion';

import LinkCTA from '@/components/common/LinkCTA';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SPRING_CONFIG_SLOW } from '@/lib/motion';

// ── Desktop ─────────────────────────────────────────────────────────────────
//
//  300vh container. VOIR IS the transition between sections.
//  Yellow bg throughout. VOIR zooms fast (Story rhythm).
//  Footer (z-20) covers Contact (inside z-12 wrapper) while it stays sticky.
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
    <div ref={ref} className="hidden h-[300vh] xl:block">
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
//
//  250vh container with sticky viewport.
//  Black overlay fades out (0→0.15) to blend from Testimonials' black bg.
//  "VOIR" zooms during the fade = seamless noir→jaune transition.
//  Entrances compressed into first 35% → long hold for text + CTA.
//
//  scroll distance = 150vh (250vh container − 100vh viewport)
//
//  0.00 – 0.15  Black overlay fades out (seamless Testimonials→Contact)
//  0.00 – 0.22  "VOIR" zoom scale 12→1 (concurrent with fade)
//  0.00 – 0.50  Motif fade-in + zoom 1→2.4 with spring
//  0.15 – 0.25  "PASSEZ" slide-up + fade-in
//  0.20 – 0.30  "NOUS" slide-up + fade-in
//  0.30 – 0.38  CTA slide-up + fade-in
//  0.38 – 1.00  Hold — text + CTA visible, footer covers section
// ─────────────────────────────────────────────────────────────────────────────

function ContactMobileAnimated() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  // ── Black overlay — seamless noir→jaune transition ──
  const overlayOpacity = useTransform(scrollYProgress, [0.0, 0.15], [1, 0]);

  // ── Motif — eye pattern, zoom-in through scroll ──
  const motifScaleRaw = useTransform(scrollYProgress, [0.0, 0.5], [1, 2.4]);
  const motifScale = useSpring(motifScaleRaw, { stiffness: 60, damping: 30 });
  const motifOpacity = useTransform(scrollYProgress, [0.0, 0.15], [0, 0.15]);

  // ── "VOIR" — dramatic zoom-in during reveal (12→1) ──
  const voirScaleRaw = useTransform(scrollYProgress, [0.0, 0.22], [12, 1]);
  const voirScale = useSpring(voirScaleRaw, SPRING_CONFIG_SLOW);
  const voirOpacity = useTransform(scrollYProgress, [0.0, 0.08], [0, 1]);

  // ── "PASSEZ" — slide up after VOIR lands ──
  const passezY = useTransform(scrollYProgress, [0.15, 0.25], [20, 0]);
  const passezOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);

  // ── "NOUS" — staggered after PASSEZ ──
  const nousY = useTransform(scrollYProgress, [0.2, 0.3], [20, 0]);
  const nousOpacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);

  // ── CTA — slide up ──
  const ctaY = useTransform(scrollYProgress, [0.3, 0.38], [24, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.3, 0.38], [0, 1]);

  return (
    <div ref={ref} className="h-[250vh] xl:hidden">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Black overlay — matches Testimonials bg, fades to reveal yellow */}
        <m.div
          className="pointer-events-none absolute inset-0 z-30 bg-black"
          style={{ opacity: overlayOpacity }}
        />

        {/* Eye pattern — cropped by overflow-hidden, subtle texture */}
        <m.img
          src="/images/motif-eye-pattern.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover mix-blend-multiply will-change-transform"
          style={{ scale: motifScale, opacity: motifOpacity }}
        />

        <div className="relative z-10 flex h-full flex-col items-start justify-center px-container-x">
          <h2 id="contact-title" className="text-heading text-fluid-outro text-black">
            {/* PASSEZ — slides up after VOIR lands */}
            <m.span className="block" style={{ opacity: passezOpacity, y: passezY }}>
              PASSEZ
            </m.span>

            {/* NOUS — staggered slide-up */}
            <m.span className="block" style={{ opacity: nousOpacity, y: nousY }}>
              NOUS
            </m.span>

            {/* VOIR — dramatic zoom from huge to normal */}
            <m.span
              className="block origin-left"
              style={{ scale: voirScale, opacity: voirOpacity }}
            >
              VOIR
            </m.span>
          </h2>

          {/* CTA — left-aligned under phrase */}
          <m.div className="mt-8" style={{ opacity: ctaOpacity, y: ctaY }}>
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
 * Mobile animated: Zoomed motif texture + ScrollWordReveal, left-aligned.
 * Reduced-motion: Static layout.
 */
export default function HomeContact() {
  const variant = useResponsiveMotion();

  return (
    <section
      id="contact"
      className="relative w-full bg-accent"
      aria-labelledby="contact-title"
      data-navbar-theme="dark"
    >
      {/* Desktop */}
      {variant === 'desktop-animated' && <ContactDesktop />}

      {/* Mobile animated */}
      {variant === 'mobile-animated' && <ContactMobileAnimated />}

      {/* Reduced-motion — static layout */}
      {variant === 'static' && (
        <div className="relative min-h-svh overflow-hidden lg:min-h-0">
          {/* Eye pattern — static texture */}
          <img
            src="/images/motif-eye-pattern.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-[1.3] object-cover opacity-15 mix-blend-multiply"
          />
          <div className="relative z-10 flex min-h-svh flex-col items-start justify-center px-container-x lg:min-h-0 lg:items-center lg:py-section lg:text-center">
            <h2
              id="contact-title"
              className="text-heading text-fluid-outro lg:text-fluid-hero-sub text-black"
              style={{ lineHeight: '0.95' }}
            >
              PASSEZ
              <br />
              NOUS VOIR
            </h2>
            <div className="mt-8">
              <LinkCTA to="/contact" theme="accent">
                Nous contacter
              </LinkCTA>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
