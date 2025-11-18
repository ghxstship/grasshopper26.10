import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { HeroTitle, SectionHeader, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import Image from 'next/image';

export interface DetailPageTemplateProps {
  hero?: {
    image?: string;
    title: string;
    subtitle?: string;
    badges?: Array<{
      label: string;
      variant?: 'default' | 'warning' | 'success' | 'error';
    }>;
    actions?: Array<{
      label: string;
      variant?: 'primary' | 'secondary';
      icon?: React.ReactNode;
      onClick?: () => void;
    }>;
  };
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  relatedContent?: {
    title: string;
    items: React.ReactNode;
  };
}

export function DetailPageTemplate({
  hero,
  sidebar,
  children,
  relatedContent,
}: DetailPageTemplateProps) {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />

      {/* Hero Image */}
      {hero?.image && (
        <section className="relative h-[400px]">
          <Image
            src={hero.image}
            alt={hero.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ghxst-black/80 to-transparent" />
        </section>
      )}

      {/* Main Content */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className={sidebar ? 'grid lg:grid-cols-[2fr_1fr] gap-12' : ''}>
            {/* Main Column */}
            <div className="space-y-8">
              {/* Hero Header */}
              {hero && (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {hero.badges && hero.badges.length > 0 && (
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          {hero.badges.map((badge, i) => (
                            <Badge key={i} variant={badge.variant || 'default'}>
                              {badge.label}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <HeroTitle className="mb-3 text-ghxst-primary">{hero.title}</HeroTitle>
                      {hero.subtitle && (
                        <BodyText className="text-ghxst-text-secondary">{hero.subtitle}</BodyText>
                      )}
                    </div>
                  </div>

                  {hero.actions && hero.actions.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                      {hero.actions.map((action, i) => (
                        <Button
                          key={i}
                          variant={action.variant || 'primary'}
                          size="md"
                          onClick={action.onClick}
                        >
                          {action.icon}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Main Content */}
              {children}
            </div>

            {/* Sidebar */}
            {sidebar && (
              <div className="space-y-6">
                <div className="sticky top-24">{sidebar}</div>
              </div>
            )}
          </div>

          {/* Related Content */}
          {relatedContent && (
            <div className="mt-16">
              <SectionHeader className="mb-6 uppercase text-ghxst-primary">
                {relatedContent.title}
              </SectionHeader>
              {relatedContent.items}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
