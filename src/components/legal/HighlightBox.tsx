import type { ReactNode } from 'react';

type HighlightBoxProps = {
  title?: string;
  variant?: 'info' | 'warning' | 'important';
  children: ReactNode;
  className?: string;
};

/**
 * Composant de mise en évidence pour informations importantes
 *
 * Affiche du contenu dans un encadré coloré selon le variant :
 * - info : bleu (informations générales)
 * - warning : orange (avertissements)
 * - important : vert (points essentiels)
 *
 * @component
 * @param props - Les propriétés du composant
 * @returns Encadré de mise en évidence
 */
export default function HighlightBox({
  title,
  variant = 'info',
  children,
  className = '',
}: HighlightBoxProps) {
  const variants = {
    info: {
      container: 'border-l-2 border-dark-green',
      title: 'text-primary font-semibold',
      content: 'text-primary',
    },
    warning: {
      container: 'border-l-2 border-orange',
      title: 'text-primary font-semibold',
      content: 'text-primary',
    },
    important: {
      container: 'border-l-2 border-dark-green',
      title: 'text-primary font-bold',
      content: 'text-primary font-medium',
    },
  };

  const style = variants[variant];

  return (
    <div
      className={`${style.container} my-6 py-4 pl-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm ${className}`}
      role="note"
    >
      {title && <h4 className={`mb-3 ${style.title}`}>{title}</h4>}
      <div className={`${style.content} space-y-xs`}>{children}</div>
    </div>
  );
}
