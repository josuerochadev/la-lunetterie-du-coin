import type React from 'react';

type PictureProps = {
  /** Chemin de base SANS extension, ex: /illustrations/eyeframe */
  srcBase: string;
  alt: string;
  /** True = LCP/hero. Force eager + fetchPriority=high */
  priority?: boolean;
  className?: string;
  /** Fallback explicite (par défaut: base-768.webp) */
  fallbackSrc?: string;
  /** Désactive les <source> modernes (debug/test) */
  disableSources?: boolean;
  /** Dimensions intrinsèques pour stabiliser la mise en page */
  width?: number;
  height?: number;
  /** Surcharge éventuelle des sizes */
  sizes?: string;
};

const DEFAULT_WIDTHS = [480, 768, 1200, 1600] as const;

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

export default Picture;
