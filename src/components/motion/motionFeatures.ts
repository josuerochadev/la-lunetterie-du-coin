// src/components/motion/motionFeatures.ts
// Import only the specific features we actually use to reduce bundle size
import { animate, transform, easeOut, easeInOut } from 'framer-motion';

// Minimal feature set for better performance
const minimalFeatures = {
  animate,
  transform,
  easeOut,
  easeInOut,
};

export default minimalFeatures;
