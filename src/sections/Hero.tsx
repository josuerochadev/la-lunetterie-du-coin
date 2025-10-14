import { forwardRef } from 'react';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import LogoEye from '@/assets/logo/logo-eye.svg?react';
import Button from '@/components/common/Button';
import { CALENDLY_URL } from '@/config/constants';
import SectionContainer from '@/components/common/SectionContainer';

/**
 * Composant Hero minimaliste redesigné (Phase 2).
 *
 * Layout 50/50 texte/image inspiré Kinfolk/La Pima :
 * - Fond crème élégant
 * - Logo minimaliste
 * - Titre principal avec accent orange
 * - Sous-titre informatif
 * - Double CTA (primaire + texte)
 * - Image de la boutique ou portrait
 *
 * @component
 * @param {React.Ref<HTMLElement>} ref - Référence transmise à la section principale.
 *
 * @example
 * <Hero ref={myRef} />
 *
 * @returns {JSX.Element} La section Hero minimaliste avec layout 50/50.
 */
const Hero = forwardRef<HTMLElement>(() => {
  return (
    <SectionContainer
      id="hero"
      className="relative min-h-[100dvh] bg-background"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto grid min-h-[100dvh] max-w-container items-center gap-8 px-4 py-container-y sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* Colonne gauche : Contenu */}
        <div className="space-y-8 lg:space-y-12">
          {/* Logo minimaliste */}
          <SimpleAnimation type="slide-down" delay={0} immediate={true}>
            <div className="w-[clamp(4rem,8vw,6rem)]">
              <LogoEye aria-hidden="true" focusable="false" className="h-auto w-full text-text" />
            </div>
          </SimpleAnimation>

          {/* Titre principal */}
          <header className="space-y-6">
            <SimpleAnimation type="slide-up" delay={200} immediate={true}>
              <h1 id="hero-title" className="text-title-lg font-normal leading-tight text-text">
                Des lunettes qui ont du style,{' '}
                <span className="font-medium text-accent">une démarche qui a du sens</span>
              </h1>
            </SimpleAnimation>

            <SimpleAnimation type="slide-up" delay={400} immediate={true}>
              <p className="text-body-lg text-stone">
                Opticien indépendant à Strasbourg depuis 2016. Neuf, occasion et recyclage.
              </p>
            </SimpleAnimation>
          </header>

          {/* CTAs */}
          <SimpleAnimation type="slide-up" delay={600} immediate={true}>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Prendre rendez-vous"
              >
                <Button id="hero-cta-primary">
                  <span className="flex items-center gap-2">
                    <Calendar className="button-icon" aria-hidden="true" />
                    Prendre rendez-vous
                  </span>
                </Button>
              </a>

              <a
                href="#story"
                className="group inline-flex items-center gap-2 text-body font-medium text-text transition-colors hover:text-accent focus-visible:text-accent"
                aria-label="En savoir plus sur notre histoire"
              >
                Notre histoire
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>
          </SimpleAnimation>
        </div>

        {/* Colonne droite : Image */}
        <SimpleAnimation type="fade" delay={300} immediate={true}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-card lg:aspect-[3/4]">
            {/* Placeholder image - à remplacer par vraie photo */}
            <div className="flex h-full w-full items-center justify-center bg-stone/10">
              <p className="text-body-lg text-stone">
                Photo boutique
                <br />
                ou portrait à venir
              </p>
            </div>
            {/* TODO: Remplacer par vraie image
            <img
              src="/images/hero-boutique.jpg"
              alt="Boutique La Lunetterie du Coin à Strasbourg"
              className="h-full w-full object-cover"
              loading="eager"
            />
            */}
          </div>
        </SimpleAnimation>
      </div>
    </SectionContainer>
  );
});

export default Hero;
