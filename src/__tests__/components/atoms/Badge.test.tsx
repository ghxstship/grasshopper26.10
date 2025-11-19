import { render, screen } from '@/test-utils/test-utils'
import { Badge } from '@/components/atoms/Badge'

describe('Badge Component', () => {
  describe('Rendering', () => {
    it('renders with default variant', () => {
      render(<Badge>Default Badge</Badge>)
      const badge = screen.getByText('Default Badge')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-grey-200', 'text-grey-900')
    })

    it('renders children correctly', () => {
      render(<Badge>Test Content</Badge>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(<Badge className="custom-class">Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveClass('custom-class')
    })

    it('renders as a div element', () => {
      render(<Badge data-testid="badge">Badge</Badge>)
      const badge = screen.getByTestId('badge')
      expect(badge.tagName).toBe('DIV')
    })
  })

  describe('Platform Variants', () => {
    it('renders GVTEWAY variant correctly', () => {
      render(<Badge variant="gvteway">GVTEWAY</Badge>)
      const badge = screen.getByText('GVTEWAY')
      expect(badge).toHaveClass('bg-gvteway-red-500', 'text-white')
    })

    it('renders GVTEWAY outline variant correctly', () => {
      render(<Badge variant="gvteway-outline">GVTEWAY</Badge>)
      const badge = screen.getByText('GVTEWAY')
      expect(badge).toHaveClass('border-2', 'border-gvteway-red-500', 'text-gvteway-red-500')
    })

    it('renders COMPVSS variant correctly', () => {
      render(<Badge variant="compvss">COMPVSS</Badge>)
      const badge = screen.getByText('COMPVSS')
      expect(badge).toHaveClass('bg-compvss-cyan-500', 'text-white')
    })

    it('renders COMPVSS outline variant correctly', () => {
      render(<Badge variant="compvss-outline">COMPVSS</Badge>)
      const badge = screen.getByText('COMPVSS')
      expect(badge).toHaveClass('border-2', 'border-compvss-cyan-500', 'text-compvss-cyan-500')
    })

    it('renders ATLVS variant correctly', () => {
      render(<Badge variant="atlvs">ATLVS</Badge>)
      const badge = screen.getByText('ATLVS')
      expect(badge).toHaveClass('bg-atlvs-green-500', 'text-black')
    })

    it('renders ATLVS outline variant correctly', () => {
      render(<Badge variant="atlvs-outline">ATLVS</Badge>)
      const badge = screen.getByText('ATLVS')
      expect(badge).toHaveClass('border-2', 'border-atlvs-green-500', 'text-atlvs-green-500')
    })
  })

  describe('Status Variants', () => {
    it('renders success variant correctly', () => {
      render(<Badge variant="success">Success</Badge>)
      const badge = screen.getByText('Success')
      expect(badge).toHaveClass('bg-success-light0', 'text-white')
    })

    it('renders warning variant correctly', () => {
      render(<Badge variant="warning">Warning</Badge>)
      const badge = screen.getByText('Warning')
      expect(badge).toHaveClass('bg-warning-light0', 'text-black')
    })

    it('renders error variant correctly', () => {
      render(<Badge variant="error">Error</Badge>)
      const badge = screen.getByText('Error')
      expect(badge).toHaveClass('bg-destructive/100', 'text-white')
    })

    it('renders info variant correctly', () => {
      render(<Badge variant="info">Info</Badge>)
      const badge = screen.getByText('Info')
      expect(badge).toHaveClass('bg-info-light0', 'text-white')
    })
  })

  describe('Styling', () => {
    it('has correct base classes', () => {
      render(<Badge data-testid="badge">Badge</Badge>)
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass(
        'inline-flex',
        'items-center',
        'rounded-none',
        'px-3',
        'py-1',
        'font-share-tech',
        'text-caption',
        'font-medium',
        'transition-colors'
      )
    })

    it('maintains base classes with custom className', () => {
      render(<Badge className="extra-class" data-testid="badge">Badge</Badge>)
      const badge = screen.getByTestId('badge')
      expect(badge).toHaveClass('inline-flex', 'extra-class')
    })
  })

  describe('HTML Attributes', () => {
    it('supports data attributes', () => {
      render(<Badge data-testid="test-badge" data-value="123">Badge</Badge>)
      const badge = screen.getByTestId('test-badge')
      expect(badge).toHaveAttribute('data-value', '123')
    })

    it('supports aria attributes', () => {
      render(<Badge aria-label="Status badge">Badge</Badge>)
      const badge = screen.getByLabelText('Status badge')
      expect(badge).toBeInTheDocument()
    })

    it('supports onClick handler', () => {
      const handleClick = jest.fn()
      render(<Badge onClick={handleClick}>Clickable</Badge>)
      const badge = screen.getByText('Clickable')
      badge.click()
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('supports id attribute', () => {
      render(<Badge id="unique-badge">Badge</Badge>)
      const badge = screen.getByText('Badge')
      expect(badge).toHaveAttribute('id', 'unique-badge')
    })
  })

  describe('Content Types', () => {
    it('renders text content', () => {
      render(<Badge>Text Badge</Badge>)
      expect(screen.getByText('Text Badge')).toBeInTheDocument()
    })

    it('renders numeric content', () => {
      render(<Badge>42</Badge>)
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('renders with icon and text', () => {
      render(
        <Badge>
          <span>★</span>
          <span>Featured</span>
        </Badge>
      )
      expect(screen.getByText('★')).toBeInTheDocument()
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })
  })
})
