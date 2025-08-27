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
 * Composant de conteneur de section standardisé, gérant la largeur, les espacements, et l’accessibilité des grandes zones du site.
 *
 * @component
 * @param {object} props
 * @param {string} [props.id] - ID unique pour l’ancre et l’accessibilité.
 * @param {string} [props.className] - Classes CSS additionnelles.
 * @param {React.ReactNode} props.children - Contenu de la section.
 * @returns {JSX.Element}
 */

/**
 * Composant SectionContainer
 *
 * Ce composant permet de créer une section réutilisable avec des options de style avancées,
 * notamment la gestion d'une image de fond, d'une superposition (overlay), et d'espacements personnalisables.
 * Il accepte également un type d'élément HTML à utiliser comme conteneur principal.
 *
 * @param id - Identifiant unique de la section, utilisé notamment pour l'accessibilité ou le ciblage CSS.
 * @param className - Classes CSS additionnelles à appliquer au conteneur principal.
 * @param children - Contenu à afficher à l'intérieur de la section.
 * @param backgroundImage - URL de l'image de fond à appliquer à la section (optionnel).
 * @param overlayClassName - Classes CSS pour la superposition (overlay) appliquée sur l'image de fond (par défaut : 'bg-white/40 backdrop-blur-sm').
 * @param noSpacing - Si vrai, supprime les espacements internes par défaut (padding).
 * @param as - Type d'élément HTML à utiliser pour le conteneur principal (par défaut : 'section').
 *
 * @returns Un conteneur de section stylisé, avec gestion optionnelle de l'image de fond et de la superposition.
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
      role={id === 'hero' ? 'banner' : undefined}
    >
      {backgroundImage && (
        <div aria-hidden="true" className={cn('absolute inset-0 -z-base', overlayClassName)} />
      )}

      <div className="relative mx-auto w-full">{children}</div>
    </Element>
  );
}
