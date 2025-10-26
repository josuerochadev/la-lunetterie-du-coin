import { ReactNode } from 'react';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Type pour un service ou une offre
 */
export interface ServiceCardData {
  id: string;
  title: string;
  image: string;
  description: string;
  details: string[];
  catchphrase?: string; // Pour les offres
  conditions?: string[]; // Pour les offres
}

/**
 * Props du composant ServiceCard
 */
interface ServiceCardProps {
  /** Données du service/offre */
  service: ServiceCardData;
  /** Position de l'image : 'left' ou 'right' */
  imagePosition: 'left' | 'right';
  /** Index pour l'animation (delay) */
  index?: number;
  /** Contenu additionnel à afficher après les détails (conditions, CTA, etc.) */
  additionalContent?: ReactNode;
}

/**
 * Composant ServiceCard - Affichage éditorial 50/50 avec image et texte
 *
 * Layout alterné automatiquement selon imagePosition:
 * - 'left': Image à gauche, texte à droite
 * - 'right': Texte à gauche, image à droite
 *
 * Principe KISS: Un seul composant pour gérer les deux layouts
 *
 * @component
 * @example
 * <ServiceCard
 *   service={serviceData}
 *   imagePosition="left"
 *   index={0}
 * />
 */
export function ServiceCard({
  service,
  imagePosition,
  index = 0,
  additionalContent,
}: ServiceCardProps) {
  const isImageLeft = imagePosition === 'left';

  // Composant Image réutilisable
  const ImageBlock = (
    <div className="relative w-full">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
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
        <h2 className="heading-section">{service.title}</h2>

        {/* Phrase d'accroche (optionnelle - pour les offres) */}
        {service.catchphrase && (
          <p className="text-body-lg font-medium italic leading-relaxed text-accent">
            {service.catchphrase}
          </p>
        )}

        {/* Description */}
        <p className="text-body-lg leading-relaxed text-text">{service.description}</p>

        {/* Détails - Boîte centralisée avec bordure */}
        <div className={`border border-charcoal p-6 ${isImageLeft ? '' : 'text-left'}`}>
          <ul className="space-y-2">
            {service.details.map((detail, i) => (
              <li key={i} className="flex gap-3 text-body text-stone">
                <span className="text-accent" aria-hidden="true">
                  •
                </span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conditions (optionnelles - pour les offres) */}
        {service.conditions && (
          <div
            className={`${isImageLeft ? 'border-l-4' : 'border-r-4'} border-accent/30 bg-accent/5 p-6 ${isImageLeft ? '' : 'text-left'}`}
          >
            <h4 className="mb-3 text-body font-medium text-text">Conditions :</h4>
            <ul className="space-y-2 text-body-sm text-stone">
              {service.conditions.map((condition, i) => (
                <li key={i} className="flex gap-2">
                  <span>•</span>
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contenu additionnel (CTA, etc.) */}
        {additionalContent && (
          <div className={isImageLeft ? '' : 'text-left'}>{additionalContent}</div>
        )}
      </div>
    </div>
  );

  return (
    <SimpleAnimation type="fade" delay={index * 100}>
      <article id={service.id} className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
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
