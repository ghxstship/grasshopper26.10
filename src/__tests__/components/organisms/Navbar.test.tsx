import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navbar } from '@/components/organisms/Navbar';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('Navbar', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg',
  };

  const mockBreadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'Details' },
  ];

  describe('Rendering', () => {
    it('should render navbar header', () => {
      const { container } = render(<Navbar />);
      
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(<Navbar className="custom-navbar" />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('custom-navbar');
    });

    it('should apply sticky positioning', () => {
      const { container } = render(<Navbar />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('sticky', 'top-0', 'z-40');
    });
  });

  describe('Logo', () => {
    it('should render logo when provided', () => {
      render(<Navbar logo={<span data-testid="logo">Logo</span>} />);
      
      expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    it('should not render logo when not provided', () => {
      render(<Navbar />);
      
      expect(screen.queryByTestId('logo')).not.toBeInTheDocument();
    });

    it('should wrap logo in Link component', () => {
      const { container } = render(<Navbar logo={<span>Logo</span>} />);
      
      const link = container.querySelector('a[href="/"]');
      expect(link).toBeInTheDocument();
    });
  });

  describe('Menu Button', () => {
    it('should render menu button when onMenuClick is provided', () => {
      const onMenuClick = jest.fn();
      const { container } = render(<Navbar onMenuClick={onMenuClick} />);
      
      const menuIcon = container.querySelector('svg.lucide-menu');
      expect(menuIcon).toBeInTheDocument();
    });

    it('should not render menu button when onMenuClick is not provided', () => {
      const { container } = render(<Navbar />);
      
      const menuIcon = container.querySelector('svg.lucide-menu');
      expect(menuIcon).not.toBeInTheDocument();
    });

    it('should call onMenuClick when menu button is clicked', () => {
      const onMenuClick = jest.fn();
      const { container } = render(<Navbar onMenuClick={onMenuClick} />);
      
      const menuButton = container.querySelector('button');
      fireEvent.click(menuButton!);
      
      expect(onMenuClick).toHaveBeenCalledTimes(1);
    });

    it('should hide menu button on large screens', () => {
      const onMenuClick = jest.fn();
      const { container } = render(<Navbar onMenuClick={onMenuClick} />);
      
      const menuButton = container.querySelector('button');
      expect(menuButton).toHaveClass('lg:hidden');
    });
  });

  describe('Breadcrumbs', () => {
    it('should render breadcrumbs when provided', () => {
      render(<Navbar breadcrumbs={mockBreadcrumbs} />);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Events')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('should not render breadcrumbs when not provided', () => {
      render(<Navbar />);
      
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('should not render breadcrumbs when empty array', () => {
      render(<Navbar breadcrumbs={[]} />);
      
      const { container } = render(<Navbar breadcrumbs={[]} />);
      const breadcrumbContainer = container.querySelector('.lg\\:flex.flex-1');
      expect(breadcrumbContainer).not.toBeInTheDocument();
    });

    it('should hide breadcrumbs on small screens', () => {
      const { container } = render(<Navbar breadcrumbs={mockBreadcrumbs} />);
      
      const breadcrumbContainer = container.querySelector('.hidden.lg\\:flex');
      expect(breadcrumbContainer).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should render custom actions when provided', () => {
      const actions = <button data-testid="custom-action">Action</button>;
      render(<Navbar actions={actions} />);
      
      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    });

    it('should not render actions when not provided', () => {
      render(<Navbar />);
      
      expect(screen.queryByTestId('custom-action')).not.toBeInTheDocument();
    });
  });

  describe('Search', () => {
    it('should render search button when onSearchClick is provided', () => {
      const onSearchClick = jest.fn();
      const { container } = render(<Navbar onSearchClick={onSearchClick} />);
      
      const searchIcon = container.querySelector('svg.lucide-search');
      expect(searchIcon).toBeInTheDocument();
    });

    it('should not render search button when onSearchClick is not provided', () => {
      const { container } = render(<Navbar />);
      
      const searchIcon = container.querySelector('svg.lucide-search');
      expect(searchIcon).not.toBeInTheDocument();
    });

    it('should call onSearchClick when search button is clicked', () => {
      const onSearchClick = jest.fn();
      const { container } = render(<Navbar onSearchClick={onSearchClick} />);
      
      const searchButton = container.querySelector('svg.lucide-search')?.parentElement;
      fireEvent.click(searchButton!);
      
      expect(onSearchClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Notifications', () => {
    it('should render notification bell when notifications > 0', () => {
      const { container } = render(<Navbar notifications={5} />);
      
      const bellIcon = container.querySelector('svg.lucide-bell');
      expect(bellIcon).toBeInTheDocument();
    });

    it('should not render notification bell when notifications = 0', () => {
      const { container } = render(<Navbar notifications={0} />);
      
      const bellIcon = container.querySelector('svg.lucide-bell');
      expect(bellIcon).not.toBeInTheDocument();
    });

    it('should display notification count', () => {
      render(<Navbar notifications={5} />);
      
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should display "9+" for notifications > 9', () => {
      render(<Navbar notifications={15} />);
      
      expect(screen.getByText('9+')).toBeInTheDocument();
    });

    it('should display exact count for notifications <= 9', () => {
      render(<Navbar notifications={9} />);
      
      expect(screen.getByText('9')).toBeInTheDocument();
    });
  });

  describe('User Menu', () => {
    it('should render user menu when user is provided', () => {
      render(<Navbar user={mockUser} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should not render user menu when user is not provided', () => {
      render(<Navbar />);
      
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('should display user email when provided', () => {
      render(<Navbar user={mockUser} />);
      
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should not display email when not provided', () => {
      const userWithoutEmail = { name: 'John Doe' };
      render(<Navbar user={userWithoutEmail} />);
      
      expect(screen.queryByText('@')).not.toBeInTheDocument();
    });

    it('should render user avatar', () => {
      const { container } = render(<Navbar user={mockUser} />);
      
      const avatar = container.querySelector('img');
      expect(avatar).toBeInTheDocument();
    });

    it('should hide user details on small screens', () => {
      const { container } = render(<Navbar user={mockUser} />);
      
      const userDetails = container.querySelector('.hidden.lg\\:block');
      expect(userDetails).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant styles', () => {
      const { container } = render(<Navbar variant="default" />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-white', 'border-grey-200');
    });

    it('should apply gvteway variant styles', () => {
      const { container } = render(<Navbar variant="gvteway" />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-white', 'border-gvteway-red-200');
    });

    it('should apply compvss variant styles', () => {
      const { container } = render(<Navbar variant="compvss" />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-white', 'border-compvss-cyan-200');
    });

    it('should apply atlvs variant styles', () => {
      const { container } = render(<Navbar variant="atlvs" />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-white', 'border-atlvs-green-200');
    });
  });

  describe('Layout', () => {
    it('should have fixed height', () => {
      const { container } = render(<Navbar />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('h-16');
    });

    it('should have proper spacing', () => {
      const { container } = render(<Navbar />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('gap-4', 'px-4', 'lg:px-6');
    });

    it('should use flexbox layout', () => {
      const { container } = render(<Navbar />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('flex', 'items-center');
    });
  });

  describe('Integration', () => {
    it('should render all elements together', () => {
      const onMenuClick = jest.fn();
      const onSearchClick = jest.fn();

      render(
        <Navbar
          logo={<span data-testid="logo">Logo</span>}
          breadcrumbs={mockBreadcrumbs}
          user={mockUser}
          notifications={5}
          onMenuClick={onMenuClick}
          onSearchClick={onSearchClick}
          variant="gvteway"
        />
      );

      expect(screen.getByTestId('logo')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should handle all interactions', () => {
      const onMenuClick = jest.fn();
      const onSearchClick = jest.fn();

      const { container } = render(
        <Navbar
          onMenuClick={onMenuClick}
          onSearchClick={onSearchClick}
        />
      );

      const menuButton = container.querySelector('svg.lucide-menu')?.parentElement;
      const searchButton = container.querySelector('svg.lucide-search')?.parentElement;

      fireEvent.click(menuButton!);
      fireEvent.click(searchButton!);

      expect(onMenuClick).toHaveBeenCalledTimes(1);
      expect(onSearchClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional props gracefully', () => {
      const { container } = render(<Navbar />);
      
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should handle user without avatar', () => {
      const userWithoutAvatar = { name: 'John Doe', email: 'john@example.com' };
      render(<Navbar user={userWithoutAvatar} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should handle very long user names', () => {
      const userWithLongName = {
        name: 'A'.repeat(100),
        email: 'test@example.com',
      };
      
      render(<Navbar user={userWithLongName} />);
      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });

    it('should handle large notification counts', () => {
      render(<Navbar notifications={999} />);
      
      expect(screen.getByText('9+')).toBeInTheDocument();
    });
  });
});
