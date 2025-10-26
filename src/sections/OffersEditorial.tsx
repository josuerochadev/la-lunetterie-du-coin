import { forwardRef } from 'react';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import { OfferContent } from '@/components/offers/OfferContent';
import { OfferImage } from '@/components/offers/OfferImage';
import { HOMEPAGE_OFFERS, HOMEPAGE_SECTIONS } from '@/data/homepage';

/**
 * Section Offres - Design éditorial Kinfolk
 *
 * Layout alterné 50/50 pour chaque offre :
 * - Image portrait (2:3) à gauche/droite alternant - grande taille
 * - Contenu texte centré verticalement à côté
 * - Design minimaliste sans bordures ni ombres
 *
 * Style éditorial :
 * - Images flat lay en ratio naturel 2:3, grandes et impactantes
 * - Texte centré verticalement avec espace en haut et en bas
 * - Espacement généreux
 * - Alternance visuelle pour rythme
 *
 * @component
 * @returns {JSX.Element} La section Offres en layout éditorial minimaliste
 */
const OffersEditorial = forwardRef<HTMLElement>(() => {
  return (
    <section
      id="offers"
      className="relative w-full bg-background py-section"
      aria-labelledby="offers-title"
    >
      <div className="mx-auto max-w-container px-container-x">
        {/* En-tête */}
        <div className="mx-auto mb-16 max-w-6xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <h2 id="offers-title" className="heading-section mb-4">
              {HOMEPAGE_SECTIONS.offers.title}
            </h2>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <p className="text-body-lg text-stone">{HOMEPAGE_SECTIONS.offers.subtitle}</p>
          </SimpleAnimation>
        </div>

        {/* Offres en layout 50/50 alternant */}
        <div className="space-y-24 lg:space-y-32">
          {HOMEPAGE_OFFERS.map((offer, index) => {
            const isEven = index % 2 === 0;

            return (
              <SimpleAnimation key={offer.id} type="fade" delay={index * 100}>
                <article className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
                  {isEven ? (
                    // Layout pair : Image gauche (50%) - Texte droite (50%)
                    <>
                      <OfferImage image={offer.image} title={offer.title} />
                      <OfferContent
                        title={offer.title}
                        catchphrase={offer.catchphrase}
                        summary={offer.summary}
                        details={offer.details}
                        link={offer.link}
                        align="left"
                      />
                    </>
                  ) : (
                    // Layout impair : Texte gauche (50%) aligné à droite - Image droite (50%)
                    <>
                      <OfferContent
                        title={offer.title}
                        catchphrase={offer.catchphrase}
                        summary={offer.summary}
                        details={offer.details}
                        link={offer.link}
                        align="right"
                      />
                      <OfferImage image={offer.image} title={offer.title} />
                    </>
                  )}
                </article>
              </SimpleAnimation>
            );
          })}
        </div>

        {/* Bouton CTA vers la page Offres complète */}
        <div className="mt-16 text-center">
          <SimpleAnimation type="slide-up" delay={200}>
            <a
              href={HOMEPAGE_SECTIONS.offers.cta.link}
              className="inline-flex items-center gap-2 border border-accent bg-transparent px-6 py-3 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
              aria-label={HOMEPAGE_SECTIONS.offers.cta.ariaLabel}
            >
              {HOMEPAGE_SECTIONS.offers.cta.text}
            </a>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
});

OffersEditorial.displayName = 'OffersEditorial';

export default OffersEditorial;
