import { TestimonialsDesktop } from './testimonials/TestimonialsDesktop';
import { TestimonialsMobile } from './testimonials/TestimonialsMobile';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsLg } from '@/hooks/useIsLg';
import { ACCENT_HEX } from '@/config/design';

/**
 * Section HomeTestimonials — Scrollytelling Quote Wall
 *
 * Desktop: Full-screen sticky viewport with scroll-linked animations.
 * Mobile/reduced-motion: Stacked layout with SimpleAnimation wrappers.
 */
function HomeTestimonials() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLg = useIsLg();

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      data-navbar-theme="light"
      className="relative bg-black"
    >
      {/* Top gradient — smooth yellow → black transition from Services */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[40vh]"
        style={{
          background: [
            'linear-gradient(to bottom,',
            `${ACCENT_HEX} 0%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 92%, black) 8%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 80%, black) 18%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 65%, black) 30%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 45%, black) 44%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 28%, black) 58%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 14%, black) 72%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 5%, black) 86%,`,
            'black 100%)',
          ].join(' '),
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[40vh] backdrop-blur-[1px]"
        style={{
          maskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {!prefersReducedMotion && isLg && <TestimonialsDesktop />}

      <div
        className={prefersReducedMotion ? 'pointer-events-auto' : 'pointer-events-auto lg:hidden'}
      >
        <TestimonialsMobile />
      </div>
    </section>
  );
}

export default HomeTestimonials;
