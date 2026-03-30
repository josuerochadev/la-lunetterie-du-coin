import { HeroAnimated, HeroStatic } from './hero/HeroDesktop';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

function HomeHero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return <HeroStatic />;
  return <HeroAnimated />;
}

export default HomeHero;
