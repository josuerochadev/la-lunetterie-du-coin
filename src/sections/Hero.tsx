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
      className="relative h-screen w-full overflow-hidden"
      aria-labelledby="hero-title"
      {...props}
    >
      {/* Images de fond 50/50 avec ligne de séparation - occupent toute la section */}
      <div className="absolute inset-0 flex flex-col lg:flex-row">
        {/* Image gauche / haut - 50% */}
        <div className="relative h-1/2 w-full lg:h-full lg:w-1/2">
          <SimpleAnimation type="fade" delay={0} immediate={true} className="h-full w-full">
            <img
              src="/images/hero-eyeglasses-left.jpg"
              alt="Lunettes élégantes - La Lunetterie du Coin"
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
          </SimpleAnimation>
        </div>

        {/* Image droite / bas - 50% */}
        <div className="relative h-1/2 w-full lg:h-full lg:w-1/2">
          <SimpleAnimation type="fade" delay={200} immediate={true} className="h-full w-full">
            <img
              src="/images/hero-eyeglasses-right.jpg"
              alt="Collection de montures - La Lunetterie du Coin"
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
          </SimpleAnimation>
        </div>

        {/* Ligne de séparation - horizontale sur mobile, verticale sur desktop */}
        <div
          className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-cream/30 lg:left-1/2 lg:top-0 lg:h-full lg:w-[2px] lg:-translate-x-1/2 lg:translate-y-0"
          aria-hidden="true"
        />
      </div>

      {/* Contenu par-dessus les images */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6">
        <SimpleAnimation type="fade" delay={400} immediate={true}>
          {/* Rectangle avec fond foncé */}
          <div className="rounded-sm bg-charcoal px-6 py-8 shadow-lg sm:px-12 sm:py-10">
            <div className="space-y-3 sm:space-y-4">
              <h1
                id="hero-title"
                className="max-w-6xl text-title-sm font-thin uppercase leading-tight tracking-wide text-cream sm:text-title-md"
              >
                Des lunettes qui ont du style, une démarche qui a du sens
              </h1>

              <p className="text-body-xs font-black text-cream/80 sm:text-body-xs">
                Opticien à Strasbourg depuis 2016. Neuf & Occasion.
              </p>
            </div>
          </div>
        </SimpleAnimation>
      </div>
    </section>
  );
});

export default Hero;
