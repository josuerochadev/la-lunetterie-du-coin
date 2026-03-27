import type { ReactNode, ElementType } from 'react';
import { useRef } from 'react';
import { m, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Clock from 'lucide-react/dist/esm/icons/clock';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LinkCTA from '@/components/common/LinkCTA';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_PHONE } from '@/config/legal';
import { OPENING_HOURS } from '@/data/contact';
import { SPRING_CONFIG } from '@/lib/motion';

// ---------------------------------------------------------------------------
// Stagger child — micro-delayed entrance for each info card
// ---------------------------------------------------------------------------

function StaggerCard({
  children,
  scrollYProgress,
  index,
}: {
  children: ReactNode;
  scrollYProgress: MotionValue<number>;
  index: number;
}) {
  const STAGGER_OFFSET = 0.04;
  const baseStart = 0.25;
  const baseEnd = 0.55;
  const offset = index * STAGGER_OFFSET;

  const opacityRaw = useTransform(scrollYProgress, [baseStart + offset, baseEnd + offset], [0, 1]);
  const opacity = useSpring(opacityRaw, SPRING_CONFIG);
  const yRaw = useTransform(scrollYProgress, [baseStart + offset, baseEnd + offset], [50, 0]);
  const y = useSpring(yRaw, SPRING_CONFIG);

  return (
    <m.div style={{ opacity, y }} className="will-change-transform">
      {children}
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Card content — reused by both desktop and mobile
// ---------------------------------------------------------------------------

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: ElementType;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="group/info relative overflow-hidden rounded-r-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Accent left bar */}
      <div
        className="absolute bottom-0 left-0 top-0 w-1.5 bg-secondary-blue transition-all duration-300 group-hover/info:w-2.5"
        aria-hidden="true"
      />
      {/* Background icon — large, top-left, decorative */}
      <Icon
        className="pointer-events-none absolute -bottom-4 -right-4 h-32 w-32 -rotate-12 text-secondary-green/15 transition-transform duration-500 group-hover/info:rotate-0 group-hover/info:scale-110"
        aria-hidden="true"
        strokeWidth={1}
      />
      <div className="relative z-10 py-6 pl-7 pr-6">
        <h3 className="text-subtitle mb-3 text-title-sm text-black">{title}</h3>
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

  // Title entrance — delayed to appear after dome
  const titleOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const titleYRaw = useTransform(scrollYProgress, [0.15, 0.3], [40, 0]);
  const titleY = useSpring(titleYRaw, SPRING_CONFIG);

  return (
    <div ref={sectionRef} className="hidden lg:block">
      <div className="mx-auto max-w-container px-container-x pb-section pt-[max(12vh,12vw)]">
        <div className="mx-auto max-w-5xl">
          <m.div style={{ opacity: titleOpacity, y: titleY }}>
            <h2 className="heading-section mb-12 text-center text-white lg:mb-16">
              Les infos utiles
            </h2>
          </m.div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Adresse */}
            <StaggerCard scrollYProgress={scrollYProgress} index={0}>
              <InfoCard icon={MapPin} title="Adresse">
                <address className="mb-3 text-body not-italic text-black/50">
                  {COMPANY_ADDRESS}
                </address>
                <LinkCTA
                  href="https://maps.google.com/?q=24+rue+du+Faubourg+de+Pierre+67000+Strasbourg"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={MapPin}
                  theme="light"
                >
                  Voir sur Google Maps
                </LinkCTA>
              </InfoCard>
            </StaggerCard>

            {/* Téléphone */}
            <StaggerCard scrollYProgress={scrollYProgress} index={1}>
              <InfoCard icon={Phone} title="Téléphone">
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="text-body text-black/50 transition-colors hover:text-secondary-orange"
                >
                  {COMPANY_PHONE}
                </a>
              </InfoCard>
            </StaggerCard>

            {/* Email */}
            <StaggerCard scrollYProgress={scrollYProgress} index={2}>
              <InfoCard icon={Mail} title="Email">
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="text-body text-black/50 transition-colors hover:text-secondary-orange"
                >
                  {COMPANY_EMAIL}
                </a>
              </InfoCard>
            </StaggerCard>

            {/* Horaires */}
            <StaggerCard scrollYProgress={scrollYProgress} index={3}>
              <InfoCard icon={Clock} title="Horaires d'ouverture">
                <dl className="space-y-1.5">
                  {OPENING_HOURS.map((schedule) => (
                    <div key={schedule.day} className="flex justify-between text-body-sm">
                      <dt className="font-medium text-black/70">{schedule.day}</dt>
                      <dd className="text-black/50">{schedule.hours}</dd>
                    </div>
                  ))}
                </dl>
              </InfoCard>
            </StaggerCard>
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
          <div className="mx-auto max-w-5xl">
            <SimpleAnimation type="slide-up" delay={0}>
              <h2 className="heading-section mb-12 text-center text-white lg:mb-16">
                Les infos utiles
              </h2>
            </SimpleAnimation>

            <div className="grid gap-6 md:grid-cols-2">
              <SimpleAnimation type="slide-up" delay={0}>
                <InfoCard icon={MapPin} title="Adresse">
                  <address className="mb-3 text-body not-italic text-black/50">
                    {COMPANY_ADDRESS}
                  </address>
                  <a
                    href="https://maps.google.com/?q=24+rue+du+Faubourg+de+Pierre+67000+Strasbourg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-body-sm font-medium text-black transition-colors hover:text-secondary-orange"
                  >
                    Voir sur Google Maps →
                  </a>
                </InfoCard>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={50}>
                <InfoCard icon={Phone} title="Téléphone">
                  <a
                    href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                    className="text-body text-black/50 transition-colors hover:text-secondary-orange"
                  >
                    {COMPANY_PHONE}
                  </a>
                </InfoCard>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <InfoCard icon={Mail} title="Email">
                  <a
                    href={`mailto:${COMPANY_EMAIL}`}
                    className="text-body text-black/50 transition-colors hover:text-secondary-orange"
                  >
                    {COMPANY_EMAIL}
                  </a>
                </InfoCard>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={150}>
                <InfoCard icon={Clock} title="Horaires d'ouverture">
                  <dl className="space-y-1.5">
                    {OPENING_HOURS.map((schedule) => (
                      <div key={schedule.day} className="flex justify-between text-body-sm">
                        <dt className="font-medium text-black/70">{schedule.day}</dt>
                        <dd className="text-black/50">{schedule.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </InfoCard>
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
