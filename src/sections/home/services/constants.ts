import { HOMEPAGE_SERVICES } from '@/data/homepage';

export const SERVICE_COUNT = HOMEPAGE_SERVICES.length;
export const OUTRO_WORDS = ['TAPEZ-LEUR', 'DANS', "L'ŒIL"] as const;

// Scroll budget
export const TITLE_END = 0.08;
export const ZOOM_END = 0.13;
export const SERVICES_START = ZOOM_END;
export const SERVICES_END = 0.78;
export const OUTRO_START = 0.8;

// Outro constants
export const REVEAL_START = 0.82;
export const REVEAL_END = 0.88;
export const EXIT_START = 0.9;
export const EXIT_STAGGER = 0.012;
export const LOGO_IN = 0.94;
export const LOGO_FLOAT_END = 0.99;

export const WORD_TIMINGS = OUTRO_WORDS.map((_, i) => {
  const rng = REVEAL_END - REVEAL_START;
  const wordCount = OUTRO_WORDS.length;
  const inStart = REVEAL_START + (i / wordCount) * rng;
  const inEnd = Math.min(inStart + rng / wordCount + rng * 0.2, REVEAL_END);
  return { inStart, inEnd };
});
