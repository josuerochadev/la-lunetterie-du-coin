import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

import { SERVICE_COUNT } from './constants';

import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { SERVICES_DATA, type ServiceData } from '@/data/services';
import { BOOKING_URL } from '@/config/endpoints';

function ServiceBlock({ service, index }: { service: ServiceData; index: number }) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // ── Photo — clipPath reveal from bottom + subtle parallax ──
  const clipTop = useTransform(scrollYProgress, [0.0, 0.25], [100, 0]);
  const photoClip = useTransform(clipTop, (v) => `inset(0 0 ${v}% 0)`);
  const photoY = useTransform(scrollYProgress, [0, 0.5], ['3%', '-3%']);
  const photoScale = useTransform(scrollYProgress, [0.0, 0.25], [1.06, 1]);

  // ── Text — staggered entrance ──
  const counterOpacity = useTransform(scrollYProgress, [0.1, 0.22], [0, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.12, 0.26], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.12, 0.26], [20, 0]);
  const descOpacity = useTransform(scrollYProgress, [0.17, 0.31], [0, 1]);
  const descY = useTransform(scrollYProgress, [0.17, 0.31], [15, 0]);
  const detailsOpacity = useTransform(scrollYProgress, [0.22, 0.36], [0, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.27, 0.4], [0, 1]);

  // ── Accent line between services ──
  const lineScale = useTransform(scrollYProgress, [0.0, 0.18], [0, 1]);

  const isExamens = service.id === 'examens';

  return (
    <article ref={ref} className="relative">
      {/* Accent separator line (skip first) */}
      {index > 0 && (
        <m.div
          className="mx-auto mb-12 h-px w-full origin-left bg-white/15"
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
          loading={index === 0 ? 'eager' : 'lazy'}
          style={{ y: photoY, scale: photoScale }}
        />
      </m.div>

      {/* Text content with staggered entrance */}
      <div className="mt-8">
        <m.span
          className="mb-3 block text-body-sm font-medium uppercase tracking-widest text-white"
          style={{ opacity: counterOpacity }}
        >
          {String(index + 1).padStart(2, '0')} / {String(SERVICE_COUNT).padStart(2, '0')}
        </m.span>

        <m.h3
          className="text-heading mb-4 text-accent"
          style={{
            fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
            lineHeight: '1.1',
            opacity: titleOpacity,
            y: titleY,
          }}
        >
          {service.title}
        </m.h3>

        <m.p
          className="mb-6 text-body-lg leading-relaxed text-secondary-blue"
          style={{ opacity: descOpacity, y: descY }}
        >
          {service.description}
        </m.p>

        <m.ul
          className="mb-6 grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-6"
          style={{ opacity: detailsOpacity }}
        >
          {service.details.map((detail, i) => (
            <li key={i} className="flex gap-2.5 text-body-sm text-white">
              <span
                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-secondary-orange"
                aria-hidden="true"
              />
              <span>{detail}</span>
            </li>
          ))}
        </m.ul>

        {isExamens && (
          <m.div
            className="mb-6 border-l-2 border-accent/30 pl-4"
            style={{ opacity: detailsOpacity }}
          >
            <h4 className="mb-2 text-body-sm font-medium text-white">
              Conditions pour un examen en magasin
            </h4>
            <ul className="space-y-1 text-body-sm text-white">
              <li>
                Ordonnance {'<'} 5 ans (16-42 ans) ou {'<'} 3 ans (42+)
              </li>
              <li>Pas de mention contre-indiquant l&apos;examen hors cabinet</li>
              <li>Non autorisé : diabète, kératocône, glaucome, cataracte</li>
            </ul>
          </m.div>
        )}

        <m.div style={{ opacity: ctaOpacity }}>
          {isExamens ? (
            <LinkCTA
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              theme="dark"
              icon={ExternalLink}
              aria-label="Prendre rendez-vous pour un examen de vue"
            >
              Prendre rendez-vous
            </LinkCTA>
          ) : (
            <LinkCTA to="/contact" theme="dark" aria-label={`En savoir plus sur ${service.title}`}>
              Nous contacter
            </LinkCTA>
          )}
        </m.div>
      </div>
    </article>
  );
}

export function ServicesMobileAnimated() {
  const titleRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: titleProgress } = useScroll({
    target: titleRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div className="px-container-x py-section lg:hidden">
      <div className="mx-auto max-w-container">
        <div ref={titleRef}>
          <ScrollWordReveal
            as="h2"
            id="services-content-title"
            scrollYProgress={titleProgress}
            revealStart={0.0}
            revealEnd={0.2}
            className="heading-section mb-12 text-white"
          >
            Chaque service mérite son moment
          </ScrollWordReveal>
        </div>

        <div className="space-y-16 sm:space-y-20">
          {SERVICES_DATA.map((service, index) => (
            <ServiceBlock key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
