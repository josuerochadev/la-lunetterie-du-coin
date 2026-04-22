import type React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ContactLocation from '../ContactLocation';

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

vi.mock('@/components/common/LinkCTA', () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock('@/components/common/ResponsiveImage', () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

vi.mock('@/lib/motion', () => ({ SPRING_CONFIG: {} }));
vi.mock('@/config/design', () => ({ ACCENT_HEX: '#FFD700' }));

vi.mock('lucide-react/dist/esm/icons/map-pin', () => ({
  default: (props: any) => <span {...props} />,
}));
vi.mock('lucide-react/dist/esm/icons/car', () => ({
  default: (props: any) => <span {...props} />,
}));
vi.mock('lucide-react/dist/esm/icons/train', () => ({
  default: (props: any) => <span {...props} />,
}));
vi.mock('lucide-react/dist/esm/icons/train-front', () => ({
  default: (props: any) => <span {...props} />,
}));
vi.mock('lucide-react/dist/esm/icons/bus', () => ({
  default: (props: any) => <span {...props} />,
}));
vi.mock('lucide-react/dist/esm/icons/footprints', () => ({
  default: (props: any) => <span {...props} />,
}));
vi.mock('lucide-react/dist/esm/icons/accessibility', () => ({
  default: (props: any) => <span {...props} />,
}));

// ── Tests ──

describe('ContactLocation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crash', () => {
    expect(() => {
      render(<ContactLocation />);
    }).not.toThrow();
  });

  it('should render section with id="localisation"', () => {
    const { container } = render(<ContactLocation />);
    const section = container.querySelector('section#localisation');
    expect(section).toBeInTheDocument();
  });

  it('should have data-navbar-theme="light"', () => {
    const { container } = render(<ContactLocation />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-navbar-theme', 'light');
  });

  it('should display heading "Comment venir"', () => {
    render(<ContactLocation />);
    expect(screen.getByText('Comment venir')).toBeInTheDocument();
  });

  it('should display transportation mode "En voiture"', () => {
    render(<ContactLocation />);
    expect(screen.getByText('En voiture')).toBeInTheDocument();
  });

  it('should display transportation mode "En transports"', () => {
    render(<ContactLocation />);
    expect(screen.getByText('En transports')).toBeInTheDocument();
  });

  it('should display accessibility information', () => {
    render(<ContactLocation />);
    expect(screen.getByText(/accessible aux personnes à mobilité réduite/)).toBeInTheDocument();
  });

  it('should display Google Maps CTA', () => {
    render(<ContactLocation />);
    expect(screen.getByText('Voir sur Google Maps')).toBeInTheDocument();
  });
});
