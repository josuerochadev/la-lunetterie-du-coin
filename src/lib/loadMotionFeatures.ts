// src/lib/loadMotionFeatures.ts
export const loadFeatures = () =>
  import('@/components/motion/motionFeatures').then((res) => res.default);
