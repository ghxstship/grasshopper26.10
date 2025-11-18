import { ReactNode } from 'react';
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { HeroTitle, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Home, Search, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export interface ErrorPageTemplateProps {
  errorCode?: string | number;
  title: string;
  description: string;
  icon?: ReactNode;
  actions?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    icon?: ReactNode;
  }>;
  showDefaultActions?: boolean;
}

/**
 * ErrorPageTemplate - GHXSTSHIP Standardized
 * 
 * Reusable template for error pages (404, 500, etc.).
 * Provides consistent error messaging with helpful actions.
 * 
 * Features:
 * - Error code display
 * - Custom error icon
 * - Helpful error message
 * - Action buttons (go home, search, contact support)
 * - Mobile-responsive layout
 * - Maintains navigation consistency
 * 
 * @example
 * // 404 Page
 * <ErrorPageTemplate
 *   errorCode="404"
 *   title="Page Not Found"
 *   description="The page you're looking for doesn't exist or has been moved."
 *   icon={<FileQuestion className="w-24 h-24" />}
 * />
 * 
 * @example
 * // 500 Page
 * <ErrorPageTemplate
 *   errorCode="500"
 *   title="Server Error"
 *   description="Something went wrong on our end. We're working to fix it."
 *   showDefaultActions={false}
 *   actions={[
 *     { label: 'Try Again', onClick: () => window.location.reload() },
 *     { label: 'Go Home', href: '/' }
 *   ]}
 * />
 */
export function ErrorPageTemplate({
  errorCode,
  title,
  description,
  icon,
  actions,
  showDefaultActions = true,
}: ErrorPageTemplateProps) {
  const defaultActions = [
    {
      label: 'Go Home',
      href: '/',
      variant: 'primary' as const,
      icon: <Home className="w-4 h-4 mr-2" />,
    },
    {
      label: 'Go Back',
      onClick: () => window.history.back(),
      variant: 'secondary' as const,
      icon: <ArrowLeft className="w-4 h-4 mr-2" />,
    },
    {
      label: 'Search',
      href: '/search',
      variant: 'ghost' as const,
      icon: <Search className="w-4 h-4 mr-2" />,
    },
    {
      label: 'Contact Support',
      href: '/contact',
      variant: 'ghost' as const,
      icon: <Mail className="w-4 h-4 mr-2" />,
    },
  ];

  const displayActions = actions || (showDefaultActions ? defaultActions : []);

  return (
    <div className="min-h-screen bg-ghxst-white flex flex-col">
      <Navigation />

      <section className="flex-1 flex items-center justify-center section-padding">
        <div className="max-w-2xl mx-auto px-8 text-center">
          {/* Error Code */}
          {errorCode && (
            <div className="mb-8">
              <span className="font-anton text-hero text-ghxst-primary opacity-20">
                {errorCode}
              </span>
            </div>
          )}

          {/* Icon */}
          {icon && (
            <div className="flex justify-center mb-8 text-ghxst-text-secondary">
              {icon}
            </div>
          )}

          {/* Title */}
          <HeroTitle className="mb-4 text-ghxst-primary">{title}</HeroTitle>

          {/* Description */}
          <BodyText className="text-ghxst-text-secondary mb-8 max-w-md mx-auto">
            {description}
          </BodyText>

          {/* Actions */}
          {displayActions.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {displayActions.map((action, index) =>
                action.href ? (
                  <Link key={index} href={action.href}>
                    <Button variant={action.variant || 'primary'}>
                      {action.icon}
                      {action.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={index}
                    variant={action.variant || 'primary'}
                    onClick={action.onClick}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
