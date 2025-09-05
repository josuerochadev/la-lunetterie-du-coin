// src/components/motion/text/RevealText.tsx
// Version simplifiée pour compatibilité

import React, { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface RevealTextProps {
  children?: ReactNode;
  text?: string;
  delay?: number;
  baseDelay?: number;
  className?: string;
  preserveWordSpacing?: boolean;
  // eslint-disable-next-line no-unused-vars
  renderPart?: (word: string) => React.ReactNode;
}

/**
 * Version ultra-simplifiée de RevealText
 * Compatible avec les props complexes mais affiche simplement le texte
 */
export default function RevealText({
  children,
  text,
  delay = 0,
  baseDelay = 0,
  className,
  preserveWordSpacing = true,
  renderPart,
}: RevealTextProps) {
  const delayIndex = Math.min(Math.floor((delay + baseDelay) * 10), 10);
  const content = text || children;

  // Si on a une fonction renderPart et un texte, on l'applique
  if (renderPart && typeof content === 'string') {
    const words = content.split(' ');
    return (
      <div
        className={cn(
          'simple-fade-in-up',
          delayIndex > 0 && `simple-fade-in-${delayIndex}`,
          className,
        )}
      >
        {words.map((word, index) => (
          <React.Fragment key={index}>
            {renderPart(word)}
            {index < words.length - 1 && preserveWordSpacing && ' '}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'simple-fade-in-up',
        delayIndex > 0 && `simple-fade-in-${delayIndex}`,
        className,
      )}
    >
      {content}
    </div>
  );
}
