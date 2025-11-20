'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Home, Calendar, Ticket, Wallet, ShoppingBag, Users, MapPin, Star, Heart, Settings, Bell, Search } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

interface GvtewayLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function GvtewayLayout({ children, showNav = true }: GvtewayLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {showNav && <GvtewayNav />}
      <main>{children}</main>
    </div>
  );
}

function GvtewayNav() {
  const navItems = [
    { href: '/gvteway', icon: Home, label: 'Home' },
    { href: '/gvteway/events', icon: Calendar, label: 'Events' },
    { href: '/gvteway/tickets', icon: Ticket, label: 'Tickets' },
    { href: '/gvteway/wallet', icon: Wallet, label: 'Wallet' },
    { href: '/gvteway/marketplace', icon: ShoppingBag, label: 'Shop' },
    { href: '/gvteway/social', icon: Users, label: 'Social' },
    { href: '/gvteway/adventures', icon: MapPin, label: 'Adventures' },
    { href: '/gvteway/memberships', icon: Star, label: 'Memberships' },
  ];

  return (
    <nav className="fixed top-0 start-0 end-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/gvteway" className="flex items-center space-x-2">
            <span className="gvteway-text-gradient">GVTEWAY</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" size="sm" className="text-grey-300 hover:text-white">
                  <item.icon className="w-4 h-4 me-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-grey-300 hover:text-white">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-grey-300 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-grey-300 hover:text-white">
              <Heart className="w-5 h-5" />
            </Button>
            <Link href="/gvteway/settings">
              <Button variant="ghost" size="icon" className="text-grey-300 hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/gvteway/auth/login">
              <Button variant="gvteway" size="sm" rounded="full">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
