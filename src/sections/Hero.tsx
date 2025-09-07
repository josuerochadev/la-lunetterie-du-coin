import { useState, forwardRef } from 'react';
import Calendar from 'lucide-react/dist/esm/icons/calendar';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
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
      <SimpleAnimation type="slide-down" delay={0} immediate={true}>
        <div className="mb-section-gap aspect-[146/85] w-[clamp(5rem,10vw,20rem)]">
          <LogoEye aria-hidden="true" focusable="false" className="h-full w-full" />
        </div>
      </SimpleAnimation>

      <div className="w-full space-y-section-gap">
        {/* Punchline avec slide-up rapide */}
        <SimpleAnimation type="slide-up" delay={300} immediate={true}>
          <div className="text-title-xl font-black uppercase">{currentPhrase}</div>
        </SimpleAnimation>

        {/* Titre principal avec stagger court */}
        <header className="space-y-1">
          <SimpleAnimation type="slide-up" delay={500} immediate={true}>
            <h1 id="hero-title" className="text-title-md">
              <span className="font-thin">－</span>
              <span className="font-thin">LA</span>
              <span className="font-black">LUNETTERIE</span>
              <span className="font-thin">DU</span>
              <span className="font-black">COIN</span>
            </h1>
          </SimpleAnimation>
        </header>

        {/* CTA avec délai court et fluide */}
        <SimpleAnimation type="slide-up" delay={700} immediate={true}>
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
        </SimpleAnimation>
      </div>
    </SectionContainer>
  );
});

export default Hero;
