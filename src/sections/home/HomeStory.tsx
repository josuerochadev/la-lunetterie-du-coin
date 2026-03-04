import { forwardRef, useRef } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ScrollParallaxImage from '@/components/motion/ScrollParallaxImage';
import ScrollScale from '@/components/motion/ScrollScale';
import TextReveal from '@/components/motion/TextReveal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Section HomeStory — Editorial Spread
 *
 * Gradient bg from accent to white (fluid transition from Hero).
 * Photo with ScrollParallaxImage + ScrollScale zoom-in.
 * TextReveal scroll mode on title. Animated CTA arrow.
 *
 * Mobile: photo full-width top, card below. SimpleAnimation fallback.
 *
 * @component
 */
const HomeStory = forwardRef<HTMLElement>((_, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={(el) => {
        sectionRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      id="story"
      className="relative w-full bg-gradient-to-b from-accent to-white py-20 sm:py-28 lg:py-36"
      aria-labelledby="story-title"
    >
      <div className="relative mx-auto max-w-container px-6 sm:px-10 md:px-16">
        <div className="relative flex flex-col items-center lg:flex-row lg:items-start lg:justify-center">
          {/* Photo with parallax + scale zoom-in */}
          <div className="w-full lg:w-auto">
            {/* Mobile: SimpleAnimation fallback */}
            <div className="lg:hidden">
              <SimpleAnimation type="slide-left" delay={0} className="w-full">
                <div className="group bg-white p-3">
                  <div className="aspect-[4/5] w-full overflow-hidden">
                    <img
                      src="/images/our-story-eyeglasses.jpg"
                      alt="Lunettes artisanales - La Lunetterie du Coin"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              </SimpleAnimation>
            </div>

            {/* Desktop: ScrollParallaxImage + ScrollScale */}
            <div className="hidden lg:block">
              <ScrollScale scaleRange={[0.92, 1]}>
                <div className="relative z-0 w-full lg:w-[380px] xl:w-[420px] 2xl:w-[480px]">
                  <div className="group bg-white p-3">
                    <ScrollParallaxImage
                      src="/images/our-story-eyeglasses.jpg"
                      alt="Lunettes artisanales - La Lunetterie du Coin"
                      parallaxRange={[-60, 60]}
                      scaleRange={[1, 1.05]}
                      loading="lazy"
                      sizes="(min-width: 1024px) 420px, 100vw"
                      widths={[384, 640, 768]}
                      aspectRatio="4/5"
                    />
                  </div>
                </div>
              </ScrollScale>
            </div>
          </div>

          {/* Card with text — overlapping the photo */}
          <SimpleAnimation
            type="slide-up"
            delay={200}
            className="relative z-10 -mt-12 w-full sm:-mt-16 lg:-ml-12 lg:mt-16 lg:w-auto xl:mt-20"
          >
            <div className="bg-white px-8 py-10 sm:px-10 sm:py-12 lg:max-w-md xl:max-w-lg">
              {/* Mobile: static title. Desktop: TextReveal scroll */}
              <div className="lg:hidden">
                <h2
                  id="story-title"
                  className="text-heading text-black"
                  style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3.5rem)' }}
                >
                  Une lunetterie différente
                </h2>
              </div>

              <div className="hidden lg:block">
                <TextReveal
                  as="h2"
                  mode="scroll"
                  splitBy="words"
                  className="text-heading text-black"
                  style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
                >
                  Une lunetterie différente
                </TextReveal>
              </div>

              <p className="mt-5 text-body leading-relaxed text-black/70 sm:mt-6">
                Romain a ouvert La Lunetterie du Coin avec une conviction&nbsp;: proposer des
                lunettes de qualité tout en donnant une seconde vie aux montures.
              </p>

              {/* CTA with animated arrow on hover */}
              {prefersReducedMotion ? (
                <Link
                  to="/a-propos"
                  className="text-heading mt-6 inline-flex items-center gap-2 underline underline-offset-4 transition-opacity duration-300 hover:opacity-60 sm:mt-8"
                  style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.25rem)' }}
                >
                  Nous découvrir
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <Link
                  to="/a-propos"
                  className="group/cta text-heading mt-6 inline-flex items-center gap-2 underline underline-offset-4 transition-opacity duration-300 hover:opacity-60 sm:mt-8"
                  style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.25rem)' }}
                >
                  Nous découvrir
                  <m.span
                    className="inline-block"
                    whileHover={{ x: 8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </m.span>
                </Link>
              )}
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
});

HomeStory.displayName = 'HomeStory';

export default HomeStory;
