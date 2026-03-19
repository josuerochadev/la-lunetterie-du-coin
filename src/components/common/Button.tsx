import type React from 'react';

import { cn } from '@/lib/cn';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Thème du fond — light = texte noir, dark = texte blanc, accent = texte noir (fond jaune) */
  theme?: 'light' | 'dark' | 'accent';
};

const textColorMap: Record<string, string> = {
  light: 'text-black',
  dark: 'text-white',
  accent: 'text-black',
};

const underlineColorMap: Record<string, string> = {
  light: 'bg-secondary-orange',
  dark: 'bg-secondary-orange',
  accent: 'bg-black',
};

/**
 * Composant bouton avec style underline.
 *
 * Trait orange permanent, hover weight change.
 * Utiliser `theme` pour adapter au fond (light/dark/accent).
 */
export default function Button({ theme = 'light', className, children, ...props }: ButtonProps) {
  return (
    <button
      type={props.type ?? 'button'}
      className={cn(
        'group/cta relative inline-flex cursor-pointer items-center gap-2 border-none bg-transparent text-body font-normal transition-[font-weight] duration-300 hover:font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        textColorMap[theme],
        className,
      )}
      {...props}
    >
      {children}
      <span
        className={cn('absolute -bottom-1 left-0 h-[1.5px] w-full', underlineColorMap[theme])}
        aria-hidden="true"
      />
    </button>
  );
}
