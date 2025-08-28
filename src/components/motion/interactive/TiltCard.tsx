// src/components/motion/interactive/TiltCard.tsx
// Version simplifiée pour compatibilité - sans effet tilt lourd

import React, { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Version ultra-simplifiée de TiltCard
 * Remplace l'effet tilt 3D par un simple hover scale
 */
export default function TiltCard({ children, className }: TiltCardProps) {
  return <div className={cn('simple-hover-scale touch-optimized', className)}>{children}</div>;
}
