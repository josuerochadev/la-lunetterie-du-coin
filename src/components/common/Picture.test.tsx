// src/components/common/Picture.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Picture from './Picture';

describe('Picture', () => {
  const defaultProps = {
    srcBase: '/images/test',
    alt: 'Test image',
  };

  it('should render picture element with sources and img', () => {
    render(<Picture {...defaultProps} />);
    
    const picture = screen.getByRole('img').parentElement;
    expect(picture?.tagName).toBe('PICTURE');
    
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Test image');
  });

  it('should generate correct srcSet for AVIF and WebP', () => {
    const { container } = render(<Picture {...defaultProps} />);
    
    const avifSource = container.querySelector('source[type="image/avif"]');
    const webpSource = container.querySelector('source[type="image/webp"]');
    
    expect(avifSource).toHaveAttribute(
      'srcset', 
      '/images/test-480.avif 480w, /images/test-768.avif 768w, /images/test-1200.avif 1200w, /images/test-1600.avif 1600w'
    );
    
    expect(webpSource).toHaveAttribute(
      'srcset',
      '/images/test-480.webp 480w, /images/test-768.webp 768w, /images/test-1200.webp 1200w, /images/test-1600.webp 1600w'
    );
  });

  it('should use default fallback src', () => {
    render(<Picture {...defaultProps} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/images/test-768.webp');
  });

  it('should use custom fallback src when provided', () => {
    render(
      <Picture 
        {...defaultProps} 
        fallbackSrc="/images/custom-fallback.jpg" 
      />
    );
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/images/custom-fallback.jpg');
  });

  it('should apply priority attributes when priority is true', () => {
    render(<Picture {...defaultProps} priority={true} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('decoding', 'sync');
    expect(img).toHaveAttribute('fetchpriority', 'high');
  });

  it('should apply non-priority attributes when priority is false', () => {
    render(<Picture {...defaultProps} priority={false} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
    expect(img).toHaveAttribute('fetchpriority', 'auto');
  });

  it('should apply custom className', () => {
    render(<Picture {...defaultProps} className="custom-image-class" />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveClass('custom-image-class');
  });

  it('should apply default className when none provided', () => {
    render(<Picture {...defaultProps} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveClass('h-full', 'w-full', 'object-contain');
  });

  it('should include width and height attributes when provided', () => {
    render(<Picture {...defaultProps} width={800} height={600} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('width', '800');
    expect(img).toHaveAttribute('height', '600');
  });

  it('should disable sources when disableSources is true', () => {
    const { container } = render(
      <Picture {...defaultProps} disableSources={true} />
    );
    
    const sources = container.querySelectorAll('source');
    expect(sources).toHaveLength(0);
  });

  it('should apply custom sizes attribute', () => {
    const customSizes = '(min-width: 1200px) 800px, 100vw';
    const { container } = render(
      <Picture {...defaultProps} sizes={customSizes} />
    );
    
    const sources = container.querySelectorAll('source');
    sources.forEach(source => {
      expect(source).toHaveAttribute('sizes', customSizes);
    });
  });
});