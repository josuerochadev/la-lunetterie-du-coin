import { type CSSProperties, useMemo, useRef } from 'react';
import { m, useScroll, useTransform, useInView, type MotionValue } from 'framer-motion';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type TagName = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
type SplitBy = 'words' | 'lines' | 'chars';
type RevealMode = 'scroll' | 'viewport';

interface TextRevealProps {
  children: string;
  as?: TagName;
  mode?: RevealMode;
  splitBy?: SplitBy;
  className?: string;
  /** Stagger delay in ms between each unit (viewport mode) */
  staggerDelay?: number;
  /** Scroll offset for useScroll (scroll mode) */
  offset?: [string, string];
  /** Style props passed to the container */
  style?: CSSProperties;
}

/**
 * Split text into units (words, lines, or chars) for animation.
 */
function splitText(text: string, splitBy: SplitBy): string[] {
  switch (splitBy) {
    case 'words':
      return text.split(/\s+/).filter(Boolean);
    case 'chars':
      return text.split('');
    case 'lines':
      return text.split('\n').filter(Boolean);
  }
}

/**
 * A single word/char animated by scroll progress.
 * Maps its stagger position within the total to opacity.
 */
function ScrollWord({
  children,
  scrollYProgress,
  index,
  total,
}: {
  children: string;
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
}) {
  // Each word fades in over a portion of the scroll range
  // with overlap so the animation feels like a wave
  const wordStart = index / total;
  const wordEnd = Math.min(wordStart + 1 / total + 0.2, 1);
  const opacity = useTransform(scrollYProgress, [wordStart, wordEnd], [0.15, 1]);

  return (
    <m.span className="inline-block" style={{ opacity }}>
      {children}
    </m.span>
  );
}

/**
 * Text reveal component with word-by-word or line-by-line animation.
 *
 * Two modes:
 * - `scroll`: Each unit's opacity is linked to scrollYProgress (wave effect)
 * - `viewport`: One-shot stagger animation when element enters viewport
 *
 * Reduced motion: renders text instantly without animation.
 */
export default function TextReveal({
  children,
  as: Tag = 'div',
  mode = 'viewport',
  splitBy = 'words',
  className = '',
  staggerDelay = 60,
  offset = ['start 0.9', 'start 0.3'],
  style,
}: TextRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const units = useMemo(() => splitText(children, splitBy), [children, splitBy]);

  // Scroll-linked mode
  const { scrollYProgress } = useScroll({
    target: mode === 'scroll' && !prefersReducedMotion ? ref : undefined,
    offset: offset as unknown as [string, string],
  });

  // Viewport mode
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Reduced motion — render plain text
  if (prefersReducedMotion) {
    // Use m.Tag for consistency within LazyMotion context
    const MTag = m[Tag];
    return (
      <MTag className={className} style={style}>
        {children}
      </MTag>
    );
  }

  if (mode === 'scroll') {
    const MTag = m[Tag];
    const isWords = splitBy === 'words';

    return (
      <MTag ref={ref} className={className} style={{ ...style, flexWrap: 'wrap' as const }}>
        {units.map((unit, i) => (
          <span key={i} className={isWords ? 'inline-block' : undefined}>
            <ScrollWord scrollYProgress={scrollYProgress} index={i} total={units.length}>
              {unit}
            </ScrollWord>
            {isWords && i < units.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </MTag>
    );
  }

  // Viewport mode — stagger reveal
  const MTag = m[Tag];
  const isWords = splitBy === 'words';

  return (
    <MTag ref={ref} className={className} style={style}>
      {units.map((unit, i) => (
        <span key={i} className={isWords ? 'inline-block' : undefined}>
          <m.span
            className="inline-block"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: 0.5,
              delay: i * (staggerDelay / 1000),
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {unit}
          </m.span>
          {isWords && i < units.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </MTag>
  );
}
