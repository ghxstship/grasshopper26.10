import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmptyState } from '@/components/molecules/EmptyState';

describe('EmptyState', () => {
  const mockAction = jest.fn();

  beforeEach(() => {
    mockAction.mockClear();
  });

  describe('Rendering', () => {
    it('should render title', () => {
      render(<EmptyState title="No items found" />);
      
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <EmptyState title="Empty" className="custom-empty" />
      );
      
      const emptyState = container.firstChild;
      expect(emptyState).toHaveClass('custom-empty');
    });
  });

  describe('Icon', () => {
    it('should render icon when provided', () => {
      render(
        <EmptyState
          title="No items"
          icon={<span data-testid="empty-icon">📭</span>}
        />
      );
      
      expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
    });

    it('should not render icon when not provided', () => {
      const { container } = render(<EmptyState title="No items" />);
      
      const iconContainer = container.querySelector('.rounded-full.bg-gray-100');
      expect(iconContainer).not.toBeInTheDocument();
    });

    it('should render icon in circular container', () => {
      const { container } = render(
        <EmptyState
          title="No items"
          icon={<span data-testid="empty-icon">📭</span>}
        />
      );
      
      const iconContainer = container.querySelector('.rounded-full.bg-gray-100');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Description', () => {
    it('should render description when provided', () => {
      render(
        <EmptyState
          title="No items"
          message="Try adding some items to get started"
        />
      );
      
      expect(screen.getByText('Try adding some items to get started')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      const { container } = render(<EmptyState title="No items" />);
      
      const description = container.querySelector('p');
      expect(description).not.toBeInTheDocument();
    });

    it('should apply proper styling to description', () => {
      render(
        <EmptyState
          title="No items"
          message="Description text"
        />
      );
      
      const description = screen.getByText('Description text');
      expect(description).toHaveClass('text-body-sm', 'text-gray-500');
    });
  });

  describe('Action Button', () => {
    it('should render action button when provided', () => {
      render(
        <EmptyState
          title="No items"
          actionLabel="Add Item"
          onAction={mockAction}
        />
      );
      
      expect(screen.getByText('Add Item')).toBeInTheDocument();
    });

    it('should not render action button when not provided', () => {
      render(<EmptyState title="No items" />);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should call onClick when button is clicked', () => {
      render(
        <EmptyState
          title="No items"
          actionLabel="Add Item"
          onAction={mockAction}
        />
      );
      
      const button = screen.getByText('Add Item');
      fireEvent.click(button);
      
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('should use default variant when not specified', () => {
      render(
        <EmptyState
          title="No items"
          actionLabel="Add Item"
          onAction={mockAction}
        />
      );
      
      const button = screen.getByText('Add Item');
      expect(button).toBeInTheDocument();
    });

    it('should apply custom variant', () => {
      render(
        <EmptyState
          title="No items"
          action={
            <button onClick={mockAction} data-variant="gvteway">
              Add Item
            </button>
          }
        />
      );
      
      const button = screen.getByText('Add Item');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should center content', () => {
      const { container } = render(<EmptyState title="No items" />);
      
      const emptyState = container.firstChild;
      expect(emptyState).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
    });

    it('should have proper padding', () => {
      const { container } = render(<EmptyState title="No items" />);
      
      const emptyState = container.firstChild;
      expect(emptyState).toHaveClass('py-12', 'px-4');
    });

    it('should center text', () => {
      const { container } = render(<EmptyState title="No items" />);
      
      const emptyState = container.firstChild;
      expect(emptyState).toHaveClass('text-center');
    });
  });

  describe('Typography', () => {
    it('should apply proper title styling', () => {
      render(<EmptyState title="No items" />);
      
      const title = screen.getByText('No items');
      expect(title).toHaveClass('text-h6', 'font-bebas', 'tracking-wide');
    });

    it('should limit description width', () => {
      render(
        <EmptyState
          title="No items"
          message="Description"
        />
      );
      
      const description = screen.getByText('Description');
      expect(description).toHaveClass('max-w-sm');
    });
  });

  describe('Complete Examples', () => {
    it('should render all elements together', () => {
      render(
        <EmptyState
          icon={<span data-testid="icon">📭</span>}
          title="No events found"
          message="Start by creating your first event"
          actionLabel="Create Event"
          onAction={mockAction}
          variant="gvteway"
        />
      );
      
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('No events found')).toBeInTheDocument();
      expect(screen.getByText('Start by creating your first event')).toBeInTheDocument();
      expect(screen.getByText('Create Event')).toBeInTheDocument();
    });

    it('should work with minimal props', () => {
      render(<EmptyState title="Empty" />);
      
      expect(screen.getByText('Empty')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(100);
      render(<EmptyState title={longTitle} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long descriptions', () => {
      const longDescription = 'B'.repeat(200);
      render(
        <EmptyState
          title="Title"
          message={longDescription}
        />
      );
      
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('should handle special characters in text', () => {
      render(
        <EmptyState
          title="No items & events"
          message="Try adding some items/events to get started!"
        />
      );
      
      expect(screen.getByText('No items & events')).toBeInTheDocument();
      expect(screen.getByText('Try adding some items/events to get started!')).toBeInTheDocument();
    });

    it('should handle multiple button clicks', () => {
      render(
        <EmptyState
          title="No items"
          actionLabel="Add Item"
          onAction={mockAction}
        />
      );
      
      const button = screen.getByText('Add Item');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockAction).toHaveBeenCalledTimes(3);
    });
  });

  describe('Variants', () => {
    it('should support default variant', () => {
      render(
        <EmptyState
          title="No items"
          actionLabel="Add"
          onAction={mockAction}
          variant="default"
        />
      );
      
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('should support gvteway variant', () => {
      render(
        <EmptyState
          title="No items"
          actionLabel="Add"
          onAction={mockAction}
          variant="gvteway"
        />
      );
      
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('should support compvss variant', () => {
      render(
        <EmptyState
          title="No items"
          actionLabel="Add"
          onAction={mockAction}
          variant="compvss"
        />
      );
      
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('should support atlvs variant', () => {
      render(
        <EmptyState
          title="No items"
          actionLabel="Add"
          onAction={mockAction}
          variant="atlvs"
        />
      );
      
      expect(screen.getByText('Add')).toBeInTheDocument();
    });
  });

  describe('Use Cases', () => {
    it('should work for empty search results', () => {
      render(
        <EmptyState
          icon={<span>🔍</span>}
          title="No results found"
          message="Try adjusting your search criteria"
          actionLabel="Clear Filters"
          onAction={mockAction}
        />
      );
      
      expect(screen.getByText('No results found')).toBeInTheDocument();
      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });

    it('should work for empty lists', () => {
      render(
        <EmptyState
          icon={<span>📋</span>}
          title="No items yet"
          message="Get started by adding your first item"
          actionLabel="Add Item"
          onAction={mockAction}
        />
      );
      
      expect(screen.getByText('No items yet')).toBeInTheDocument();
      expect(screen.getByText('Add Item')).toBeInTheDocument();
    });

    it('should work for error states', () => {
      render(
        <EmptyState
          icon={<span>⚠️</span>}
          title="Something went wrong"
          message="We couldn't load the data"
          actionLabel="Try Again"
          onAction={mockAction}
        />
      );
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });
});
