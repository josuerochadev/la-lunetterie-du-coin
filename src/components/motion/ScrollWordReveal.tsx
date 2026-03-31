import { type CSSProperties, useMemo } from 'react';
import { m, useTransform, type MotionValue } from 'framer-motion';

function ScrollWord({
  children,
  scrollYProgress,
  index,
  total,
  rangeStart,
  rangeEnd,
}: {
  children: string;
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
  rangeStart: number;
  rangeEnd: number;
}) {
  const range = rangeEnd - rangeStart;
  const wordStart = rangeStart + (index / total) * range;
  const wordEnd = Math.min(wordStart + range / total + range * 0.2, rangeEnd);
  const opacity = useTransform(scrollYProgress, [wordStart, wordEnd], [0, 1]);
  const y = useTransform(scrollYProgress, [wordStart, wordEnd], [12, 0]);

  return (
    <m.span className="inline-block" style={{ opacity, y }}>
      {children}
    </m.span>
  );
}

export default function ScrollWordReveal({
  children,
  scrollYProgress,
  revealStart,
  revealEnd,
  as: Tag = 'p',
  className,
  id,
  style,
}: {
  children: string;
  scrollYProgress: MotionValue<number>;
  revealStart: number;
  revealEnd: number;
  as?: 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  id?: string;
  style?: CSSProperties;
}) {
  const words = useMemo(() => children.split(/\s+/).filter(Boolean), [children]);

  return (
    <Tag className={className} id={id} style={style}>
      {words.map((word, i) => (
        <span key={i} className="inline-block">
          <ScrollWord
            scrollYProgress={scrollYProgress}
            index={i}
            total={words.length}
            rangeStart={revealStart}
            rangeEnd={revealEnd}
          >
            {word}
          </ScrollWord>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}
