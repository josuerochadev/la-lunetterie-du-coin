import { type ReactNode } from 'react';
import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Car from 'lucide-react/dist/esm/icons/car';
import Train from 'lucide-react/dist/esm/icons/train';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SPRING_CONFIG } from '@/lib/motion';
import { ACCENT_HEX } from '@/config/design';

// ---------------------------------------------------------------------------
// Location item — icon + text, no card wrapper (same pattern as ContactInfo)
// ---------------------------------------------------------------------------

function LocationItem({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Car;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
        <Icon className="h-5 w-5 text-secondary-blue" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-subtitle mb-2 text-title-sm text-white">{title}</h3>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop — scroll-driven parallax image + staggered content
// ---------------------------------------------------------------------------

function LocationDesktop() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-end');

  // Parallax image — slow vertical drift
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.02]);

  const title = useScrollEntrance(scrollYProgress, 0.15, 0.3);
  const content = useScrollEntrance(scrollYProgress, 0.25, 0.45);
  const footer = useScrollEntrance(scrollYProgress, 0.3, 0.48, 30);

  return (
    <div ref={ref} className="relative hidden min-h-screen w-full xl:block">
      {/* Parallax background image */}
      <div className="absolute inset-0 overflow-hidden">
        <m.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
          <ResponsiveImage
            src="/images/contact-informations-boutique-outside.jpg"
            alt="Façade de La Lunetterie du Coin"
            className="h-full w-full object-cover"
            loading="lazy"
            widths={[640, 1024, 1280, 1920]}
            sizes="100vw"
          />
        </m.div>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto max-w-container px-container-x pb-[50vh] pt-[35vh]">
          <m.div style={{ opacity: title.opacity, y: title.y }}>
            <h2 className="heading-section mb-16 text-center text-white">Comment venir</h2>
          </m.div>

          <m.div
            className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2"
            style={{ opacity: content.opacity, y: content.y }}
          >
            <LocationItem icon={Car} title="En voiture">
              <div className="space-y-2 text-body text-secondary-blue">
                <p>
                  <span className="font-medium text-white">Parking payant</span> : Parking Halles et
                  Opéra Broglie (environ 10 min à pied)
                </p>
              </div>
            </LocationItem>

            <LocationItem icon={Train} title="En transports">
              <div className="space-y-2 text-body text-secondary-blue">
                <p>
                  <span className="font-medium text-white">Tram B, C, F</span> : arrêt Broglie (7
                  min à pied)
                </p>
                <p>
                  <span className="font-medium text-white">Tram A, D</span> : arrêt Ancienne
                  Synagogue / Les Halles (7 min à pied)
                </p>
                <p>
                  <span className="font-medium text-white">Bus C3</span> : arrêt Faubourg de Pierre
                  (2 min à pied)
                </p>
                <p>
                  <span className="font-medium text-white">Bus C6</span> : arrêt Tribunal (5 min à
                  pied)
                </p>
                <p className="pt-2 text-white">
                  À 15 minutes à pied de la gare centrale de Strasbourg
                </p>
              </div>
            </LocationItem>
          </m.div>

          {/* Accessibility + Maps CTA */}
          <m.div
            className="mx-auto mt-12 flex max-w-4xl flex-col items-center justify-between gap-6 sm:flex-row"
            style={{ opacity: footer.opacity, y: footer.y }}
          >
            <p className="text-body text-white">
              <span className="font-medium text-white">Accessibilité :</span> Le magasin est
              accessible aux personnes à mobilité réduite
            </p>
            <LinkCTA
              href="https://maps.google.com/?q=24+rue+du+Faubourg+de+Pierre+67000+Strasbourg"
              target="_blank"
              rel="noopener noreferrer"
              icon={MapPin}
              theme="dark"
            >
              Voir sur Google Maps
            </LinkCTA>
          </m.div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile animated — sticky scrollytelling with pinned parallax photo
//
//  220vh container with sticky viewport
//  Uses useManualScrollProgress('start-start')
//  Total scroll range: 220vh − 100vh = 120vh of pin
//
//  Photo parallax: pinned in bg, gentle scale + Y drift across the whole pin
//  0.00 – 0.10  Title entrance (ScrollWordReveal cascade)
//  0.10 – 0.22  Car item enters
//  0.20 – 0.32  Train item enters
//  0.32 – 0.44  Footer (accessibility + Maps CTA) enters
//  0.44 – 0.78  Hold
//  0.78 – 0.92  Exit — gentle fade + Y drift
// ---------------------------------------------------------------------------

function StaggeredItem({
  children,
  scrollYProgress,
  start,
  end,
}: {
  children: ReactNode;
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const yRaw = useTransform(scrollYProgress, [start, end], [30, 0]);
  const y = useSpring(yRaw, SPRING_CONFIG);

  return (
    <m.div style={{ opacity, y }} className="will-change-transform">
      {children}
    </m.div>
  );
}

function LocationMobileAnimated() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  // Pinned photo: gentle parallax while the section is pinned
  const imageY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.02]);

  // Title entrance
  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.1], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.0, 0.1], [40, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Section-level exit — gentle fade + drift
  const exitOpacity = useTransform(scrollYProgress, [0.78, 0.92], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0.78, 0.92], [0, -30]);

  return (
    <div ref={ref} className="relative h-[220vh] w-full xl:hidden">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Pinned parallax background */}
        <div className="absolute inset-0 overflow-hidden">
          <m.div
            className="absolute inset-0 will-change-transform"
            style={{ y: imageY, scale: imageScale }}
          >
            <ResponsiveImage
              src="/images/contact-informations-boutique-outside.jpg"
              alt="Façade de La Lunetterie du Coin"
              className="h-full w-full object-cover"
              loading="lazy"
              widths={[640, 768, 1024]}
              sizes="100vw"
            />
          </m.div>
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        </div>

        {/* Pinned content */}
        <m.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-container-x"
          style={{ opacity: exitOpacity, y: exitY }}
        >
          <div className="mx-auto w-full max-w-4xl">
            {/* Title */}
            <m.div
              className="mb-8 text-center will-change-transform sm:mb-10"
              style={{ opacity: titleOpacity, y: titleY }}
            >
              <ScrollWordReveal
                as="h2"
                scrollYProgress={scrollYProgress}
                revealStart={0.02}
                revealEnd={0.14}
                className="heading-section text-white"
              >
                Comment venir
              </ScrollWordReveal>
            </m.div>

            {/* Items stacked (Train block is dense, stacking avoids a tall void under Car) */}
            <div className="mx-auto grid max-w-4xl gap-8">
              <StaggeredItem scrollYProgress={scrollYProgress} start={0.1} end={0.22}>
                <LocationItem icon={Car} title="En voiture">
                  <div className="space-y-2 text-body text-secondary-blue">
                    <p>
                      <span className="font-medium text-white">Parking payant</span> : Parking
                      Halles et Opéra Broglie (environ 10 min à pied)
                    </p>
                  </div>
                </LocationItem>
              </StaggeredItem>

              <StaggeredItem scrollYProgress={scrollYProgress} start={0.2} end={0.32}>
                <LocationItem icon={Train} title="En transports">
                  <div className="space-y-1.5 text-body text-secondary-blue">
                    <p>
                      <span className="font-medium text-white">Tram B, C, F</span> : arrêt Broglie
                      (7 min à pied)
                    </p>
                    <p>
                      <span className="font-medium text-white">Tram A, D</span> : arrêt Ancienne
                      Synagogue / Les Halles (7 min à pied)
                    </p>
                    <p>
                      <span className="font-medium text-white">Bus C3</span> : arrêt Faubourg de
                      Pierre (2 min à pied)
                    </p>
                    <p>
                      <span className="font-medium text-white">Bus C6</span> : arrêt Tribunal (5 min
                      à pied)
                    </p>
                  </div>
                </LocationItem>
              </StaggeredItem>

              <StaggeredItem scrollYProgress={scrollYProgress} start={0.32} end={0.44}>
                <div className="flex flex-col items-center gap-4 text-center">
                  <p className="text-body-sm text-white">
                    <span className="font-medium text-white">Accessibilité :</span> magasin
                    accessible aux personnes à mobilité réduite
                  </p>
                  <LinkCTA
                    href="https://maps.google.com/?q=24+rue+du+Faubourg+de+Pierre+67000+Strasbourg"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={MapPin}
                    theme="dark"
                  >
                    Voir sur Google Maps
                  </LinkCTA>
                </div>
              </StaggeredItem>
            </div>
          </div>
        </m.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function ContactLocation() {
  const variant = useResponsiveMotion();

  return (
    <section id="localisation" className="relative bg-black" data-navbar-theme="light">
      {/* Top gradient fade — white → transparent, photo appears progressively */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[35vh]"
        style={{
          background: [
            'linear-gradient(to bottom,',
            'white 0%,',
            'color-mix(in srgb, white 92%, transparent) 10%,',
            'color-mix(in srgb, white 75%, transparent) 25%,',
            'color-mix(in srgb, white 50%, transparent) 42%,',
            'color-mix(in srgb, white 30%, transparent) 58%,',
            'color-mix(in srgb, white 12%, transparent) 74%,',
            'transparent 100%)',
          ].join(' '),
        }}
        aria-hidden="true"
      />

      {/* Desktop — scroll-driven parallax */}
      {variant === 'desktop-animated' && <LocationDesktop />}

      {/* Mobile — sticky scrollytelling with pinned parallax */}
      {variant === 'mobile-animated' && <LocationMobileAnimated />}

      {/* Reduced-motion fallback – static */}
      {variant === 'static' && (
        <div className="relative min-h-screen w-full">
          <ResponsiveImage
            src="/images/contact-informations-boutique-outside.jpg"
            alt="Façade de La Lunetterie du Coin"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            widths={[640, 768, 1024]}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

          <div className="relative z-10 flex items-center">
            <div className="mx-auto max-w-container px-container-x pb-[50vh] pt-[35vh]">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="heading-section mb-12 text-center text-white lg:mb-16">
                  Comment venir
                </h2>
              </SimpleAnimation>

              <div className="mx-auto grid max-w-4xl gap-10">
                <SimpleAnimation type="slide-up" delay={100}>
                  <LocationItem icon={Car} title="En voiture">
                    <div className="space-y-2 text-body text-secondary-blue">
                      <p>
                        <span className="font-medium text-white">Parking payant</span> : Parking
                        Halles et Opéra Broglie (environ 10 min à pied)
                      </p>
                    </div>
                  </LocationItem>
                </SimpleAnimation>

                <SimpleAnimation type="slide-up" delay={150}>
                  <LocationItem icon={Train} title="En transports">
                    <div className="space-y-2 text-body text-secondary-blue">
                      <p>
                        <span className="font-medium text-white">Tram B, C, F</span> : arrêt Broglie
                        (7 min à pied)
                      </p>
                      <p>
                        <span className="font-medium text-white">Tram A, D</span> : arrêt Ancienne
                        Synagogue / Les Halles (7 min à pied)
                      </p>
                      <p>
                        <span className="font-medium text-white">Bus C3</span> : arrêt Faubourg de
                        Pierre (2 min à pied)
                      </p>
                      <p>
                        <span className="font-medium text-white">Bus C6</span> : arrêt Tribunal (5
                        min à pied)
                      </p>
                      <p className="pt-2 text-white">
                        À 15 minutes à pied de la gare centrale de Strasbourg
                      </p>
                    </div>
                  </LocationItem>
                </SimpleAnimation>
              </div>

              <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center gap-6 text-center">
                <SimpleAnimation type="fade" delay={200}>
                  <p className="text-body text-white">
                    <span className="font-medium text-white">Accessibilité :</span> Le magasin est
                    accessible aux personnes à mobilité réduite
                  </p>
                </SimpleAnimation>

                <SimpleAnimation type="fade" delay={250}>
                  <LinkCTA
                    href="https://maps.google.com/?q=24+rue+du+Faubourg+de+Pierre+67000+Strasbourg"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={MapPin}
                    theme="dark"
                  >
                    Voir sur Google Maps
                  </LinkCTA>
                </SimpleAnimation>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Bottom gradient dissolve — photo fades into accent for CTA transition */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[45vh]"
        style={{
          background: [
            'linear-gradient(to bottom,',
            'transparent 0%,',
            `color-mix(in srgb, ${ACCENT_HEX} 5%, transparent) 14%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 15%, transparent) 28%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 30%, transparent) 42%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 50%, transparent) 56%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 72%, transparent) 70%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 88%, transparent) 82%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 96%, transparent) 92%,`,
            `${ACCENT_HEX} 100%)`,
          ].join(' '),
        }}
        aria-hidden="true"
      />
    </section>
  );
}
