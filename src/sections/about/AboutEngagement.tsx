import EngagementDesktop from './EngagementDesktop';
import EngagementMobile from './EngagementMobile';
import EngagementStatic from './EngagementStatic';

import { useResponsiveMotion } from '@/hooks/useResponsiveMotion';

export const ENGAGEMENT_TITLE = 'La mode change. La planète, non.';
export const ENGAGEMENT_BODY =
  "Des montures restaurées avec soin plutôt que jetées. Ici, l'occasion c'est pas du bas de gamme — c'est du bon sens.";
export const ENGAGEMENT_HIGHLIGHT =
  "Ramenez vos anciennes lunettes : jusqu'à 70€ de remise sur votre prochain achat. Bon pour vous, bon pour la planète.";

export default function AboutEngagement() {
  const variant = useResponsiveMotion();

  return (
    <section
      id="engagement"
      aria-label="Notre engagement écologique"
      className="relative w-full bg-background"
      data-navbar-theme="dark"
    >
      {variant === 'desktop-animated' && <EngagementDesktop />}
      {variant === 'mobile-animated' && <EngagementMobile />}
      {variant === 'static' && <EngagementStatic />}
    </section>
  );
}
