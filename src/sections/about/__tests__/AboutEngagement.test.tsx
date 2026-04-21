import type React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import AboutEngagement from '../AboutEngagement';

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
}));

vi.mock('@/hooks/useManualScrollProgress', () => ({
  useManualScrollProgress: () => ({
    ref: { current: null },
    scrollYProgress: { get: () => 0, on: () => () => {} },
  }),
}));

vi.mock('@/hooks/useScrollEntrance', () => ({
  useScrollEntrance: () => ({
    opacity: { get: () => 1, on: () => () => {} },
    y: { get: () => 0, on: () => () => {} },
  }),
}));

vi.mock('@/components/motion/SimpleAnimation', () => ({
  SimpleAnimation: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/motion/ScrollWordReveal', () => ({
  default: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock('@/components/motion/GiantCounter', () => ({
  GiantCounter: () => null,
}));

vi.mock('@/lib/motion', () => ({ SPRING_CONFIG: {} }));

// ── Tests ──

describe('AboutEngagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crash', () => {
    expect(() => {
      render(<AboutEngagement />);
    }).not.toThrow();
  });

  it('should render section with id="engagement"', () => {
    const { container } = render(<AboutEngagement />);
    const section = container.querySelector('section#engagement');
    expect(section).toBeInTheDocument();
  });

  it('should have aria-label for accessibility', () => {
    const { container } = render(<AboutEngagement />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-label', 'Notre engagement écologique');
  });

  it('should have data-navbar-theme="dark"', () => {
    const { container } = render(<AboutEngagement />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-navbar-theme', 'dark');
  });

  it('should display the engagement title', () => {
    render(<AboutEngagement />);
    expect(screen.getByText('La mode change. La planète, non.')).toBeInTheDocument();
  });

  it('should display all stats', () => {
    render(<AboutEngagement />);
    expect(screen.getByText('2016')).toBeInTheDocument();
    expect(screen.getByText('2000+')).toBeInTheDocument();
    expect(screen.getByText('70€')).toBeInTheDocument();
    expect(screen.getByText('Année de création')).toBeInTheDocument();
    expect(screen.getByText('Paires recyclées')).toBeInTheDocument();
    expect(screen.getByText('Réduction maximum')).toBeInTheDocument();
  });

  it('should display the engagement body text', () => {
    render(<AboutEngagement />);
    expect(screen.getByText(/Des montures restaurées avec soin/)).toBeInTheDocument();
  });

  it('should display the highlight text', () => {
    render(<AboutEngagement />);
    expect(screen.getByText(/Ramenez vos anciennes lunettes/)).toBeInTheDocument();
  });
});
