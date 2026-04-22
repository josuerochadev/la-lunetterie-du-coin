// ── Phase 1: photo appears alone ──
export const PHOTO_ENTRANCE_START = 0.05;
export const PHOTO_ENTRANCE_END = 0.12;
export const PHOTO_GROWTH_END = 0.5;
export const PHOTO_ZOOM_END = 0.6;

// ── Phase 2: title & text enter ──
export const TITLE_ENTER_START = 0.17;
export const TITLE_ENTER_END = 0.28;
export const TEXT_REVEAL_START = 0.17;
export const TEXT_REVEAL_END = 0.32;
export const TITLE_TEXT_FADE_IN = 0.15;
export const TITLE_TEXT_VISIBLE = 0.25;
export const TITLE_TEXT_FADE_OUT_START = 0.45;
export const TITLE_TEXT_FADE_OUT_END = 0.5;

// ── Phase 3: photo expands fullscreen ──
export const EXPAND_START = 0.5;
export const EXPAND_END = 0.6;
export const EXPAND_OPACITY_START = 0.55;
export const EXPAND_OPACITY_END = 0.62;

// ── Phase 4: transition phrase ("VOYEZ GRAND PAYEZ PETIT") ──
export const PHRASE_FADE_IN_START = 0.58;
export const PHRASE_FADE_IN_END = 0.66;

// ── Phase 5: "GRAND" zoom-out ──
// The browser rasterizes text at its layout size then scales the bitmap.
// By rendering GRAND at RASTER_BOOST× font-size and starting scale at
// 1/BOOST, the bitmap is high-res so the zoom stays sharp.
export const RASTER_BOOST = 10;
export const GRAND_ZOOM_START = 0.76;
export const GRAND_ZOOM_END = 0.88;
export const SURROUNDING_FADE_START = 0.75;
export const SURROUNDING_FADE_END = 0.8;
export const YELLOW_OVERLAY_START = 0.82;
export const YELLOW_OVERLAY_END = 0.9;

// ── Navbar theme switch threshold ──
export const NAVBAR_THEME_SWITCH = 0.78;
