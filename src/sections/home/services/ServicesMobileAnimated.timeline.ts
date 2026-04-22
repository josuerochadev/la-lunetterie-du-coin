import { SERVICE_COUNT } from './constants';

// ── Scroll budget ──
// Total height = (SERVICE_COUNT + 3) viewports
// 0.00–0.03 → curtain lift (accent overlay slides up)
// 0.03–0.68 → services crossfade (equally divided), title persists
// 0.68–0.95 → outro phrase + logo (yellow bg)
// 0.95–1.00 → final CTA
export const TOTAL_VH = SERVICE_COUNT + 3;
export const CURTAIN_END = 0.03;
export const SERVICES_START = 0.05;
export const SERVICES_END = 0.68;
export const SERVICE_RANGE = (SERVICES_END - SERVICES_START) / SERVICE_COUNT;

// Outro budget
export const OUTRO_START = 0.7;
export const OUTRO_REVEAL_START = 0.72;
export const OUTRO_REVEAL_END = 0.8;
export const OUTRO_EXIT_START = 0.83;
export const OUTRO_EXIT_STAGGER = 0.015;
export const OUTRO_LOGO_IN = 0.86;
