import { forwardRef, useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollParallaxImage from '@/components/motion/ScrollParallaxImage';
import AnimatedCounter from '@/components/motion/AnimatedCounter';
import TextReveal from '@/components/motion/TextReveal';
import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

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
        <EyePattern variant="jaune" opacity={0.04} />
      </m.div>
    </div>
  );
}

const STATS = [
  { from: 2000, to: 2016, suffix: '', label: 'Année de création' },
  { from: 0, to: 70, suffix: '€', label: 'Réduction max' },
  { from: 0, to: 100, suffix: '%', label: 'Restaurées main' },
] as const;

/**
 * Section HomeEngagement — Impact Counter
 *
 * AnimatedCounter for stats, TextReveal with punchline effect.
 * ScrollParallaxImage on photo, EyePattern with horizontal drift.
 *
 * Mobile: stats in horizontal row (already in place). Counter in viewport mode.
 *
 * @component
 */
const HomeEngagement = forwardRef<HTMLElement>(() => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="engagement"
      className="relative w-full overflow-hidden bg-black py-section"
      aria-labelledby="engagement-title"
      data-navbar-theme="light"
    >
      {/* EyePattern with drift (desktop) / static (mobile/reduced) */}
      {prefersReducedMotion ? (
        <EyePattern variant="jaune" opacity={0.04} />
      ) : (
        <DriftingEyePattern />
      )}

      <div className="relative z-10 mx-auto max-w-container px-container-x">
        {/* Tagline with TextReveal punchline */}
        <div className="mb-12 lg:mb-16">
          <SimpleAnimation type="slide-up" delay={0}>
            <span className="mb-4 block text-body-sm font-medium uppercase tracking-wider text-white/50">
              Notre engagement
            </span>
          </SimpleAnimation>

          {/* Mobile: SimpleAnimation. Desktop: TextReveal scroll */}
          <div className="lg:hidden">
            <SimpleAnimation type="slide-up" delay={100}>
              <h2 id="engagement-title" className="heading-section text-white">
                La mode change.
                <br />
                <span className="text-accent">La planète, non.</span>
              </h2>
            </SimpleAnimation>
          </div>

          <div className="hidden lg:block">
            <TextReveal
              as="h2"
              mode="scroll"
              splitBy="words"
              className="heading-section text-white"
            >
              La mode change. La planète, non.
            </TextReveal>
          </div>
        </div>

        {/* Layout 3 columns */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Animated stats — left column */}
          <div className="lg:col-span-3">
            <SimpleAnimation type="slide-up" delay={100}>
              <div className="flex justify-between gap-6 lg:flex-col lg:gap-10 lg:border-r lg:border-accent/30 lg:pr-8">
                {STATS.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <AnimatedCounter
                      from={stat.from}
                      to={stat.to}
                      suffix={stat.suffix}
                      className="mb-1 block font-bold text-accent"
                      duration={1.5}
                    />
                    <div className="text-body-xs text-white/50 sm:text-body-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </SimpleAnimation>
          </div>

          {/* Image portrait — center */}
          <div className="lg:col-span-4">
            {/* Mobile: SimpleAnimation. Desktop: ScrollParallaxImage */}
            <div className="lg:hidden">
              <SimpleAnimation type="fade" delay={200}>
                <div className="relative aspect-[2/3] w-full overflow-hidden">
                  <img
                    src="/images/homepage-engagement-eyeglasses.jpg"
                    alt="Engagement écologique - La Lunetterie du Coin"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SimpleAnimation>
            </div>

            <div className="hidden lg:block">
              <ScrollParallaxImage
                src="/images/homepage-engagement-eyeglasses.jpg"
                alt="Engagement écologique - La Lunetterie du Coin"
                parallaxRange={[-40, 40]}
                scaleRange={[0.95, 1.05]}
                loading="lazy"
                sizes="(min-width: 1024px) 33vw, 100vw"
                aspectRatio="2/3"
              />
            </div>
          </div>

          {/* Text — right column */}
          <div className="flex items-center lg:col-span-5">
            <SimpleAnimation type="slide-up" delay={300}>
              <div className="space-y-6">
                <p className="text-body-lg leading-relaxed text-white">
                  Depuis 2016, nous proposons une alternative durable au marché traditionnel de
                  l'optique. Nos montures d'occasion sont soigneusement restaurées, donnant une
                  seconde vie à des pièces qui auraient fini à la décharge.
                </p>

                <p className="text-body leading-relaxed text-white/50">
                  En rapportant vos anciennes lunettes, vous bénéficiez d'une réduction allant
                  jusqu'à 70€ sur votre nouvel achat. Un geste pour votre portefeuille et pour la
                  planète.
                </p>

                <a
                  href="/offres#recyclage"
                  className="group inline-flex items-center gap-2 text-body font-medium text-accent transition-colors hover:text-white focus-visible:text-white"
                  aria-label="En savoir plus sur notre programme de recyclage"
                >
                  Comment ça marche
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </SimpleAnimation>
          </div>
        </div>
      </div>
    </section>
  );
});

HomeEngagement.displayName = 'HomeEngagement';

export default HomeEngagement;
