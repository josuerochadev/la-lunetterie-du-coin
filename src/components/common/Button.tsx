import type React from 'react';

import { cn } from '@/lib/cn';

/**
 * Bouton personnalisable compatible avec le design system du projet.
 *
 * @component
 * @param {object} props
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - Toutes les props natives du bouton HTML, plus les classes custom du design system.
 * @returns {JSX.Element}
 */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Composant bouton réutilisable.
 *
 * @param className - Classes CSS supplémentaires à appliquer au bouton.
 * @param props - Autres propriétés du bouton (par exemple, type, onClick, etc.).
 * @returns Un élément bouton stylisé avec les propriétés spécifiées.
 */
export default function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      type={props.type}
      className={cn('button-primary font-semibold', className)}
      {...props}
    />
  );
}
