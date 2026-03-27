const GRAIN_SVG_ID = 'home-services-grain';

/**
 * Inline SVG feTurbulence grain overlay — gives photos an artisanal/film texture.
 */
export function GrainOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] mix-blend-overlay">
      <svg className="hidden">
        <filter id={GRAIN_SVG_ID}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
      </svg>
      <div
        className="h-full w-full"
        style={{ filter: `url(#${GRAIN_SVG_ID})` }}
        aria-hidden="true"
      />
    </div>
  );
}
