import { type ReactNode } from 'react';
import type Car from 'lucide-react/dist/esm/icons/car';

import MapBlock from './MapBlock';
import { DirectionsBlockAnimated, DirectionsBlockStatic } from './DirectionsBlock';

import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';
import { ACCENT_HEX } from '@/config/design';

// ---------------------------------------------------------------------------
// Location item — icon + text, no card wrapper (same pattern as ContactInfo)
// ---------------------------------------------------------------------------

export function LocationItem({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Car;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
        <Icon className="h-6 w-6 text-secondary-blue" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <h3 className="text-subtitle mb-3 text-title-sm text-white">{title}</h3>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function ContactLocation() {
  const variant = useResponsiveMotion();

  return (
    <section id="localisation" className="relative bg-black" data-navbar-theme="light">
      {/* Top gradient fade — white → transparent, photo appears progressively */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[35vh]"
        style={{
          background: [
            'linear-gradient(to bottom,',
            'white 0%,',
            'color-mix(in srgb, white 92%, transparent) 10%,',
            'color-mix(in srgb, white 75%, transparent) 25%,',
            'color-mix(in srgb, white 50%, transparent) 42%,',
            'color-mix(in srgb, white 30%, transparent) 58%,',
            'color-mix(in srgb, white 12%, transparent) 74%,',
            'transparent 100%)',
          ].join(' '),
        }}
        aria-hidden="true"
      />

      {/* Desktop — scroll-driven parallax */}
      {variant === 'desktop-animated' && <MapBlock />}

      {/* Mobile — sticky scrollytelling with pinned parallax */}
      {variant === 'mobile-animated' && <DirectionsBlockAnimated />}

      {/* Reduced-motion fallback – static */}
      {variant === 'static' && <DirectionsBlockStatic />}

      {/* Bottom gradient dissolve — photo fades into accent for CTA transition */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[45vh]"
        style={{
          background: [
            'linear-gradient(to bottom,',
            'transparent 0%,',
            `color-mix(in srgb, ${ACCENT_HEX} 5%, transparent) 14%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 15%, transparent) 28%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 30%, transparent) 42%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 50%, transparent) 56%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 72%, transparent) 70%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 88%, transparent) 82%,`,
            `color-mix(in srgb, ${ACCENT_HEX} 96%, transparent) 92%,`,
            `${ACCENT_HEX} 100%)`,
          ].join(' '),
        }}
        aria-hidden="true"
      />
    </section>
  );
}
