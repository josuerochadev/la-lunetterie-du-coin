import { forwardRef } from 'react';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';

/**
 * Composant Hero.
 *
 * Design éditorial immersif avec :
 * - Deux images 50/50 en fond pleine hauteur
 * - Rectangle flottant centré avec phrase d'accroche
 * - Fond semi-transparent (style navbar)
 * - Baseline en bas
 *
 * Style éditorial Kinfolk avec profondeur et espace.
 *
 * @component
 * @param {React.Ref<HTMLElement>} ref - Référence transmise à la section principale.
 *
 * @example
 * <Hero ref={myRef} />
 *
 * @returns {JSX.Element} La section Hero éditoriale immersive.
 */
const Hero = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-background"
      aria-labelledby="hero-title"
      {...props}
    >
      {/* 50% inférieur : images 50/50 avec gaps */}
      <div className="absolute bottom-0 left-0 right-0 flex h-[50%] w-full gap-4 px-4 pb-4 sm:gap-6 sm:px-6 sm:pb-6">
        {/* Image gauche */}
        <div className="relative h-full w-1/2">
          <SimpleAnimation type="fade" delay={0} immediate={true} className="h-full w-full">
            <img
              src="/images/hero-eyeglasses-left.jpg"
              alt="Lunettes élégantes - La Lunetterie du Coin"
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
          </SimpleAnimation>
        </div>

        {/* Image droite */}
        <div className="relative h-full w-1/2">
          <SimpleAnimation type="fade" delay={200} immediate={true} className="h-full w-full">
            <img
              src="/images/hero-eyeglasses-right.jpg"
              alt="Collection de montures - La Lunetterie du Coin"
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
          </SimpleAnimation>
        </div>
      </div>

      {/* Contenu texte - centré horizontalement avec max-width, texte aligné à gauche */}
      <div className="absolute left-0 right-0 top-[60px] z-10 flex h-[calc(50%-60px)] items-center justify-center px-6 sm:top-[72px] sm:h-[calc(50%-72px)] sm:px-12 lg:px-16">
        <SimpleAnimation type="fade" delay={400} immediate={true}>
          <div className="mx-auto w-full max-w-7xl space-y-6">
            <h1
              id="hero-title"
              className="font-light uppercase leading-tight tracking-wide text-text"
              style={{ fontSize: 'clamp(2.5rem, 4vw, 5rem)' }}
            >
              Des lunettes qui ont du style, une démarche qui a du sens
            </h1>

            <p
              className="leading-relaxed text-stone"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
            >
              Opticien à Strasbourg depuis 2016. Neuf & Occasion.
            </p>
          </div>
        </SimpleAnimation>
      </div>
    </section>
  );
});

export default Hero;
