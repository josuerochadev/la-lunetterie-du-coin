import type { ReactNode } from 'react';

export interface OfferImageProps {
  image: string;
  title: string;
}

/**
 * Composant réutilisable pour afficher l'image d'une offre
 */
export function OfferImage({ image, title }: OfferImageProps): ReactNode {
  return (
    <div className="relative w-full">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
      </div>
    </div>
  );
}
