import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring } from 'framer-motion';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Car from 'lucide-react/dist/esm/icons/car';
import Train from 'lucide-react/dist/esm/icons/train';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { SPRING_CONFIG } from '@/lib/motion';

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
  const contentScroll = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });

  const titleOpacity = useTransform(contentScroll.scrollYProgress, [0.15, 0.3], [0, 1]);
  const titleYRaw = useTransform(contentScroll.scrollYProgress, [0.15, 0.3], [40, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Staggered cards
  const card1Opacity = useTransform(contentScroll.scrollYProgress, [0.2, 0.38], [0, 1]);
  const card1YRaw = useTransform(contentScroll.scrollYProgress, [0.2, 0.38], [50, 0]);
  const card1Y = useSpring(card1YRaw, SPRING_CONFIG);

  const card2Opacity = useTransform(contentScroll.scrollYProgress, [0.25, 0.43], [0, 1]);
  const card2YRaw = useTransform(contentScroll.scrollYProgress, [0.25, 0.43], [50, 0]);
  const card2Y = useSpring(card2YRaw, SPRING_CONFIG);

  const footerOpacity = useTransform(contentScroll.scrollYProgress, [0.3, 0.48], [0, 1]);
  const footerYRaw = useTransform(contentScroll.scrollYProgress, [0.3, 0.48], [30, 0]);
  const footerY = useSpring(footerYRaw, SPRING_CONFIG);

  return (
    <div ref={sectionRef} className="relative hidden min-h-screen w-full lg:block">
      {/* Parallax background image */}
      <div className="absolute inset-0 overflow-hidden">
        <m.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
          <img
            src="/images/contact-informations-boutique-outside.jpg"
            alt="Façade de La Lunetterie du Coin"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </m.div>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto max-w-container px-container-x py-section">
          <m.div style={{ opacity: titleOpacity, y: titleY }}>
            <h2 className="heading-section mb-12 text-center text-white lg:mb-16">Comment venir</h2>
          </m.div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {/* En voiture */}
            <m.div style={{ opacity: card1Opacity, y: card1Y }}>
              <div className="group/loc relative overflow-hidden rounded-r-2xl bg-white/[0.07] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.1]">
                <div
                  className="absolute bottom-0 left-0 top-0 w-1.5 bg-secondary-blue transition-all duration-300 group-hover/loc:w-2.5"
                  aria-hidden="true"
                />
                <div className="py-6 pl-7 pr-6">
                  <div className="mb-4 flex items-center gap-2.5">
                    <Car className="h-5 w-5 text-secondary-green" aria-hidden="true" />
                    <h3 className="text-subtitle text-title-sm text-white">En voiture</h3>
                  </div>
                  <div className="space-y-2 text-body text-white/60">
                    <p>
                      <span className="font-medium text-white/80">Parking payant</span> : Parking
                      Halles et Opéra Broglie (environ 10 min à pied)
                    </p>
                  </div>
                </div>
              </div>
            </m.div>

            {/* En transports */}
            <m.div style={{ opacity: card2Opacity, y: card2Y }}>
              <div className="group/loc relative overflow-hidden rounded-r-2xl bg-white/[0.07] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.1]">
                <div
                  className="absolute bottom-0 left-0 top-0 w-1.5 bg-secondary-blue transition-all duration-300 group-hover/loc:w-2.5"
                  aria-hidden="true"
                />
                <div className="py-6 pl-7 pr-6">
                  <div className="mb-4 flex items-center gap-2.5">
                    <Train className="h-5 w-5 text-secondary-green" aria-hidden="true" />
                    <h3 className="text-subtitle text-title-sm text-white">En transports</h3>
                  </div>
                  <div className="space-y-2 text-body text-white/60">
                    <p>
                      <span className="font-medium text-white/80">Tram B, C, F</span> : arrêt
                      Broglie (7 min à pied)
                    </p>
                    <p>
                      <span className="font-medium text-white/80">Tram A, D</span> : arrêt Ancienne
                      Synagogue / Les Halles (7 min à pied)
                    </p>
                    <p>
                      <span className="font-medium text-white/80">Bus C3</span> : arrêt Faubourg de
                      Pierre (2 min à pied)
                    </p>
                    <p>
                      <span className="font-medium text-white/80">Bus C6</span> : arrêt Tribunal (5
                      min à pied)
                    </p>
                    <p className="pt-2 text-white/40">
                      À 15 minutes à pied de la gare centrale de Strasbourg
                    </p>
                  </div>
                </div>
              </div>
            </m.div>
          </div>

          {/* Accessibility + Maps CTA */}
          <m.div
            className="mx-auto mt-8 flex max-w-4xl flex-col items-center justify-between gap-6 sm:flex-row"
            style={{ opacity: footerOpacity, y: footerY }}
          >
            <p className="text-body text-white/50">
              <span className="font-medium text-white/70">Accessibilité :</span> Le magasin est
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();

  return (
    <section id="localisation" className="relative" data-navbar-theme="light">
      {/* Desktop — scroll-driven parallax */}
      {!prefersReducedMotion && isLg && <LocationDesktop />}

      {/* Mobile / reduced-motion fallback */}
      <div className={!prefersReducedMotion && isLg ? 'hidden' : ''}>
        <div className="relative w-full">
          <img
            src="/images/contact-informations-boutique-outside.jpg"
            alt="Façade de La Lunetterie du Coin"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

          <div className="relative z-10 flex items-center">
            <div className="mx-auto max-w-container px-container-x py-section">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="heading-section mb-12 text-center text-white lg:mb-16">
                  Comment venir
                </h2>
              </SimpleAnimation>

              <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
                <SimpleAnimation type="slide-up" delay={100}>
                  <div className="group/loc relative overflow-hidden rounded-r-2xl bg-white/[0.07] backdrop-blur-sm">
                    <div
                      className="absolute bottom-0 left-0 top-0 w-1.5 bg-secondary-blue"
                      aria-hidden="true"
                    />
                    <div className="py-6 pl-7 pr-6">
                      <div className="mb-4 flex items-center gap-2.5">
                        <Car className="h-5 w-5 text-secondary-green" aria-hidden="true" />
                        <h3 className="text-subtitle text-title-sm text-white">En voiture</h3>
                      </div>
                      <div className="space-y-2 text-body text-white/60">
                        <p>
                          <span className="font-medium text-white/80">Parking payant</span> :
                          Parking Halles et Opéra Broglie (environ 10 min à pied)
                        </p>
                      </div>
                    </div>
                  </div>
                </SimpleAnimation>

                <SimpleAnimation type="slide-up" delay={150}>
                  <div className="group/loc relative overflow-hidden rounded-r-2xl bg-white/[0.07] backdrop-blur-sm">
                    <div
                      className="absolute bottom-0 left-0 top-0 w-1.5 bg-secondary-blue"
                      aria-hidden="true"
                    />
                    <div className="py-6 pl-7 pr-6">
                      <div className="mb-4 flex items-center gap-2.5">
                        <Train className="h-5 w-5 text-secondary-green" aria-hidden="true" />
                        <h3 className="text-subtitle text-title-sm text-white">En transports</h3>
                      </div>
                      <div className="space-y-2 text-body text-white/60">
                        <p>
                          <span className="font-medium text-white/80">Tram B, C, F</span> : arrêt
                          Broglie (7 min à pied)
                        </p>
                        <p>
                          <span className="font-medium text-white/80">Tram A, D</span> : arrêt
                          Ancienne Synagogue / Les Halles (7 min à pied)
                        </p>
                        <p>
                          <span className="font-medium text-white/80">Bus C3</span> : arrêt Faubourg
                          de Pierre (2 min à pied)
                        </p>
                        <p>
                          <span className="font-medium text-white/80">Bus C6</span> : arrêt Tribunal
                          (5 min à pied)
                        </p>
                        <p className="pt-2 text-white/40">
                          À 15 minutes à pied de la gare centrale de Strasbourg
                        </p>
                      </div>
                    </div>
                  </div>
                </SimpleAnimation>
              </div>

              <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center justify-between gap-6 sm:flex-row">
                <SimpleAnimation type="fade" delay={200}>
                  <p className="text-body text-white/50">
                    <span className="font-medium text-white/70">Accessibilité :</span> Le magasin
                    est accessible aux personnes à mobilité réduite
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
      </div>
    </section>
  );
}
