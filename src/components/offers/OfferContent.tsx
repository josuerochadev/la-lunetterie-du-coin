import type { ReactNode } from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

export interface OfferContentProps {
  title: string;
  catchphrase: string;
  summary: string;
  details: string;
  link: string;
  align?: 'left' | 'right';
}

/**
 * Composant réutilisable pour afficher le contenu d'une offre
 * Supporte l'alignement gauche/droite pour les layouts alternés
 */
export function OfferContent({
  title,
  catchphrase,
  summary,
  details,
  link,
  align = 'left',
}: OfferContentProps): ReactNode {
  const isRightAligned = align === 'right';

  return (
    <div className={`flex min-h-full items-center ${isRightAligned ? 'justify-end' : ''}`}>
      <div className={`space-y-6 ${isRightAligned ? 'text-right' : ''}`}>
        {/* Titre */}
        <h3 className="heading-subsection-lg">{title}</h3>

        {/* Phrase d'accroche */}
        <p className="text-body-lg font-medium italic leading-relaxed text-accent">{catchphrase}</p>

        {/* Résumé */}
        <p className="text-body-lg font-medium leading-relaxed text-text">{summary}</p>

        {/* Détails */}
        <div className="space-y-3 pt-2">
          <p className="whitespace-pre-line text-body leading-relaxed text-stone">{details}</p>
        </div>

        {/* CTA */}
        <a
          href={link}
          className="group inline-flex items-center gap-2 text-body font-medium text-accent transition-colors hover:text-text focus-visible:text-text"
          aria-label={`En savoir plus sur l'offre ${title}`}
        >
          Découvrir l'offre
          <ArrowRight
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
}
