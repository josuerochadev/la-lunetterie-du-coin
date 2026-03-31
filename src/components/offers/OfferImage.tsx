import type { ReactNode } from 'react';

import ResponsiveImage from '@/components/common/ResponsiveImage';

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
        <ResponsiveImage
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
          widths={[384, 640]}
          sizes="(min-width: 1024px) 33vw, 50vw"
        />
      </div>
    </div>
  );
}
