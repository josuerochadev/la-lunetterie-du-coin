import { OFFERS_DATA } from '@/data/offers';

export const OFFER_COUNT = OFFERS_DATA.length;

// ---------------------------------------------------------------------------
// Desktop — per-offer scroll windows (normalised 0–1)
// Phase layout:  photo1 + card1  →  photo2 + card2  →  fade-to-black
// ---------------------------------------------------------------------------

export const OFFERS_TIMELINE = [
  {
    imgIn: [0.0, 0.08],
    hold: [0.08, 0.38],
    imgOut: [0.38, 0.48],
    cardIn: [0.06, 0.16],
    cardOut: [0.38, 0.46],
  },
  {
    imgIn: [0.46, 0.54],
    hold: [0.54, 0.76],
    imgOut: [0.76, 0.86],
    cardIn: [0.5, 0.6],
    cardOut: [0.76, 0.84],
  },
] as const;

// Fade-to-black after second offer (transition to gradient → CTA)
export const BLACK_FADE_START = 0.84;
export const BLACK_FADE_END = 0.96;

// ---------------------------------------------------------------------------
// StaggerChild — micro-delayed entrance offset per element within a card
// ---------------------------------------------------------------------------

export const STAGGER_OFFSET = 0.012;

// ---------------------------------------------------------------------------
// Mobile — immersive sticky slideshow
// ---------------------------------------------------------------------------

// Scroll budget (normalised 0–1)
export const SLICE = 1 / OFFER_COUNT; // 0.50 per offer

// Per-slide phase offsets (relative to slice start)
export const ENTER_OFFSET = 0.02;
export const ENTER_DUR = 0.04;
export const TEXT_COUNTER = 0.04;
export const TEXT_TITLE = 0.06;
export const TEXT_DESC = 0.09;
export const TEXT_DETAILS = 0.12;
export const TEXT_CONDITIONS = 0.15;
export const TEXT_CTA = 0.18;
export const TEXT_STAGGER = 0.04;
export const EXIT_START = 0.4;
export const EXIT_END = SLICE;
