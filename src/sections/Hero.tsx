import { useState, forwardRef } from 'react';
import Calendar from 'lucide-react/dist/esm/icons/calendar';

import { OptimizedAnimateItem } from '@/components/motion/OptimizedAnimateItem';
import SimpleRevealText from '@/components/motion/text/SimpleRevealText';
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
      {/* Logo avec animation immédiate (above-the-fold) */}
      <OptimizedAnimateItem index={0} type="fade-up" immediate={true}>
        <div className="mb-section-gap aspect-[146/85] w-[clamp(5rem,10vw,20rem)]">
          <LogoEye aria-hidden="true" focusable="false" className="h-full w-full" />
        </div>
      </OptimizedAnimateItem>

      <div className="w-full space-y-section-gap">
        {/* Punchline avec animation simple - utilise le DS title-xl */}
        <SimpleRevealText
          text={currentPhrase}
          delay={0.2}
          className="text-title-xl font-black uppercase"
        />

        {/* Titre principal */}
        <OptimizedAnimateItem index={1} type="fade-up" immediate={true} customDelay={100}>
          <header>
            <h1 id="hero-title" className="text-title-md">
              <span className="font-thin">－</span>
              <span className="font-thin">LA</span>
              <span className="font-black">LUNETTERIE</span>
              <span className="font-thin">DU</span>
              <span className="font-black">COIN</span>
            </h1>
          </header>
        </OptimizedAnimateItem>

        {/* CTA */}
        <OptimizedAnimateItem index={2} type="fade-up" immediate={true} customDelay={200}>
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
        </OptimizedAnimateItem>
      </div>
    </SectionContainer>
  );
});

export default Hero;
