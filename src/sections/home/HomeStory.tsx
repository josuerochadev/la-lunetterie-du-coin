import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import TextReveal from '@/components/motion/TextReveal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Section HomeStory — Editorial Spread
 *
 * Dark background section with two-column layout:
 *   - Left: large photo (sticky on desktop) with title overlaid at the bottom
 *   - Right: body text and CTA that scroll naturally past the sticky photo
 *
 * The section is tall enough (min-h-[150vh]) to give the text room to scroll
 * while the photo stays pinned.
 *
 * Mobile: stacked layout, photo top with title overlay, text below.
 */
const HomeStory = forwardRef<HTMLElement>((_, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      id="story"
      className="relative w-full bg-black"
      aria-labelledby="story-title"
      data-navbar-theme="light"
    >
      <div className="relative mx-auto max-w-container px-6 sm:px-10 md:px-16">
        {/* ===== Mobile layout — stacked ===== */}
        <div className="flex flex-col gap-8 py-20 sm:py-28 lg:hidden">
          {/* Photo with title overlay */}
          <SimpleAnimation type="slide-up" delay={0} className="w-full">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <img
                src="/images/our-story-eyeglasses.jpg"
                alt="Lunettes artisanales - La Lunetterie du Coin"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {/* Gradient overlay for title readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
              <h2
                id="story-title"
                className="text-heading absolute bottom-6 left-6 right-6 text-accent"
                style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
              >
                Une lunetterie
                <br />
                différente
              </h2>
            </div>
          </SimpleAnimation>

          {/* Text content */}
          <SimpleAnimation type="slide-up" delay={200}>
            <p className="text-body leading-relaxed text-accent/80">
              La Lunetterie du Coin a été ouverte avec une conviction&nbsp;: proposer des lunettes
              de qualité tout en donnant une seconde vie aux montures. Au c&oelig;ur du Faubourg de
              Pierre à Strasbourg, notre boutique indépendante allie expertise optique, style
              contemporain et engagement écologique. Chaque paire est sélectionnée avec soin,
              qu&apos;elle soit neuve ou d&apos;occasion.
            </p>

            <Link
              to="/a-propos"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-body-sm font-medium text-black transition-all duration-300 hover:brightness-110 active:scale-95 sm:mt-8"
            >
              Nous découvrir
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </SimpleAnimation>
        </div>

        {/* ===== Desktop layout — two columns, photo sticky ===== */}
        <div className="hidden min-h-[150vh] lg:flex lg:gap-16 xl:gap-20">
          {/* Left column — sticky photo with title overlay */}
          <div className="w-[45%] py-20 xl:py-28">
            <div className="sticky top-[10vh]">
              <SimpleAnimation type="slide-left" delay={0}>
                <div className="relative overflow-hidden">
                  <img
                    src="/images/our-story-eyeglasses.jpg"
                    alt="Lunettes artisanales - La Lunetterie du Coin"
                    className="aspect-[3/4] w-full object-cover"
                    loading="lazy"
                  />
                  {/* Gradient overlay for title readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Title overlaid on photo */}
                  <div className="absolute bottom-8 left-8 right-4">
                    <TextReveal
                      as="h2"
                      mode="scroll"
                      splitBy="words"
                      className="text-heading text-accent"
                      style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)' }}
                    >
                      Une lunetterie différente
                    </TextReveal>
                  </div>
                </div>
              </SimpleAnimation>
            </div>
          </div>

          {/* Right column — scrolling text content */}
          <div className="flex w-[55%] flex-col justify-center py-20 xl:py-28">
            <SimpleAnimation type="slide-up" delay={200}>
              <p
                className="text-accent/80"
                style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.75rem)', lineHeight: 1.6 }}
              >
                La Lunetterie du Coin a été ouverte avec une conviction&nbsp;: proposer des lunettes
                de qualité tout en donnant une seconde vie aux montures. Au c&oelig;ur du Faubourg
                de Pierre à Strasbourg, notre boutique indépendante allie expertise optique, style
                contemporain et engagement écologique. Chaque paire est sélectionnée avec soin,
                qu&apos;elle soit neuve ou d&apos;occasion.
              </p>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={400}>
              {prefersReducedMotion ? (
                <Link
                  to="/a-propos"
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-body font-medium text-black transition-all duration-300 hover:brightness-110 active:scale-95"
                >
                  Nous découvrir
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <Link
                  to="/a-propos"
                  className="group/cta mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-body font-medium text-black transition-all duration-300 hover:brightness-110 active:scale-95"
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
            </SimpleAnimation>
          </div>
        </div>
      </div>
    </section>
  );
});

HomeStory.displayName = 'HomeStory';

export default HomeStory;
