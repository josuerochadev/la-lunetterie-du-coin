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
 * translateZ(0) promotes each wrapper to a GPU compositing layer,
 * eliminating subpixel rasterization seams between adjacent sections.
 */
export default function StickySection({
  children,
  zIndex,
  className,
  enableSticky = false,
  wrapperMinHeight,
}: StickySectionProps) {
  if (enableSticky && wrapperMinHeight) {
    return (
      <div
        className={cn('relative w-full [transform:translateZ(0)]', className)}
        style={{ minHeight: wrapperMinHeight, zIndex }}
      >
        <div className="sticky top-0 w-full">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full [transform:translateZ(0)]',
        enableSticky && 'sticky top-0',
        className,
      )}
      style={zIndex !== undefined ? { zIndex } : undefined}
    >
      {children}
    </div>
  );
}
