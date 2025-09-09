import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import TableOfContents from '../TableOfContents';

// Mock SimpleAnimation
vi.mock('@/components/motion/SimpleAnimation', () => ({
  SimpleAnimation: ({ children, type, delay, immediate }: any) => (
    <div
      data-testid="simple-animation"
      data-type={type}
      data-delay={delay}
      data-immediate={immediate}
    >
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

    // Mock getElementById to return elements with our mock methods
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
    it('should number sections starting from 1', () => {
      render(<TableOfContents sections={defaultSections} />);

      expect(screen.getByText('1.')).toBeInTheDocument();
      expect(screen.getByText('2.')).toBeInTheDocument();
      expect(screen.getByText('3.')).toBeInTheDocument();
    });

    it('should handle single section', () => {
      const singleSection = [{ id: 'only-section', title: 'Only Section' }];

      render(<TableOfContents sections={singleSection} />);

      expect(screen.getByText('1.')).toBeInTheDocument();
      expect(screen.queryByText('2.')).not.toBeInTheDocument();
    });

    it('should handle many sections', () => {
      const manySections = Array.from({ length: 10 }, (_, i) => ({
        id: `section-${i + 1}`,
        title: `Section ${i + 1}`,
      }));

      render(<TableOfContents sections={manySections} />);

      expect(screen.getByText('1.')).toBeInTheDocument();
      expect(screen.getByText('5.')).toBeInTheDocument();
      expect(screen.getByText('10.')).toBeInTheDocument();
    });
  });

  describe('navigation behavior', () => {
    it('should scroll to section when link is clicked', () => {
      render(<TableOfContents sections={defaultSections} />);

      const firstSectionLink = screen.getByText('First Section').closest('a');
      expect(firstSectionLink).toBeInTheDocument();

      fireEvent.click(firstSectionLink!);

      expect(document.getElementById).toHaveBeenCalledWith('section-1');
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('should focus on section after scrolling', () => {
      render(<TableOfContents sections={defaultSections} />);

      const secondSectionLink = screen.getByText('Second Section').closest('a');
      fireEvent.click(secondSectionLink!);

      expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true });
    });

    it('should prevent default link behavior', () => {
      render(<TableOfContents sections={defaultSections} />);

      const link = screen.getByText('First Section').closest('a');
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fireEvent(link!, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should handle missing elements gracefully', () => {
      // Mock getElementById to return null
      vi.mocked(document.getElementById).mockReturnValue(null);

      render(<TableOfContents sections={defaultSections} />);

      const link = screen.getByText('First Section').closest('a');

      expect(() => {
        fireEvent.click(link!);
      }).not.toThrow();

      expect(mockScrollIntoView).not.toHaveBeenCalled();
      expect(mockFocus).not.toHaveBeenCalled();
    });
  });

  describe('animations setup', () => {
    it('should wrap component in main animation', () => {
      render(<TableOfContents sections={defaultSections} />);

      const mainAnimation = screen.getAllByTestId('simple-animation')[0];
      expect(mainAnimation).toHaveAttribute('data-type', 'slide-up');
      expect(mainAnimation).toHaveAttribute('data-delay', '160');
    });

    it('should animate heading immediately', () => {
      render(<TableOfContents sections={defaultSections} />);

      const animations = screen.getAllByTestId('simple-animation');
      const headingAnimation = animations.find((anim) => anim.textContent?.includes('Sommaire'));

      expect(headingAnimation).toHaveAttribute('data-type', 'slide-down');
      expect(headingAnimation).toHaveAttribute('data-immediate', 'true');
    });

    it('should animate each section with incremental delay', () => {
      render(<TableOfContents sections={defaultSections} />);

      const animations = screen.getAllByTestId('simple-animation');

      // Find animations for each section
      defaultSections.forEach((section, index) => {
        const sectionAnimation = animations.find(
          (anim) =>
            anim.textContent?.includes(section.title) && !anim.textContent?.includes('Sommaire'),
        );

        expect(sectionAnimation).toHaveAttribute('data-type', 'slide-up');
        expect(sectionAnimation).toHaveAttribute('data-delay', (index * 80).toString());
      });
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

    it('should have focus styles classes', () => {
      render(<TableOfContents sections={defaultSections} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveClass('focus-style');
        expect(link).toHaveClass('focus:outline-none');
      });
    });

    it('should support keyboard navigation', () => {
      render(<TableOfContents sections={defaultSections} />);

      const firstLink = screen.getByText('First Section').closest('a');

      // Should be focusable
      expect(firstLink).toHaveAttribute('href');
      expect(firstLink).toHaveClass('focus-style');
    });
  });

  describe('styling and layout', () => {
    it('should apply custom className when provided', () => {
      render(<TableOfContents sections={defaultSections} className="custom-class" />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('custom-class');
    });

    it('should have default spacing classes', () => {
      render(<TableOfContents sections={defaultSections} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('mb-20');
    });

    it('should style heading correctly', () => {
      render(<TableOfContents sections={defaultSections} />);

      const heading = screen.getByText('Sommaire');
      expect(heading).toHaveClass(
        'mb-8',
        'font-serif',
        'text-title-lg',
        'font-bold',
        'text-primary',
      );
    });

    it('should style list with proper spacing', () => {
      render(<TableOfContents sections={defaultSections} />);

      const list = screen.getByRole('list');
      expect(list).toHaveClass('space-y-6');
    });

    it('should style links with hover effects', () => {
      render(<TableOfContents sections={defaultSections} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveClass('group', 'transition-all', 'duration-200');
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
        { id: 'section-with-special', title: 'Section with "quotes" & ampersands' },
        { id: 'section-with-html', title: 'Section with <tags>' },
        { id: 'section-with-accents', title: 'Section with accénts and çharàcters' },
      ];

      render(<TableOfContents sections={specialSections} />);

      specialSections.forEach((section) => {
        expect(screen.getByText(section.title)).toBeInTheDocument();
      });
    });

    it('should handle very long section titles', () => {
      const longSections = [
        {
          id: 'long-section',
          title:
            'This is a very long section title that might wrap to multiple lines and should still display correctly',
        },
      ];

      render(<TableOfContents sections={longSections} />);

      expect(screen.getByText(longSections[0].title)).toBeInTheDocument();
    });

    it('should handle sections with same titles but different IDs', () => {
      const duplicateTitleSections = [
        { id: 'section-1', title: 'Duplicate Title' },
        { id: 'section-2', title: 'Duplicate Title' },
      ];

      render(<TableOfContents sections={duplicateTitleSections} />);

      const links = screen.getAllByText('Duplicate Title');
      expect(links).toHaveLength(2);

      expect(links[0].closest('a')).toHaveAttribute('href', '#section-1');
      expect(links[1].closest('a')).toHaveAttribute('href', '#section-2');
    });

    it('should handle click on element without href', () => {
      render(<TableOfContents sections={defaultSections} />);

      // Click on the number span instead of the link
      const numberSpan = screen.getByText('1.');

      expect(() => {
        fireEvent.click(numberSpan);
      }).not.toThrow();
    });
  });

  describe('performance considerations', () => {
    it('should use unique keys for section list items', () => {
      render(<TableOfContents sections={defaultSections} />);

      const listItems = screen.getAllByRole('listitem');

      // React should properly render all items without key warnings
      expect(listItems).toHaveLength(defaultSections.length);
    });

    it('should handle rapid clicks gracefully', () => {
      render(<TableOfContents sections={defaultSections} />);

      const link = screen.getByText('First Section').closest('a');

      // Rapidly click multiple times
      fireEvent.click(link!);
      fireEvent.click(link!);
      fireEvent.click(link!);

      // Should call scroll/focus for each click
      expect(mockScrollIntoView).toHaveBeenCalledTimes(3);
      expect(mockFocus).toHaveBeenCalledTimes(3);
    });

    it('should handle many sections efficiently', () => {
      const manySections = Array.from({ length: 50 }, (_, i) => ({
        id: `section-${i}`,
        title: `Section ${i}`,
      }));

      expect(() => {
        render(<TableOfContents sections={manySections} />);
      }).not.toThrow();

      expect(screen.getAllByRole('listitem')).toHaveLength(50);
    });
  });
});
