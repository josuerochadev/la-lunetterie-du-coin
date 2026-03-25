import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };
const ZOOM_SPRING = { stiffness: 60, damping: 30, mass: 0.5 };

// ── Desktop ─────────────────────────────────────────────────────────────────
//
//  300vh container. VOIR IS the transition between sections.
//  Starts black (seamless with Testimonials), yellow reveals instantly,
//  VOIR zooms fast (Story rhythm). Footer (z-20) covers Contact (z-16)
//  while it stays sticky.
//
//  scroll distance = 200vh
//
//  0.00 – 0.02  Yellow bg instant reveal
//  0.00 – 0.20  "VOIR" zooms scale 12 → 1 (fast, Story rhythm)
//  0.14 – 0.22  "PASSEZ" slides up
//  0.19 – 0.27  "NOUS" slides up
//  0.26 – 0.34  CTA fades in
//  0.34 – 1.00  Hold — footer (z-20) scrolls up and covers this section
// ─────────────────────────────────────────────────────────────────────────────

function ContactDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // ── Yellow bg — instant reveal ─────────────────────────────────────────
  const yellowBg = useTransform(scrollYProgress, [0.0, 0.02], [0, 1]);

  // ── "VOIR" zoom — scale 12→1, Story-matching pace & spring ────────────
  const voirScaleRaw = useTransform(scrollYProgress, [0.0, 0.2], [12, 1]);
  const voirScale = useSpring(voirScaleRaw, ZOOM_SPRING);

  // ── "PASSEZ" — word 1 ─────────────────────────────────────────────────
  const passezOpacity = useTransform(scrollYProgress, [0.14, 0.22], [0, 1]);
  const passezYRaw = useTransform(scrollYProgress, [0.14, 0.22], [40, 0]);
  const passezY = useSpring(passezYRaw, SPRING_CONFIG);

  // ── "NOUS" — word 2, staggered ────────────────────────────────────────
  const nousOpacity = useTransform(scrollYProgress, [0.19, 0.27], [0, 1]);
  const nousYRaw = useTransform(scrollYProgress, [0.19, 0.27], [40, 0]);
  const nousY = useSpring(nousYRaw, SPRING_CONFIG);

  // ── CTA ──────────────────────────────────────────────────────────────────
  const ctaOpacity = useTransform(scrollYProgress, [0.26, 0.34], [0, 1]);
  const ctaYRaw = useTransform(scrollYProgress, [0.26, 0.34], [30, 0]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);

  return (
    <div ref={sectionRef} className="hidden h-[300vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Yellow bg — instant reveal behind VOIR */}
        <m.div
          className="absolute inset-0 bg-accent"
          style={{ opacity: yellowBg }}
          aria-hidden="true"
        />

        {/* Content — stacked column, centered */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-10 px-8">
          <h2
            id="contact-title"
            className="text-heading text-center text-black"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 14rem)', lineHeight: '0.95' }}
          >
            <m.span className="block" style={{ opacity: passezOpacity, y: passezY }}>
              PASSEZ
            </m.span>
            <m.span className="block" style={{ opacity: nousOpacity, y: nousY }}>
              NOUS
            </m.span>
            <m.span className="block origin-center" style={{ scale: voirScale }}>
              VOIR
            </m.span>
          </h2>

          <m.div style={{ opacity: ctaOpacity, y: ctaY }}>
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
                className="text-heading mb-10 text-black"
                style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', lineHeight: '0.95' }}
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
