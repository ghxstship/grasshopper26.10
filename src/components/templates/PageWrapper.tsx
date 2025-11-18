'use client';

import * as React from 'react';
import { LoadingState } from '@/components/molecules/LoadingState';
import { ErrorState } from '@/components/molecules/ErrorState';
import { EmptyState, EmptyStateProps } from '@/components/molecules/EmptyState';

export interface PageMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

export interface PageWrapperProps {
  children: React.ReactNode;
  loading?: boolean;
  error?: Error | null;
  empty?: boolean;
  emptyConfig?: EmptyStateProps;
  metadata?: PageMetadata;
  variant?: 'default' | 'gvteway' | 'compvss' | 'atlvs';
  onRetry?: () => void;
  onGoHome?: () => void;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  showErrorDetails?: boolean;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  loading = false,
  error = null,
  empty = false,
  emptyConfig,
  metadata,
  variant = 'default',
  onRetry,
  onGoHome,
  loadingMessage,
  errorTitle,
  errorMessage,
  showErrorDetails = false,
  className,
}) => {
  // Set page metadata
  React.useEffect(() => {
    if (metadata?.title) {
      document.title = metadata.title;
    }

    if (metadata?.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', metadata.description);
    }

    if (metadata?.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', metadata.keywords.join(', '));
    }

    if (metadata?.ogImage) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', metadata.ogImage);
    }

    if (metadata?.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', metadata.canonical);
    }

    if (metadata?.noindex) {
      let robots = document.querySelector('meta[name="robots"]');
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'noindex, nofollow');
    }
  }, [metadata]);

  // Show loading state
  if (loading) {
    return (
      <LoadingState
        message={loadingMessage}
        variant={variant}
        className={className}
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <ErrorState
        title={errorTitle}
        message={errorMessage}
        error={error}
        variant={variant}
        onRetry={onRetry}
        onGoHome={onGoHome}
        showDetails={showErrorDetails}
        className={className}
      />
    );
  }

  // Show empty state
  if (empty) {
    return (
      <EmptyState
        {...emptyConfig}
        variant={variant}
        className={className}
      />
    );
  }

  // Show content
  return <>{children}</>;
};

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class PageErrorBoundary extends React.Component<
  { children: React.ReactNode; variant?: 'default' | 'gvteway' | 'compvss' | 'atlvs'; onRetry?: () => void },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; variant?: 'default' | 'gvteway' | 'compvss' | 'atlvs'; onRetry?: () => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PageErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title="Something went wrong"
          message="An unexpected error occurred while rendering this page."
          error={this.state.error}
          variant={this.props.variant || 'default'}
          onRetry={this.handleRetry}
          showDetails={true}
        />
      );
    }

    return this.props.children;
  }
}

// Combined wrapper with error boundary
export interface PageContainerProps extends PageWrapperProps {
  withErrorBoundary?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  withErrorBoundary = true,
  variant = 'default',
  onRetry,
  children,
  ...props
}) => {
  const content = (
    <PageWrapper variant={variant} onRetry={onRetry} {...props}>
      {children}
    </PageWrapper>
  );

  if (withErrorBoundary) {
    return (
      <PageErrorBoundary variant={variant} onRetry={onRetry}>
        {content}
      </PageErrorBoundary>
    );
  }

  return content;
};
