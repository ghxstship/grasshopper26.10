import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Breadcrumb, BreadcrumbItem } from '@/components/molecules/Breadcrumb';

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('Breadcrumb', () => {
  const mockItems: BreadcrumbItem[] = [
    { label: 'Events', href: '/events' },
    { label: 'Music Festival', href: '/events/123' },
    { label: 'Details' },
  ];

  describe('Rendering', () => {
    it('should render breadcrumb navigation', () => {
      render(<Breadcrumb items={mockItems} />);
      
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
      expect(nav).toBeInTheDocument();
    });

    it('should render all breadcrumb items', () => {
      render(<Breadcrumb items={mockItems} />);
      
      expect(screen.getByText('Events')).toBeInTheDocument();
      expect(screen.getByText('Music Festival')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <Breadcrumb items={mockItems} className="custom-breadcrumb" />
      );
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('custom-breadcrumb');
    });
  });

  describe('Home Icon', () => {
    it('should render home icon by default', () => {
      const { container } = render(<Breadcrumb items={mockItems} />);
      
      const homeIcon = container.querySelector('svg.lucide-home');
      expect(homeIcon).toBeInTheDocument();
    });

    it('should not render home icon when showHome is false', () => {
      const { container } = render(
        <Breadcrumb items={mockItems} showHome={false} />
      );
      
      const homeIcon = container.querySelector('svg.lucide-home');
      expect(homeIcon).not.toBeInTheDocument();
    });

    it('should link home icon to root', () => {
      const { container } = render(<Breadcrumb items={mockItems} />);
      
      const homeLink = container.querySelector('a[href="/"]');
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe('Separators', () => {
    it('should render chevron separators between items', () => {
      const { container } = render(<Breadcrumb items={mockItems} />);
      
      const chevrons = container.querySelectorAll('svg.lucide-chevron-right');
      // Home separator + 2 item separators
      expect(chevrons.length).toBeGreaterThanOrEqual(2);
    });

    it('should not render separator after last item', () => {
      render(<Breadcrumb items={mockItems} />);
      
      const lastItem = screen.getByText('Details');
      const nextSibling = lastItem.parentElement?.nextSibling;
      
      // Next sibling should not be a chevron
      expect(nextSibling?.nodeName).not.toBe('svg');
    });

    it('should render separator after home when items exist', () => {
      const { container } = render(<Breadcrumb items={mockItems} />);
      
      const chevrons = container.querySelectorAll('svg.lucide-chevron-right');
      expect(chevrons.length).toBeGreaterThan(0);
    });

    it('should not render separator after home when no items', () => {
      const { container } = render(<Breadcrumb items={[]} />);
      
      const chevrons = container.querySelectorAll('svg.lucide-chevron-right');
      expect(chevrons.length).toBe(0);
    });
  });

  describe('Links', () => {
    it('should render links for items with href', () => {
      render(<Breadcrumb items={mockItems} />);
      
      const eventsLink = screen.getByText('Events').closest('a');
      expect(eventsLink).toHaveAttribute('href', '/events');
      
      const festivalLink = screen.getByText('Music Festival').closest('a');
      expect(festivalLink).toHaveAttribute('href', '/events/123');
    });

    it('should not render link for last item', () => {
      render(<Breadcrumb items={mockItems} />);
      
      const lastItem = screen.getByText('Details');
      const link = lastItem.closest('a');
      expect(link).not.toBeInTheDocument();
    });

    it('should not render link for items without href', () => {
      const itemsWithoutHref: BreadcrumbItem[] = [
        { label: 'First' },
        { label: 'Second' },
      ];

      render(<Breadcrumb items={itemsWithoutHref} />);
      
      const firstItem = screen.getByText('First');
      const secondItem = screen.getByText('Second');
      
      expect(firstItem.closest('a')).not.toBeInTheDocument();
      expect(secondItem.closest('a')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should highlight last item', () => {
      render(<Breadcrumb items={mockItems} />);
      
      const lastItem = screen.getByText('Details');
      expect(lastItem).toHaveClass('text-gray-900', 'font-medium');
    });

    it('should style non-last items differently', () => {
      render(<Breadcrumb items={mockItems} />);
      
      const firstItem = screen.getByText('Events');
      expect(firstItem).toHaveClass('text-gray-500');
    });

    it('should apply hover styles to links', () => {
      render(<Breadcrumb items={mockItems} />);
      
      const eventsLink = screen.getByText('Events').closest('a');
      expect(eventsLink).toHaveClass('hover:text-gray-900');
    });
  });

  describe('Icons', () => {
    it('should render custom icons for items', () => {
      const itemsWithIcons: BreadcrumbItem[] = [
        {
          label: 'With Icon',
          icon: <span data-testid="custom-icon">📁</span>,
        },
      ];

      render(<Breadcrumb items={itemsWithIcons} />);
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should render items without icons', () => {
      render(<Breadcrumb items={mockItems} />);
      
      expect(screen.getByText('Events')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      const { container } = render(<Breadcrumb items={[]} />);
      
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('should handle single item', () => {
      const singleItem: BreadcrumbItem[] = [{ label: 'Only Item' }];
      
      render(<Breadcrumb items={singleItem} />);
      
      expect(screen.getByText('Only Item')).toBeInTheDocument();
    });

    it('should handle very long breadcrumb trail', () => {
      const longItems: BreadcrumbItem[] = Array.from({ length: 10 }, (_, i) => ({
        label: `Level ${i + 1}`,
        href: i < 9 ? `/level-${i + 1}` : undefined,
      }));

      render(<Breadcrumb items={longItems} />);
      
      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('Level 10')).toBeInTheDocument();
    });

    it('should handle items with very long labels', () => {
      const longLabel = 'A'.repeat(100);
      const items: BreadcrumbItem[] = [{ label: longLabel }];

      render(<Breadcrumb items={items} />);
      
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('should handle special characters in labels', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Events & Shows' },
        { label: 'Rock/Metal' },
        { label: 'AC/DC' },
      ];

      render(<Breadcrumb items={items} />);
      
      expect(screen.getByText('Events & Shows')).toBeInTheDocument();
      expect(screen.getByText('Rock/Metal')).toBeInTheDocument();
      expect(screen.getByText('AC/DC')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label', () => {
      render(<Breadcrumb items={mockItems} />);
      
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
      expect(nav).toBeInTheDocument();
    });

    it('should maintain semantic HTML structure', () => {
      const { container } = render(<Breadcrumb items={mockItems} />);
      
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should use flex layout', () => {
      const { container } = render(<Breadcrumb items={mockItems} />);
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('flex', 'items-center');
    });

    it('should have proper spacing', () => {
      const { container } = render(<Breadcrumb items={mockItems} />);
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('space-x-2');
    });
  });

  describe('Integration', () => {
    it('should work with all features combined', () => {
      const complexItems: BreadcrumbItem[] = [
        {
          label: 'Dashboard',
          href: '/dashboard',
          icon: <span data-testid="dashboard-icon">📊</span>,
        },
        {
          label: 'Projects',
          href: '/projects',
          icon: <span data-testid="projects-icon">📁</span>,
        },
        {
          label: 'Current Project',
          icon: <span data-testid="project-icon">📄</span>,
        },
      ];

      render(<Breadcrumb items={complexItems} showHome={true} />);
      
      // Home icon
      const { container } = render(<Breadcrumb items={complexItems} />);
      expect(container.querySelector('svg.lucide-home')).toBeInTheDocument();
      
      // All items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Current Project')).toBeInTheDocument();
      
      // Custom icons
      expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument();
      expect(screen.getByTestId('projects-icon')).toBeInTheDocument();
      expect(screen.getByTestId('project-icon')).toBeInTheDocument();
    });
  });
});
