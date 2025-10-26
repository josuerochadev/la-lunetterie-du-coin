/**
 * ResponsiveImage - Component for responsive images with modern formats
 *
 * Automatically generates <picture> element with:
 * - AVIF (best compression, modern browsers)
 * - WebP (good compression, wide support)
 * - JPG/PNG fallback (universal support)
 * - Responsive srcsets for different viewport sizes
 *
 * @component
 */

import type { ImgHTMLAttributes } from 'react';

type ResponsiveImageProps = {
  /** Base filename without extension (e.g., "hero-eyeglasses-left") */
  src: string;

  /** Alt text for accessibility */
  alt: string;

  /** Available widths for srcset */
  widths?: number[];

  /** Sizes attribute for responsive images */
  sizes?: string;

  /** CSS classes for the img element */
  className?: string;

  /** Loading strategy */
  loading?: 'eager' | 'lazy';

  /** Additional props for img element */
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
};

/**
 * Default responsive widths
 */
const DEFAULT_WIDTHS = [640, 768, 1024, 1280, 1920, 2560];

/**
 * Generate srcset string for a given format
 */
function generateSrcSet(basePath: string, widths: number[], format: string): string {
  return widths
    .map((width) => `/images-optimized/${basePath}-${width}w.${format} ${width}w`)
    .join(', ');
}

export default function ResponsiveImage({
  src,
  alt,
  widths = DEFAULT_WIDTHS,
  sizes = '100vw',
  className = '',
  loading = 'lazy',
  imgProps = {},
}: ResponsiveImageProps) {
  // Extract base filename without extension and directory
  const baseName = src.replace(/^\/images\//, '').replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');

  return (
    <picture>
      {/* AVIF - Best compression for modern browsers */}
      <source type="image/avif" srcSet={generateSrcSet(baseName, widths, 'avif')} sizes={sizes} />

      {/* WebP - Good compression with wider browser support */}
      <source type="image/webp" srcSet={generateSrcSet(baseName, widths, 'webp')} sizes={sizes} />

      {/* JPG - Fallback for older browsers */}
      <source type="image/jpeg" srcSet={generateSrcSet(baseName, widths, 'jpg')} sizes={sizes} />

      {/* Fallback img element */}
      <img
        src={`/images-optimized/${baseName}-1920w.jpg`}
        alt={alt}
        loading={loading}
        className={className}
        {...imgProps}
      />
    </picture>
  );
}
