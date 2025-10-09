import { forwardRef } from 'react';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';

/**
 * Section Engagement Écologique redesignée (Phase 2)
 *
 * Remplace l'ancienne section "Concept" trop chargée de symboles.
 * Design minimaliste avec :
 * - Titre impactant
 * - 3 statistiques clés en grille
 * - Texte explicatif clair
 * - CTA vers page services/recyclage
 *
 * Style : épuré, focus sur l'impact écologique et social
 *
 * @component
 * @returns {JSX.Element} La section Engagement Écologique minimaliste
 */
const EngagementEcologique = forwardRef<HTMLElement>(() => {
  const stats = [
    {
      number: '2016',
      label: 'Année de création',
      description: 'Pionnier du recyclage de montures à Strasbourg',
    },
    {
      number: '70€',
      label: 'Réduction max',
      description: 'En rapportant vos anciennes lunettes',
    },
    {
      number: '100%',
      label: 'Restaurées main',
      description: "Chaque monture d'occasion est nettoyée et réparée",
    },
  ];

  return (
    <SectionContainer
      id="engagement"
      className="bg-surface py-section"
      aria-labelledby="engagement-title"
    >
      <div className="container mx-auto px-container-x">
        {/* En-tête */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <SimpleAnimation type="slide-up" delay={0}>
            <span className="mb-4 inline-block text-body-sm font-medium uppercase tracking-wider text-stone">
              Notre engagement
            </span>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={100}>
            <h2 id="engagement-title" className="mb-6 text-title-md font-medium text-text">
              La mode change. La planète, non.
            </h2>
          </SimpleAnimation>
        </div>

        {/* Statistiques en grille */}
        <div className="mx-auto mb-12 grid max-w-5xl gap-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <SimpleAnimation key={stat.label} type="slide-up" delay={index * 100}>
              <div className="text-center">
                <div className="mb-3 text-title-lg font-bold text-accent">{stat.number}</div>
                <div className="mb-2 text-body-lg font-medium text-text">{stat.label}</div>
                <p className="text-body text-stone">{stat.description}</p>
              </div>
            </SimpleAnimation>
          ))}
        </div>

        {/* Texte explicatif */}
        <div className="mx-auto max-w-3xl space-y-6">
          <SimpleAnimation type="slide-up" delay={300}>
            <p className="text-body-lg leading-relaxed text-text">
              Depuis 2016, nous proposons une alternative durable au marché traditionnel de
              l'optique. Nos montures d'occasion sont soigneusement restaurées, donnant une seconde
              vie à des pièces qui auraient fini à la décharge.
            </p>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={400}>
            <p className="text-body leading-relaxed text-stone">
              En rapportant vos anciennes lunettes, vous bénéficiez d'une réduction allant jusqu'à
              70€ sur votre nouvel achat. Un geste pour votre portefeuille et pour la planète.
            </p>
          </SimpleAnimation>

          <SimpleAnimation type="slide-up" delay={500}>
            <div className="pt-4 text-center">
              <a
                href="/services#recyclage"
                className="inline-flex items-center gap-2 rounded-sm border border-accent bg-transparent px-8 py-4 text-body font-medium text-accent transition-all hover:bg-accent hover:text-cream focus-visible:bg-accent focus-visible:text-cream"
                aria-label="En savoir plus sur notre programme de recyclage"
              >
                Comment ça marche →
              </a>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </SectionContainer>
  );
});

export default EngagementEcologique;
