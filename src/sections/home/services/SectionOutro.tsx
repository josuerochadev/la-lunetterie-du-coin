import { useEffect, useRef } from 'react';
import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import {
  OUTRO_WORDS,
  WORD_TIMINGS,
  EXIT_START,
  EXIT_STAGGER,
  LOGO_IN,
  LOGO_FLOAT_END,
} from './constants';

import LinkCTA from '@/components/common/LinkCTA';
import { HOMEPAGE_SECTIONS } from '@/data/homepage';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { SPRING_CONFIG } from '@/lib/motion';

/**
 * Outro — word-by-word reveal + staggered exit + floating logo video.
 */
export function SectionOutro({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── Word entrance transforms ──
  const w0InOpacity = useTransform(
    scrollYProgress,
    [WORD_TIMINGS[0].inStart, WORD_TIMINGS[0].inEnd],
    [0, 1],
  );
  const w0InY = useTransform(
    scrollYProgress,
    [WORD_TIMINGS[0].inStart, WORD_TIMINGS[0].inEnd],
    [12, 0],
  );
  const w1InOpacity = useTransform(
    scrollYProgress,
    [WORD_TIMINGS[1].inStart, WORD_TIMINGS[1].inEnd],
    [0, 1],
  );
  const w1InY = useTransform(
    scrollYProgress,
    [WORD_TIMINGS[1].inStart, WORD_TIMINGS[1].inEnd],
    [12, 0],
  );
  const w2InOpacity = useTransform(
    scrollYProgress,
    [WORD_TIMINGS[2].inStart, WORD_TIMINGS[2].inEnd],
    [0, 1],
  );
  const w2InY = useTransform(
    scrollYProgress,
    [WORD_TIMINGS[2].inStart, WORD_TIMINGS[2].inEnd],
    [12, 0],
  );

  // ── Staggered exit upward ──
  const w0ExitOpacity = useTransform(scrollYProgress, [EXIT_START, EXIT_START + 0.02], [1, 0]);
  const w0ExitYRaw = useTransform(scrollYProgress, [EXIT_START, EXIT_START + 0.025], [0, -60]);
  const w0ExitY = useSpring(w0ExitYRaw, SPRING_CONFIG);

  const w1ExitOpacity = useTransform(
    scrollYProgress,
    [EXIT_START + EXIT_STAGGER, EXIT_START + EXIT_STAGGER + 0.02],
    [1, 0],
  );
  const w1ExitYRaw = useTransform(
    scrollYProgress,
    [EXIT_START + EXIT_STAGGER, EXIT_START + EXIT_STAGGER + 0.025],
    [0, -60],
  );
  const w1ExitY = useSpring(w1ExitYRaw, SPRING_CONFIG);

  const w2TextOpacity = useTransform(scrollYProgress, [0.92, 0.94], [1, 0]);
  const w2ExitYRaw = useTransform(scrollYProgress, [0.92, 0.94], [0, -30]);
  const w2ExitY = useSpring(w2ExitYRaw, SPRING_CONFIG);

  // Combine entrance + exit
  const w0Opacity = useTransform([w0InOpacity, w0ExitOpacity] as const, ([a, b]: number[]) =>
    Math.min(a, b),
  );
  const w0Y = useTransform([w0InY, w0ExitY] as const, ([a, b]: number[]) => a + b);
  const w1Opacity = useTransform([w1InOpacity, w1ExitOpacity] as const, ([a, b]: number[]) =>
    Math.min(a, b),
  );
  const w1Y = useTransform([w1InY, w1ExitY] as const, ([a, b]: number[]) => a + b);
  const w2Opacity = useTransform([w2InOpacity, w2TextOpacity] as const, ([a, b]: number[]) =>
    Math.min(a, b),
  );
  const w2Y = useTransform([w2InY, w2ExitY] as const, ([a, b]: number[]) => a + b);

  // ── Logo video ──
  const logoOpacity = useTransform(
    scrollYProgress,
    [LOGO_IN, LOGO_IN + 0.01, 0.985, LOGO_FLOAT_END],
    [0, 1, 1, 0],
  );
  const logoScale = useTransform(
    scrollYProgress,
    [LOGO_IN, 0.96, 0.975, LOGO_FLOAT_END],
    [1, 4, 6, 5],
  );
  const logoScaleSpring = useSpring(logoScale, SPRING_CONFIG);
  const logoYRaw = useTransform(
    scrollYProgress,
    [LOGO_IN, 0.96, 0.975, LOGO_FLOAT_END],
    [0, 15, 10, -55],
  );
  const logoY = useTransform(logoYRaw, (v: number) => `${v}vh`);
  const logoXRaw = useTransform(scrollYProgress, [0.95, LOGO_FLOAT_END], [0, Math.PI * 2]);
  const logoX = useTransform(logoXRaw, (v: number) => Math.sin(v) * 40);
  const logoXSpring = useSpring(logoX, { stiffness: 50, damping: 20, mass: 1 });
  const logoRotateRaw = useTransform(scrollYProgress, [0.95, LOGO_FLOAT_END], [0, Math.PI * 2]);
  const logoRotate = useTransform(logoRotateRaw, (v: number) => Math.sin(v) * 4);

  // ── CTA ──
  const ctaOpacity = useTransform(
    scrollYProgress,
    [0.89, EXIT_START, EXIT_START + 0.005, EXIT_START + 0.02],
    [0, 1, 1, 0],
  );
  const ctaYRaw = useTransform(scrollYProgress, [0.89, EXIT_START], [20, 0]);
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);
  const ctaPointer = usePointerEvents(ctaOpacity);

  // Play/pause video based on visibility
  useEffect(() => {
    const unsubscribe = logoOpacity.on('change', (v: number) => {
      const video = videoRef.current;
      if (!video) return;
      if (v > 0.05) {
        if (video.paused) {
          video.playbackRate = 2;
          video.play().catch(() => {});
        }
      } else {
        if (!video.paused) {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
    return unsubscribe;
  }, [logoOpacity]);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 px-8">
        {/* Phrase — word-by-word entrance + staggered exit */}
        <h3 className="text-heading text-center text-title-xl text-black">
          {/* Line 1: TAPEZ-LEUR */}
          <span className="inline-block">
            <m.span className="inline-block" style={{ opacity: w0Opacity, y: w0Y }}>
              {OUTRO_WORDS[0]}
            </m.span>
          </span>
          <br />
          {/* Line 2: DANS + L'ŒIL → logo */}
          <span className="inline-block">
            <m.span className="inline-block" style={{ opacity: w1Opacity, y: w1Y }}>
              {OUTRO_WORDS[1]}
            </m.span>
          </span>
          {'\u00A0'}
          <span className="relative inline-block align-bottom">
            <m.span className="inline-block" style={{ opacity: w2Opacity, y: w2Y }}>
              {OUTRO_WORDS[2]}
            </m.span>

            {/* Logo video — spawns at L'ŒIL position, then grows + floats */}
            <m.span
              className="absolute left-1/2 top-1/2 inline-flex origin-center items-center justify-center"
              style={{
                opacity: logoOpacity,
                scale: logoScaleSpring,
                y: logoY,
                x: logoXSpring,
                rotate: logoRotate,
                translateX: '-50%',
                translateY: '-50%',
              }}
            >
              <video
                ref={videoRef}
                src="/videos/logo-animated.mp4"
                muted
                playsInline
                loop
                preload="metadata"
                className="h-[1em] w-auto rounded-lg object-contain"
                style={{ mixBlendMode: 'multiply' }}
                aria-label="Logo animé La Lunetterie du Coin"
              />
            </m.span>
          </span>
        </h3>

        {/* CTA */}
        <m.div
          className="pointer-events-auto"
          style={{ opacity: ctaOpacity, y: ctaY, pointerEvents: ctaPointer }}
        >
          <LinkCTA
            to={HOMEPAGE_SECTIONS.services.cta.link}
            theme="light"
            aria-label={HOMEPAGE_SECTIONS.services.cta.ariaLabel}
          >
            {HOMEPAGE_SECTIONS.services.cta.text}
          </LinkCTA>
        </m.div>
      </div>
    </>
  );
}
