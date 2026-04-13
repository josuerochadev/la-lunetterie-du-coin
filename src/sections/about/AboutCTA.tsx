import { m, useTransform, useSpring } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';

// ---------------------------------------------------------------------------
// Desktop — sticky with scroll-driven entrance
//
//  300vh container (200vh scroll distance)
//
//  0.00 – 0.15  "YEUX" slides up
//  0.14 – 0.22  "T'AIMENT" slides up
//  0.26 – 0.34  CTA fades in
//  0.34 – 1.00  Hold — footer covers this section
// ---------------------------------------------------------------------------

function CTADesktop() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  // Motif — scale grows through hold phase
  const motifScale = useTransform(scrollYProgress, [0.2, 1], [1, 1.4]);

  // "YEUX" — slides up first
  const yeux = useScrollEntrance(scrollYProgress, 0.0, 0.15);

  // "T'AIMENT" — slides up after YEUX
  const taiment = useScrollEntrance(scrollYProgress, 0.14, 0.22);

  // CTA
  const cta = useScrollEntrance(scrollYProgress, 0.26, 0.34, 30);

  return (
    <div ref={ref} className="hidden h-[300vh] xl:block">
      <div className="sticky top-0 h-screen overflow-hidden bg-accent">
        {/* Circle motif */}
        <m.img
          src="/images/motif-cercle.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover opacity-20 mix-blend-multiply"
          style={{ scale: motifScale }}
        />

        {/* Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-10 px-8 pb-[15vh]">
          <h2
            className="text-heading text-center text-black"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 14rem)', lineHeight: '0.95' }}
          >
            <m.span className="block" style={{ opacity: yeux.opacity, y: yeux.y }}>
              YEUX
            </m.span>
            <m.span className="block" style={{ opacity: taiment.opacity, y: taiment.y }}>
              T&apos;AIMENT
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

// ---------------------------------------------------------------------------
// Mobile — left-aligned, scroll-driven entrances, motif zoom
//
//  250vh container with sticky viewport.
//  Eye pattern zooms in as texture.
//
//  0.00 – 0.10  "YEUX" fade-in + slide up
//  0.10 – 0.20  "T'AIMENT" slide-up + fade-in
//  0.20 – 0.28  Subtitle slide-up + fade-in
//  0.28 – 0.36  CTA slide-up + fade-in
//  0.36 – 1.00  Hold — footer covers section
// ---------------------------------------------------------------------------

function CTAMobile() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  // Eye pattern — zoom through scroll
  const motifScaleRaw = useTransform(scrollYProgress, [0.0, 0.5], [1, 2.4]);
  const motifScale = useSpring(motifScaleRaw, { stiffness: 60, damping: 30 });
  const motifOpacity = useTransform(scrollYProgress, [0.0, 0.15], [0, 0.15]);

  // "YEUX" — fades in first
  const yeuxOpacity = useTransform(scrollYProgress, [0.0, 0.1], [0, 1]);
  const yeuxY = useTransform(scrollYProgress, [0.0, 0.1], [20, 0]);

  // "T'AIMENT" — slides up after YEUX
  const taimentOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);
  const taimentY = useTransform(scrollYProgress, [0.1, 0.2], [20, 0]);

  // Subtitle
  const subtitleOpacity = useTransform(scrollYProgress, [0.2, 0.28], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.2, 0.28], [20, 0]);

  // CTA
  const ctaOpacity = useTransform(scrollYProgress, [0.28, 0.36], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.28, 0.36], [24, 0]);

  return (
    <div ref={ref} className="h-[250vh] xl:hidden">
      <div className="sticky top-0 h-svh overflow-hidden">
        <m.img
          src="/images/motif-eye-pattern.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover mix-blend-multiply will-change-transform"
          style={{ scale: motifScale, opacity: motifOpacity }}
        />

        <div className="relative z-10 flex h-full flex-col items-start justify-center px-container-x">
          <h2 className="text-heading text-fluid-outro text-black">
            <m.span className="block" style={{ opacity: yeuxOpacity, y: yeuxY }}>
              YEUX
            </m.span>
            <m.span className="block" style={{ opacity: taimentOpacity, y: taimentY }}>
              T&apos;AIMENT
            </m.span>
          </h2>

          <m.p
            className="mt-6 text-body-lg text-black"
            style={{ opacity: subtitleOpacity, y: subtitleY }}
          >
            Venez voir par vous-même.
          </m.p>

          <m.div className="mt-8 flex flex-col gap-4" style={{ opacity: ctaOpacity, y: ctaY }}>
            <LinkCTA to="/services" theme="accent">
              Voir nos services
            </LinkCTA>
            <LinkCTA to="/contact" theme="accent">
              Nous contacter
            </LinkCTA>
          </m.div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AboutCTA() {
  const variant = useResponsiveMotion();

  return (
    <div className="relative bg-accent">
      <section
        aria-label="Nous rendre visite"
        className="relative w-full bg-accent"
        data-navbar-theme="dark"
      >
        {/* Desktop */}
        {variant === 'desktop-animated' && <CTADesktop />}

        {/* Mobile animated */}
        {variant === 'mobile-animated' && <CTAMobile />}

        {/* Reduced-motion — static layout */}
        {variant === 'static' && (
          <div className="relative min-h-svh overflow-hidden lg:min-h-0">
            <img
              src="/images/motif-eye-pattern.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-[1.3] object-cover opacity-15 mix-blend-multiply"
            />
            <div className="relative z-10 flex min-h-svh flex-col items-start justify-center px-container-x lg:min-h-0 lg:items-center lg:py-section lg:text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="text-heading text-fluid-outro lg:text-fluid-hero-sub text-black">
                  YEUX
                  <br />
                  T&apos;AIMENT
                </h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mt-6 text-body-lg text-black">Venez voir par vous-même.</p>
              </SimpleAnimation>

              <SimpleAnimation type="fade" delay={200}>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <LinkCTA to="/services" theme="accent">
                    Voir nos services
                  </LinkCTA>
                  <LinkCTA to="/contact" theme="accent">
                    Nous contacter
                  </LinkCTA>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
