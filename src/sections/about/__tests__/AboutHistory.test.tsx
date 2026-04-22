import type React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import AboutHistory from '../AboutHistory';

// ── Mocks ──

vi.mock('@/hooks/useResponsiveMotion', () => ({
  useResponsiveMotion: () => 'static',
}));

vi.mock('framer-motion', () => ({
  m: new Proxy(
    {},
    {
      get:
        (_t: unknown, prop: string) =>
        ({ children, style, ...props }: any) => {
          const Tag = prop as any;
          return (
            <Tag {...props} style={style}>
              {children}
            </Tag>
          );
        },
    },
  ),
  useTransform: () => ({ get: () => 0, on: () => () => {} }),
  useSpring: (v: any) => v,
  useMotionValueEvent: vi.fn(),
}));

vi.mock('@/hooks/useManualScrollProgress', () => ({
  useManualScrollProgress: () => ({
    ref: { current: null },
    scrollYProgress: { get: () => 0, on: () => () => {} },
  }),
}));

vi.mock('@/hooks/usePointerEvents', () => ({
  usePointerEvents: () => 'auto',
}));

vi.mock('@/components/motion/SimpleAnimation', () => ({
  SimpleAnimation: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/motion/ScrollWordReveal', () => ({
  default: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('@/components/common/LinkCTA', () => ({
  default: ({ children, to, href, ...props }: any) => (
    <a href={to || href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/common/ResponsiveImage', () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

vi.mock('@/components/common/ConvexDome', () => ({
  ConvexDome: () => null,
}));

vi.mock('@/lib/motion', () => ({ SPRING_CONFIG: {} }));

// ── Tests ──

describe('AboutHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crash', () => {
    expect(() => {
      render(<AboutHistory />);
    }).not.toThrow();
  });

  it('should render section with id="histoire"', () => {
    const { container } = render(<AboutHistory />);
    const section = container.querySelector('section#histoire');
    expect(section).toBeInTheDocument();
  });

  it('should have aria-labelledby pointing to title', () => {
    const { container } = render(<AboutHistory />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-labelledby', 'histoire-title');
  });

  it('should have data-navbar-theme="light"', () => {
    const { container } = render(<AboutHistory />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-navbar-theme', 'light');
  });

  it('should display the history title', () => {
    render(<AboutHistory />);
    const title = document.getElementById('histoire-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/histoire/i);
  });

  it('should display body text about founding', () => {
    render(<AboutHistory />);
    expect(screen.getByText(/En 2016, La Lunetterie du Coin/)).toBeInTheDocument();
  });

  it('should display the second body paragraph', () => {
    render(<AboutHistory />);
    expect(screen.getByText(/l'adresse à Strasbourg/)).toBeInTheDocument();
  });

  it('should display "Voir nos services" CTA', () => {
    render(<AboutHistory />);
    expect(screen.getByText('Voir nos services')).toBeInTheDocument();
  });

  it('should render shop photo', () => {
    render(<AboutHistory />);
    const img = screen.getByAltText('Intérieur de La Lunetterie du Coin');
    expect(img).toBeInTheDocument();
  });
});
