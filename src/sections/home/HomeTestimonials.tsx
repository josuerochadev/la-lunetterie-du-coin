import { TestimonialsDesktop } from './testimonials/TestimonialsDesktop';
import { TestimonialsMobile } from './testimonials/TestimonialsMobile';
import { TestimonialsMobileAnimated } from './testimonials/TestimonialsMobileAnimated';

import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { ACCENT_HEX } from '@/config/design';

/**
 * Section HomeTestimonials — Scrollytelling Quote Wall
 *
 * Desktop: Full-screen sticky viewport with scroll-linked animations.
 * Mobile animated: Scroll-driven counter, word reveals, card stagger.
 * Reduced-motion: Static stacked layout.
 */
function HomeTestimonials() {
  const variant = useResponsiveMotion();

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      data-navbar-theme="light"
      className="relative -mt-1 bg-black"
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

      {variant === 'desktop-animated' && <TestimonialsDesktop />}

      {variant === 'mobile-animated' && (
        <div className="pointer-events-auto lg:hidden">
          <TestimonialsMobileAnimated />
        </div>
      )}

      {variant === 'static' && (
        <div className="pointer-events-auto">
          <TestimonialsMobile />
        </div>
      )}
    </section>
  );
}

export default HomeTestimonials;
