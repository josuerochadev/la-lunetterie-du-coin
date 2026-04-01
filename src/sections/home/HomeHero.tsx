import { HeroDesktopAnimated, HeroMobileAnimated, HeroStatic } from './hero/HeroDesktop';

import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';

function HomeHero() {
  const variant = useResponsiveMotion();

  if (variant === 'static') return <HeroStatic />;
  if (variant === 'mobile-animated') return <HeroMobileAnimated />;
  return <HeroDesktopAnimated />;
}

export default HomeHero;
