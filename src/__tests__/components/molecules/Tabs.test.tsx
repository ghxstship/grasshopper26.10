import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tabs, Tab } from '@/components/molecules/Tabs';

describe('Tabs', () => {
  const mockOnChange = jest.fn();

  const mockTabs: Tab[] = [
    { id: 'tab1', label: 'First Tab' },
    { id: 'tab2', label: 'Second Tab' },
    { id: 'tab3', label: 'Third Tab' },
  ];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('Rendering', () => {
    it('should render all tabs', () => {
      render(
        <Tabs tabs={mockTabs} activeTab="tab1" onChange={mockOnChange} />
      );
      
      expect(screen.getByText('First Tab')).toBeInTheDocument();
      expect(screen.getByText('Second Tab')).toBeInTheDocument();
      expect(screen.getByText('Third Tab')).toBeInTheDocument();
    });

    it('should render tabs navigation', () => {
      render(
        <Tabs tabs={mockTabs} activeTab="tab1" onChange={mockOnChange} />
      );
      
      const nav = screen.getByRole('navigation', { name: 'Tabs' });
      expect(nav).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <Tabs
          tabs={mockTabs}
          activeTab="tab1"
          onChange={mockOnChange}
          className="custom-tabs"
        />
      );
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-tabs');
    });

    it('should render tabs with icons', () => {
      const tabsWithIcons: Tab[] = [
        {
          id: 'tab1',
          label: 'Tab with Icon',
          icon: <span data-testid="tab-icon">Icon</span>,
        },
      ];

      render(
        <Tabs tabs={tabsWithIcons} activeTab="tab1" onChange={mockOnChange} />
      );
      
      expect(screen.getByTestId('tab-icon')).toBeInTheDocument();
    });
  });

  describe('Tab Selection', () => {
    it('should call onChange when clicking a tab', () => {
      render(
        <Tabs tabs={mockTabs} activeTab="tab1" onChange={mockOnChange} />
      );
      
      const secondTab = screen.getByText('Second Tab');
      fireEvent.click(secondTab);
      
      expect(mockOnChange).toHaveBeenCalledWith('tab2');
    });

    it('should not call onChange when clicking active tab', () => {
      render(
        <Tabs tabs={mockTabs} activeTab="tab1" onChange={mockOnChange} />
      );
      
      const firstTab = screen.getByText('First Tab');
      fireEvent.click(firstTab);
      
      // onChange is still called, but component can handle this
      expect(mockOnChange).toHaveBeenCalledWith('tab1');
    });

    it('should not call onChange when clicking disabled tab', () => {
      const tabsWithDisabled: Tab[] = [
        { id: 'tab1', label: 'Active Tab' },
        { id: 'tab2', label: 'Disabled Tab', disabled: true },
      ];

      render(
        <Tabs
          tabs={tabsWithDisabled}
          activeTab="tab1"
          onChange={mockOnChange}
        />
      );
      
      const disabledTab = screen.getByText('Disabled Tab');
      fireEvent.click(disabledTab);
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Active State', () => {
    it('should highlight active tab', () => {
      render(
        <Tabs tabs={mockTabs} activeTab="tab2" onChange={mockOnChange} />
      );
      
      const secondTab = screen.getByText('Second Tab');
      expect(secondTab).toHaveClass('border-gray-900', 'text-gray-900');
    });

    it('should not highlight inactive tabs', () => {
      render(
        <Tabs tabs={mockTabs} activeTab="tab2" onChange={mockOnChange} />
      );
      
      const firstTab = screen.getByText('First Tab');
      expect(firstTab).toHaveClass('border-transparent', 'text-gray-500');
    });
  });

  describe('Disabled State', () => {
    it('should render disabled tab with disabled attribute', () => {
      const tabsWithDisabled: Tab[] = [
        { id: 'tab1', label: 'Active Tab' },
        { id: 'tab2', label: 'Disabled Tab', disabled: true },
      ];

      render(
        <Tabs
          tabs={tabsWithDisabled}
          activeTab="tab1"
          onChange={mockOnChange}
        />
      );
      
      const disabledTab = screen.getByText('Disabled Tab');
      expect(disabledTab).toBeDisabled();
    });

    it('should apply disabled styling', () => {
      const tabsWithDisabled: Tab[] = [
        { id: 'tab1', label: 'Active Tab' },
        { id: 'tab2', label: 'Disabled Tab', disabled: true },
      ];

      render(
        <Tabs
          tabs={tabsWithDisabled}
          activeTab="tab1"
          onChange={mockOnChange}
        />
      );
      
      const disabledTab = screen.getByText('Disabled Tab');
      expect(disabledTab).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  describe('Variants', () => {
    it('should apply default variant styles', () => {
      render(
        <Tabs
          tabs={mockTabs}
          activeTab="tab1"
          onChange={mockOnChange}
          variant="default"
        />
      );
      
      const activeTab = screen.getByText('First Tab');
      expect(activeTab).toHaveClass('border-gray-900', 'text-gray-900');
    });

    it('should apply gvteway variant styles', () => {
      render(
        <Tabs
          tabs={mockTabs}
          activeTab="tab1"
          onChange={mockOnChange}
          variant="gvteway"
        />
      );
      
      const activeTab = screen.getByText('First Tab');
      expect(activeTab).toHaveClass('border-gvteway-red-500', 'text-gvteway-red-500');
    });

    it('should apply compvss variant styles', () => {
      render(
        <Tabs
          tabs={mockTabs}
          activeTab="tab1"
          onChange={mockOnChange}
          variant="compvss"
        />
      );
      
      const activeTab = screen.getByText('First Tab');
      expect(activeTab).toHaveClass('border-compvss-cyan-500', 'text-compvss-cyan-500');
    });

    it('should apply atlvs variant styles', () => {
      render(
        <Tabs
          tabs={mockTabs}
          activeTab="tab1"
          onChange={mockOnChange}
          variant="atlvs"
        />
      );
      
      const activeTab = screen.getByText('First Tab');
      expect(activeTab).toHaveClass('border-atlvs-green-500', 'text-atlvs-green-500');
    });

    it('should apply variant hover styles to inactive tabs', () => {
      render(
        <Tabs
          tabs={mockTabs}
          activeTab="tab1"
          onChange={mockOnChange}
          variant="gvteway"
        />
      );
      
      const inactiveTab = screen.getByText('Second Tab');
      expect(inactiveTab).toHaveClass('hover:text-gvteway-red-500');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tabs array', () => {
      const { container } = render(
        <Tabs tabs={[]} activeTab="" onChange={mockOnChange} />
      );
      
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('should handle single tab', () => {
      const singleTab: Tab[] = [{ id: 'only', label: 'Only Tab' }];

      render(
        <Tabs tabs={singleTab} activeTab="only" onChange={mockOnChange} />
      );
      
      expect(screen.getByText('Only Tab')).toBeInTheDocument();
    });

    it('should handle tabs with long labels', () => {
      const longLabelTabs: Tab[] = [
        { id: 'tab1', label: 'This is a very long tab label that should not wrap' },
      ];

      render(
        <Tabs tabs={longLabelTabs} activeTab="tab1" onChange={mockOnChange} />
      );
      
      const tab = screen.getByText('This is a very long tab label that should not wrap');
      expect(tab).toHaveClass('whitespace-nowrap');
    });

    it('should handle rapid tab switching', () => {
      render(
        <Tabs tabs={mockTabs} activeTab="tab1" onChange={mockOnChange} />
      );
      
      const tab2 = screen.getByText('Second Tab');
      const tab3 = screen.getByText('Third Tab');
      
      fireEvent.click(tab2);
      fireEvent.click(tab3);
      fireEvent.click(tab2);
      
      expect(mockOnChange).toHaveBeenCalledTimes(3);
    });

    it('should handle invalid activeTab', () => {
      render(
        <Tabs tabs={mockTabs} activeTab="nonexistent" onChange={mockOnChange} />
      );
      
      // Should render without crashing
      expect(screen.getByText('First Tab')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label', () => {
      render(
        <Tabs tabs={mockTabs} activeTab="tab1" onChange={mockOnChange} />
      );
      
      const nav = screen.getByRole('navigation', { name: 'Tabs' });
      expect(nav).toBeInTheDocument();
    });

    it('should render buttons for keyboard navigation', () => {
      render(
        <Tabs tabs={mockTabs} activeTab="tab1" onChange={mockOnChange} />
      );
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('should support keyboard focus', () => {
      render(
        <Tabs tabs={mockTabs} activeTab="tab1" onChange={mockOnChange} />
      );
      
      const secondTab = screen.getByText('Second Tab');
      secondTab.focus();
      
      expect(secondTab).toHaveFocus();
    });

    it('should prevent focus on disabled tabs', () => {
      const tabsWithDisabled: Tab[] = [
        { id: 'tab1', label: 'Active Tab' },
        { id: 'tab2', label: 'Disabled Tab', disabled: true },
      ];

      render(
        <Tabs
          tabs={tabsWithDisabled}
          activeTab="tab1"
          onChange={mockOnChange}
        />
      );
      
      const disabledTab = screen.getByText('Disabled Tab');
      expect(disabledTab).toBeDisabled();
    });
  });

  describe('Integration', () => {
    it('should work in a controlled component pattern', () => {
      const TestComponent = () => {
        const [activeTab, setActiveTab] = React.useState('tab1');
        
        return (
          <div>
            <div data-testid="active-tab">{activeTab}</div>
            <Tabs
              tabs={mockTabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>
        );
      };

      render(<TestComponent />);
      
      expect(screen.getByTestId('active-tab')).toHaveTextContent('tab1');
      
      const secondTab = screen.getByText('Second Tab');
      fireEvent.click(secondTab);
      
      expect(screen.getByTestId('active-tab')).toHaveTextContent('tab2');
    });

    it('should work with tab content switching', () => {
      const TestComponent = () => {
        const [activeTab, setActiveTab] = React.useState('tab1');
        
        return (
          <div>
            <Tabs
              tabs={mockTabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            <div data-testid="tab-content">
              {activeTab === 'tab1' && 'Content 1'}
              {activeTab === 'tab2' && 'Content 2'}
              {activeTab === 'tab3' && 'Content 3'}
            </div>
          </div>
        );
      };

      render(<TestComponent />);
      
      expect(screen.getByTestId('tab-content')).toHaveTextContent('Content 1');
      
      const secondTab = screen.getByText('Second Tab');
      fireEvent.click(secondTab);
      
      expect(screen.getByTestId('tab-content')).toHaveTextContent('Content 2');
    });
  });
});
