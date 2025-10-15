import { forwardRef } from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Section Engagement Écologique - Design éditorial Kinfolk
 *
 * Image de fond pleine hauteur avec texte superposé en bas.
 * Style cohérent avec OurStory :
 * - Image pleine largeur (min-h-screen, max-h-[120vh])
 * - Boîte crème en bas avec contenu
 * - Tagline, titre, statistiques et CTA
 *
 * @component
 * @returns {JSX.Element} La section Engagement Écologique avec image de fond
 */
const EngagementEcologique = forwardRef<HTMLElement>(() => {
  const stats = [
    { number: '2016', label: 'Année de création' },
    { number: '70€', label: 'Réduction max' },
    { number: '100%', label: 'Restaurées main' },
  ];

  return (
    <section
      id="engagement"
      className="relative w-full bg-background"
      aria-labelledby="engagement-title"
    >
      {/* Image pleine largeur à hauteur contrôlée */}
      <div className="relative w-full">
        <SimpleAnimation type="fade" delay={0} immediate={true}>
          <img
            src="/images/engagement-eyeglasses.jpg"
            alt="Engagement écologique - La Lunetterie du Coin"
            className="max-h-[120vh] min-h-screen w-full object-cover"
            loading="lazy"
          />
        </SimpleAnimation>

        {/* Boîte de texte superposée en bas */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center px-4 pb-8 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16">
          <SimpleAnimation type="slide-up" delay={200}>
            <div className="w-full max-w-3xl space-y-6 bg-background px-6 py-8 sm:space-y-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
              {/* Tagline */}
              <span className="text-body-sm font-medium uppercase tracking-wider text-stone">
                Notre engagement
              </span>

              {/* Titre */}
              <h2
                id="engagement-title"
                className="text-title-md font-medium text-text sm:text-title-lg"
              >
                La mode change. La planète, non.
              </h2>

              {/* Statistiques en ligne */}
              <div className="grid grid-cols-3 gap-4 border-y border-stone/20 py-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="mb-1 text-title-sm font-bold text-accent sm:text-title-md">
                      {stat.number}
                    </div>
                    <div className="text-body-xs text-stone sm:text-body-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Texte descriptif */}
              <p className="text-body leading-relaxed text-text">
                Depuis 2016, nous proposons une alternative durable au marché traditionnel de
                l'optique. Nos montures d'occasion sont soigneusement restaurées, donnant une
                seconde vie à des pièces qui auraient fini à la décharge.
              </p>

              <p className="text-body-sm leading-relaxed text-stone">
                En rapportant vos anciennes lunettes, vous bénéficiez d'une réduction allant jusqu'à
                70€ sur votre nouvel achat. Un geste pour votre portefeuille et pour la planète.
              </p>

              {/* CTA */}
              <a
                href="/offres#recyclage"
                className="group inline-flex items-center gap-2 text-body font-medium text-accent transition-colors hover:text-text focus-visible:text-text"
                aria-label="En savoir plus sur notre programme de recyclage"
              >
                Comment ça marche
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
});

export default EngagementEcologique;
