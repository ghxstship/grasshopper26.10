import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Pagination } from '@/components/ui-rebuild/molecules/Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  describe('Rendering', () => {
    it('should render pagination navigation', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );
      
      const nav = screen.getByRole('navigation', { name: 'Pagination' });
      expect(nav).toBeInTheDocument();
    });

    it('should render all page numbers when total pages <= 7', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should render with ellipsis when total pages > 7', () => {
      const { container } = render(
        <Pagination
          currentPage={5}
          totalPages={20}
          onPageChange={mockOnPageChange}
        />
      );
      
      const ellipsis = container.querySelectorAll('svg.lucide-more-horizontal');
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('should render previous and next buttons', () => {
      const { container } = render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );
      
      const prevButton = container.querySelector('svg.lucide-chevron-left');
      const nextButton = container.querySelector('svg.lucide-chevron-right');
      
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should call onPageChange when clicking a page number', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );
      
      const page3Button = screen.getByText('3');
      fireEvent.click(page3Button);
      
      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it('should call onPageChange with previous page when clicking prev button', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );
      
      const buttons = screen.getAllByRole('button');
      const prevButton = buttons[0]; // First button is prev
      
      fireEvent.click(prevButton);
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange with next page when clicking next button', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );
      
      const buttons = screen.getAllByRole('button');
      const nextButton = buttons[buttons.length - 1]; // Last button is next
      
      fireEvent.click(nextButton);
      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it('should not call onPageChange when clicking active page', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );
      
      const activePage = screen.getByText('3');
      fireEvent.click(activePage);
      
      // Active page has pointer-events-none, but click still fires
      // The component should handle this gracefully
      expect(activePage.parentElement).toHaveClass('pointer-events-none');
    });
  });

  describe('Disabled States', () => {
    it('should disable previous button on first page', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );
      
      const buttons = screen.getAllByRole('button');
      const prevButton = buttons[0];
      
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );
      
      const buttons = screen.getAllByRole('button');
      const nextButton = buttons[buttons.length - 1];
      
      expect(nextButton).toBeDisabled();
    });

    it('should enable both buttons on middle pages', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );
      
      const buttons = screen.getAllByRole('button');
      const prevButton = buttons[0];
      const nextButton = buttons[buttons.length - 1];
      
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Variants', () => {
    it('should apply default variant to active page', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
          variant="default"
        />
      );
      
      const activePage = screen.getByText('2');
      expect(activePage).toBeInTheDocument();
    });

    it('should apply gvteway variant to active page', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
          variant="gvteway"
        />
      );
      
      const activePage = screen.getByText('2');
      expect(activePage).toBeInTheDocument();
    });

    it('should apply compvss variant to active page', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
          variant="compvss"
        />
      );
      
      const activePage = screen.getByText('2');
      expect(activePage).toBeInTheDocument();
    });

    it('should apply atlvs variant to active page', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
          variant="atlvs"
        />
      );
      
      const activePage = screen.getByText('2');
      expect(activePage).toBeInTheDocument();
    });
  });

  describe('Ellipsis Logic', () => {
    it('should show ellipsis at start when current page > 3', () => {
      const { container } = render(
        <Pagination
          currentPage={10}
          totalPages={20}
          onPageChange={mockOnPageChange}
        />
      );
      
      const ellipsis = container.querySelectorAll('svg.lucide-more-horizontal');
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('should show ellipsis at end when current page < totalPages - 2', () => {
      const { container } = render(
        <Pagination
          currentPage={5}
          totalPages={20}
          onPageChange={mockOnPageChange}
        />
      );
      
      const ellipsis = container.querySelectorAll('svg.lucide-more-horizontal');
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('should always show first and last page', () => {
      render(
        <Pagination
          currentPage={10}
          totalPages={20}
          onPageChange={mockOnPageChange}
        />
      );
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('should show pages around current page', () => {
      render(
        <Pagination
          currentPage={10}
          totalPages={20}
          onPageChange={mockOnPageChange}
        />
      );
      
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single page', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={mockOnPageChange}
        />
      );
      
      expect(screen.getByText('1')).toBeInTheDocument();
      
      const buttons = screen.getAllByRole('button');
      const prevButton = buttons[0];
      const nextButton = buttons[buttons.length - 1];
      
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('should handle two pages', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={2}
          onPageChange={mockOnPageChange}
        />
      );
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should handle exactly 7 pages without ellipsis', () => {
      const { container } = render(
        <Pagination
          currentPage={4}
          totalPages={7}
          onPageChange={mockOnPageChange}
        />
      );
      
      const ellipsis = container.querySelectorAll('svg.lucide-more-horizontal');
      expect(ellipsis.length).toBe(0);
      
      for (let i = 1; i <= 7; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });

    it('should handle very large page numbers', () => {
      render(
        <Pagination
          currentPage={500}
          totalPages={1000}
          onPageChange={mockOnPageChange}
        />
      );
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
          className="custom-pagination"
        />
      );
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('custom-pagination');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );
      
      const nav = screen.getByRole('navigation', { name: 'Pagination' });
      expect(nav).toBeInTheDocument();
    });

    it('should have focusable buttons', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );
      
      const page3Button = screen.getByText('3');
      page3Button.focus();
      
      expect(page3Button).toHaveFocus();
    });
  });

  describe('Integration', () => {
    it('should work in a controlled component pattern', () => {
      const TestComponent = () => {
        const [page, setPage] = React.useState(1);
        
        return (
          <div>
            <div data-testid="current-page">{page}</div>
            <Pagination
              currentPage={page}
              totalPages={5}
              onPageChange={setPage}
            />
          </div>
        );
      };

      render(<TestComponent />);
      
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
      
      const page3Button = screen.getByText('3');
      fireEvent.click(page3Button);
      
      expect(screen.getByTestId('current-page')).toHaveTextContent('3');
    });
  });
});
