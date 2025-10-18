import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type StickySectionProps = {
  children: ReactNode;
  zIndex: number;
  className?: string;
  /**
   * Si true, applique l'effet sticky
   * Si false, utilise juste le z-index pour la superposition
   */
  enableSticky?: boolean;
  /**
   * Hauteur minimale du wrapper pour permettre le scroll
   * Utilisé pour les sections sticky avec contenu long
   * Exemples: '200vh', '150vh', etc.
   */
  wrapperMinHeight?: string;
};

/**
 * Composant StickySection
 *
 * Wrapper pour créer l'effet parallax entre les sections.
 * Supporte les sections longues via wrapperMinHeight.
 *
 * @component
 * @param {ReactNode} children - Contenu de la section
 * @param {number} zIndex - Index z pour la superposition (doit être croissant)
 * @param {boolean} [enableSticky=false] - Active l'effet sticky
 * @param {string} [wrapperMinHeight] - Hauteur min du wrapper (ex: '200vh')
 * @param {string} [className] - Classes CSS additionnelles
 *
 * @example
 * // Section courte (Hero)
 * <StickySection zIndex={11} enableSticky={true}>
 *   <Hero />
 * </StickySection>
 *
 * @example
 * // Section longue avec wrapper
 * <StickySection zIndex={12} enableSticky={true} wrapperMinHeight="200vh">
 *   <OurStory />
 * </StickySection>
 *
 * @returns {JSX.Element} Section avec effet parallax
 */
export default function StickySection({
  children,
  zIndex,
  className,
  enableSticky = false,
  wrapperMinHeight,
}: StickySectionProps) {
  // Si on a un wrapperMinHeight, on crée un conteneur externe
  if (enableSticky && wrapperMinHeight) {
    return (
      <div
        className="relative w-full"
        style={{
          minHeight: wrapperMinHeight,
          zIndex,
        }}
      >
        <div className={cn('sticky top-0 w-full', className)}>{children}</div>
      </div>
    );
  }

  // Sinon, comportement classique
  return (
    <div
      className={cn('relative w-full', enableSticky && 'sticky top-0', className)}
      style={{ zIndex }}
    >
      {children}
    </div>
  );
}
