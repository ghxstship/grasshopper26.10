/**
 * Navbar Component - Organism Design System
 * Main navigation with brutalist design
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hero, H5 } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { cn } from '@/lib/utils';

export interface NavbarProps {
  user?: {
    name: string;
    email: string;
  } | null;
  onLogout?: () => void;
  variant?: 'atlvs' | 'compvss' | 'gvteway' | 'default';
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, variant = 'default' }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '/events', label: 'Events' },
    { href: '/adventures', label: 'Adventures' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/memberships', label: 'Memberships' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Hero className="text-4xl">GVTEWAY</Hero>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
              >
                <H5
                  as="span"
                  className={cn(
                    'transition-colors',
                    pathname === link.href
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-600 hover:text-black'
                  )}
                >
                  {link.label}
                </H5>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="font-share-tech text-sm text-gray-600">
                  {user.name}
                </span>
                <Button variant="secondary" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <H5
                  as="span"
                  className={cn(
                    'block',
                    pathname === link.href ? 'text-black' : 'text-gray-600'
                  )}
                >
                  {link.label}
                </H5>
              </Link>
            ))}
            <div className="pt-4 border-t-2 border-gray-200 space-y-3">
              {user ? (
                <>
                  <p className="font-share-tech text-sm text-gray-600">{user.name}</p>
                  <Button variant="secondary" fullWidth onClick={onLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block">
                    <Button variant="ghost" fullWidth>
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="block">
                    <Button variant="primary" fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export { Navbar };
