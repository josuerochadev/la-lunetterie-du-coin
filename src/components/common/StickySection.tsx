import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type StickySectionProps = {
  children: ReactNode;
  /** Optional z-index. Omit to rely on DOM order within a shared stacking context. */
  zIndex?: number;
  className?: string;
  enableSticky?: boolean;
  wrapperMinHeight?: string;
};

/**
 * Composant StickySection
 *
 * Wrapper pour créer l'effet parallax entre les sections.
 *
 * Desktop: translateZ(0) promotes each wrapper to a GPU compositing layer,
 * eliminating subpixel rasterization seams between adjacent sections.
 *
 * Mobile: isolation:isolate creates a stacking context without the
 * containing-block side-effect of transform, which would break
 * position:sticky inside child scroll-driven sections.
 */

const LAYER_CLASS = 'relative w-full max-lg:[isolation:isolate] lg:[transform:translateZ(0)]';

export default function StickySection({
  children,
  zIndex,
  className,
  enableSticky = false,
  wrapperMinHeight,
}: StickySectionProps) {
  if (enableSticky && wrapperMinHeight) {
    return (
      <div className={cn(LAYER_CLASS, className)} style={{ minHeight: wrapperMinHeight, zIndex }}>
        <div className="sticky top-0 w-full">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(LAYER_CLASS, enableSticky && 'sticky top-0', className)}
      style={zIndex !== undefined ? { zIndex } : undefined}
    >
      {children}
    </div>
  );
}
