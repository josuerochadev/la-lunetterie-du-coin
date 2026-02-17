import type React from 'react';

import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

/**
 * Composant bouton réutilisable.
 *
 * @param variant - 'primary' (jaune/noir) ou 'secondary' (outline noir)
 * @param className - Classes CSS supplémentaires
 */
export default function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const variantClass = variant === 'secondary' ? 'button-secondary' : 'button-primary';

  return (
    <button
      type={props.type}
      className={cn(`${variantClass} font-semibold`, className)}
      {...props}
    />
  );
}
