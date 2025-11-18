import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, SectionHeader, CardTitle, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}

export interface DashboardPageTemplateProps {
  title: string;
  description?: string;
  stats?: StatCardProps[];
  sections: Array<{
    title: string;
    action?: {
      label: string;
      href: string;
    };
    content: React.ReactNode;
  }>;
}

export function DashboardPageTemplate({
  title,
  description,
  stats,
  sections,
}: DashboardPageTemplateProps) {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="mb-8">
            <PageTitle className="mb-4 uppercase text-ghxst-primary">{title}</PageTitle>
            {description && (
              <BodyText className="text-ghxst-text-secondary">{description}</BodyText>
            )}
          </div>

          {/* Stats Grid */}
          {stats && stats.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, i) => (
                <StatCard key={i} {...stat} />
              ))}
            </div>
          )}

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-6">
                  <SectionHeader className="uppercase text-ghxst-primary">
                    {section.title}
                  </SectionHeader>
                  {section.action && (
                    <Link href={section.action.href}>
                      <Button variant="secondary" size="sm">
                        {section.action.label}
                      </Button>
                    </Link>
                  )}
                </div>
                {section.content}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatCard({ icon, title, value, href }: StatCardProps) {
  const content = (
    <div className="card p-6 hover:border-ghxst-primary transition-colors group">
      <div className="text-ghxst-primary group-hover:text-ghxst-black transition-colors mb-4">
        {icon}
      </div>
      <div className="text-h2 font-anton text-ghxst-primary mb-2">{value}</div>
      <CardTitle className="text-ghxst-text-secondary">{title}</CardTitle>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
