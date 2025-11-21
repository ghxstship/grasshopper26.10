import { render, screen } from '@/test-utils/test-utils'
import { Button } from '@/components/ui-rebuild/atoms/Button'
import userEvent from '@testing-library/user-event'

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
    })

    it('renders with custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('renders as disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Variants', () => {
    it('renders GVTEWAY variant correctly', () => {
      render(<Button variant="gvteway">GVTEWAY Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('from-gvteway-red-500')
    })

    it('renders COMPVSS variant correctly', () => {
      render(<Button variant="compvss">COMPVSS Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('from-compvss-cyan-500')
    })

    it('renders ATLVS variant correctly', () => {
      render(<Button variant="atlvs">ATLVS Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('from-atlvs-green-500')
    })

    it('renders outline variant correctly', () => {
      render(<Button variant="outline">Outline Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-2')
    })

    it('renders ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-grey-100')
    })
  })

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      render(<Button size="sm">Small Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9')
    })

    it('renders medium size correctly (default)', () => {
      render(<Button size="md">Medium Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-11')
    })

    it('renders large size correctly', () => {
      render(<Button size="lg">Large Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-14')
    })

    it('renders extra large size correctly', () => {
      render(<Button size="xl">XL Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-16')
    })

    it('renders icon size correctly', () => {
      render(<Button size="icon">Icon</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10', 'w-10')
    })
  })

  describe('Rounded', () => {
    it('renders with default rounded-none corners', () => {
      render(<Button rounded-none="default">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('rounded-none')
    })

    it('renders with fully rounded-none corners', () => {
      render(<Button rounded-none="full">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('rounded-none')
    })

    it('renders with no rounded-none corners', () => {
      render(<Button rounded-none="none">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('rounded-none')
    })
  })

  describe('Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button')
      
      await user.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick} disabled>Click me</Button>)
      const button = screen.getByRole('button')
      
      await user.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('supports keyboard navigation', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button')
      
      button.focus()
      expect(button).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('has correct role', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('supports aria-label', () => {
      render(<Button aria-label="Custom label">Button</Button>)
      const button = screen.getByLabelText('Custom label')
      expect(button).toBeInTheDocument()
    })

    it('supports aria-disabled', () => {
      render(<Button disabled>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
    })
  })

  describe('Type attribute', () => {
    it('can be set to submit', () => {
      render(<Button type="submit">Submit</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('can be set to reset', () => {
      render(<Button type="reset">Reset</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'reset')
    })
  })
})
