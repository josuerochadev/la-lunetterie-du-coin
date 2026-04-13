type ConvexDomeProps = {
  /**
   * Theme color of the dome — must match the section background that sits
   * underneath. Defaults to 'black'.
   */
  color?: 'black' | 'accent';
};

const COLOR_FILL: Record<NonNullable<ConvexDomeProps['color']>, string> = {
  black: '#000',
  accent: 'rgb(var(--color-yellow-rgb))',
};

const COLOR_BG: Record<NonNullable<ConvexDomeProps['color']>, string> = {
  black: 'bg-black',
  accent: 'bg-accent',
};

/**
 * Shared convex dome that smooths the visual transition between a hero
 * section and the next section. Renders an SVG quadratic curve on desktop
 * (`xl:block`) and a CSS border-radius half-ellipse on mobile (`xl:hidden`).
 *
 * Used by AboutHistory, ServicesContent, OffersContent and ContactInfo so
 * the dome stays consistent across pages.
 *
 * Place it as a direct child of the target section, after setting the
 * section background gradient (`linear-gradient(to bottom, transparent 12vw,
 * <color> 12vw)`) so the dome aligns with the gradient stop.
 */
export function ConvexDome({ color = 'black' }: ConvexDomeProps = {}) {
  return (
    <>
      {/* Desktop: SVG quadratic curve */}
      <svg
        className="pointer-events-none absolute left-0 top-0 z-[1] hidden w-full xl:block"
        style={{ height: '12vw' }}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,120 Q720,-120 1440,120 Z" fill={COLOR_FILL[color]} />
      </svg>
      {/* Mobile: CSS border-radius half-ellipse, oversized for a pronounced curve */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-[11vw] z-[1] h-[24vw] overflow-hidden xl:hidden"
        aria-hidden="true"
        data-navbar-theme="light"
      >
        <div
          className={`absolute left-1/2 top-0 h-full w-[140vw] -translate-x-1/2 ${COLOR_BG[color]}`}
          style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
        />
      </div>
    </>
  );
}
