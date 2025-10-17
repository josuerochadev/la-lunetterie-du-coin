import Layout from '@/components/common/Layout';
import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';
import { useNativeScroll } from '@/hooks/useNativeScroll';
import { Seo } from '@/seo/Seo';
import { CALENDLY_URL } from '@/config/constants';

/**
 * Page Offres détaillée
 *
 * Page complète présentant nos deux offres principales :
 * - Programme de recyclage (jusqu'à 70€ de réduction)
 * - Deuxième paire (à partir de 59€)
 *
 * Style minimaliste cohérent avec ServicesPage
 *
 * @component
 * @returns {JSX.Element} Page Offres complète
 */
export default function OffersPage() {
  useNativeScroll();

  const offers = [
    {
      id: 'recyclage',
      title: 'Programme de recyclage',
      image: '/images/offers-recyclage-sunglasses.jpg',
      catchphrase: "Vos anciennes lunettes valent de l'or",
      description:
        "Rapportez vos anciennes lunettes et économisez jusqu'à 70€ sur votre nouvel achat. Un geste pour votre budget et pour la planète.",
      details: [
        "Jusqu'à 70€ de réduction immédiate sur votre équipement complet",
        'Toutes marques acceptées, peu importe leur état',
        'Montures cassées, rayées ou démodées : tout est bon !',
        'Geste écologique récompensé : donnez une seconde vie',
        'Les montures sont restaurées professionnellement puis revendues',
        'Réduction directement déduite en magasin',
        'Pas de limite de quantité : plus vous apportez, plus vous économisez',
      ],
      conditions: [
        'Offre limitée à 1 monture par transaction',
        'Valable uniquement pour un équipement de classe B (monture + verres)',
        "Non cumulable avec d'autres promotions exceptionnelles",
        'Les montures doivent être propres et complètes (branches et façade)',
      ],
    },
    {
      id: 'deuxieme-paire',
      title: 'Deuxième paire',
      image: '/images/offers-second-sunglasses-clip.jpg',
      catchphrase: 'Deux paires, deux styles, un prix imbattable',
      description:
        'Obtenez une deuxième paire à partir de 59€ selon vos besoins. Lunettes de soleil, de lecture ou de secours : doublez votre style sans vous ruiner.',
      details: [
        '59€ : monture + verres unifocaux standards',
        '89€ : verres progressifs pour votre deuxième paire',
        'Verres antireflet durci inclus',
        'Option solaires UV cat.3 au même prix',
        'Origine France Garantie — Ophtalmic Vision',
        'Large choix de montures disponibles',
        'Qualité professionnelle garantie',
      ],
      conditions: [
        'Offre valable sur la monture la moins chère',
        "Applicable lors de l'achat d'un équipement de classe B",
        "Cumulable avec l'offre de recyclage",
        '+40€ pour option polarisée sur les solaires',
        'Voir conditions détaillées en magasin',
      ],
    },
  ];

  return (
    <>
      <Seo
        title="Nos Offres - La Lunetterie du Coin"
        description="Découvrez nos offres exclusives : jusqu'à 70€ de réduction avec le recyclage, deuxième paire à partir de 59€. Économisez en faisant un geste pour la planète."
        canonicalPath="/offres"
      />
      <Layout>
        {/* Hero - Style homepage avec hiérarchie forte */}
        <SectionContainer id="hero" className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-5xl">
              <SimpleAnimation type="slide-up" delay={0}>
                <div className="space-y-6">
                  <h1 className="heading-page">Nos offres</h1>
                  <p
                    className="leading-relaxed text-stone"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
                  >
                    Des solutions pensées pour votre budget et pour la planète
                  </p>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>

        {/* Offres détaillées - Layout éditorial 50/50 alterné */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="space-y-24 lg:space-y-32">
              {offers.map((offer, index) => {
                const isEven = index % 2 === 0;

                return (
                  <SimpleAnimation key={offer.id} type="fade" delay={index * 100}>
                    <article
                      id={offer.id}
                      className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16"
                    >
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
                              {/* Titre */}
                              <h2 className="heading-section">{offer.title}</h2>

                              {/* Phrase d'accroche */}
                              <p className="text-body-lg font-medium italic leading-relaxed text-accent">
                                {offer.catchphrase}
                              </p>

                              {/* Description */}
                              <p className="text-body-lg leading-relaxed text-text">
                                {offer.description}
                              </p>

                              {/* Détails - Boîte avec bordure */}
                              <div className="border border-charcoal p-6">
                                <ul className="space-y-2">
                                  {offer.details.map((detail, i) => (
                                    <li key={i} className="flex gap-3 text-body text-stone">
                                      <span className="text-accent" aria-hidden="true">
                                        •
                                      </span>
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Conditions */}
                              <div className="border-l-4 border-accent/30 bg-accent/5 p-6">
                                <h4 className="mb-3 text-body font-medium text-text">
                                  Conditions :
                                </h4>
                                <ul className="space-y-2 text-body-sm text-stone">
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
                        </>
                      ) : (
                        // Layout impair : Texte gauche (50%) - Image droite (50%)
                        <>
                          <div className="flex min-h-full items-center justify-end">
                            <div className="space-y-6 text-right">
                              {/* Titre */}
                              <h2 className="heading-section">{offer.title}</h2>

                              {/* Phrase d'accroche */}
                              <p className="text-body-lg font-medium italic leading-relaxed text-accent">
                                {offer.catchphrase}
                              </p>

                              {/* Description */}
                              <p className="text-body-lg leading-relaxed text-text">
                                {offer.description}
                              </p>

                              {/* Détails - Boîte avec bordure */}
                              <div className="border border-charcoal p-6 text-left">
                                <ul className="space-y-2">
                                  {offer.details.map((detail, i) => (
                                    <li key={i} className="flex gap-3 text-body text-stone">
                                      <span className="text-accent" aria-hidden="true">
                                        •
                                      </span>
                                      <span>{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Conditions */}
                              <div className="border-r-4 border-accent/30 bg-accent/5 p-6 text-left">
                                <h4 className="mb-3 text-body font-medium text-text">
                                  Conditions :
                                </h4>
                                <ul className="space-y-2 text-body-sm text-stone">
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
        </SectionContainer>

        {/* CTA final */}
        <SectionContainer className="bg-background py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-4xl text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="heading-section mb-6">Prêt à profiter de nos offres ?</h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mb-8 text-body-lg text-stone">
                  Prenez rendez-vous dès maintenant ou passez nous voir en boutique
                </p>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={200}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-accent bg-transparent px-6 py-3 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
                  >
                    Prendre rendez-vous
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3 text-body font-medium text-cream transition-all hover:bg-accent/90 focus-visible:bg-accent/90"
                  >
                    Nous contacter
                  </a>
                </div>
              </SimpleAnimation>
            </div>
          </div>
        </SectionContainer>
      </Layout>
    </>
  );
}
