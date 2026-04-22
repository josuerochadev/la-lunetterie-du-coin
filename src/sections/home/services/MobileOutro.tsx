import { useEffect, useRef } from 'react';
import { m, useTransform, useSpring, type MotionValue } from 'framer-motion';

import { OUTRO_WORDS } from './constants';
import {
  SERVICES_END,
  OUTRO_START,
  OUTRO_REVEAL_START,
  OUTRO_REVEAL_END,
  OUTRO_EXIT_START,
  OUTRO_EXIT_STAGGER,
  OUTRO_LOGO_IN,
} from './ServicesMobileAnimated.timeline';

import LinkCTA from '@/components/common/LinkCTA';
import { HOMEPAGE_SECTIONS } from '@/data/homepage';
import { SPRING_CONFIG } from '@/lib/motion';

export function MobileOutro({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Word timings — staggered reveal
  const wordRange = OUTRO_REVEAL_END - OUTRO_REVEAL_START;
  const wordCount = OUTRO_WORDS.length;
  const wordTimings = OUTRO_WORDS.map((_, i) => {
    const inStart = OUTRO_REVEAL_START + (i / wordCount) * wordRange;
    const inEnd = Math.min(inStart + wordRange / wordCount + wordRange * 0.2, OUTRO_REVEAL_END);
    return { inStart, inEnd };
  });

  // Word entrance
  const w0InOp = useTransform(
    scrollYProgress,
    [wordTimings[0].inStart, wordTimings[0].inEnd],
    [0, 1],
  );
  const w0InY = useTransform(
    scrollYProgress,
    [wordTimings[0].inStart, wordTimings[0].inEnd],
    [16, 0],
  );
  const w1InOp = useTransform(
    scrollYProgress,
    [wordTimings[1].inStart, wordTimings[1].inEnd],
    [0, 1],
  );
  const w1InY = useTransform(
    scrollYProgress,
    [wordTimings[1].inStart, wordTimings[1].inEnd],
    [16, 0],
  );
  const w2InOp = useTransform(
    scrollYProgress,
    [wordTimings[2].inStart, wordTimings[2].inEnd],
    [0, 1],
  );
  const w2InY = useTransform(
    scrollYProgress,
    [wordTimings[2].inStart, wordTimings[2].inEnd],
    [16, 0],
  );

  // Staggered exit upward
  const w0ExitOp = useTransform(
    scrollYProgress,
    [OUTRO_EXIT_START, OUTRO_EXIT_START + 0.02],
    [1, 0],
  );
  const w0ExitYRaw = useTransform(
    scrollYProgress,
    [OUTRO_EXIT_START, OUTRO_EXIT_START + 0.025],
    [0, -40],
  );
  const w0ExitY = useSpring(w0ExitYRaw, SPRING_CONFIG);

  const e1 = OUTRO_EXIT_START + OUTRO_EXIT_STAGGER;
  const w1ExitOp = useTransform(scrollYProgress, [e1, e1 + 0.02], [1, 0]);
  const w1ExitYRaw = useTransform(scrollYProgress, [e1, e1 + 0.025], [0, -40]);
  const w1ExitY = useSpring(w1ExitYRaw, SPRING_CONFIG);

  const w2TextOp = useTransform(scrollYProgress, [OUTRO_LOGO_IN - 0.02, OUTRO_LOGO_IN], [1, 0]);
  const w2ExitYRaw = useTransform(scrollYProgress, [OUTRO_LOGO_IN - 0.02, OUTRO_LOGO_IN], [0, -20]);
  const w2ExitY = useSpring(w2ExitYRaw, SPRING_CONFIG);

  // Combined entrance + exit
  const w0Op = useTransform([w0InOp, w0ExitOp] as const, ([a, b]: number[]) => Math.min(a, b));
  const w0Y = useTransform([w0InY, w0ExitY] as const, ([a, b]: number[]) => a + b);
  const w1Op = useTransform([w1InOp, w1ExitOp] as const, ([a, b]: number[]) => Math.min(a, b));
  const w1Y = useTransform([w1InY, w1ExitY] as const, ([a, b]: number[]) => a + b);
  const w2Op = useTransform([w2InOp, w2TextOp] as const, ([a, b]: number[]) => Math.min(a, b));
  const w2Y = useTransform([w2InY, w2ExitY] as const, ([a, b]: number[]) => a + b);

  // Logo video — visible from 0.86 to 0.99, no early fade
  const logoOpacity = useTransform(
    scrollYProgress,
    [OUTRO_LOGO_IN, OUTRO_LOGO_IN + 0.01, 0.99, 1],
    [0, 1, 1, 0],
  );
  const logoScale = useTransform(
    scrollYProgress,
    [OUTRO_LOGO_IN, OUTRO_LOGO_IN + 0.04, 0.96, 1],
    [1, 3, 4.5, 4],
  );
  const logoScaleSpring = useSpring(logoScale, SPRING_CONFIG);
  const logoYRaw = useTransform(
    scrollYProgress,
    [OUTRO_LOGO_IN, OUTRO_LOGO_IN + 0.04, 0.95, 1],
    [0, 10, 5, -40],
  );
  const logoYVh = useTransform(logoYRaw, (v: number) => `${v}vh`);
  const logoRotateRaw = useTransform(scrollYProgress, [OUTRO_LOGO_IN + 0.02, 1], [0, Math.PI * 2]);
  const logoRotate = useTransform(logoRotateRaw, (v: number) => Math.sin(v) * 3);

  // Overall outro container opacity — anchored at 1 until end
  const outroOpacity = useTransform(
    scrollYProgress,
    [OUTRO_START, OUTRO_REVEAL_START, 1],
    [0, 1, 1],
  );

  // Yellow bg — reaches full opacity before text appears, stays solid until end
  const outroBgOpacity = useTransform(
    scrollYProgress,
    [SERVICES_END, OUTRO_REVEAL_START, 1],
    [0, 1, 1],
  );

  // CTA — appears with the phrase, exits with it
  const ctaOpacity = useTransform(
    scrollYProgress,
    [OUTRO_REVEAL_END - 0.02, OUTRO_REVEAL_END, OUTRO_EXIT_START, OUTRO_EXIT_START + 0.02],
    [0, 1, 1, 0],
  );
  const ctaYRaw = useTransform(
    scrollYProgress,
    [OUTRO_REVEAL_END - 0.02, OUTRO_REVEAL_END],
    [20, 0],
  );
  const ctaY = useSpring(ctaYRaw, SPRING_CONFIG);

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
      {/* Yellow background for outro */}
      <m.div
        className="pointer-events-none absolute inset-0 z-20 bg-accent"
        style={{ opacity: outroBgOpacity }}
        aria-hidden="true"
      />

      {/* Outro content — left-aligned like OffersMobileAnimated outro */}
      <m.div
        className="pointer-events-none absolute inset-0 z-30 flex flex-col items-start justify-center gap-6 px-container-x"
        style={{ opacity: outroOpacity }}
      >
        {/* Phrase — word-by-word, left-aligned */}
        <h3 className="text-heading text-fluid-outro text-black">
          {/* TAPEZ-LEUR */}
          <span className="inline-block">
            <m.span className="inline-block" style={{ opacity: w0Op, y: w0Y }}>
              {OUTRO_WORDS[0]}
            </m.span>
          </span>
          <br />
          {/* DANS */}
          <span className="inline-block">
            <m.span className="inline-block" style={{ opacity: w1Op, y: w1Y }}>
              {OUTRO_WORDS[1]}
            </m.span>
          </span>
          {'\u00A0'}
          {/* L'ŒIL + logo */}
          <span className="relative inline-block align-bottom">
            <m.span className="inline-block" style={{ opacity: w2Op, y: w2Y }}>
              {OUTRO_WORDS[2]}
            </m.span>

            {/* Logo video — spawns at L'ŒIL, then grows + floats */}
            <m.span
              className="absolute left-1/2 top-1/2 inline-flex origin-center items-center justify-center"
              style={{
                opacity: logoOpacity,
                scale: logoScaleSpring,
                y: logoYVh,
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
                aria-label="Logo animé La Lunetterie du Coin"
              />
            </m.span>
          </span>
        </h3>

        {/* CTA */}
        <m.div className="pointer-events-auto" style={{ opacity: ctaOpacity, y: ctaY }}>
          <LinkCTA
            to={HOMEPAGE_SECTIONS.services.cta.link}
            aria-label={HOMEPAGE_SECTIONS.services.cta.ariaLabel}
          >
            {HOMEPAGE_SECTIONS.services.cta.text}
          </LinkCTA>
        </m.div>
      </m.div>
    </>
  );
}
