// src/components/motion/text/SimpleRevealText.tsx
import React from 'react';

import { cn } from '@/lib/cn';

interface SimpleRevealTextProps {
  text: string;
  delay?: number;
  className?: string;
}

/**
 * Version ultra-simplifiée de SimpleRevealText
 * Utilise des animations CSS au lieu de Framer Motion
 */
export default function SimpleRevealText({ 
  text, 
  delay = 0, 
  className 
}: SimpleRevealTextProps) {
  const delayIndex = Math.min(Math.floor(delay * 10), 10);
  
  return (
    <div 
      className={cn(
        'simple-fade-in-up',
        delayIndex > 0 && `simple-fade-in-${delayIndex}`,
        className
      )}
    >
      {text}
    </div>
  );
}