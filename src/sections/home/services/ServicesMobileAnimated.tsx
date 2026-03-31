import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import { GrainOverlay } from './GrainOverlay';

import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { HOMEPAGE_SERVICES, HOMEPAGE_SECTIONS } from '@/data/homepage';
import { BOOKING_URL } from '@/config/endpoints';

function ServiceBlock({
  service,
  index,
}: {
  service: (typeof HOMEPAGE_SERVICES)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // ── Photo — clipPath reveal from bottom + subtle parallax ──
  const clipTop = useTransform(scrollYProgress, [0.0, 0.25], [100, 0]);
  const photoClip = useTransform(clipTop, (v) => `inset(0 0 ${v}% 0)`);
  const photoY = useTransform(scrollYProgress, [0, 0.5], ['3%', '-3%']);
  const photoScale = useTransform(scrollYProgress, [0.0, 0.35], [1.06, 1]);

  // ── Text — staggered entrance ──
  const titleOpacity = useTransform(scrollYProgress, [0.12, 0.26], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.12, 0.26], [20, 0]);
  const descOpacity = useTransform(scrollYProgress, [0.17, 0.31], [0, 1]);
  const descY = useTransform(scrollYProgress, [0.17, 0.31], [15, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.22, 0.36], [0, 1]);

  // ── Accent line between services ──
  const lineScale = useTransform(scrollYProgress, [0.0, 0.18], [0, 1]);

  return (
    <article ref={ref} className="relative">
      {/* Accent separator line (skip first) */}
      {index > 0 && (
        <m.div
          className="mx-auto mb-12 h-px w-full origin-left bg-black/10"
          style={{ scaleX: lineScale }}
          aria-hidden="true"
        />
      )}

      {/* Photo with clipPath reveal */}
      <m.div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-sm will-change-[clip-path]"
        style={{ clipPath: photoClip }}
      >
        <m.img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover will-change-transform"
          loading="lazy"
          style={{ y: photoY, scale: photoScale }}
        />
        <GrainOverlay />
      </m.div>

      {/* Text content with staggered entrance */}
      <div className="mt-6 space-y-3">
        <m.h3
          className="text-subtitle text-title-sm text-black"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          {service.title}
        </m.h3>
        <m.p className="text-body text-black" style={{ opacity: descOpacity, y: descY }}>
          {service.description}
        </m.p>
        <m.div className="flex flex-col items-start gap-3" style={{ opacity: ctaOpacity }}>
          <LinkCTA
            to={service.link}
            theme="light"
            aria-label={`En savoir plus sur ${service.title}`}
          >
            En savoir plus
          </LinkCTA>
          {service.title === 'Examens de vue' && (
            <LinkCTA
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              theme="light"
              icon={ExternalLink}
              aria-label="Prendre rendez-vous pour un examen de vue"
            >
              Prendre RDV
            </LinkCTA>
          )}
        </m.div>
      </div>
    </article>
  );
}

export function ServicesMobileAnimated() {
  const titleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: titleProgress } = useScroll({
    target: titleRef,
    offset: ['start end', 'end start'],
  });

  const { scrollYProgress: ctaProgress } = useScroll({
    target: ctaRef,
    offset: ['start end', 'end start'],
  });

  const ctaOpacity = useTransform(ctaProgress, [0.05, 0.25], [0, 1]);
  const ctaY = useTransform(ctaProgress, [0.05, 0.25], [30, 0]);

  return (
    <div className="pointer-events-auto bg-white px-container-x py-section lg:hidden">
      <div className="relative z-10 mx-auto max-w-container">
        <div ref={titleRef}>
          <ScrollWordReveal
            as="h2"
            id="services-title"
            scrollYProgress={titleProgress}
            revealStart={0.0}
            revealEnd={0.2}
            className="heading-section mb-12 text-black"
          >
            {HOMEPAGE_SECTIONS.services.title}
          </ScrollWordReveal>
        </div>

        <div className="flex flex-col gap-16">
          {HOMEPAGE_SERVICES.map((service, index) => (
            <ServiceBlock key={service.title} service={service} index={index} />
          ))}
        </div>

        <div ref={ctaRef} className="mt-16 text-center">
          <m.div style={{ opacity: ctaOpacity, y: ctaY }} className="will-change-transform">
            <LinkCTA
              to={HOMEPAGE_SECTIONS.services.cta.link}
              theme="light"
              aria-label={HOMEPAGE_SECTIONS.services.cta.ariaLabel}
            >
              {HOMEPAGE_SECTIONS.services.cta.text}
            </LinkCTA>
          </m.div>
        </div>
      </div>
    </div>
  );
}
