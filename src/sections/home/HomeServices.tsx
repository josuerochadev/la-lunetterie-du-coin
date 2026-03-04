import { forwardRef, useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollParallaxImage from '@/components/motion/ScrollParallaxImage';
import TextReveal from '@/components/motion/TextReveal';
import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { HOMEPAGE_SERVICES, HOMEPAGE_SECTIONS } from '@/data/homepage';

/**
 * EyePattern with horizontal drift on scroll.
 */
function DriftingEyePattern() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <m.div className="absolute inset-0 w-[200%]" style={{ x }}>
        <EyePattern variant="jaune" opacity={0.05} />
      </m.div>
    </div>
  );
}

/**
 * Section HomeServices — Immersive Gallery
 *
 * Full-width alternating rows (image 60-70% + text 30-40%).
 * Odd: image left. Even: image right. Editorial feel.
 * ScrollParallaxImage per service, TextReveal on title.
 * EyePattern with horizontal drift on scroll.
 *
 * Mobile: simple stack (image top, text below). SimpleAnimation fallback.
 *
 * @component
 */
const HomeServices = forwardRef<HTMLElement>(() => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="services"
      className="relative w-full overflow-hidden bg-black py-section"
      aria-labelledby="services-title"
    >
      {/* EyePattern with drift (desktop) / static (mobile/reduced) */}
      {prefersReducedMotion ? (
        <EyePattern variant="jaune" opacity={0.05} />
      ) : (
        <DriftingEyePattern />
      )}

      <div className="relative z-10 mx-auto max-w-container px-container-x">
        {/* Header */}
        <div className="mb-16 max-w-2xl lg:mb-24">
          {/* Mobile: SimpleAnimation. Desktop: TextReveal */}
          <div className="lg:hidden">
            <SimpleAnimation type="slide-up" delay={0}>
              <h2 id="services-title" className="heading-section mb-4 text-white">
                {HOMEPAGE_SECTIONS.services.title}
              </h2>
            </SimpleAnimation>
          </div>

          <div className="hidden lg:block">
            <TextReveal
              as="h2"
              mode="scroll"
              splitBy="words"
              className="heading-section mb-4 text-white"
            >
              {HOMEPAGE_SECTIONS.services.title}
            </TextReveal>
          </div>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="text-body-lg text-white/50">{HOMEPAGE_SECTIONS.services.subtitle}</p>
          </SimpleAnimation>
        </div>

        {/* Services — full-width alternating rows */}
        <div className="space-y-16 lg:space-y-24">
          {HOMEPAGE_SERVICES.map((service, index) => {
            const isEven = index % 2 === 0;
            const slideDirection = isEven ? 'slide-right' : 'slide-left';

            return (
              <article key={service.title} className="group">
                {/* Mobile: simple stack */}
                <div className="lg:hidden">
                  <SimpleAnimation type="fade" delay={index * 100}>
                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-accent opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-20"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-6 space-y-3">
                      <h3
                        className="text-heading text-white"
                        style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
                      >
                        {service.title}
                      </h3>
                      <p className="text-body leading-relaxed text-white/50">
                        {service.description}
                      </p>
                      <a
                        href={service.link}
                        className="inline-flex items-center gap-2 text-body font-medium text-accent transition-colors hover:text-white focus-visible:text-white"
                        aria-label={`En savoir plus sur ${service.title}`}
                      >
                        En savoir plus
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                  </SimpleAnimation>
                </div>

                {/* Desktop: full-width alternating rows */}
                <div className="hidden lg:block">
                  <div
                    className={`grid grid-cols-12 items-center gap-8 xl:gap-12 ${
                      !isEven ? '' : ''
                    }`}
                  >
                    {/* Image — 7 cols (60%) */}
                    <div className={`relative col-span-7 ${!isEven ? 'order-2' : ''}`}>
                      <ScrollParallaxImage
                        src={service.image}
                        alt={service.title}
                        parallaxRange={[-30, 30]}
                        scaleRange={[1, 1.08]}
                        loading="lazy"
                        sizes="60vw"
                        aspectRatio="3/4"
                        className="w-full"
                      />
                      {/* Hover overlay jaune */}
                      <div
                        className="pointer-events-none absolute inset-0 bg-accent opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-20"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Text — 5 cols (40%) */}
                    <div className={`col-span-5 ${!isEven ? 'order-1' : ''}`}>
                      <SimpleAnimation type={slideDirection} delay={150}>
                        <div className="space-y-5">
                          <h3
                            className="text-heading text-white"
                            style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}
                          >
                            {service.title}
                          </h3>

                          <p className="text-body-lg leading-relaxed text-white/50">
                            {service.description}
                          </p>

                          <a
                            href={service.link}
                            className="group/link inline-flex items-center gap-2 text-body font-medium text-accent transition-colors hover:text-white focus-visible:text-white"
                            aria-label={`En savoir plus sur ${service.title}`}
                          >
                            En savoir plus
                            <ArrowRight
                              className="h-4 w-4 transition-transform group-hover/link:translate-x-1"
                              aria-hidden="true"
                            />
                          </a>
                        </div>
                      </SimpleAnimation>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center lg:mt-24">
          <SimpleAnimation type="slide-up" delay={400}>
            <a
              href={HOMEPAGE_SECTIONS.services.cta.link}
              className="group inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-body font-medium text-white transition-colors hover:border-accent hover:bg-accent hover:text-black focus-visible:border-accent focus-visible:bg-accent focus-visible:text-black"
              aria-label={HOMEPAGE_SECTIONS.services.cta.ariaLabel}
            >
              {HOMEPAGE_SECTIONS.services.cta.text}
            </a>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
});

HomeServices.displayName = 'HomeServices';

export default HomeServices;
