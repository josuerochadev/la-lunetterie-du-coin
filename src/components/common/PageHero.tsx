import { m, useScroll, useTransform } from 'framer-motion';

import { SimpleAnimation } from '@/components/motion/SimpleAnimation';
import TextReveal from '@/components/motion/TextReveal';
import EyePattern from '@/components/common/EyePattern';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SPRING_TRANSITION } from '@/lib/motion';

type EyePatternVariant = 'noir' | 'blanc' | 'jaune';

type PageHeroTheme = 'dark' | 'light';

interface PageHeroProps {
  title: string;
  subtitle: string;
  eyeVariant?: EyePatternVariant;
  /** 'dark' = black bg + light text, 'light' = accent bg + dark text */
  theme?: PageHeroTheme;
  ariaLabel?: string;
}

const THEME_CONFIG = {
  dark: {
    bg: 'bg-black',
    navbarTheme: 'light' as const,
    titleClass: 'text-accent',
    titleClassMobile: 'text-accent',
    subtitleClass: 'text-white',
    subtitleClassMobile: 'text-white',
  },
  light: {
    bg: 'bg-accent',
    navbarTheme: 'dark' as const,
    titleClass: 'text-black',
    titleClassMobile: 'text-black',
    subtitleClass: 'text-black',
    subtitleClassMobile: 'text-black',
  },
};

function HeroDesktop({
  title,
  subtitle,
  eyeVariant,
  titleClass,
  subtitleClass,
}: {
  title: string;
  subtitle: string;
  eyeVariant: EyePatternVariant;
  titleClass: string;
  subtitleClass: string;
}) {
  const { scrollY } = useScroll();
  const exitOpacity = useTransform(scrollY, [100, 400], [1, 0]);
  const exitY = useTransform(scrollY, [100, 400], [0, -60]);

  return (
    <div className="hidden lg:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <EyePattern variant={eyeVariant} opacity={0.03} />

        <m.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-container-x"
          style={{ opacity: exitOpacity, y: exitY }}
        >
          <TextReveal as="h1" className={`text-heading text-fluid-hero text-center ${titleClass}`}>
            {title}
          </TextReveal>

          <m.p
            className={`mt-8 max-w-3xl text-center text-body-xl ${subtitleClass}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.4 }}
          >
            {subtitle}
          </m.p>
        </m.div>
      </div>
    </div>
  );
}

export default function PageHero({
  title,
  subtitle,
  eyeVariant = 'noir',
  theme = 'light',
  ariaLabel,
}: PageHeroProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const config = THEME_CONFIG[theme];

  return (
    <section
      id="hero"
      aria-label={ariaLabel}
      className={`relative w-full ${config.bg}`}
      data-navbar-theme={config.navbarTheme}
    >
      {!prefersReducedMotion && (
        <HeroDesktop
          title={title}
          subtitle={subtitle}
          eyeVariant={eyeVariant}
          titleClass={config.titleClass}
          subtitleClass={config.subtitleClass}
        />
      )}

      <div className={prefersReducedMotion ? '' : 'lg:hidden'}>
        <div className="relative flex min-h-[70vh] items-center py-section">
          <EyePattern variant={eyeVariant} opacity={0.03} />
          <div className="relative z-10 mx-auto max-w-container px-container-x">
            <div className="flex flex-col items-center justify-center text-center">
              <TextReveal
                as="h1"
                className={`text-heading text-fluid-hero-sub ${config.titleClassMobile}`}
              >
                {title}
              </TextReveal>

              <SimpleAnimation type="slide-up" delay={150}>
                <p className={`mt-6 max-w-2xl text-body-lg ${config.subtitleClassMobile}`}>
                  {subtitle}
                </p>
              </SimpleAnimation>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
