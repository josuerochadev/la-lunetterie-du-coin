import { useState, forwardRef } from 'react';
import Calendar from 'lucide-react/dist/esm/icons/calendar';

import { OptimizedAnimateItem } from '@/components/motion/OptimizedAnimateItem';
import LogoEye from '@/assets/logo/logo-eye.svg?react';
import Button from '@/components/common/Button';
import { HERO_PHRASES, CALENDLY_URL } from '@/config/constants';
import { getRandomHeroPhrase } from '@/lib/hero';
import SectionContainer from '@/components/common/SectionContainer';

/**
 * Composant principal de la section "Hero" de la page d'accueil.
 *
 * Affiche le logo animé, une phrase d'accroche aléatoire, le titre principal
 * "La Lunetterie du Coin" avec une mise en forme typographique, ainsi qu'un bouton
 * d'appel à l'action pour prendre rendez-vous.
 *
 * @component
 * @param {React.Ref<HTMLElement>} ref - Référence transmise à la section principale.
 *
 * @example
 * <Hero ref={myRef} />
 *
 * @returns {JSX.Element} La section Hero avec logo, punchline, titre et bouton CTA.
 */
const Hero = forwardRef<HTMLElement>(() => {
  const [currentPhrase] = useState(() => getRandomHeroPhrase(HERO_PHRASES));

  return (
    <SectionContainer
      id="hero"
      className="section-shell relative flex min-h-[100dvh] items-center justify-center"
      aria-labelledby="hero-title"
    >
      {/* Logo avec slide-down smooth */}
      <OptimizedAnimateItem index={0} type="slide-down" immediate={true} customDelay={0}>
        <div className="mb-section-gap aspect-[146/85] w-[clamp(5rem,10vw,20rem)]">
          <LogoEye aria-hidden="true" focusable="false" className="h-full w-full" />
        </div>
      </OptimizedAnimateItem>

      <div className="w-full space-y-section-gap">
        {/* Punchline avec slide-up rapide */}
        <OptimizedAnimateItem index={1} type="slide-up" immediate={true} customDelay={300}>
          <div className="text-title-xl font-black uppercase">{currentPhrase}</div>
        </OptimizedAnimateItem>

        {/* Titre principal avec stagger court */}
        <header className="space-y-1">
          <OptimizedAnimateItem index={2} type="slide-up" immediate={true} customDelay={500}>
            <h1 id="hero-title" className="text-title-md">
              <span className="font-thin">－</span>
              <span className="font-thin">LA</span>
              <span className="font-black">LUNETTERIE</span>
              <span className="font-thin">DU</span>
              <span className="font-black">COIN</span>
            </h1>
          </OptimizedAnimateItem>
        </header>

        {/* CTA avec délai court et fluide */}
        <OptimizedAnimateItem index={3} type="slide-up" immediate={true} customDelay={700}>
          <div className="pt-4">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Prendre rendez-vous"
            >
              <Button id="hero-cta">
                <span className="flex items-center gap-2">
                  <Calendar className="button-icon" />
                  Prendre rendez-vous
                </span>
              </Button>
            </a>
          </div>
        </OptimizedAnimateItem>
      </div>
    </SectionContainer>
  );
});

export default Hero;
