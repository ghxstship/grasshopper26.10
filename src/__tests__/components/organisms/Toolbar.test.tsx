import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toolbar, ToolbarAction } from '@/components/organisms/Toolbar';

describe('Toolbar', () => {
  const mockOnSearch = jest.fn();
  const mockOnFilter = jest.fn();
  const mockAction = jest.fn();

  const mockActions: ToolbarAction[] = [
    {
      label: 'Export',
      icon: <span data-testid="export-icon">📤</span>,
      onClick: mockAction,
    },
    {
      label: 'Import',
      icon: <span data-testid="import-icon">📥</span>,
      onClick: mockAction,
    },
  ];

  const mockPrimaryAction: ToolbarAction = {
    label: 'Create New',
    onClick: mockAction,
    variant: 'gvteway',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render toolbar container', () => {
      const { container } = render(<Toolbar />);
      
      const toolbar = container.firstChild;
      expect(toolbar).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(<Toolbar className="custom-toolbar" />);
      
      const toolbar = container.firstChild;
      expect(toolbar).toHaveClass('custom-toolbar');
    });
  });

  describe('Title and Description', () => {
    it('should render title when provided', () => {
      render(<Toolbar title="Events Dashboard" />);
      
      expect(screen.getByText('Events Dashboard')).toBeInTheDocument();
    });

    it('should render description when provided', () => {
      render(<Toolbar description="Manage all your events" />);
      
      expect(screen.getByText('Manage all your events')).toBeInTheDocument();
    });

    it('should render both title and description', () => {
      render(
        <Toolbar
          title="Events Dashboard"
          description="Manage all your events"
        />
      );
      
      expect(screen.getByText('Events Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Manage all your events')).toBeInTheDocument();
    });

    it('should not render title section when both are missing', () => {
      const { container } = render(<Toolbar />);
      
      const heading = container.querySelector('h2');
      expect(heading).not.toBeInTheDocument();
    });

    it('should apply proper heading styles', () => {
      render(<Toolbar title="Title" />);
      
      const heading = screen.getByText('Title');
      expect(heading).toHaveClass('text-2xl', 'font-bebas', 'tracking-wide');
    });
  });

  describe('Search', () => {
    it('should render search bar when onSearch is provided', () => {
      render(<Toolbar onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeInTheDocument();
    });

    it('should not render search bar when onSearch is not provided', () => {
      render(<Toolbar />);
      
      const searchInput = screen.queryByRole('searchbox');
      expect(searchInput).not.toBeInTheDocument();
    });

    it('should use custom search placeholder', () => {
      render(
        <Toolbar
          onSearch={mockOnSearch}
          searchPlaceholder="Search events..."
        />
      );
      
      const searchInput = screen.getByPlaceholderText('Search events...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should use default search placeholder', () => {
      render(<Toolbar onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should call onSearch when typing', () => {
      render(<Toolbar onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'test query' } });
      
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });

    it('should call onSearch when clearing', () => {
      render(<Toolbar onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      const clearButton = screen.getByRole('searchbox').parentElement?.querySelector('button');
      if (clearButton) {
        fireEvent.click(clearButton);
        expect(mockOnSearch).toHaveBeenCalledWith('');
      }
    });

    it('should apply variant to search bar', () => {
      render(<Toolbar onSearch={mockOnSearch} variant="gvteway" />);
      
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Filter Button', () => {
    it('should render filter button when onFilter is provided', () => {
      const { container } = render(<Toolbar onFilter={mockOnFilter} />);
      
      const filterIcon = container.querySelector('svg.lucide-filter');
      expect(filterIcon).toBeInTheDocument();
    });

    it('should not render filter button when onFilter is not provided', () => {
      const { container } = render(<Toolbar />);
      
      const filterIcon = container.querySelector('svg.lucide-filter');
      expect(filterIcon).not.toBeInTheDocument();
    });

    it('should call onFilter when clicked', () => {
      const { container } = render(<Toolbar onFilter={mockOnFilter} />);
      
      const filterButton = container.querySelector('svg.lucide-filter')?.parentElement;
      fireEvent.click(filterButton!);
      
      expect(mockOnFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('Secondary Actions', () => {
    it('should render secondary actions', () => {
      render(<Toolbar actions={mockActions} />);
      
      expect(screen.getByText('Export')).toBeInTheDocument();
      expect(screen.getByText('Import')).toBeInTheDocument();
    });

    it('should not render actions when empty array', () => {
      render(<Toolbar actions={[]} />);
      
      expect(screen.queryByText('Export')).not.toBeInTheDocument();
    });

    it('should render action icons', () => {
      render(<Toolbar actions={mockActions} />);
      
      expect(screen.getByTestId('export-icon')).toBeInTheDocument();
      expect(screen.getByTestId('import-icon')).toBeInTheDocument();
    });

    it('should call action onClick when clicked', () => {
      render(<Toolbar actions={mockActions} />);
      
      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);
      
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('should disable action when disabled prop is true', () => {
      const disabledActions: ToolbarAction[] = [
        {
          label: 'Disabled Action',
          onClick: mockAction,
          disabled: true,
        },
      ];

      render(<Toolbar actions={disabledActions} />);
      
      const button = screen.getByText('Disabled Action');
      expect(button).toBeDisabled();
    });

    it('should apply custom variant to actions', () => {
      const customActions: ToolbarAction[] = [
        {
          label: 'Custom',
          onClick: mockAction,
          variant: 'gvteway',
        },
      ];

      render(<Toolbar actions={customActions} />);
      
      const button = screen.getByText('Custom');
      expect(button).toBeInTheDocument();
    });

    it('should hide actions on mobile', () => {
      render(<Toolbar actions={mockActions} />);
      
      const exportButton = screen.getByText('Export');
      expect(exportButton).toHaveClass('hidden', 'sm:inline-flex');
    });
  });

  describe('Mobile Actions Menu', () => {
    it('should render mobile menu button when actions exist', () => {
      const { container } = render(<Toolbar actions={mockActions} />);
      
      const moreIcon = container.querySelector('svg.lucide-more-vertical');
      expect(moreIcon).toBeInTheDocument();
    });

    it('should not render mobile menu when no actions', () => {
      const { container } = render(<Toolbar actions={[]} />);
      
      const moreIcon = container.querySelector('svg.lucide-more-vertical');
      expect(moreIcon).not.toBeInTheDocument();
    });

    it('should hide mobile menu on desktop', () => {
      const { container } = render(<Toolbar actions={mockActions} />);
      
      const moreButton = container.querySelector('svg.lucide-more-vertical')?.parentElement;
      expect(moreButton).toHaveClass('sm:hidden');
    });
  });

  describe('Primary Action', () => {
    it('should render primary action when provided', () => {
      render(<Toolbar primaryAction={mockPrimaryAction} />);
      
      expect(screen.getByText('Create New')).toBeInTheDocument();
    });

    it('should not render primary action when not provided', () => {
      render(<Toolbar />);
      
      expect(screen.queryByText('Create New')).not.toBeInTheDocument();
    });

    it('should call primary action onClick when clicked', () => {
      render(<Toolbar primaryAction={mockPrimaryAction} />);
      
      const button = screen.getByText('Create New');
      fireEvent.click(button);
      
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('should disable primary action when disabled', () => {
      const disabledAction: ToolbarAction = {
        ...mockPrimaryAction,
        disabled: true,
      };

      render(<Toolbar primaryAction={disabledAction} />);
      
      const button = screen.getByText('Create New');
      expect(button).toBeDisabled();
    });

    it('should apply custom variant to primary action', () => {
      render(<Toolbar primaryAction={mockPrimaryAction} />);
      
      const button = screen.getByText('Create New');
      expect(button).toBeInTheDocument();
    });

    it('should use toolbar variant when action variant not specified', () => {
      const actionWithoutVariant: ToolbarAction = {
        label: 'Action',
        onClick: mockAction,
      };

      render(
        <Toolbar primaryAction={actionWithoutVariant} variant="compvss" />
      );
      
      const button = screen.getByText('Action');
      expect(button).toBeInTheDocument();
    });

    it('should render primary action icon', () => {
      const actionWithIcon: ToolbarAction = {
        label: 'With Icon',
        icon: <span data-testid="primary-icon">✨</span>,
        onClick: mockAction,
      };

      render(<Toolbar primaryAction={actionWithIcon} />);
      
      expect(screen.getByTestId('primary-icon')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant', () => {
      render(<Toolbar onSearch={mockOnSearch} variant="default" />);
      
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeInTheDocument();
    });

    it('should apply gvteway variant', () => {
      render(<Toolbar onSearch={mockOnSearch} variant="gvteway" />);
      
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeInTheDocument();
    });

    it('should apply compvss variant', () => {
      render(<Toolbar onSearch={mockOnSearch} variant="compvss" />);
      
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeInTheDocument();
    });

    it('should apply atlvs variant', () => {
      render(<Toolbar onSearch={mockOnSearch} variant="atlvs" />);
      
      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should use proper spacing', () => {
      const { container } = render(<Toolbar />);
      
      const toolbar = container.firstChild;
      expect(toolbar).toHaveClass('space-y-4');
    });

    it('should use responsive flex layout for action bar', () => {
      const { container } = render(<Toolbar onSearch={mockOnSearch} />);
      
      const actionBar = container.querySelector('.flex.flex-col');
      expect(actionBar).toHaveClass('sm:flex-row', 'sm:items-center', 'sm:justify-between');
    });

    it('should limit search bar width', () => {
      const { container } = render(<Toolbar onSearch={mockOnSearch} />);
      
      const searchContainer = container.querySelector('.flex-1.max-w-md');
      expect(searchContainer).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should render all elements together', () => {
      render(
        <Toolbar
          title="Dashboard"
          description="Overview"
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
          actions={mockActions}
          primaryAction={mockPrimaryAction}
          variant="gvteway"
        />
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(screen.getByText('Export')).toBeInTheDocument();
      expect(screen.getByText('Create New')).toBeInTheDocument();
    });

    it('should handle all interactions', () => {
      const { container } = render(
        <Toolbar
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
          actions={mockActions}
          primaryAction={mockPrimaryAction}
        />
      );

      // Search
      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(mockOnSearch).toHaveBeenCalledWith('test');

      // Filter
      const filterButton = container.querySelector('svg.lucide-filter')?.parentElement;
      fireEvent.click(filterButton!);
      expect(mockOnFilter).toHaveBeenCalledTimes(1);

      // Secondary action
      const exportButton = screen.getByText('Export');
      fireEvent.click(exportButton);
      expect(mockAction).toHaveBeenCalled();

      // Primary action
      const primaryButton = screen.getByText('Create New');
      fireEvent.click(primaryButton);
      expect(mockAction).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty configuration', () => {
      const { container } = render(<Toolbar />);
      
      const toolbar = container.firstChild;
      expect(toolbar).toBeInTheDocument();
    });

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(100);
      render(<Toolbar title={longTitle} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle many actions', () => {
      const manyActions: ToolbarAction[] = Array.from({ length: 10 }, (_, i) => ({
        label: `Action ${i + 1}`,
        onClick: mockAction,
      }));

      render(<Toolbar actions={manyActions} />);
      
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 10')).toBeInTheDocument();
    });

    it('should handle rapid search input', () => {
      render(<Toolbar onSearch={mockOnSearch} />);
      
      const searchInput = screen.getByRole('searchbox');
      
      fireEvent.change(searchInput, { target: { value: 'a' } });
      fireEvent.change(searchInput, { target: { value: 'ab' } });
      fireEvent.change(searchInput, { target: { value: 'abc' } });
      
      expect(mockOnSearch).toHaveBeenCalledTimes(3);
    });
  });
});
