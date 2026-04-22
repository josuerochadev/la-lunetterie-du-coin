import type React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import OffersContent from '../OffersContent';

// ── Mocks ──

vi.mock('@/hooks/useResponsiveMotion', () => ({
  useResponsiveMotion: () => 'static',
}));

const mockMotionValue = () => ({ get: () => 0, set: vi.fn(), on: () => () => {} });

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
  useTransform: () => mockMotionValue(),
  useSpring: () => mockMotionValue(),
}));

vi.mock('@/hooks/useManualScrollProgress', () => ({
  useManualScrollProgress: () => ({
    ref: { current: null },
    scrollYProgress: mockMotionValue(),
  }),
}));

vi.mock('@/hooks/useFadeInOut', () => ({
  useFadeInOut: () => mockMotionValue(),
}));

vi.mock('@/hooks/usePointerEvents', () => ({
  usePointerEvents: () => 'auto',
}));

vi.mock('@/components/motion/SimpleAnimation', () => ({
  SimpleAnimation: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/common/LinkCTA', () => ({
  default: ({ children, to, href, ...props }: any) => (
    <a href={to || href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/common/ConvexDome', () => ({
  ConvexDome: () => null,
}));

vi.mock('@/lib/motion', () => ({ SPRING_CONFIG: {} }));
vi.mock('@/config/design', () => ({ ACCENT_HEX: '#FFD700' }));

vi.mock('lucide-react/dist/esm/icons/chevron-down', () => ({
  default: (props: any) => <span {...props} />,
}));

// ── Tests ──

describe('OffersContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crash', () => {
    expect(() => {
      render(<OffersContent />);
    }).not.toThrow();
  });

  it('should render section with id="offers-content"', () => {
    const { container } = render(<OffersContent />);
    const section = container.querySelector('section#offers-content');
    expect(section).toBeInTheDocument();
  });

  it('should have data-navbar-theme="light"', () => {
    const { container } = render(<OffersContent />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-navbar-theme', 'light');
  });

  it('should display first offer catchphrase', () => {
    render(<OffersContent />);
    expect(screen.getByText("Vos anciennes lunettes valent de l'or")).toBeInTheDocument();
  });

  it('should display second offer catchphrase', () => {
    render(<OffersContent />);
    expect(screen.getByText('Deux paires, deux styles, un prix imbattable')).toBeInTheDocument();
  });

  it('should display offer counters', () => {
    render(<OffersContent />);
    expect(screen.getByText('01 / 02')).toBeInTheDocument();
    expect(screen.getByText('02 / 02')).toBeInTheDocument();
  });

  it('should display offer descriptions', () => {
    render(<OffersContent />);
    expect(screen.getByText(/70€ de remise/)).toBeInTheDocument();
    expect(screen.getByText(/deuxième paire à partir de 59€/i)).toBeInTheDocument();
  });

  it('should display "En profiter" CTAs', () => {
    render(<OffersContent />);
    expect(screen.getAllByText('En profiter').length).toBe(2);
  });

  it('should display conditions sections', () => {
    render(<OffersContent />);
    expect(screen.getAllByText('Conditions').length).toBe(2);
  });
});
