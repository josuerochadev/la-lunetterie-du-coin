import { forwardRef } from 'react';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Section "Notre Histoire"
 *
 * Design éditorial Kinfolk :
 * - Image de fond pleine hauteur (60-70% de la section)
 * - Texte en bas sur fond cream (30-40%)
 * - Transition nette entre image et texte
 *
 * @component
 * @returns {JSX.Element} La section Notre Histoire avec image pleine et texte en bas
 */
const OurStory = forwardRef<HTMLElement>(() => {
  return (
    <section id="story" className="relative w-full bg-background" aria-labelledby="story-title">
      {/* Image pleine largeur à hauteur naturelle */}
      <div className="relative w-full">
        <SimpleAnimation type="fade" delay={0} immediate={true}>
          <img
            src="/images/our-story-eyeglasses.jpg"
            alt="Lunettes élégantes sur un fond ensoleillé"
            className="max-h-[120vh] min-h-screen w-full object-cover"
            loading="lazy"
          />
        </SimpleAnimation>

        {/* Rectangle de texte superposé en bas de l'image */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center px-4 pb-8 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16">
          <SimpleAnimation type="slide-up" delay={200}>
            <div className="w-full max-w-3xl space-y-4 bg-background px-6 py-8 sm:space-y-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
              <span className="text-body-sm font-medium uppercase tracking-wider text-stone">
                Depuis 2016
              </span>

              <h2 id="story-title" className="text-title-md font-medium text-text sm:text-title-lg">
                Une lunetterie différente
              </h2>

              <p className="text-body-lg leading-relaxed text-text">
                Romain Corato a ouvert La Lunetterie du Coin avec une conviction : proposer des
                lunettes de qualité tout en donnant une seconde vie aux montures.
              </p>

              <p className="text-body leading-relaxed text-stone">
                Au cœur du Faubourg de Pierre à Strasbourg, notre boutique indépendante allie
                expertise optique, style contemporain et engagement écologique. Chaque paire est
                sélectionnée avec soin, qu'elle soit neuve ou d'occasion.
              </p>

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
            </div>
          </SimpleAnimation>
        </div>
      </div>
    </section>
  );
});

export default OurStory;
