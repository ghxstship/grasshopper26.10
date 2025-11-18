import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, SectionHeader, BodyText } from '@/components/atoms/Typography';
import { CategoryTab } from '@/components/atoms/CategoryTab';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';

export interface ListPageTemplateProps {
  title: string;
  description: string;
  categories?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  activeCategory?: string;
  onCategoryChange?: (id: string) => void;
  headerAction?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  children: React.ReactNode;
  emptyState?: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: {
      label: string;
      href: string;
    };
  };
  isEmpty?: boolean;
}

export function ListPageTemplate({
  title,
  description,
  categories,
  activeCategory,
  onCategoryChange,
  headerAction,
  children,
  emptyState,
  isEmpty = false,
}: ListPageTemplateProps) {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <PageTitle className="mb-4 uppercase text-ghxst-primary">{title}</PageTitle>
              <BodyText className="text-ghxst-text-secondary">{description}</BodyText>
            </div>
            {headerAction && (
              <Link href={headerAction.href}>
                <Button variant="primary" size="md">
                  {headerAction.icon}
                  {headerAction.label}
                </Button>
              </Link>
            )}
          </div>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-8">
              {categories.map((category) => (
                <CategoryTab
                  key={category.id}
                  active={activeCategory === category.id}
                  onClick={() => onCategoryChange?.(category.id)}
                  icon={category.icon}
                >
                  {category.label}
                </CategoryTab>
              ))}
            </div>
          )}

          {/* Content or Empty State */}
          {isEmpty && emptyState ? (
            <div className="text-center py-16">
              <div className="text-ghxst-text-secondary mb-4">{emptyState.icon}</div>
              <SectionHeader className="mb-2 text-ghxst-text-secondary">
                {emptyState.title}
              </SectionHeader>
              <BodyText className="text-ghxst-text-secondary mb-6">
                {emptyState.description}
              </BodyText>
              {emptyState.action && (
                <Link href={emptyState.action.href}>
                  <Button variant="primary" size="lg">
                    {emptyState.action.label}
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            children
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
