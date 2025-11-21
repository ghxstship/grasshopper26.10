/**
 * Coming Soon Page Template
 */

import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';

interface ComingSoonPageProps {
  title?: string;
  description?: string;
  apiEndpoint?: string;
  features?: string[];
  backLink?: string;
  backLabel?: string;
}

export default function ComingSoonPage({ 
  title = 'Coming Soon',
  description,
}: ComingSoonPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <H1 className="mb-4">{title}</H1>
        <Body className="text-gray-600">
          {description || 'This feature is under development.'}
        </Body>
      </div>
    </div>
  );
}
