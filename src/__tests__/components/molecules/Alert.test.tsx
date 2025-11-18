import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Alert } from '@/components/molecules/Alert';

describe('Alert', () => {
  describe('Rendering', () => {
    it('should render with default variant', () => {
      render(<Alert>Default alert message</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText('Default alert message')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(<Alert title="Alert Title">Alert content</Alert>);
      
      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Alert content')).toBeInTheDocument();
    });

    it('should render without title', () => {
      render(<Alert>Just content</Alert>);
      
      expect(screen.getByText('Just content')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Alert className="custom-alert">Content</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('custom-alert');
    });
  });

  describe('Variants', () => {
    it('should render info variant', () => {
      render(<Alert variant="info">Info message</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-900');
    });

    it('should render success variant', () => {
      render(<Alert variant="success">Success message</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-green-50', 'border-green-200', 'text-green-900');
    });

    it('should render warning variant', () => {
      render(<Alert variant="warning">Warning message</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-yellow-50', 'border-yellow-200', 'text-yellow-900');
    });

    it('should render error variant', () => {
      render(<Alert variant="error">Error message</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-red-50', 'border-red-200', 'text-red-900');
    });

    it('should render default variant explicitly', () => {
      render(<Alert variant="default">Default message</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-gray-50', 'border-gray-200', 'text-gray-900');
    });
  });

  describe('Icons', () => {
    it('should render info icon for info variant', () => {
      const { container } = render(<Alert variant="info">Info</Alert>);
      
      const icon = container.querySelector('svg.lucide-info');
      expect(icon).toBeInTheDocument();
    });

    it('should render check circle icon for success variant', () => {
      const { container } = render(<Alert variant="success">Success</Alert>);
      
      const icon = container.querySelector('svg.lucide-check-circle');
      expect(icon).toBeInTheDocument();
    });

    it('should render alert circle icon for warning variant', () => {
      const { container } = render(<Alert variant="warning">Warning</Alert>);
      
      const icon = container.querySelector('svg.lucide-alert-circle');
      expect(icon).toBeInTheDocument();
    });

    it('should render x circle icon for error variant', () => {
      const { container } = render(<Alert variant="error">Error</Alert>);
      
      const icon = container.querySelector('svg.lucide-x-circle');
      expect(icon).toBeInTheDocument();
    });

    it('should render info icon for default variant', () => {
      const { container } = render(<Alert>Default</Alert>);
      
      const icon = container.querySelector('svg.lucide-info');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should render close button when onClose is provided', () => {
      const onClose = jest.fn();
      const { container } = render(<Alert onClose={onClose}>Content</Alert>);
      
      const closeButton = container.querySelector('button');
      expect(closeButton).toBeInTheDocument();
    });

    it('should not render close button when onClose is not provided', () => {
      const { container } = render(<Alert>Content</Alert>);
      
      const closeButton = container.querySelector('button');
      expect(closeButton).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      const { container } = render(<Alert onClose={onClose}>Content</Alert>);
      
      const closeButton = container.querySelector('button');
      fireEvent.click(closeButton!);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should render X icon in close button', () => {
      const onClose = jest.fn();
      const { container } = render(<Alert onClose={onClose}>Content</Alert>);
      
      const xIcon = container.querySelector('svg.lucide-x');
      expect(xIcon).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('should render text content', () => {
      render(<Alert>Simple text content</Alert>);
      
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('should render JSX content', () => {
      render(
        <Alert>
          <div data-testid="custom-content">
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
          </div>
        </Alert>
      );
      
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    });

    it('should render with both title and content', () => {
      render(
        <Alert title="Important">
          <p>This is the content</p>
        </Alert>
      );
      
      expect(screen.getByText('Important')).toBeInTheDocument();
      expect(screen.getByText('This is the content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert"', () => {
      render(<Alert>Alert message</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should be accessible with screen readers', () => {
      render(<Alert title="Error" variant="error">Something went wrong</Alert>);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Error');
      expect(alert).toHaveTextContent('Something went wrong');
    });
  });

  describe('Forwarded Ref', () => {
    it('should forward ref to div element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Alert ref={ref}>Content</Alert>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('role', 'alert');
    });
  });

  describe('Additional Props', () => {
    it('should accept and apply additional HTML attributes', () => {
      render(
        <Alert data-testid="custom-alert" id="alert-1">
          Content
        </Alert>
      );
      
      const alert = screen.getByTestId('custom-alert');
      expect(alert).toHaveAttribute('id', 'alert-1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      render(<Alert />);
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(1000);
      render(<Alert>{longContent}</Alert>);
      
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('should handle multiple close button clicks', () => {
      const onClose = jest.fn();
      const { container } = render(<Alert onClose={onClose}>Content</Alert>);
      
      const closeButton = container.querySelector('button');
      fireEvent.click(closeButton!);
      fireEvent.click(closeButton!);
      fireEvent.click(closeButton!);
      
      expect(onClose).toHaveBeenCalledTimes(3);
    });
  });
});
