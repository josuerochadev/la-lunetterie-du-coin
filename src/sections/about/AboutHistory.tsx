import HistoryDesktop from './HistoryDesktop';
import HistoryMobile from './HistoryMobile';
import HistoryStatic from './HistoryStatic';

import { ConvexDome } from '@/components/common/ConvexDome';
import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';

export const STORY_TITLE = 'Notre Histoire';
export const STORY_BODY =
  'En 2016, La Lunetterie du Coin ouvre ses portes avec une idée simple : restaurer des montures plutôt que les jeter. Ajoutez une sélection pointue de créateurs, un vrai conseil — et la boutique était née.';
export const STORY_BODY_2 =
  "Aujourd'hui, c'est l'adresse à Strasbourg pour des lunettes uniques et un service qui prend le temps.";

export default function AboutHistory() {
  const variant = useResponsiveMotion();

  return (
    <section
      id="histoire"
      className="relative w-full"
      style={{
        background:
          'linear-gradient(to bottom, transparent 12vw, rgb(var(--color-yellow-rgb)) 12vw)',
      }}
      aria-labelledby="histoire-title"
      data-navbar-theme="light"
    >
      <ConvexDome color="accent" />

      {variant === 'desktop-animated' && <HistoryDesktop />}
      {variant === 'mobile-animated' && <HistoryMobile />}
      {variant === 'static' && <HistoryStatic />}
    </section>
  );
}
