import type { ReactNode } from 'react';

import { use3DTilt } from '@/hooks/use3DTilt';

/**
 * Composant React qui applique un effet de tilt 3D à son contenu enfant.
 *
 * @param children Les éléments React à afficher à l'intérieur de la carte avec effet tilt.
 * @returns Un conteneur `<div>` avec un effet de perspective 3D appliqué.
 *
 */

export default function TiltCard({ children }: { children: ReactNode }) {
  const ref = use3DTilt();

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}
