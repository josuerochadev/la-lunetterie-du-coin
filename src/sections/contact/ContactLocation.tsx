import { type ReactNode, useRef, useCallback } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Car from 'lucide-react/dist/esm/icons/car';
import Train from 'lucide-react/dist/esm/icons/train';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax image — slow vertical drift
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.02]);

  // Content entrance — triggered when section scrolls in
  const { ref: contentRef, scrollYProgress: contentProgress } =
    useManualScrollProgress('start-end');

  // Combine parallax ref + content ref on the same element
  const combinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      (sectionRef as { current: HTMLDivElement | null }).current = node;
      (contentRef as { current: HTMLDivElement | null }).current = node;
    },
    [sectionRef, contentRef],
  );

  const title = useScrollEntrance(contentProgress, 0.15, 0.3);
  const content = useScrollEntrance(contentProgress, 0.25, 0.45);
  const footer = useScrollEntrance(contentProgress, 0.3, 0.48, 30);

  return (
    <div ref={combinedRef} className="relative hidden min-h-screen w-full lg:block">
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
        <div className="mx-auto max-w-container px-container-x py-section">
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
// Mobile animated — subtle parallax + scroll-driven content entrance
// ---------------------------------------------------------------------------

function LocationMobileAnimated() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Background image: subtle Y parallax (-3% to 3%), scale 1.04→1
  const imageY = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1, 1.01]);

  // Title: opacity + Y entrance (0.05-0.20)
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.05, 0.2], [25, 0]);

  // Car item: opacity + Y (0.12-0.28)
  const item1Opacity = useTransform(scrollYProgress, [0.12, 0.28], [0, 1]);
  const item1Y = useTransform(scrollYProgress, [0.12, 0.28], [20, 0]);

  // Train item: opacity + Y (0.18-0.34)
  const item2Opacity = useTransform(scrollYProgress, [0.18, 0.34], [0, 1]);
  const item2Y = useTransform(scrollYProgress, [0.18, 0.34], [20, 0]);

  // Footer (accessibility + CTA): opacity + Y (0.25-0.40)
  const footerOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
  const footerY = useTransform(scrollYProgress, [0.25, 0.4], [15, 0]);

  return (
    <div ref={ref} className="relative w-full lg:hidden">
      {/* Parallax background */}
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

      <div className="relative z-10 flex items-center">
        <div className="mx-auto max-w-container px-container-x py-section">
          <m.div style={{ opacity: titleOpacity, y: titleY }} className="will-change-transform">
            <h2 className="heading-section mb-12 text-center text-white">Comment venir</h2>
          </m.div>

          <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
            <m.div style={{ opacity: item1Opacity, y: item1Y }} className="will-change-transform">
              <LocationItem icon={Car} title="En voiture">
                <div className="space-y-2 text-body text-secondary-blue">
                  <p>
                    <span className="font-medium text-white">Parking payant</span> : Parking Halles
                    et Opéra Broglie (environ 10 min à pied)
                  </p>
                </div>
              </LocationItem>
            </m.div>

            <m.div style={{ opacity: item2Opacity, y: item2Y }} className="will-change-transform">
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
                    <span className="font-medium text-white">Bus C3</span> : arrêt Faubourg de
                    Pierre (2 min à pied)
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
          </div>

          <m.div
            className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between gap-6 will-change-transform sm:flex-row"
            style={{ opacity: footerOpacity, y: footerY }}
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
// Main
// ---------------------------------------------------------------------------

export default function ContactLocation() {
  const variant = useResponsiveMotion();

  return (
    <section id="localisation" className="relative" data-navbar-theme="light">
      {/* Desktop — scroll-driven parallax */}
      {variant === 'desktop-animated' && <LocationDesktop />}

      {/* Mobile — scroll-driven with subtle parallax */}
      {variant === 'mobile-animated' && <LocationMobileAnimated />}

      {/* Reduced-motion fallback */}
      {variant === 'static' && (
        <div className="relative w-full">
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
            <div className="mx-auto max-w-container px-container-x py-section">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="heading-section mb-12 text-center text-white lg:mb-16">
                  Comment venir
                </h2>
              </SimpleAnimation>

              <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
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

              <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between gap-6 sm:flex-row">
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
    </section>
  );
}
