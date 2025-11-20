import { ReactNode, useState } from 'react';
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, SectionHeader, BodyTextSmall as _BodyTextSmall, BodyText } from "@/components/atoms/Typography";
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Alert } from '@/components/molecules/Alert';
import { Check, X } from 'lucide-react';

export interface SettingsSection {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

export interface SettingsPageTemplateProps {
  title: string;
  description?: string;
  sections: SettingsSection[];
  defaultSection?: string;
  onSave?: (sectionId: string) => void | Promise<void>;
  isSaving?: boolean;
  successMessage?: string;
  errorMessage?: string;
  showSaveButton?: boolean;
}

/**
 * SettingsPageTemplate - GHXSTSHIP Standardized
 * 
 * Reusable template for settings pages with sidebar navigation.
 * Provides consistent layout for account, privacy, notification, and other settings.
 * 
 * Features:
 * - Sidebar navigation for settings sections
 * - Tab-based content switching
 * - Form sections with save buttons
 * - Success/error messaging
 * - Mobile-responsive (stacked on mobile)
 * - Keyboard navigation support
 * 
 * @example
 * <SettingsPageTemplate
 *   title="Account Settings"
 *   sections={[
 *     { id: 'profile', label: 'Profile', content: <ProfileSettings /> },
 *     { id: 'security', label: 'Security', content: <SecuritySettings /> },
 *     { id: 'notifications', label: 'Notifications', content: <NotificationSettings /> }
 *   ]}
 *   onSave={handleSave}
 * />
 */
export function SettingsPageTemplate({
  title,
  description,
  sections,
  defaultSection,
  onSave,
  isSaving = false,
  successMessage,
  errorMessage,
  showSaveButton = true,
}: SettingsPageTemplateProps) {
  const [activeSection, setActiveSection] = useState(
    defaultSection || sections[0]?.id || ''
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const currentSection = sections.find(s => s.id === activeSection);

  const handleSectionChange = (sectionId: string) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) return;
    }
    setActiveSection(sectionId);
    setHasUnsavedChanges(false);
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(activeSection);
      setHasUnsavedChanges(false);
    }
  };

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

          {/* Success/Error Messages */}
          {successMessage && (
            <Alert variant="success" className="mb-6">
              <Check className="w-5 h-5 me-2" />
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert variant="error" className="mb-6">
              <X className="w-5 h-5 me-2" />
              {errorMessage}
            </Alert>
          )}

          {/* Settings Layout */}
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar Navigation */}
            <aside className="space-y-2">
              <Card className="p-2">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${ activeSection === section.id ? 'bg-ghxst-primary text-white' : 'text-ghxst-text hover:bg-ghxst-background' }`}
                    >
                      {section.icon && (
                        <span className="flex-shrink-0">{section.icon}</span>
                      )}
                      <span >{section.label}</span>
                    </button>
                  ))}
                </nav>
              </Card>

              {/* Unsaved Changes Indicator */}
              {hasUnsavedChanges && (
                <Card className="p-4 border-2 border-warning bg-warning-light">
                  <BodyText className="text-warning-foreground">
                    You have unsaved changes
                  </BodyText>
                </Card>
              )}
            </aside>

            {/* Main Content */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  {/* Section Header */}
                  <div className="mb-6">
                    <SectionHeader className="mb-2">
                      {currentSection?.label}
                    </SectionHeader>
                  </div>

                  {/* Section Content */}
                  <div
                    onChange={() => setHasUnsavedChanges(true)}
                    onInput={() => setHasUnsavedChanges(true)}
                  >
                    {currentSection?.content}
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              {showSaveButton && onSave && (
                <div className="flex items-center justify-end gap-4">
                  {hasUnsavedChanges && (
                    <BodyText className="text-ghxst-text-secondary">
                      Unsaved changes
                    </BodyText>
                  )}
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving || !hasUnsavedChanges}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
