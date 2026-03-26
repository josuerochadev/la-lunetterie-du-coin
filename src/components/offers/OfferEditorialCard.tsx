import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import type { OfferData } from '@/data/offers';

/**
 * Props du composant OfferEditorialCard
 */
interface OfferEditorialCardProps {
  /** Données de l'offre */
  offer: OfferData;
  /** Position de l'image : 'left' ou 'right' */
  imagePosition: 'left' | 'right';
  /** Index pour l'animation (delay) */
  index?: number;
}

/**
 * Composant OfferEditorialCard - Affichage éditorial 50/50 pour les offres
 *
 * Layout alterné automatiquement selon imagePosition:
 * - 'left': Image à gauche, texte à droite
 * - 'right': Texte à gauche, image à droite
 *
 * Affiche la phrase d'accroche et les conditions spécifiques aux offres.
 *
 * @component
 * @example
 * <OfferEditorialCard
 *   offer={offerData}
 *   imagePosition="left"
 *   index={0}
 * />
 */
export function OfferEditorialCard({ offer, imagePosition, index = 0 }: OfferEditorialCardProps) {
  const isImageLeft = imagePosition === 'left';

  // Composant Image réutilisable
  const ImageBlock = (
    <div className="relative w-full">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img
          src={offer.image}
          alt={offer.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );

  // Composant Texte réutilisable
  const TextBlock = (
    <div className={`flex min-h-full items-center ${isImageLeft ? '' : 'justify-end'}`}>
      <div className={`space-y-6 ${isImageLeft ? '' : 'text-right'}`}>
        {/* Titre */}
        <h2 className="heading-section">{offer.title}</h2>

        {/* Phrase d'accroche */}
        <p className="text-body-lg font-medium italic text-accent">{offer.catchphrase}</p>

        {/* Description */}
        <p className="text-body-lg text-text">{offer.description}</p>

        {/* Détails - Boîte centralisée avec bordure */}
        <div className={`border border-black p-6 ${isImageLeft ? '' : 'text-left'}`}>
          <ul className="space-y-2">
            {offer.details.map((detail, i) => (
              <li key={i} className="flex gap-3 text-body text-black/50">
                <span className="text-accent" aria-hidden="true">
                  •
                </span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conditions */}
        <div
          className={`${isImageLeft ? 'border-l-4' : 'border-r-4'} border-accent/30 bg-accent/5 p-6 ${isImageLeft ? '' : 'text-left'}`}
        >
          <h4 className="mb-3 text-body font-medium text-text">Conditions :</h4>
          <ul className="space-y-2 text-body-sm text-black/50">
            {offer.conditions.map((condition, i) => (
              <li key={i} className="flex gap-2">
                <span>•</span>
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <SimpleAnimation type="fade" delay={index * 100}>
      <article id={offer.id} className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {isImageLeft ? (
          // Layout: Image gauche - Texte droite
          <>
            {ImageBlock}
            {TextBlock}
          </>
        ) : (
          // Layout: Texte gauche - Image droite
          <>
            {TextBlock}
            {ImageBlock}
          </>
        )}
      </article>
    </SimpleAnimation>
  );
}
