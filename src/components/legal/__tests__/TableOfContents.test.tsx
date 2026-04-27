import type React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import TableOfContents from '../TableOfContents';

// Mock SimpleAnimation
vi.mock('@/components/motion/SimpleAnimation', () => ({
  SimpleAnimation: ({
    children,
    type,
    delay,
  }: {
    children: React.ReactNode;
    type?: string;
    delay?: number;
  }) => (
    <div data-testid="simple-animation" data-type={type} data-delay={delay}>
      {children}
    </div>
  ),
}));

// Mock DOM methods
const mockScrollIntoView = vi.fn();
const mockFocus = vi.fn();

describe('TableOfContents', () => {
  const defaultSections = [
    { id: 'section-1', title: 'First Section' },
    { id: 'section-2', title: 'Second Section' },
    { id: 'section-3', title: 'Third Section' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(document, 'getElementById', {
      value: vi.fn((id) => ({
        scrollIntoView: mockScrollIntoView,
        focus: mockFocus,
        id,
      })),
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic rendering', () => {
    it('should render navigation with correct aria-label', () => {
      render(<TableOfContents sections={defaultSections} />);

      const nav = screen.getByRole('navigation', { name: 'Table des matières' });
      expect(nav).toBeInTheDocument();
    });

    it('should render sommaire heading', () => {
      render(<TableOfContents sections={defaultSections} />);

      const heading = screen.getByText('Sommaire');
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H2');
    });

    it('should render all sections as list items', () => {
      render(<TableOfContents sections={defaultSections} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(defaultSections.length);
    });

    it('should render links for all sections', () => {
      render(<TableOfContents sections={defaultSections} />);

      defaultSections.forEach((section) => {
        const link = screen.getByText(section.title);
        expect(link).toBeInTheDocument();
        expect(link.closest('a')).toHaveAttribute('href', `#${section.id}`);
      });
    });
  });

  describe('section numbering', () => {
    it('should number sections with zero-padded format', () => {
      render(<TableOfContents sections={defaultSections} />);

      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByText('03')).toBeInTheDocument();
    });

    it('should handle single section', () => {
      render(<TableOfContents sections={[{ id: 'only', title: 'Only Section' }]} />);

      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.queryByText('02')).not.toBeInTheDocument();
    });
  });

  describe('navigation behavior', () => {
    it('should scroll to section when link is clicked', () => {
      render(<TableOfContents sections={defaultSections} />);

      const link = screen.getByText('First Section').closest('a');
      fireEvent.click(link!);

      expect(document.getElementById).toHaveBeenCalledWith('section-1');
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('should focus on section after scrolling', () => {
      render(<TableOfContents sections={defaultSections} />);

      const link = screen.getByText('Second Section').closest('a');
      fireEvent.click(link!);

      expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true });
    });

    it('should handle missing elements gracefully', () => {
      vi.mocked(document.getElementById).mockReturnValue(null);

      render(<TableOfContents sections={defaultSections} />);

      const link = screen.getByText('First Section').closest('a');

      expect(() => {
        fireEvent.click(link!);
      }).not.toThrow();

      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });
  });

  describe('accessibility features', () => {
    it('should have proper navigation structure', () => {
      render(<TableOfContents sections={defaultSections} />);

      const nav = screen.getByRole('navigation');
      const list = screen.getByRole('list');

      expect(nav).toContainElement(list);
    });

    it('should have accessible links with href attributes', () => {
      render(<TableOfContents sections={defaultSections} />);

      defaultSections.forEach((section) => {
        const link = screen.getByText(section.title).closest('a');
        expect(link).toHaveAttribute('href', `#${section.id}`);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty sections array', () => {
      render(<TableOfContents sections={[]} />);

      expect(screen.getByText('Sommaire')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });

    it('should handle sections with special characters', () => {
      const specialSections = [
        { id: 'special', title: 'Section with "quotes" & ampersands' },
        { id: 'accents', title: 'Section with accénts and çharàcters' },
      ];

      render(<TableOfContents sections={specialSections} />);

      specialSections.forEach((section) => {
        expect(screen.getByText(section.title)).toBeInTheDocument();
      });
    });
  });
});
