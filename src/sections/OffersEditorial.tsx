import { forwardRef } from 'react';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';
import { OFFERS } from '@/config/constants';
import Picture from '@/components/common/Picture';

/**
 * Section Offres redesignée en style éditorial (Phase 2)
 *
 * Layout 50/50 alternant pour chaque offre :
 * - Image d'un côté
 * - Contenu texte de l'autre
 * - Alternance gauche/droite pour rythme visuel
 *
 * Style inspiré La Pima/Kinfolk :
 * - Espaces généreux
 * - Typographie claire
 * - Pas d'expansion/collapse (tout visible)
 * - Focus sur la lisibilité
 *
 * @component
 * @returns {JSX.Element} La section Offres en layout éditorial
 */
const OffersEditorial = forwardRef<HTMLElement>(() => {
  return (
    <SectionContainer
      id="offers"
      className="bg-background py-section"
      aria-labelledby="offers-title"
    >
      <div className="mx-auto max-w-container px-4 sm:px-6">
        {/* En-tête */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 id="offers-title" className="mb-4 text-title-md font-medium text-text">
              Nos offres
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="text-body-lg text-stone">
              Des solutions pensées pour votre budget et pour la planète
            </p>
          </SimpleAnimation>
        </div>

        {/* Offres en layout 50/50 alternant */}
        <div className="space-y-24">
          {OFFERS.map((offer, index) => {
            const isEven = index % 2 === 0;

            return (
              <article
                key={offer.id}
                className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
                  isEven ? '' : 'lg:grid-flow-dense'
                }`}
              >
                {/* Image */}
                <SimpleAnimation type="slide-up" delay={index * 100}>
                  <div
                    className={`relative aspect-[4/3] overflow-hidden rounded-sm shadow-card ${
                      isEven ? '' : 'lg:col-start-2'
                    }`}
                  >
                    <Picture
                      srcBase={offer.imageBase}
                      alt={offer.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </SimpleAnimation>

                {/* Contenu */}
                <div className={`space-y-6 ${isEven ? '' : 'lg:col-start-1'}`}>
                  <SimpleAnimation type="slide-up" delay={index * 100 + 100}>
                    <div>
                      <span className="mb-3 inline-block text-body-sm font-medium uppercase tracking-wider text-stone">
                        Offre {index + 1}
                      </span>
                      <h3 className="mb-4 text-title-sm font-medium text-text">{offer.title}</h3>
                    </div>
                  </SimpleAnimation>

                  <SimpleAnimation type="slide-up" delay={index * 100 + 200}>
                    <div className="space-y-4">
                      {/* Résumé */}
                      <p className="text-body-lg font-medium leading-relaxed text-text">
                        {offer.summary}
                      </p>

                      {/* Détails */}
                      <div className="border-l-2 border-accent pl-6">
                        <p className="whitespace-pre-line text-body leading-relaxed text-stone">
                          {offer.details}
                        </p>
                      </div>
                    </div>
                  </SimpleAnimation>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
});

OffersEditorial.displayName = 'OffersEditorial';

export default OffersEditorial;
