export const SCROLL_HEIGHT_VH = 550;

export const OFFERS_TIMELINE = [
  {
    imgIn: [0.02, 0.12],
    hold: [0.12, 0.34],
    imgOut: [0.34, 0.46],
    cardIn: [0.1, 0.2],
    cardOut: [0.34, 0.44],
  },
  {
    imgIn: [0.46, 0.56],
    hold: [0.56, 0.78],
    imgOut: [0.78, 0.88],
    cardIn: [0.52, 0.62],
    cardOut: [0.78, 0.86],
  },
] as const;

export const IMAGE_LAYOUT = [
  { x: '-18%', rotateZ: -8, rotateY: 14, rotateX: 8 },
  { x: '18%', rotateZ: 6, rotateY: -14, rotateX: 8 },
] as const;
