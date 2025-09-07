import type React from 'react';

// ========================================
// SOLID ISP: Interfaces spécialisées
// ========================================

/** Interface de base - propriétés minimales requises */
interface CorePictureProps {
  /** Chemin de base SANS extension, ex: /illustrations/eyeframe */
  srcBase: string;
  alt: string;
}

/** Interface pour les optimisations de performance */
interface OptimizationProps {
  /** True = LCP/hero. Force eager + fetchPriority=high */
  priority: true;
  /** Fallback explicite (par défaut: base-768.webp) */
  fallbackSrc?: string;
}

/** Interface pour le contrôle responsive */
interface ResponsiveProps {
  /** Dimensions intrinsèques pour stabiliser la mise en page */
  width: number;
  height: number;
  /** Surcharge des sizes pour responsive */
  sizes: string;
}

/** Interface pour les options de débogage */
interface DebugProps {
  /** Désactive les <source> modernes (debug/test) */
  disableSources: boolean;
}

/** Interface pour le styling */
interface StylingProps {
  className?: string;
}

// Interfaces spécialisées combinées
interface OptimizedPictureProps extends CorePictureProps, OptimizationProps, StylingProps {}
interface ResponsivePictureProps extends CorePictureProps, ResponsiveProps, StylingProps {}
interface DebugPictureProps extends CorePictureProps, DebugProps, StylingProps {}

// Interface universelle pour compatibilité ascendante
type PictureProps = CorePictureProps &
  Partial<OptimizationProps> &
  Partial<ResponsiveProps> &
  Partial<DebugProps> &
  StylingProps;

const DEFAULT_WIDTHS = [480, 768, 1200, 1600] as const;

// Composant spécialisé pour images optimisées (LCP/Hero)
const OptimizedPicture: React.FC<OptimizedPictureProps> = (props) => {
  return <Picture {...props} />;
};

// Composant spécialisé pour images responsives
const ResponsivePicture: React.FC<ResponsivePictureProps> = (props) => {
  return <Picture {...props} />;
};

// Composant principal - implémentation unifiée
const Picture: React.FC<PictureProps> = ({
  srcBase,
  alt,
  priority = false,
  className,
  fallbackSrc,
  disableSources = false,
  width,
  height,
  sizes = '(min-width: 1280px) 1200px, (min-width: 1024px) 1200px, (min-width: 768px) 768px, 100vw',
}) => {
  const avifSrcSet = DEFAULT_WIDTHS.map((w) => `${srcBase}-${w}.avif ${w}w`).join(', ');
  const webpSrcSet = DEFAULT_WIDTHS.map((w) => `${srcBase}-${w}.webp ${w}w`).join(', ');

  const loading = (priority ? 'eager' : 'lazy') as 'eager' | 'lazy';
  const decoding = (priority ? 'sync' : 'async') as 'sync' | 'async';
  const fetchPriority = (priority ? 'high' : 'auto') as 'high' | 'auto';

  const fallback = fallbackSrc ?? `${srcBase}-768.webp`;

  return (
    <picture>
      {!disableSources && (
        <>
          <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
          <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
        </>
      )}
      <img
        src={fallback}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        width={width}
        height={height}
        className={className ?? 'h-full w-full object-contain'}
      />
    </picture>
  );
};

// Exports selon SOLID ISP
export type {
  CorePictureProps,
  OptimizedPictureProps,
  ResponsivePictureProps,
  DebugPictureProps,
  PictureProps,
};

export { OptimizedPicture, ResponsivePicture };
export default Picture;
