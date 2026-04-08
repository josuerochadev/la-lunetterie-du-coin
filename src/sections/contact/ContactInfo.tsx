import { type ReactNode, useRef } from 'react';
import { m, useScroll, useTransform, type MotionValue } from 'framer-motion';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Clock from 'lucide-react/dist/esm/icons/clock';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { ConvexDome } from '@/components/common/ConvexDome';
import { OpeningHoursList } from '@/components/common/OpeningHoursList';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
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
// Desktop — scroll-driven staggered entrance
// ---------------------------------------------------------------------------

function InfoDesktop() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-end');

  const title = useScrollEntrance(scrollYProgress, 0.15, 0.3);
  const content = useScrollEntrance(scrollYProgress, 0.25, 0.45);

  return (
    <div ref={ref} className="hidden xl:block">
      <div className="mx-auto max-w-container px-container-x pb-section pt-[max(12vh,12vw)]">
        <div className="mx-auto max-w-4xl">
          <m.div style={{ opacity: title.opacity, y: title.y }}>
            <h2 className="heading-section mb-16 text-center text-white">Les infos utiles</h2>
          </m.div>

          <m.div
            className="grid gap-12 md:grid-cols-2"
            style={{ opacity: content.opacity, y: content.y }}
          >
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

            <InfoItem icon={Phone} title="Téléphone">
              <a
                href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                className="text-body text-white transition-colors hover:text-secondary-orange"
                aria-label={`Appeler le ${COMPANY_PHONE}`}
              >
                {COMPANY_PHONE}
              </a>
            </InfoItem>

            <InfoItem icon={Mail} title="Email">
              <a
                href={`mailto:${COMPANY_EMAIL}`}
                className="text-body text-white transition-colors hover:text-secondary-orange"
                aria-label={`Envoyer un email à ${COMPANY_EMAIL}`}
              >
                {COMPANY_EMAIL}
              </a>
            </InfoItem>

            <InfoItem icon={Clock} title="Horaires d'ouverture">
              <OpeningHoursList />
            </InfoItem>
          </m.div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile — per-item scroll-driven staggered entrance
// ---------------------------------------------------------------------------

function MobileInfoItem({
  children,
  scrollYProgress,
  start,
}: {
  children: ReactNode;
  scrollYProgress: MotionValue<number>;
  start: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, start + 0.14], [0, 1]);
  const y = useTransform(scrollYProgress, [start, start + 0.14], [20, 0]);

  return (
    <m.div style={{ opacity, y }} className="will-change-transform">
      {children}
    </m.div>
  );
}

function InfoMobileAnimated() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0.0, 0.15], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.0, 0.15], [25, 0]);

  return (
    <div ref={ref} className="xl:hidden">
      <div className="mx-auto max-w-container px-container-x pb-section pt-[max(12vh,12vw)]">
        <div className="mx-auto max-w-4xl">
          <m.div style={{ opacity: titleOpacity, y: titleY }} className="will-change-transform">
            <h2 className="heading-section mb-12 text-center text-white">Les infos utiles</h2>
          </m.div>

          <div className="grid gap-10 md:grid-cols-2">
            <MobileInfoItem scrollYProgress={scrollYProgress} start={0.08}>
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
            </MobileInfoItem>

            <MobileInfoItem scrollYProgress={scrollYProgress} start={0.14}>
              <InfoItem icon={Phone} title="Téléphone">
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="text-body text-white transition-colors hover:text-secondary-orange"
                  aria-label={`Appeler le ${COMPANY_PHONE}`}
                >
                  {COMPANY_PHONE}
                </a>
              </InfoItem>
            </MobileInfoItem>

            <MobileInfoItem scrollYProgress={scrollYProgress} start={0.2}>
              <InfoItem icon={Mail} title="Email">
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="text-body text-white transition-colors hover:text-secondary-orange"
                  aria-label={`Envoyer un email à ${COMPANY_EMAIL}`}
                >
                  {COMPANY_EMAIL}
                </a>
              </InfoItem>
            </MobileInfoItem>

            <MobileInfoItem scrollYProgress={scrollYProgress} start={0.26}>
              <InfoItem icon={Clock} title="Horaires d'ouverture">
                <OpeningHoursList />
              </InfoItem>
            </MobileInfoItem>
          </div>
        </div>
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
                  <InfoItem icon={Clock} title="Horaires d'ouverture">
                    <OpeningHoursList />
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
