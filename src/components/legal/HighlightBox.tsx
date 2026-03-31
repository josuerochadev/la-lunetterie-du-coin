import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type HighlightBoxProps = {
  title?: string;
  variant?: 'accent' | 'neutral';
  children: ReactNode;
  className?: string;
};

export default function HighlightBox({
  title,
  variant = 'neutral',
  children,
  className,
}: HighlightBoxProps) {
  return (
    <div
      className={cn(
        'border-l-4 p-6 sm:p-8',
        variant === 'accent'
          ? 'border-secondary-blue/30 bg-secondary-blue/5'
          : 'border-black/10 bg-black/[0.02]',
        className,
      )}
      role="note"
    >
      {title && <h3 className="heading-subsection mb-4">{title}</h3>}
      <div className="space-y-3 text-body text-black">{children}</div>
    </div>
  );
}
