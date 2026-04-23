// src/components/common/SectionContainer.tsx

import type { ReactNode, CSSProperties, JSX } from 'react';

import { cn } from '@/lib/cn';

type SectionContainerProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  backgroundImage?: string; // "/backgrounds/services-background.png"
  overlayClassName?: string; // "bg-white/40 backdrop-blur"
  noSpacing?: boolean;
  as?: keyof JSX.IntrinsicElements; // "div" | "section" | ...
};
/**
 * Conteneur de section réutilisable gérant largeur, espacements, accessibilité,
 * image de fond optionnelle avec overlay, et choix de l’élément HTML.
 *
 * @param id - Identifiant unique pour l’ancre et l’accessibilité.
 * @param className - Classes CSS additionnelles.
 * @param children - Contenu de la section.
 * @param backgroundImage - URL de l’image de fond (optionnel).
 * @param overlayClassName - Classes de l’overlay sur l’image (défaut : ‘bg-white/40 backdrop-blur-sm’).
 * @param noSpacing - Supprime les espacements internes par défaut.
 * @param as - Élément HTML du conteneur (défaut : ‘section’).
 */
export default function SectionContainer({
  id,
  className = '',
  children,
  backgroundImage,
  overlayClassName = 'bg-white/40 backdrop-blur-sm',
  noSpacing,
  as: Element = 'section',
}: SectionContainerProps) {
  const backgroundStyle: CSSProperties = backgroundImage
    ? {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  return (
    <Element
      id={id}
      style={backgroundStyle}
      className={cn(
        'relative z-base w-full',
        backgroundImage && 'bg-cover bg-center bg-no-repeat',
        !noSpacing && 'section-shell',
        className,
      )}
    >
      {backgroundImage && (
        <div aria-hidden="true" className={cn('absolute inset-0 -z-base', overlayClassName)} />
      )}

      <div className="relative mx-auto w-full">{children}</div>
    </Element>
  );
}
