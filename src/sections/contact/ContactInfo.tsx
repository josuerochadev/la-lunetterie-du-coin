import { type ReactNode } from 'react';
import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Clock from 'lucide-react/dist/esm/icons/clock';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { ConvexDome } from '@/components/common/ConvexDome';
import { OpeningHoursList } from '@/components/common/OpeningHoursList';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SPRING_CONFIG } from '@/lib/motion';
import { COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_PHONE } from '@/config/legal';
import { STORE_INFO } from '@/config/store';

// ---------------------------------------------------------------------------
// Info item — icon + text, no card wrapper
// ---------------------------------------------------------------------------

function InfoItem({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
        <Icon className="h-6 w-6 text-secondary-blue" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h3 className="text-subtitle mb-3 text-title-sm text-white">{title}</h3>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop — IntersectionObserver-based entrance (flow section, not sticky)
// ---------------------------------------------------------------------------

function InfoDesktop() {
  return (
    <div className="hidden xl:block">
      <div className="mx-auto max-w-container px-container-x pb-section pt-[max(12vh,12vw)]">
        <div className="mx-auto max-w-[1400px]">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 className="heading-section mb-16 text-center text-white">Les infos utiles</h2>
          </SimpleAnimation>

          <div className="grid grid-cols-2 gap-x-[6vw] gap-y-16">
            <SimpleAnimation type="slide-up" delay={0}>
              <InfoItem icon={MapPin} title="Adresse">
                <address className="mb-3 text-body not-italic text-secondary-blue">
                  {COMPANY_ADDRESS}
                </address>
                <LinkCTA
                  href={STORE_INFO.address.googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={MapPin}
                  theme="dark"
                >
                  Voir sur Google Maps
                </LinkCTA>
              </InfoItem>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={80}>
              <InfoItem icon={Clock} title="Horaires">
                <OpeningHoursList />
              </InfoItem>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={160}>
              <InfoItem icon={Mail} title="Email">
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="text-body text-white transition-colors hover:text-secondary-orange"
                  aria-label={`Envoyer un email à ${COMPANY_EMAIL}`}
                >
                  {COMPANY_EMAIL}
                </a>
              </InfoItem>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={240}>
              <InfoItem icon={Phone} title="Téléphone">
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="text-body text-white transition-colors hover:text-secondary-orange"
                  aria-label={`Appeler le ${COMPANY_PHONE}`}
                >
                  {COMPANY_PHONE}
                </a>
              </InfoItem>
            </SimpleAnimation>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile animated — sticky scrollytelling
//
//  200vh container with sticky viewport
//  Uses useManualScrollProgress('start-start')
//  Total scroll range: 200vh − 100vh = 100vh of pin
//
//  0.00 – 0.10  Title entrance (slide-up + ScrollWordReveal)
//  0.10 – 0.20  Address item enters
//  0.18 – 0.28  Hours item enters
//  0.26 – 0.36  Email item enters
//  0.34 – 0.44  Phone item enters
//  0.44 – 0.78  Hold
//  0.78 – 0.92  Exit — gentle fade + Y drift
// ---------------------------------------------------------------------------

function StaggeredItem({
  children,
  scrollYProgress,
  start,
}: {
  children: ReactNode;
  scrollYProgress: MotionValue<number>;
  start: number;
}) {
  const end = start + 0.1;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const yRaw = useTransform(scrollYProgress, [start, end], [30, 0]);
  const y = useSpring(yRaw, SPRING_CONFIG);

  return (
    <m.div style={{ opacity, y }} className="will-change-transform">
      {children}
    </m.div>
  );
}

function InfoMobileAnimated() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  // Title entrance
  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.1], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.0, 0.1], [40, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  // Section-level exit — gentle fade + drift
  const exitOpacity = useTransform(scrollYProgress, [0.78, 0.92], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0.78, 0.92], [0, -30]);

  return (
    <div ref={ref} className="relative h-[200vh] xl:hidden">
      <div className="sticky top-0 h-svh overflow-hidden">
        <m.div
          className="flex h-full flex-col items-center justify-center px-container-x pt-[10vw] sm:pt-[14vw]"
          style={{ opacity: exitOpacity, y: exitY }}
        >
          <div className="mx-auto w-full max-w-4xl">
            {/* Title — centered, ScrollWordReveal cascade */}
            <m.div
              className="mb-6 text-center will-change-transform sm:mb-12"
              style={{ opacity: titleOpacity, y: titleY }}
            >
              <ScrollWordReveal
                as="h2"
                scrollYProgress={scrollYProgress}
                revealStart={0.02}
                revealEnd={0.14}
                className="heading-section text-white"
              >
                Les infos utiles
              </ScrollWordReveal>
            </m.div>

            <div className="grid gap-5 sm:grid-cols-2 sm:gap-10">
              <StaggeredItem scrollYProgress={scrollYProgress} start={0.1}>
                <InfoItem icon={MapPin} title="Adresse">
                  <address className="mb-3 text-body not-italic text-secondary-blue">
                    {COMPANY_ADDRESS}
                  </address>
                  <LinkCTA
                    href={STORE_INFO.address.googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={MapPin}
                    theme="dark"
                  >
                    Voir sur Google Maps
                  </LinkCTA>
                </InfoItem>
              </StaggeredItem>

              <StaggeredItem scrollYProgress={scrollYProgress} start={0.18}>
                <InfoItem icon={Clock} title="Horaires">
                  <OpeningHoursList />
                </InfoItem>
              </StaggeredItem>

              <StaggeredItem scrollYProgress={scrollYProgress} start={0.26}>
                <InfoItem icon={Mail} title="Email">
                  <a
                    href={`mailto:${COMPANY_EMAIL}`}
                    className="text-body text-white transition-colors hover:text-secondary-orange"
                    aria-label={`Envoyer un email à ${COMPANY_EMAIL}`}
                  >
                    {COMPANY_EMAIL}
                  </a>
                </InfoItem>
              </StaggeredItem>

              <StaggeredItem scrollYProgress={scrollYProgress} start={0.34}>
                <InfoItem icon={Phone} title="Téléphone">
                  <a
                    href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                    className="text-body text-white transition-colors hover:text-secondary-orange"
                    aria-label={`Appeler le ${COMPANY_PHONE}`}
                  >
                    {COMPANY_PHONE}
                  </a>
                </InfoItem>
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

export default function ContactInfo() {
  const variant = useResponsiveMotion();

  return (
    <section
      id="informations-pratiques"
      className="relative"
      style={{ background: 'linear-gradient(to bottom, transparent 12vw, #000 12vw)' }}
      data-navbar-theme="light"
    >
      <ConvexDome color="black" />

      {variant === 'desktop-animated' && <InfoDesktop />}
      {variant === 'mobile-animated' && <InfoMobileAnimated />}
      {variant === 'static' && (
        <div>
          <div className="mx-auto max-w-container px-container-x pb-section pt-[max(12vh,12vw)]">
            <div className="mx-auto max-w-4xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="heading-section mb-12 text-center text-white lg:mb-16">
                  Les infos utiles
                </h2>
              </SimpleAnimation>

              <div className="grid gap-10 md:grid-cols-2">
                <SimpleAnimation type="slide-up" delay={0}>
                  <InfoItem icon={MapPin} title="Adresse">
                    <address className="mb-3 text-body not-italic text-secondary-blue">
                      {COMPANY_ADDRESS}
                    </address>
                    <a
                      href={STORE_INFO.address.googleMapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-body-sm font-medium text-white transition-colors hover:text-secondary-orange"
                    >
                      Voir sur Google Maps →
                    </a>
                  </InfoItem>
                </SimpleAnimation>

                <SimpleAnimation type="slide-up" delay={50}>
                  <InfoItem icon={Clock} title="Horaires">
                    <OpeningHoursList />
                  </InfoItem>
                </SimpleAnimation>

                <SimpleAnimation type="slide-up" delay={100}>
                  <InfoItem icon={Mail} title="Email">
                    <a
                      href={`mailto:${COMPANY_EMAIL}`}
                      className="text-body text-white transition-colors hover:text-secondary-orange"
                      aria-label={`Envoyer un email à ${COMPANY_EMAIL}`}
                    >
                      {COMPANY_EMAIL}
                    </a>
                  </InfoItem>
                </SimpleAnimation>

                <SimpleAnimation type="slide-up" delay={150}>
                  <InfoItem icon={Phone} title="Téléphone">
                    <a
                      href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                      className="text-body text-white transition-colors hover:text-secondary-orange"
                      aria-label={`Appeler le ${COMPANY_PHONE}`}
                    >
                      {COMPANY_PHONE}
                    </a>
                  </InfoItem>
                </SimpleAnimation>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom gradient dissolve — smooth black → white for form section transition */}
      <div
        className="pointer-events-none relative z-[1] h-[45vh]"
        style={{
          background: [
            'linear-gradient(to bottom,',
            'black 0%,',
            'color-mix(in srgb, white 5%, black) 14%,',
            'color-mix(in srgb, white 14%, black) 28%,',
            'color-mix(in srgb, white 28%, black) 42%,',
            'color-mix(in srgb, white 45%, black) 56%,',
            'color-mix(in srgb, white 65%, black) 70%,',
            'color-mix(in srgb, white 80%, black) 82%,',
            'color-mix(in srgb, white 92%, black) 92%,',
            'white 100%)',
          ].join(' '),
        }}
        aria-hidden="true"
      />
    </section>
  );
}
