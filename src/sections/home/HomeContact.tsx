import { forwardRef, useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.5 };

// ── Desktop ─────────────────────────────────────────────────────────────────
//
//  150vh container → 50vh effective scroll.
//  Content starts nearly visible — just a subtle scale-up polish.
//
//  0.00  Title at 0.85 opacity, scale 0.96
//  0.12  Title fully visible + scale 1
//  0.08  CTA at 0.7 opacity
//  0.20  CTA fully visible
//  0.20 – 1.00  Hold — footer rises from below
// ─────────────────────────────────────────────────────────────────────────────

function ContactDesktop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Title — starts almost visible, subtle scale-up
  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.12], [0.85, 1]);
  const titleScaleRaw = useTransform(scrollYProgress, [0.0, 0.12], [0.96, 1]);
  const titleScale = useSpring(titleScaleRaw, SPRING_CONFIG);

  // CTA — starts mostly visible, settles quickly
  const ctaOpacity = useTransform(scrollYProgress, [0.08, 0.2], [0.7, 1]);
  const ctaYRaw = useTransform(scrollYProgress, [0.08, 0.2], [6, 0]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);

  return (
    <div ref={sectionRef} className="hidden h-[150vh] lg:block">
      <div className="sticky top-0 h-screen overflow-hidden bg-accent">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-10 px-8">
          <m.div style={{ opacity: titleOpacity, scale: titleScale }}>
            <h2
              id="contact-title"
              className="text-heading text-center text-black"
              style={{ fontSize: 'clamp(3.5rem, 12vw, 14rem)', lineHeight: '0.95' }}
            >
              PASSEZ
              <br />
              NOUS VOIR
            </h2>
          </m.div>

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
const HomeContact = forwardRef<HTMLElement>(() => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-accent"
      aria-labelledby="contact-title"
      data-navbar-theme="dark"
    >
      {/* Desktop */}
      {!prefersReducedMotion && <ContactDesktop />}

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
});

HomeContact.displayName = 'HomeContact';

export default HomeContact;
