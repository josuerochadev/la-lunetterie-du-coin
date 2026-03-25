import type React from 'react';
import { Link } from 'react-router-dom';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { cn } from '@/lib/cn';

type LinkCTAProps = {
  /** Route interne (react-router Link) */
  to?: string;
  /** URL externe (anchor) */
  href?: string;
  /** Thème du fond — light = texte noir, dark = texte blanc, accent = texte noir (fond jaune) */
  theme?: 'light' | 'dark' | 'accent';
  /** Icône à afficher (défaut: ArrowRight) */
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  'aria-label'?: string;
  onClick?: React.MouseEventHandler;
};

const textColorMap: Record<string, string> = {
  light: 'text-black',
  dark: 'text-white',
  accent: 'text-black',
};

const underlineColorMap: Record<string, string> = {
  light: 'bg-secondary-orange',
  dark: 'bg-secondary-orange',
  accent: 'bg-secondary-orange',
};

export default function LinkCTA({
  to,
  href,
  theme = 'light',
  icon: Icon = ArrowRight,
  children,
  className,
  ...props
}: LinkCTAProps) {
  const classes = cn(
    'group/cta relative inline-flex w-fit items-center gap-2 text-body font-normal transition-[font-weight] duration-300 hover:font-semibold',
    textColorMap[theme],
    className,
  );

  const content = (
    <>
      {children}
      <Icon
        className="h-4 w-4 flex-shrink-0 text-secondary-green transition-transform duration-300 group-hover/cta:translate-x-1"
        aria-hidden="true"
      />
      <span
        className={cn(
          'absolute -bottom-1 left-0 h-[1.5px] w-0 transition-all duration-300 group-hover/cta:w-full',
          underlineColorMap[theme],
        )}
        aria-hidden="true"
      />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={props['aria-label']} onClick={props.onClick}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...props}>
      {content}
    </a>
  );
}
