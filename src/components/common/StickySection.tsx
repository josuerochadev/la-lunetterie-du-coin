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

/**
 * Anti-seam: -mb-px pulls the next sibling up by 1px, creating a physical
 * overlap. The later section (higher DOM order / z-index) paints on top,
 * covering the 1px gap with its own background. Works universally regardless
 * of whether the bg class is on the wrapper or the child section.
 */
const LAYER_CLASS =
  'relative -mb-px w-full max-lg:[isolation:isolate] lg:[transform:translateZ(0)] print:!static print:!mb-0 print:![transform:none] print:![isolation:auto]';

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
        <div className="sticky top-0 w-full print:!static">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(LAYER_CLASS, enableSticky && 'sticky top-0 print:!static', className)}
      style={zIndex !== undefined ? { zIndex } : undefined}
    >
      {children}
    </div>
  );
}
