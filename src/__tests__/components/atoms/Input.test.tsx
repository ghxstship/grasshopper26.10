import React from 'react'
import { render, screen } from '@/test-utils/test-utils'
import { Input } from '@/components/ui-rebuild/atoms/Input'
import userEvent from '@testing-library/user-event'

describe('Input Component', () => {
  describe('Rendering', () => {
    it('renders with default variant', () => {
      render(<Input placeholder="Enter text" />)
      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toBeInTheDocument()
      expect(input).toHaveClass('focus:ring-grey-500', 'focus:border-grey-500')
    })

    it('renders as input element', () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input.tagName).toBe('INPUT')
    })

    it('applies custom className', () => {
      render(<Input className="custom-input" data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('custom-input')
    })
  })

  describe('Platform Variants', () => {
    it('renders GVTEWAY variant correctly', () => {
      render(<Input variant="gvteway" data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('focus:ring-gvteway-red-500', 'focus:border-gvteway-red-500')
    })

    it('renders COMPVSS variant correctly', () => {
      render(<Input variant="compvss" data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('focus:ring-compvss-cyan-500', 'focus:border-compvss-cyan-500')
    })

    it('renders ATLVS variant correctly', () => {
      render(<Input variant="atlvs" data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('focus:ring-atlvs-green-500', 'focus:border-atlvs-green-500')
    })
  })

  describe('Input Types', () => {
    it('renders text input by default', () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.type).toBe('text')
    })

    it('renders email input', () => {
      render(<Input type="email" data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.type).toBe('email')
    })

    it('renders password input', () => {
      render(<Input type="password" data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.type).toBe('password')
    })

    it('renders number input', () => {
      render(<Input type="number" data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.type).toBe('number')
    })

    it('renders search input', () => {
      render(<Input type="search" data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.type).toBe('search')
    })

    it('renders tel input', () => {
      render(<Input type="tel" data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.type).toBe('tel')
    })

    it('renders url input', () => {
      render(<Input type="url" data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.type).toBe('url')
    })
  })

  describe('User Interactions', () => {
    it('accepts text input', async () => {
      const user = userEvent.setup()
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      
      await user.type(input, 'Hello World')
      expect(input.value).toBe('Hello World')
    })

    it('calls onChange handler', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<Input onChange={handleChange} data-testid="input" />)
      const input = screen.getByTestId('input')
      
      await user.type(input, 'a')
      expect(handleChange).toHaveBeenCalled()
    })

    it('calls onFocus handler', async () => {
      const handleFocus = jest.fn()
      const user = userEvent.setup()
      render(<Input onFocus={handleFocus} data-testid="input" />)
      const input = screen.getByTestId('input')
      
      await user.click(input)
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('calls onBlur handler', async () => {
      const handleBlur = jest.fn()
      const user = userEvent.setup()
      render(<Input onBlur={handleBlur} data-testid="input" />)
      const input = screen.getByTestId('input')
      
      await user.click(input)
      await user.tab()
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input')
      
      await user.tab()
      expect(input).toHaveFocus()
    })
  })

  describe('States', () => {
    it('renders disabled state', () => {
      render(<Input disabled data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
    })

    it('does not accept input when disabled', async () => {
      const user = userEvent.setup()
      render(<Input disabled data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      
      await user.type(input, 'test')
      expect(input.value).toBe('')
    })

    it('renders readonly state', () => {
      render(<Input readOnly value="Read only" data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input).toHaveAttribute('readonly')
      expect(input.value).toBe('Read only')
    })

    it('renders required state', () => {
      render(<Input required data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toBeRequired()
    })
  })

  describe('Placeholder', () => {
    it('displays placeholder text', () => {
      render(<Input placeholder="Enter your name" />)
      const input = screen.getByPlaceholderText('Enter your name')
      expect(input).toBeInTheDocument()
    })

    it('placeholder disappears when typing', async () => {
      const user = userEvent.setup()
      render(<Input placeholder="Type here" data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      
      await user.type(input, 'text')
      expect(input.value).toBe('text')
    })
  })

  describe('Value Control', () => {
    it('renders with initial value', () => {
      render(<Input value="Initial" onChange={() => {}} data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.value).toBe('Initial')
    })

    it('renders with defaultValue', () => {
      render(<Input defaultValue="Default" data-testid="input" />)
      const input = screen.getByTestId('input') as HTMLInputElement
      expect(input.value).toBe('Default')
    })

    it('updates controlled value', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('')
        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            data-testid="input"
          />
        )
      }
      
      const user = userEvent.setup()
      render(<TestComponent />)
      const input = screen.getByTestId('input') as HTMLInputElement
      
      await user.type(input, 'controlled')
      expect(input.value).toBe('controlled')
    })
  })

  describe('Accessibility', () => {
    it('supports aria-label', () => {
      render(<Input aria-label="Username input" />)
      const input = screen.getByLabelText('Username input')
      expect(input).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(
        <>
          <Input aria-describedby="help-text" data-testid="input" />
          <span id="help-text">Help text</span>
        </>
      )
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('aria-describedby', 'help-text')
    })

    it('supports aria-invalid for error state', () => {
      render(<Input aria-invalid="true" data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Styling', () => {
    it('has correct base classes', () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveClass(
        'flex',
        'h-11',
        'w-full',
        'rounded-none',
        'border-2',
        'border-grey-300',
        'bg-white',
        'px-4',
        'py-2',
        'font-share-tech',
        'text-body',
        'transition-colors'
      )
    })

    it('has focus styles', () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2'
      )
    })

    it('has placeholder styles', () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('placeholder:text-grey-400')
    })

    it('has dark mode styles', () => {
      render(<Input data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveClass('dark:bg-grey-900', 'dark:border-grey-700', 'dark:text-white')
    })
  })

  describe('Additional Attributes', () => {
    it('supports name attribute', () => {
      render(<Input name="username" data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('name', 'username')
    })

    it('supports id attribute', () => {
      render(<Input id="email-input" data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('id', 'email-input')
    })

    it('supports maxLength attribute', () => {
      render(<Input maxLength={10} data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('maxLength', '10')
    })

    it('supports pattern attribute', () => {
      render(<Input pattern="[0-9]*" data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('pattern', '[0-9]*')
    })

    it('supports autoComplete attribute', () => {
      render(<Input autoComplete="email" data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveAttribute('autoComplete', 'email')
    })

    it('supports autoFocus attribute', () => {
      render(<Input autoFocus data-testid="input" />)
      const input = screen.getByTestId('input')
      expect(input).toHaveFocus()
    })
  })
})
