import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { SearchBar } from "@/components/atoms/SearchBar";
import { Menu, X, Search } from "lucide-react";
import Link from "next/link";

export const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const mainNav = [
    { label: "Events", href: "/gvteway/events" },
    { label: "Music", href: "/gvteway/music" },
    { label: "Brands", href: "/gvteway/brands" },
    { label: "Destinations", href: "/gvteway/destinations" },
    { label: "Adventures", href: "/gvteway/adventures" },
    { label: "Community", href: "/gvteway/social" },
    { label: "Membership", href: "/gvteway/memberships" },
  ];

  const industryNav = [
    { label: "ATLVS", subtitle: "For Experience Creators", href: "/atlvs" },
    { label: "COMPVSS", subtitle: "For Experience Collaborators", href: "/compvss" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-ghxst-white/95 backdrop-blur-md border-b-2 border-ghxst-black">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/home" className="font-anton text-h2 hover:text-ghxst-accent transition-colors tracking-tight">
            GVTEWAY
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-bebas text-h5 hover:text-ghxst-accent transition-colors uppercase tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-ghxst-surface rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Button variant="secondary" size="sm">
              Sign In
            </Button>
            <Button variant="primary" size="sm">
              Join Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search Bar (Desktop) */}
        {searchOpen && (
          <div className="hidden lg:block py-4 border-t border-gray-200">
            <SearchBar showLocationSelector={false} />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
            {/* Search */}
            <SearchBar showLocationSelector={false} />

            {/* Main Nav */}
            <div className="space-y-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block font-bebas text-h4 hover:text-gray-700 transition-colors uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Industry Nav */}
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <p className="font-share-tech-mono text-caption text-gray-500 uppercase">
                For the Industry
              </p>
              {industryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="font-bebas text-h5">{item.label}</div>
                  <div className="font-share-tech-mono text-body-sm text-gray-600">
                    {item.subtitle}
                  </div>
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-6 border-t border-gray-200">
              <Button variant="secondary" size="md" className="w-full">
                Sign In
              </Button>
              <Button variant="primary" size="md" className="w-full">
                Join Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

Navigation.displayName = "Navigation";
