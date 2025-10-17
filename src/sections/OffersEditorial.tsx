import { forwardRef } from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

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
  const offers = [
    {
      id: 1,
      title: 'Recyclage',
      image: '/images/offer-recyclage.jpg',
      catchphrase: "Vos anciennes lunettes valent de l'or",
      summary: "Jusqu'à 70€ de remise en rapportant vos anciennes montures.",
      details:
        "Donnez une seconde vie à vos lunettes tout en économisant sur votre nouvel équipement. Un geste pour votre budget et pour la planète.\n\nRapportez toutes vos anciennes paires, peu importe leur état, et bénéficiez d'une réduction immédiate.",
      link: '/offres#recyclage',
    },
    {
      id: 2,
      title: 'Deuxième paire',
      image: '/images/offer-second-pair.jpg',
      catchphrase: 'Deux paires, deux styles, un prix imbattable',
      summary: 'Obtenez une deuxième paire à partir de 59€ selon vos besoins.',
      details:
        "Lunettes de soleil, de lecture ou de secours : doublez votre style sans vous ruiner.\n\n59€ pour des verres unifocaux, 89€ pour des progressifs. Verres antireflet durci inclus. Cumulable avec l'offre recyclage !",
      link: '/offres#deuxieme-paire',
    },
  ];

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
        <div className="space-y-24 lg:space-y-32">
          {offers.map((offer, index) => {
            const isEven = index % 2 === 0;

            return (
              <SimpleAnimation key={offer.id} type="fade" delay={index * 100}>
                <article className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
                  {isEven ? (
                    // Layout pair : Image gauche (50%) - Texte droite (50%)
                    <>
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
                      <div className="flex min-h-full items-center">
                        <div className="space-y-6">
                          {/* Tagline + Titre */}
                          <div>
                            <span className="mb-3 inline-block text-body-sm font-medium uppercase tracking-wider text-stone">
                              Offre {index + 1}
                            </span>
                            <h3 className="heading-subsection-lg">{offer.title}</h3>
                          </div>

                          {/* Phrase d'accroche */}
                          <p className="text-body-lg font-medium italic leading-relaxed text-accent">
                            {offer.catchphrase}
                          </p>

                          {/* Résumé */}
                          <p className="text-body-lg font-medium leading-relaxed text-text">
                            {offer.summary}
                          </p>

                          {/* Détails */}
                          <div className="space-y-3 pt-2">
                            <p className="whitespace-pre-line text-body leading-relaxed text-stone">
                              {offer.details}
                            </p>
                          </div>

                          {/* CTA */}
                          <a
                            href={offer.link}
                            className="group inline-flex items-center gap-2 text-body font-medium text-accent transition-colors hover:text-text focus-visible:text-text"
                            aria-label={`En savoir plus sur l'offre ${offer.title}`}
                          >
                            Découvrir l'offre
                            <ArrowRight
                              className="h-5 w-5 transition-transform group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </a>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Layout impair : Texte gauche (50%) aligné à droite - Image droite (50%)
                    <>
                      <div className="flex min-h-full items-center justify-end">
                        <div className="space-y-6 text-right">
                          {/* Tagline + Titre */}
                          <div>
                            <span className="mb-3 inline-block text-body-sm font-medium uppercase tracking-wider text-stone">
                              Offre {index + 1}
                            </span>
                            <h3 className="heading-subsection-lg">{offer.title}</h3>
                          </div>

                          {/* Phrase d'accroche */}
                          <p className="text-body-lg font-medium italic leading-relaxed text-accent">
                            {offer.catchphrase}
                          </p>

                          {/* Résumé */}
                          <p className="text-body-lg font-medium leading-relaxed text-text">
                            {offer.summary}
                          </p>

                          {/* Détails */}
                          <div className="space-y-3 pt-2">
                            <p className="whitespace-pre-line text-body leading-relaxed text-stone">
                              {offer.details}
                            </p>
                          </div>

                          {/* CTA */}
                          <a
                            href={offer.link}
                            className="group inline-flex items-center gap-2 text-body font-medium text-accent transition-colors hover:text-text focus-visible:text-text"
                            aria-label={`En savoir plus sur l'offre ${offer.title}`}
                          >
                            Découvrir l'offre
                            <ArrowRight
                              className="h-5 w-5 transition-transform group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </a>
                        </div>
                      </div>
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
                    </>
                  )}
                </article>
              </SimpleAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
});

OffersEditorial.displayName = 'OffersEditorial';

export default OffersEditorial;
