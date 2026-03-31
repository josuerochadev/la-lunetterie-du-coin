import { type ReactNode, useRef } from 'react';
import { m, useScroll } from 'framer-motion';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Clock from 'lucide-react/dist/esm/icons/clock';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { useScrollEntrance } from '@/hooks/useScrollEntrance';
import { COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_PHONE } from '@/config/legal';
import { STORE_INFO } from '@/config/store';
import { OPENING_HOURS } from '@/data/contact';

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });

  const title = useScrollEntrance(scrollYProgress, 0.15, 0.3);
  const content = useScrollEntrance(scrollYProgress, 0.25, 0.45);

  return (
    <div ref={sectionRef} className="hidden lg:block">
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
              <address className="mb-3 text-body not-italic text-white">{COMPANY_ADDRESS}</address>
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
              <dl className="space-y-1.5">
                {OPENING_HOURS.map((schedule) => (
                  <div key={schedule.day} className="flex justify-between gap-4 text-body-sm">
                    <dt className="font-medium text-white">{schedule.day}</dt>
                    <dd className="text-white">{schedule.hours}</dd>
                  </div>
                ))}
              </dl>
            </InfoItem>
          </m.div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function ContactInfo() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();

  return (
    <section
      id="informations-pratiques"
      className="relative"
      style={{ background: 'linear-gradient(to bottom, transparent 12vw, #000 12vw)' }}
      data-navbar-theme="light"
    >
      {/* Convex dome — black dome with transparent corners revealing the hero behind */}
      <svg
        className="pointer-events-none absolute left-0 top-0 z-[1] w-full"
        style={{ height: '12vw' }}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,120 Q720,-120 1440,120 Z" fill="#000" />
      </svg>

      {/* Desktop — scroll-driven */}
      {!prefersReducedMotion && isLg && <InfoDesktop />}

      {/* Mobile / reduced-motion fallback */}
      <div className={!prefersReducedMotion && isLg ? 'hidden' : ''}>
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
                  <address className="mb-3 text-body not-italic text-white">
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
                  <dl className="space-y-1.5">
                    {OPENING_HOURS.map((schedule) => (
                      <div key={schedule.day} className="flex justify-between gap-4 text-body-sm">
                        <dt className="font-medium text-white">{schedule.day}</dt>
                        <dd className="text-white">{schedule.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </InfoItem>
              </SimpleAnimation>
            </div>
          </div>
        </div>
      </div>

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
