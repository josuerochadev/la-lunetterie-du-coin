import { ReactNode } from 'react';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import type { ServiceData } from '@/data/services';

/**
 * Props du composant ServiceEditorialCard
 */
interface ServiceEditorialCardProps {
  /** Données du service */
  service: ServiceData;
  /** Position de l'image : 'left' ou 'right' */
  imagePosition: 'left' | 'right';
  /** Index pour l'animation (delay) */
  index?: number;
  /** Contenu additionnel à afficher après les détails (CTA, etc.) */
  additionalContent?: ReactNode;
}

/**
 * Composant ServiceEditorialCard - Affichage éditorial 50/50 pour les services
 *
 * Layout alterné automatiquement selon imagePosition:
 * - 'left': Image à gauche, texte à droite
 * - 'right': Texte à gauche, image à droite
 *
 * @component
 * @example
 * <ServiceEditorialCard
 *   service={serviceData}
 *   imagePosition="left"
 *   index={0}
 * />
 */
export function ServiceEditorialCard({
  service,
  imagePosition,
  index = 0,
  additionalContent,
}: ServiceEditorialCardProps) {
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

        {/* Description */}
        <p className="text-body-lg text-text">{service.description}</p>

        {/* Détails - Boîte centralisée avec bordure */}
        <div className={`border border-black p-6 ${isImageLeft ? '' : 'text-left'}`}>
          <ul className="space-y-2">
            {service.details.map((detail, i) => (
              <li key={i} className="flex gap-3 text-body text-black/50">
                <span className="text-accent" aria-hidden="true">
                  •
                </span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

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
