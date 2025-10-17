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
      icon: '♻️',
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
      tips: [
        '💡 Astuce : Faites le tri dans vos tiroirs ! Plus vous rapportez de paires, plus votre réduction est importante.',
        "🌍 Impact : Chaque monture recyclée, c'est moins de déchets et plus de style accessible.",
        "⏱️ Bon à savoir : La réduction est appliquée immédiatement, pas besoin d'attendre.",
      ],
    },
    {
      id: 'deuxieme-paire',
      title: 'Deuxième paire',
      icon: '👓',
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
      tips: [
        '☀️ Idée : Profitez-en pour avoir des lunettes de soleil à votre vue !',
        '📚 Pratique : Une paire de secours au bureau, une à la maison.',
        '🎨 Style : Changez de look selon votre humeur ou votre tenue.',
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
                  <span className="text-body-sm font-medium uppercase tracking-wider text-stone">
                    Nos promotions
                  </span>
                  <h1
                    className="font-light uppercase leading-tight tracking-wide text-text"
                    style={{ fontSize: 'clamp(2.5rem, 4vw, 5rem)' }}
                  >
                    Nos offres
                  </h1>
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

        {/* Offres détaillées */}
        {offers.map((offer, index) => (
          <SectionContainer key={offer.id} id={offer.id} className="bg-background py-section">
            <div className="mx-auto max-w-container px-container-x">
              <div
                className={`grid items-start gap-12 lg:grid-cols-2 lg:gap-16 ${
                  index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Contenu */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <SimpleAnimation type="slide-up" delay={0}>
                    <div className="mb-6 text-4xl" aria-hidden="true">
                      {offer.icon}
                    </div>
                    <h2 className="text-title-md font-medium text-text">{offer.title}</h2>
                  </SimpleAnimation>

                  <SimpleAnimation type="slide-up" delay={100}>
                    <p className="text-body-lg font-medium italic leading-relaxed text-accent">
                      {offer.catchphrase}
                    </p>
                  </SimpleAnimation>

                  <SimpleAnimation type="slide-up" delay={150}>
                    <p className="text-body-lg leading-relaxed text-text">{offer.description}</p>
                  </SimpleAnimation>

                  <SimpleAnimation type="slide-up" delay={200}>
                    <div className="space-y-3">
                      <h3 className="text-body-lg font-medium text-text">Ce que vous obtenez :</h3>
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
                  </SimpleAnimation>

                  {/* Tips box */}
                  <SimpleAnimation type="slide-up" delay={250}>
                    <div className="mt-8 space-y-3 border-l-4 border-accent bg-accent/5 p-6">
                      {offer.tips.map((tip, i) => (
                        <p key={i} className="text-body text-text">
                          {tip}
                        </p>
                      ))}
                    </div>
                  </SimpleAnimation>

                  {/* Conditions */}
                  <SimpleAnimation type="slide-up" delay={300}>
                    <div className="mt-8 border-l-4 border-stone/30 bg-stone/5 p-6">
                      <h4 className="mb-3 text-body font-medium text-text">Conditions :</h4>
                      <ul className="space-y-2 text-body-sm text-stone">
                        {offer.conditions.map((condition, i) => (
                          <li key={i} className="flex gap-2">
                            <span>•</span>
                            <span>{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </SimpleAnimation>
                </div>

                {/* Image */}
                <SimpleAnimation
                  type="slide-up"
                  delay={100}
                  className={index % 2 === 1 ? 'lg:col-start-2' : ''}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={`/images/offers-${offer.id}.jpg`}
                      alt={offer.title}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                </SimpleAnimation>
              </div>
            </div>
          </SectionContainer>
        ))}

        {/* CTA final */}
        <SectionContainer className="bg-accent py-section">
          <div className="mx-auto max-w-container px-container-x">
            <div className="mx-auto max-w-5xl text-center">
              <SimpleAnimation type="slide-up" delay={0}>
                <h2 className="mb-6 text-title-md font-medium text-cream">
                  Prêt à profiter de nos offres ?
                </h2>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={100}>
                <p className="mb-8 text-body-lg text-cream/90">
                  Prenez rendez-vous dès maintenant ou passez nous voir en boutique
                </p>
              </SimpleAnimation>

              <SimpleAnimation type="slide-up" delay={200}>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-primary bg-cream text-accent hover:bg-cream/90 hover:text-accent"
                  >
                    Prendre rendez-vous
                  </a>
                  <a
                    href="/contact"
                    className="button-primary border-cream text-cream hover:bg-cream hover:text-accent"
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
