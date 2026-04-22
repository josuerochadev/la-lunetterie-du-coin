import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ServicesMobileAnimated } from '../ServicesMobileAnimated';

// ── Mocks ──

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
  useScroll: () => ({ scrollY: mockMotionValue(), scrollYProgress: mockMotionValue() }),
  useTransform: () => mockMotionValue(),
  useSpring: () => mockMotionValue(),
  useMotionValueEvent: vi.fn(),
}));

vi.mock('@/components/common/ResponsiveImage', () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

vi.mock('@/components/common/LinkCTA', () => ({
  default: ({ children, to, href, ...props }: any) => (
    <a href={to || href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('../GrainOverlay', () => ({
  GrainOverlay: () => null,
}));

vi.mock('@/lib/motion', () => ({ SPRING_CONFIG: {} }));
vi.mock('@/config/endpoints', () => ({ BOOKING_URL: 'https://booking.test' }));

vi.mock('lucide-react/dist/esm/icons/external-link', () => ({
  default: (props: any) => <span {...props} />,
}));

// ── Tests ──

describe('ServicesMobileAnimated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crash', () => {
    expect(() => {
      render(<ServicesMobileAnimated />);
    }).not.toThrow();
  });

  it('should render within xl:hidden container', () => {
    const { container } = render(<ServicesMobileAnimated />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain('xl:hidden');
  });

  it('should render section title', () => {
    render(<ServicesMobileAnimated />);
    const title = document.getElementById('services-title');
    expect(title).toBeInTheDocument();
  });

  it('should render service titles', () => {
    render(<ServicesMobileAnimated />);
    expect(screen.getAllByText('Lunettes neuves').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Examens de vue/).length).toBeGreaterThanOrEqual(1);
  });

  it('should render "En savoir plus" CTAs', () => {
    render(<ServicesMobileAnimated />);
    expect(screen.getAllByText('En savoir plus').length).toBeGreaterThanOrEqual(1);
  });

  it('should render "Prendre RDV" CTA for exams service', () => {
    render(<ServicesMobileAnimated />);
    expect(screen.getAllByText('Prendre RDV').length).toBeGreaterThanOrEqual(1);
  });

  it('should render outro words', () => {
    render(<ServicesMobileAnimated />);
    expect(screen.getByText('TAPEZ-LEUR')).toBeInTheDocument();
    expect(screen.getByText('DANS')).toBeInTheDocument();
    expect(screen.getByText("L'ŒIL")).toBeInTheDocument();
  });

  it('should render progress segments with sr-only text', () => {
    render(<ServicesMobileAnimated />);
    expect(screen.getAllByText(/Service \d+ sur \d+/).length).toBeGreaterThanOrEqual(1);
  });
});
