import { forwardRef } from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import SectionContainer from '@/components/common/SectionContainer';

/**
 * Section "Notre Histoire" - Nouvelle section Phase 2
 *
 * Raconte l'histoire de La Lunetterie du Coin et de son fondateur Romain.
 * Layout avec texte à gauche et grille de 4 photos à droite.
 * Style minimaliste inspiré Kinfolk/La Pima.
 *
 * @component
 * @returns {JSX.Element} La section Notre Histoire avec storytelling et photos
 */
const OurStory = forwardRef<HTMLElement>(() => {
  return (
    <SectionContainer id="story" className="bg-surface py-section" aria-labelledby="story-title">
      <div className="container mx-auto px-container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Colonne gauche : Texte */}
          <div className="space-y-6">
            <SimpleAnimation type="slide-up" delay={0}>
              <span className="text-body-sm font-medium uppercase tracking-wider text-stone">
                Depuis 2016
              </span>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={100}>
              <h2 id="story-title" className="text-title-md font-medium text-text">
                Une lunetterie différente
              </h2>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={200}>
              <p className="text-body-lg leading-relaxed text-text">
                Romain Corato a ouvert La Lunetterie du Coin avec une conviction : proposer des
                lunettes de qualité tout en donnant une seconde vie aux montures.
              </p>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={300}>
              <p className="text-body leading-relaxed text-stone">
                Au cœur du Faubourg de Pierre à Strasbourg, notre boutique indépendante allie
                expertise optique, style contemporain et engagement écologique. Chaque paire est
                sélectionnée avec soin, qu'elle soit neuve ou d'occasion.
              </p>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={400}>
              <a
                href="/a-propos"
                className="group inline-flex items-center gap-2 text-body font-medium text-accent transition-colors hover:text-text focus-visible:text-text"
                aria-label="En savoir plus sur notre histoire"
              >
                En savoir plus
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </SimpleAnimation>
          </div>

          {/* Colonne droite : Grille de photos 2x2 */}
          <SimpleAnimation type="fade" delay={200}>
            <div className="grid grid-cols-2 gap-4">
              {/* Photo 1 : Portrait Romain */}
              <div className="aspect-square overflow-hidden rounded-sm shadow-card">
                <div className="flex h-full w-full items-center justify-center bg-stone/10">
                  <span className="text-body-sm text-stone">Portrait Romain</span>
                </div>
                {/* TODO: Remplacer par vraie photo
                <img
                  src="/images/romain-portrait.jpg"
                  alt="Romain Corato, fondateur de La Lunetterie du Coin"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                */}
              </div>

              {/* Photo 2 : Boutique intérieur */}
              <div className="aspect-square overflow-hidden rounded-sm shadow-card">
                <div className="flex h-full w-full items-center justify-center bg-stone/10">
                  <span className="text-body-sm text-stone">Boutique</span>
                </div>
                {/* TODO: Remplacer par vraie photo
                <img
                  src="/images/boutique-interieur.jpg"
                  alt="Intérieur de la boutique"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                */}
              </div>

              {/* Photo 3 : Atelier restauration */}
              <div className="aspect-square overflow-hidden rounded-sm shadow-card">
                <div className="flex h-full w-full items-center justify-center bg-stone/10">
                  <span className="text-body-sm text-stone">Atelier</span>
                </div>
                {/* TODO: Remplacer par vraie photo
                <img
                  src="/images/atelier-restauration.jpg"
                  alt="Atelier de restauration de montures"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                */}
              </div>

              {/* Photo 4 : Détail monture */}
              <div className="aspect-square overflow-hidden rounded-sm shadow-card">
                <div className="flex h-full w-full items-center justify-center bg-stone/10">
                  <span className="text-body-sm text-stone">Détail monture</span>
                </div>
                {/* TODO: Remplacer par vraie photo
                <img
                  src="/images/detail-monture.jpg"
                  alt="Détail d'une monture"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                */}
              </div>
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </SectionContainer>
  );
});

export default OurStory;
