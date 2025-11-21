import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchBar } from '@/components/ui-rebuild/molecules/SearchBar';

describe('SearchBar', () => {
  describe('Rendering', () => {
    it('should render search input', () => {
      render(<SearchBar placeholder="Search..." />);
      
      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'search');
    });

    it('should render search icon', () => {
      const { container } = render(<SearchBar />);
      
      const searchIcon = container.querySelector('svg.lucide-search');
      expect(searchIcon).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(<SearchBar className="custom-search" />);
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-search');
    });
  });

  describe('Variants', () => {
    it('should render with default variant', () => {
      render(<SearchBar variant="default" />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });

    it('should render with gvteway variant', () => {
      render(<SearchBar variant="gvteway" />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });

    it('should render with compvss variant', () => {
      render(<SearchBar variant="compvss" />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });

    it('should render with atlvs variant', () => {
      render(<SearchBar variant="atlvs" />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Clear Button', () => {
    it('should not show clear button when value is empty', () => {
      const { container } = render(<SearchBar value="" onClear={jest.fn()} />);
      
      const clearButton = container.querySelector('button');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('should show clear button when value is provided', () => {
      const { container } = render(
        <SearchBar value="search term" onClear={jest.fn()} />
      );
      
      const clearButton = container.querySelector('button');
      expect(clearButton).toBeInTheDocument();
    });

    it('should not show clear button when onClear is not provided', () => {
      const { container } = render(<SearchBar value="search term" />);
      
      const clearButton = container.querySelector('button');
      expect(clearButton).not.toBeInTheDocument();
    });

    it('should call onClear when clear button is clicked', () => {
      const onClear = jest.fn();
      const { container } = render(
        <SearchBar value="search term" onClear={onClear} />
      );
      
      const clearButton = container.querySelector('button');
      fireEvent.click(clearButton!);
      
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('should render X icon in clear button', () => {
      const { container } = render(
        <SearchBar value="search term" onClear={jest.fn()} />
      );
      
      const xIcon = container.querySelector('svg.lucide-x');
      expect(xIcon).toBeInTheDocument();
    });

    it('should have type="button" to prevent form submission', () => {
      const { container } = render(
        <SearchBar value="search term" onClear={jest.fn()} />
      );
      
      const clearButton = container.querySelector('button');
      expect(clearButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Input Behavior', () => {
    it('should accept user input', () => {
      const onChange = jest.fn();
      render(<SearchBar onChange={onChange} />);
      
      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'test query' } });
      
      expect(onChange).toHaveBeenCalled();
    });

    it('should display controlled value', () => {
      render(<SearchBar value="controlled value" onChange={jest.fn()} />);
      
      const input = screen.getByRole('searchbox') as HTMLInputElement;
      expect(input.value).toBe('controlled value');
    });

    it('should support placeholder text', () => {
      render(<SearchBar placeholder="Type to search..." />);
      
      const input = screen.getByPlaceholderText('Type to search...');
      expect(input).toBeInTheDocument();
    });

    it('should support disabled state', () => {
      render(<SearchBar disabled />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toBeDisabled();
    });

    it('should support readonly state', () => {
      render(<SearchBar readOnly />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('readonly');
    });
  });

  describe('Forwarded Ref', () => {
    it('should forward ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<SearchBar ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toHaveAttribute('type', 'search');
    });

    it('should allow focus via ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<SearchBar ref={ref} />);
      
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  describe('Additional Props', () => {
    it('should accept and apply additional HTML attributes', () => {
      render(
        <SearchBar
          data-testid="custom-search"
          id="search-1"
          name="search"
          autoComplete="off"
        />
      );
      
      const input = screen.getByTestId('custom-search');
      expect(input).toHaveAttribute('id', 'search-1');
      expect(input).toHaveAttribute('name', 'search');
      expect(input).toHaveAttribute('autocomplete', 'off');
    });

    it('should support maxLength attribute', () => {
      render(<SearchBar maxLength={50} />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('maxlength', '50');
    });
  });

  describe('Layout', () => {
    it('should position search icon on the left', () => {
      const { container } = render(<SearchBar />);
      
      const searchIcon = container.querySelector('svg.lucide-search');
      expect(searchIcon?.parentElement).toHaveClass('absolute', 'start-3');
    });

    it('should add padding for search icon', () => {
      render(<SearchBar />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('ps-10');
    });

    it('should add padding for clear button when visible', () => {
      render(<SearchBar value="test" onClear={jest.fn()} />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveClass('pe-10');
    });
  });

  describe('Accessibility', () => {
    it('should have searchbox role', () => {
      render(<SearchBar />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<SearchBar aria-label="Search events" />);
      
      const input = screen.getByLabelText('Search events');
      expect(input).toBeInTheDocument();
    });

    it('should make search icon non-interactive', () => {
      const { container } = render(<SearchBar />);
      
      const searchIcon = container.querySelector('svg.lucide-search');
      expect(searchIcon?.parentElement).toHaveClass('pointer-events-none');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string value', () => {
      render(<SearchBar value="" onChange={jest.fn()} />);
      
      const input = screen.getByRole('searchbox') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('should handle very long search terms', () => {
      const longTerm = 'A'.repeat(200);
      render(<SearchBar value={longTerm} onChange={jest.fn()} />);
      
      const input = screen.getByRole('searchbox') as HTMLInputElement;
      expect(input.value).toBe(longTerm);
    });

    it('should handle special characters in search', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      render(<SearchBar value={specialChars} onChange={jest.fn()} />);
      
      const input = screen.getByRole('searchbox') as HTMLInputElement;
      expect(input.value).toBe(specialChars);
    });

    it('should handle rapid clear button clicks', () => {
      const onClear = jest.fn();
      const { container } = render(
        <SearchBar value="test" onClear={onClear} />
      );
      
      const clearButton = container.querySelector('button');
      fireEvent.click(clearButton!);
      fireEvent.click(clearButton!);
      fireEvent.click(clearButton!);
      
      expect(onClear).toHaveBeenCalledTimes(3);
    });
  });

  describe('Integration', () => {
    it('should work in a controlled component pattern', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        
        return (
          <SearchBar
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue('')}
          />
        );
      };

      render(<TestComponent />);
      
      const input = screen.getByRole('searchbox') as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: 'test' } });
      expect(input.value).toBe('test');
      
      const clearButton = input.parentElement?.querySelector('button');
      fireEvent.click(clearButton!);
      expect(input.value).toBe('');
    });
  });
});
