import type React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import FullScreenMenu from '../FullScreenMenu';

// ── Mocks ──

vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: '/' }),
}));

vi.mock('@/hooks/useClickOutside', () => ({ useClickOutside: vi.fn() }));
vi.mock('@/hooks/useMenuAnimation', () => ({ useMenuAnimation: vi.fn() }));

vi.mock('@/components/motion/SimpleAnimation', () => ({
  SimpleAnimation: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/common/OpeningHoursList', () => ({
  OpeningHoursList: () => <div data-testid="opening-hours">Horaires</div>,
}));

vi.mock('@/lib/iconRegistry', () => ({
  getSocialIcon: (name: string) => {
    const Icon = ({ className, ...props }: any) => (
      <span data-testid={`social-icon-${name}`} className={className} {...props} />
    );
    Icon.displayName = `SocialIcon_${name}`;
    return Icon;
  },
}));

vi.mock('@/assets/logo/Logo_LLDC_Noir.svg?react', () => ({
  default: (props: any) => <svg data-testid="logo" {...props} />,
}));

vi.mock('@/assets/patterns/motif-cercle-jaune.svg', () => ({
  default: '/mock-motif.svg',
}));

vi.mock('lucide-react/dist/esm/icons/phone', () => ({
  default: (props: any) => <span data-testid="icon-phone" {...props} />,
}));
vi.mock('lucide-react/dist/esm/icons/map-pin', () => ({
  default: (props: any) => <span data-testid="icon-map-pin" {...props} />,
}));
vi.mock('lucide-react/dist/esm/icons/external-link', () => ({
  default: (props: any) => <span data-testid="icon-external-link" {...props} />,
}));

// ── Tests ──

describe('FullScreenMenu', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when closed', () => {
    it('should render nothing when isOpen is false', () => {
      const { container } = render(<FullScreenMenu isOpen={false} onClose={onClose} />);
      expect(container.innerHTML).toBe('');
    });
  });

  describe('when open', () => {
    it('should render without crash', () => {
      expect(() => {
        render(<FullScreenMenu isOpen={true} onClose={onClose} />);
      }).not.toThrow();
    });

    it('should render main navigation with aria-label', () => {
      render(<FullScreenMenu isOpen={true} onClose={onClose} />);
      const nav = screen.getByLabelText('Menu de navigation principal');
      expect(nav).toBeInTheDocument();
      expect(nav.tagName).toBe('NAV');
    });

    it('should render close button with correct aria-label', () => {
      render(<FullScreenMenu isOpen={true} onClose={onClose} />);
      expect(screen.getByLabelText('Fermer le menu')).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      render(<FullScreenMenu isOpen={true} onClose={onClose} />);
      // Mobile + desktop duplicates — use getAllByText
      expect(screen.getAllByText('Accueil').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('À propos').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Nos services').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Nos offres').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Nous contacter').length).toBeGreaterThanOrEqual(1);
    });

    it('should render legal links', () => {
      render(<FullScreenMenu isOpen={true} onClose={onClose} />);
      expect(screen.getAllByText('Mentions légales').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Conditions de vente').length).toBeGreaterThanOrEqual(1);
    });

    it('should render Prendre RDV CTA', () => {
      render(<FullScreenMenu isOpen={true} onClose={onClose} />);
      expect(screen.getAllByText('Prendre RDV').length).toBeGreaterThanOrEqual(1);
    });

    it('should display phone number', () => {
      render(<FullScreenMenu isOpen={true} onClose={onClose} />);
      expect(screen.getAllByText('03 88 51 24 40').length).toBeGreaterThanOrEqual(1);
    });

    it('should render social media links with aria-labels', () => {
      render(<FullScreenMenu isOpen={true} onClose={onClose} />);
      expect(screen.getAllByLabelText('Facebook').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByLabelText('Instagram').length).toBeGreaterThanOrEqual(1);
    });

    it('should render store address', () => {
      render(<FullScreenMenu isOpen={true} onClose={onClose} />);
      expect(screen.getAllByText(/24 Rue du Faubourg-de-Pierre/).length).toBeGreaterThanOrEqual(1);
    });
  });
});
