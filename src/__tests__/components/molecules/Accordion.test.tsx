import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accordion, AccordionItem } from '@/components/molecules/Accordion';

describe('Accordion', () => {
  const mockItems: AccordionItem[] = [
    {
      id: '1',
      title: 'First Item',
      content: 'First content',
    },
    {
      id: '2',
      title: 'Second Item',
      content: 'Second content',
    },
    {
      id: '3',
      title: 'Third Item',
      content: <div>Third content with JSX</div>,
    },
  ];

  describe('Rendering', () => {
    it('should render all accordion items', () => {
      render(<Accordion items={mockItems} />);
      
      expect(screen.getByText('First Item')).toBeInTheDocument();
      expect(screen.getByText('Second Item')).toBeInTheDocument();
      expect(screen.getByText('Third Item')).toBeInTheDocument();
    });

    it('should not display content by default', () => {
      render(<Accordion items={mockItems} />);
      
      expect(screen.queryByText('First content')).not.toBeInTheDocument();
      expect(screen.queryByText('Second content')).not.toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <Accordion items={mockItems} className="custom-class" />
      );
      
      const accordion = container.firstChild;
      expect(accordion).toHaveClass('custom-class');
    });

    it('should render items with icons', () => {
      const itemsWithIcons: AccordionItem[] = [
        {
          id: '1',
          title: 'Item with icon',
          content: 'Content',
          icon: <span data-testid="custom-icon">Icon</span>,
        },
      ];

      render(<Accordion items={itemsWithIcons} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Single Selection Mode', () => {
    it('should open item when clicked', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByText('First Item');
      fireEvent.click(firstButton);
      
      expect(screen.getByText('First content')).toBeInTheDocument();
    });

    it('should close item when clicked again', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByText('First Item');
      fireEvent.click(firstButton);
      expect(screen.getByText('First content')).toBeInTheDocument();
      
      fireEvent.click(firstButton);
      expect(screen.queryByText('First content')).not.toBeInTheDocument();
    });

    it('should close previous item when opening new one', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByText('First Item');
      const secondButton = screen.getByText('Second Item');
      
      fireEvent.click(firstButton);
      expect(screen.getByText('First content')).toBeInTheDocument();
      
      fireEvent.click(secondButton);
      expect(screen.queryByText('First content')).not.toBeInTheDocument();
      expect(screen.getByText('Second content')).toBeInTheDocument();
    });
  });

  describe('Multiple Selection Mode', () => {
    it('should allow multiple items to be open', () => {
      render(<Accordion items={mockItems} allowMultiple />);
      
      const firstButton = screen.getByText('First Item');
      const secondButton = screen.getByText('Second Item');
      
      fireEvent.click(firstButton);
      fireEvent.click(secondButton);
      
      expect(screen.getByText('First content')).toBeInTheDocument();
      expect(screen.getByText('Second content')).toBeInTheDocument();
    });

    it('should close individual items independently', () => {
      render(<Accordion items={mockItems} allowMultiple />);
      
      const firstButton = screen.getByText('First Item');
      const secondButton = screen.getByText('Second Item');
      
      fireEvent.click(firstButton);
      fireEvent.click(secondButton);
      
      fireEvent.click(firstButton);
      
      expect(screen.queryByText('First content')).not.toBeInTheDocument();
      expect(screen.getByText('Second content')).toBeInTheDocument();
    });
  });

  describe('Default Open State', () => {
    it('should open items specified in defaultOpen', () => {
      render(<Accordion items={mockItems} defaultOpen={['1', '2']} />);
      
      expect(screen.getByText('First content')).toBeInTheDocument();
      expect(screen.getByText('Second content')).toBeInTheDocument();
    });

    it('should respect defaultOpen in single selection mode', () => {
      render(<Accordion items={mockItems} defaultOpen={['1']} />);
      
      expect(screen.getByText('First content')).toBeInTheDocument();
      expect(screen.queryByText('Second content')).not.toBeInTheDocument();
    });

    it('should respect defaultOpen in multiple selection mode', () => {
      render(<Accordion items={mockItems} allowMultiple defaultOpen={['1', '3']} />);
      
      expect(screen.getByText('First content')).toBeInTheDocument();
      expect(screen.getByText('Third content with JSX')).toBeInTheDocument();
      expect(screen.queryByText('Second content')).not.toBeInTheDocument();
    });
  });

  describe('Chevron Icon', () => {
    it('should rotate chevron when item is opened', () => {
      const { container } = render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByText('First Item');
      const chevron = container.querySelector('svg.lucide-chevron-down');
      
      expect(chevron).not.toHaveClass('rotate-180');
      
      fireEvent.click(firstButton);
      expect(chevron).toHaveClass('rotate-180');
    });
  });

  describe('Accessibility', () => {
    it('should render buttons with proper structure', () => {
      render(<Accordion items={mockItems} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('should support keyboard navigation', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByText('First Item');
      firstButton.focus();
      
      expect(firstButton).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      const { container } = render(<Accordion items={[]} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle items with empty content', () => {
      const emptyItems: AccordionItem[] = [
        {
          id: '1',
          title: 'Empty',
          content: '',
        },
      ];

      render(<Accordion items={emptyItems} />);
      const button = screen.getByText('Empty');
      fireEvent.click(button);
      
      expect(button).toBeInTheDocument();
    });

    it('should handle rapid clicking', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByText('First Item');
      
      fireEvent.click(firstButton);
      fireEvent.click(firstButton);
      fireEvent.click(firstButton);
      
      expect(screen.getByText('First content')).toBeInTheDocument();
    });
  });
});
