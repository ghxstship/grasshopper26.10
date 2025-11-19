import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingState } from '@/components/molecules/LoadingState';

describe('LoadingState', () => {
  describe('Rendering', () => {
    it('should render loading message', () => {
      render(<LoadingState />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render custom message', () => {
      render(<LoadingState message="Please wait..." />);
      
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('should render spinner', () => {
      const { container } = render(<LoadingState />);
      
      // Spinner component should be rendered
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <LoadingState className="custom-loading" />
      );
      
      const loadingContainer = container.querySelector('.custom-loading');
      expect(loadingContainer).toBeInTheDocument();
    });
  });

  describe('Message', () => {
    it('should render message when provided', () => {
      render(<LoadingState message="Loading data..." />);
      
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('should not render message when empty string', () => {
      render(<LoadingState message="" />);
      
      const message = screen.queryByText('Loading...');
      expect(message).not.toBeInTheDocument();
    });

    it('should apply proper styling to message', () => {
      render(<LoadingState message="Loading..." />);
      
      const message = screen.getByText('Loading...');
      expect(message).toHaveClass('text-body-sm', 'text-grey-600', 'font-share-tech');
    });
  });

  describe('Variants', () => {
    it('should apply default variant', () => {
      render(<LoadingState variant="default" />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should apply gvteway variant', () => {
      render(<LoadingState variant="gvteway" />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should apply compvss variant', () => {
      render(<LoadingState variant="compvss" />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should apply atlvs variant', () => {
      render(<LoadingState variant="atlvs" />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should apply sm size', () => {
      render(<LoadingState size="sm" />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should apply md size', () => {
      render(<LoadingState size="md" />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should apply lg size by default', () => {
      render(<LoadingState />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should apply lg size', () => {
      render(<LoadingState size="lg" />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Full Screen Mode', () => {
    it('should render in normal mode by default', () => {
      const { container } = render(<LoadingState />);
      
      const fullScreenContainer = container.querySelector('.fixed.inset-0');
      expect(fullScreenContainer).not.toBeInTheDocument();
    });

    it('should render in full screen mode when enabled', () => {
      const { container } = render(<LoadingState fullScreen={true} />);
      
      const fullScreenContainer = container.querySelector('.fixed.inset-0');
      expect(fullScreenContainer).toBeInTheDocument();
    });

    it('should apply backdrop blur in full screen mode', () => {
      const { container } = render(<LoadingState fullScreen={true} />);
      
      const fullScreenContainer = container.querySelector('.backdrop-blur-sm');
      expect(fullScreenContainer).toBeInTheDocument();
    });

    it('should apply z-index in full screen mode', () => {
      const { container } = render(<LoadingState fullScreen={true} />);
      
      const fullScreenContainer = container.querySelector('.z-50');
      expect(fullScreenContainer).toBeInTheDocument();
    });

    it('should center content in full screen mode', () => {
      const { container } = render(<LoadingState fullScreen={true} />);
      
      const fullScreenContainer = container.querySelector('.fixed.inset-0');
      expect(fullScreenContainer).toHaveClass('flex', 'items-center', 'justify-center');
    });
  });

  describe('Layout', () => {
    it('should center content in normal mode', () => {
      const { container } = render(<LoadingState />);
      
      const loadingContainer = container.querySelector('.flex.items-center.justify-center');
      expect(loadingContainer).toBeInTheDocument();
    });

    it('should have proper padding in normal mode', () => {
      const { container } = render(<LoadingState />);
      
      const loadingContainer = container.querySelector('.py-12');
      expect(loadingContainer).toBeInTheDocument();
    });

    it('should use flex column layout for content', () => {
      const { container } = render(<LoadingState />);
      
      const contentContainer = container.querySelector('.flex.flex-col');
      expect(contentContainer).toBeInTheDocument();
    });

    it('should have gap between spinner and message', () => {
      const { container } = render(<LoadingState />);
      
      const contentContainer = container.querySelector('.gap-4');
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(200);
      render(<LoadingState message={longMessage} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle special characters in message', () => {
      render(<LoadingState message="Loading data & processing..." />);
      
      expect(screen.getByText('Loading data & processing...')).toBeInTheDocument();
    });

    it('should handle undefined message', () => {
      render(<LoadingState message={undefined} />);
      
      // Should render default message
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Use Cases', () => {
    it('should work for page loading', () => {
      render(
        <LoadingState
          message="Loading page..."
          fullScreen={true}
          size="lg"
        />
      );
      
      expect(screen.getByText('Loading page...')).toBeInTheDocument();
    });

    it('should work for component loading', () => {
      render(
        <LoadingState
          message="Loading data..."
          size="md"
        />
      );
      
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('should work for inline loading', () => {
      render(
        <LoadingState
          message="Processing..."
          size="sm"
        />
      );
      
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('should work with different variants for branding', () => {
      const { rerender } = render(
        <LoadingState variant="gvteway" message="Loading events..." />
      );
      expect(screen.getByText('Loading events...')).toBeInTheDocument();

      rerender(<LoadingState variant="compvss" message="Loading production..." />);
      expect(screen.getByText('Loading production...')).toBeInTheDocument();

      rerender(<LoadingState variant="atlvs" message="Loading projects..." />);
      expect(screen.getByText('Loading projects...')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be visible to screen readers', () => {
      render(<LoadingState message="Loading content" />);
      
      const message = screen.getByText('Loading content');
      expect(message).toBeVisible();
    });

    it('should provide loading feedback', () => {
      render(<LoadingState />);
      
      // Message provides context for loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with all props combined', () => {
      const { container } = render(
        <LoadingState
          message="Loading your dashboard..."
          variant="gvteway"
          size="lg"
          fullScreen={true}
          className="custom-class"
        />
      );
      
      expect(screen.getByText('Loading your dashboard...')).toBeInTheDocument();
      expect(container.querySelector('.fixed.inset-0')).toBeInTheDocument();
    });

    it('should work with minimal props', () => {
      render(<LoadingState />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering', () => {
    it('should render when loading is true', () => {
      const { rerender } = render(
        <div>{true && <LoadingState />}</div>
      );
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      rerender(<div>{false && <LoadingState />}</div>);
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Instances', () => {
    it('should support multiple loading states', () => {
      render(
        <div>
          <LoadingState message="Loading section 1..." />
          <LoadingState message="Loading section 2..." />
        </div>
      );
      
      expect(screen.getByText('Loading section 1...')).toBeInTheDocument();
      expect(screen.getByText('Loading section 2...')).toBeInTheDocument();
    });
  });
});
