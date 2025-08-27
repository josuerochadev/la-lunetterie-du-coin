import { useState, forwardRef } from 'react';
import { useTransform, useScroll, m } from 'framer-motion';
import Calendar from 'lucide-react/dist/esm/icons/calendar';

import AnimatedItem from '@/components/motion/AnimatedItem';
import { fadeInUp } from '@/components/motion/variants/fade';
import SplitText from '@/components/motion/text/SplitText';
import LogoEye from '@/assets/logo/logo-eye.svg?react';
import Button from '@/components/common/Button';
import { HERO_PHRASES } from '@/config/constants';
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

  // Parallax effect pour le logo
  const { scrollY } = useScroll();
  const logoY = useTransform(scrollY, [0, 300], [0, -50]);
  const logoScale = useTransform(scrollY, [0, 300], [1, 0.9]);

  return (
    <SectionContainer
      id="hero"
      className="section-shell relative flex min-h-[100dvh] items-center justify-center"
      aria-labelledby="hero-title"
    >
      {/* Logo avec effet parallax */}
      <AnimatedItem index={0} variant={fadeInUp}>
        <m.div
          className="mb-section-gap aspect-[146/85] w-[clamp(5rem,10vw,20rem)] transition-all duration-500 ease-out hover:drop-shadow-lg"
          style={{ y: logoY, scale: logoScale }}
        >
          <LogoEye aria-hidden="true" focusable="false" className="h-full w-full" />
        </m.div>
      </AnimatedItem>

      <div className="w-full space-y-section-gap">
        {/* Punchline */}
        <div className="text-title-xl font-black uppercase">
          <SplitText text={currentPhrase} className="" priority={false} />
        </div>

        {/* Titre - Animation non-bloquante pour LCP */}
        <AnimatedItem index={1.5} variant={fadeInUp} nonBlocking>
          <header>
            <h1 id="hero-title" className="text-title-md">
              <span className="font-thin">－</span>
              <span className="font-thin">LA</span>
              <span className="font-black">LUNETTERIE</span>
              <span className="font-thin">DU</span>
              <span className="font-black">COIN</span>
            </h1>
          </header>
        </AnimatedItem>

        {/* CTA */}
        <AnimatedItem index={2} variant={fadeInUp}>
          <Button id="hero-cta" aria-label="Prendre rendez-vous" className="group">
            <span className="flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
              <Calendar className="button-icon group-hover:rotate-12" />
              Prendre rendez-vous
            </span>
          </Button>
        </AnimatedItem>
      </div>
    </SectionContainer>
  );
});

export default Hero;
