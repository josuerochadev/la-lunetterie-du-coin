import { forwardRef } from 'react';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import EyePattern from '@/components/common/EyePattern';

/**
 * Composant HomeHero - Hero de la page d'accueil (Rebranding 2026)
 *
 * Design immersif : fond noir, typo Please Heavy caps, motif eyes en overlay.
 *
 * @component
 */
const HomeHero = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-black"
      aria-labelledby="hero-title"
      {...props}
    >
      {/* Motif eyes en overlay subtil */}
      <EyePattern variant="blanc" opacity={0.03} />

      {/* 50% inférieur : images 50/50 avec gaps */}
      <div className="absolute bottom-0 left-0 right-0 flex h-[50%] w-full gap-4 px-4 pb-4 sm:gap-6 sm:px-6 sm:pb-6">
        {/* Image gauche */}
        <div className="relative h-full w-1/2">
          <SimpleAnimation type="fade" delay={0} immediate={true} className="h-full w-full">
            <ResponsiveImage
              src="/images/hero-eyeglasses-left.jpg"
              alt="Lunettes élégantes - La Lunetterie du Coin"
              className="h-full w-full object-cover object-center"
              loading="eager"
              sizes="50vw"
              widths={[640, 768, 1024, 1280, 1920]}
            />
          </SimpleAnimation>
        </div>

        {/* Image droite */}
        <div className="relative h-full w-1/2">
          <SimpleAnimation type="fade" delay={200} immediate={true} className="h-full w-full">
            <ResponsiveImage
              src="/images/hero-eyeglasses-right.jpg"
              alt="Collection de montures - La Lunetterie du Coin"
              className="h-full w-full object-cover object-center"
              loading="eager"
              sizes="50vw"
              widths={[640, 768, 1024, 1280, 1920]}
            />
          </SimpleAnimation>
        </div>
      </div>

      {/* Contenu texte */}
      <div className="absolute left-0 right-0 top-[60px] z-10 flex h-[calc(50%-60px)] items-center justify-center px-6 sm:top-[72px] sm:h-[calc(50%-72px)] sm:px-12 lg:px-16">
        <SimpleAnimation type="fade" delay={400} immediate={true}>
          <div className="mx-auto w-full max-w-7xl space-y-6">
            <h1
              id="hero-title"
              className="text-heading tracking-wide text-white"
              style={{ fontSize: 'clamp(2.5rem, 4vw, 5rem)' }}
            >
              Des lunettes qui ont du style, une démarche qui a du sens
            </h1>

            <p
              className="leading-relaxed text-white/80"
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

HomeHero.displayName = 'HomeHero';

export default HomeHero;
