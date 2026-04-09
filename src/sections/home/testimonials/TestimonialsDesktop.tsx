import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { FEATURED, OTHERS, OTHER_COUNT, SCROLL_HEIGHT_VH } from './constants';

import { GiantCounter } from '@/components/motion/GiantCounter';
import ScrollWordReveal from '@/components/motion/ScrollWordReveal';
import LinkCTA from '@/components/common/LinkCTA';
import { RatingStars } from '@/components/common/RatingStars';
import { type Testimonial } from '@/data/testimonials';
import { STORE_INFO } from '@/config/store';
import { useFadeInOut } from '@/hooks/useFadeInOut';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { useManualScrollProgress } from '@/hooks/useManualScrollProgress';
import { SPRING_CONFIG } from '@/lib/motion';

function SectionTitle({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const yRaw = useTransform(scrollYProgress, [0, 0.08], ['40vh', '14vh']);
  const y = useSpring(yRaw, SPRING_CONFIG);
  const opacity = useFadeInOut(scrollYProgress, 0, 0.03, 0.76, 0.8);

  return (
    <m.div
      className="pointer-events-none absolute inset-x-0 z-20 flex justify-center"
      style={{ top: y, opacity }}
    >
      <ScrollWordReveal
        as="h2"
        id="testimonials-title"
        scrollYProgress={scrollYProgress}
        revealStart={0.0}
        revealEnd={0.06}
        className="heading-section text-center text-white"
      >
        On ne le dit pas, ils le disent.
      </ScrollWordReveal>
    </m.div>
  );
}

function FeaturedQuote({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const containerOpacity = useTransform(scrollYProgress, [0.06, 0.1, 0.28, 0.34], [0, 1, 1, 0]);
  const containerYRaw = useTransform(scrollYProgress, [0.06, 0.1, 0.28, 0.34], [80, 0, 0, -80]);
  const containerY = useSpring(containerYRaw, SPRING_CONFIG);

  const authorOpacity = useTransform(scrollYProgress, [0.22, 0.26], [0, 1]);
  const authorYRaw = useTransform(scrollYProgress, [0.22, 0.26], [20, 0]);
  const authorY = useSpring(authorYRaw, SPRING_CONFIG);

  return (
    <m.div
      className="absolute inset-0 z-10 flex items-start justify-center px-container-x pt-[44vh]"
      style={{ opacity: containerOpacity, y: containerY }}
    >
      <div className="max-w-4xl text-center">
        <RatingStars rating={FEATURED.rating} size="h-5 w-5" className="mb-8 justify-center" />

        <blockquote>
          <div style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}>
            <ScrollWordReveal
              as="p"
              scrollYProgress={scrollYProgress}
              revealStart={0.1}
              revealEnd={0.24}
              className="text-white"
            >
              {`\u201C${FEATURED.quote}\u201D`}
            </ScrollWordReveal>
          </div>
        </blockquote>

        <m.footer className="mt-8" style={{ opacity: authorOpacity, y: authorY }}>
          <cite className="not-italic">
            <div className="text-body-lg font-medium text-white">{FEATURED.name}</div>
            <div className="mt-1 flex items-center justify-center gap-2 text-body-sm text-secondary-blue">
              <span>{FEATURED.role}</span>
              {FEATURED.date && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <time>{FEATURED.date}</time>
                </>
              )}
            </div>
          </cite>
        </m.footer>
      </div>
    </m.div>
  );
}

function TestimonialSlide({
  testimonial,
  index,
  scrollYProgress,
}: {
  testimonial: Testimonial;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const PARADE_START = 0.34;
  const PARADE_END = 0.78;
  const range = PARADE_END - PARADE_START;
  const segmentSize = range / OTHER_COUNT;
  const start = PARADE_START + index * segmentSize;

  const enterEnd = start + segmentSize * 0.25;
  const exitStart = start + segmentSize * 0.75;
  const end = start + segmentSize;

  const yRaw = useTransform(scrollYProgress, [start, enterEnd, exitStart, end], [80, 0, 0, -80]);
  const y = useSpring(yRaw, SPRING_CONFIG);

  const opacity = useFadeInOut(scrollYProgress, start, start + segmentSize * 0.15, exitStart, end);
  const pointerEvents = usePointerEvents(opacity);

  const rotation = index % 2 === 0 ? -1 : 1;

  return (
    <m.div
      className={`${index === 0 ? '' : 'absolute inset-0'} flex items-center justify-center`}
      style={{ opacity, y, pointerEvents }}
    >
      <article
        className="w-full max-w-3xl text-center"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <RatingStars rating={testimonial.rating} size="h-4 w-4" className="mb-6 justify-center" />

        <blockquote className="mb-6">
          <p className="text-white" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.6rem)' }}>
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </blockquote>

        <footer>
          <cite className="not-italic">
            <div className="text-body-sm font-medium text-white">{testimonial.name}</div>
            <div className="mt-1 flex items-center justify-center gap-2 text-body-xs text-secondary-blue">
              <span>{testimonial.role}</span>
              {testimonial.date && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <time>{testimonial.date}</time>
                </>
              )}
            </div>
          </cite>
        </footer>
      </article>
    </m.div>
  );
}

export function TestimonialsDesktop() {
  const { ref, scrollYProgress } = useManualScrollProgress('start-start');

  const ctaOpacity = useTransform(scrollYProgress, [0.38, 0.44, 0.76, 0.82], [0, 1, 1, 0]);
  const ctaYRaw = useTransform(scrollYProgress, [0.38, 0.44, 0.76, 0.82], [20, 0, 0, -30]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);
  const ctaPointer = usePointerEvents(ctaOpacity);

  return (
    <div ref={ref} className="hidden xl:block" style={{ height: `${SCROLL_HEIGHT_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <GiantCounter
          scrollYProgress={scrollYProgress}
          countRange={[0.02, 0.12]}
          countValues={[0, 4.9]}
          opacityRange={[0.01, 0.06, 0.76, 0.8]}
        />
        <SectionTitle scrollYProgress={scrollYProgress} />
        <FeaturedQuote scrollYProgress={scrollYProgress} />

        <div className="absolute inset-0 z-10 flex items-start justify-center px-container-x pt-[44vh]">
          <div className="relative w-full max-w-2xl">
            {OTHERS.map((testimonial, i) => (
              <TestimonialSlide
                key={testimonial.id}
                testimonial={testimonial}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        <m.div
          className="absolute inset-x-0 bottom-[15%] z-20 flex justify-center"
          style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaPointer }}
        >
          <LinkCTA
            href={STORE_INFO.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            theme="dark"
          >
            Voir nos avis Google
          </LinkCTA>
        </m.div>
      </div>
    </div>
  );
}
