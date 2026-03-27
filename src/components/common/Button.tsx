import type React from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { cn } from '@/lib/cn';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Thème du fond — light = texte noir, dark = texte blanc, accent = texte noir (fond jaune) */
  theme?: ButtonTheme;
  /** Icône à afficher (défaut: ArrowRight) */
  icon?: React.ElementType;
};

type ButtonTheme = 'light' | 'dark' | 'accent';

const textColorMap: Record<ButtonTheme, string> = {
  light: 'text-black',
  dark: 'text-white',
  accent: 'text-black',
};

const underlineColorMap: Record<ButtonTheme, string> = {
  light: 'bg-secondary-orange',
  dark: 'bg-secondary-orange',
  accent: 'bg-black',
};

/**
 * Composant bouton avec style underline + flèche.
 *
 * Même style visuel que LinkCTA mais en <button>.
 * Trait orange au hover, flèche verte.
 */
export default function Button({
  theme = 'light',
  icon: Icon = ArrowRight,
  className,
  children,
  ...props
}: ButtonProps) {
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
      {!props.disabled && (
        <Icon
          className="h-4 w-4 flex-shrink-0 text-secondary-green transition-transform duration-300 group-hover/cta:translate-x-1"
          aria-hidden="true"
        />
      )}
      <span
        className={cn(
          'absolute -bottom-1 left-0 h-[1.5px] w-0 transition-all duration-300 group-hover/cta:w-full',
          underlineColorMap[theme],
        )}
        aria-hidden="true"
      />
    </button>
  );
}
