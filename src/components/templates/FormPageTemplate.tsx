import { ReactNode, useState } from 'react';
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, SectionHeader, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Alert } from '@/components/molecules/Alert';
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react';

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  validation?: () => boolean | Promise<boolean>;
}

export interface FormPageTemplateProps {
  title: string;
  description?: string;
  steps?: FormStep[];
  singleStep?: ReactNode;
  onSubmit: () => void | Promise<void>;
  onSaveDraft?: () => void | Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
  successMessage?: string;
  errorMessage?: string;
  showProgressBar?: boolean;
  allowDraft?: boolean;
}

/**
 * FormPageTemplate - GHXSTSHIP Standardized
 * 
 * Reusable template for form pages with multi-step wizard support.
 * Handles single-step forms and multi-step wizards with progress tracking.
 * 
 * Features:
 * - Multi-step wizard with progress indicator
 * - Form validation per step
 * - Save draft functionality
 * - Success/error messaging
 * - Mobile-responsive layout
 * - Keyboard navigation support
 * 
 * @example
 * // Single-step form
 * <FormPageTemplate
 *   title="Create Project"
 *   singleStep={<ProjectForm />}
 *   onSubmit={handleSubmit}
 * />
 * 
 * @example
 * // Multi-step wizard
 * <FormPageTemplate
 *   title="New Advancing Request"
 *   steps={[
 *     { id: 'details', title: 'Details', content: <DetailsForm /> },
 *     { id: 'items', title: 'Items', content: <ItemsForm /> },
 *     { id: 'review', title: 'Review', content: <ReviewStep /> }
 *   ]}
 *   onSubmit={handleSubmit}
 *   allowDraft
 * />
 */
export function FormPageTemplate({
  title,
  description,
  steps,
  singleStep,
  onSubmit,
  onSaveDraft,
  submitLabel = 'Submit',
  isSubmitting = false,
  successMessage,
  errorMessage,
  showProgressBar = true,
  allowDraft = false,
}: FormPageTemplateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const isMultiStep = steps && steps.length > 0;
  const totalSteps = steps?.length || 1;
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = async () => {
    if (!isMultiStep || !steps) return;

    const currentStepData = steps[currentStep];
    if (currentStepData.validation) {
      const isValid = await currentStepData.validation();
      if (!isValid) return;
    }

    setCompletedSteps(prev => new Set(prev).add(currentStep));
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleStepClick = (index: number) => {
    if (completedSteps.has(index) || index < currentStep) {
      setCurrentStep(index);
    }
  };

  const handleSubmit = async () => {
    if (isMultiStep && steps) {
      const currentStepData = steps[currentStep];
      if (currentStepData.validation) {
        const isValid = await currentStepData.validation();
        if (!isValid) return;
      }
    }
    await onSubmit();
  };

  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />

      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-8">
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
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert variant="error" className="mb-6">
              {errorMessage}
            </Alert>
          )}

          {/* Multi-Step Progress Bar */}
          {isMultiStep && showProgressBar && steps && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex-1 flex items-center">
                    <button
                      onClick={() => handleStepClick(index)}
                      disabled={!completedSteps.has(index) && index > currentStep}
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${ index === currentStep ? 'bg-ghxst-primary border-ghxst-primary text-white' : completedSteps.has(index) ? 'bg-success-light0 border-success text-white' : 'bg-white border-ghxst-border text-ghxst-text-secondary' } ${ completedSteps.has(index) || index < currentStep ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-50' }`}
                    >
                      {completedSteps.has(index) ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span >{index + 1}</span>
                      )}
                    </button>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded-full transition-all ${ completedSteps.has(index) || index < currentStep ? 'bg-success-light0' : 'bg-ghxst-border' }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div
                    key={`label-${step.id}`}
                    className={`flex-1 text-center ${index < steps.length - 1 ? 'mr-2' : ''}`}
                  >
                    <Metadata
                      className={`${ index === currentStep ? 'text-ghxst-primary' : completedSteps.has(index) ? 'text-success' : 'text-ghxst-text-secondary' }`}
                    >
                      {step.title}
                    </Metadata>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Content */}
          <Card className="mb-6">
            {isMultiStep && steps && (
              <CardHeader>
                <CardTitle >
                  {steps[currentStep].title}
                </CardTitle>
                {steps[currentStep].description && (
                  <BodyText className="text-ghxst-text-secondary mt-2">
                    {steps[currentStep].description}
                  </BodyText>
                )}
              </CardHeader>
            )}
            <CardContent className="space-y-6">
              {isMultiStep && steps ? steps[currentStep].content : singleStep}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isMultiStep && !isFirstStep && (
                <Button
                  variant="secondary"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              {allowDraft && onSaveDraft && (
                <Button
                  variant="ghost"
                  onClick={onSaveDraft}
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {isMultiStep && !isLastStep ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : submitLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
