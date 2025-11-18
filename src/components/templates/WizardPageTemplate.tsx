import { ReactNode, useState } from 'react';
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, SectionHeader, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  content: ReactNode;
  validation?: () => boolean | Promise<boolean>;
  optional?: boolean;
}

export interface WizardPageTemplateProps {
  title: string;
  description?: string;
  steps: WizardStep[];
  onComplete: () => void | Promise<void>;
  onSkip?: (stepId: string) => void;
  isProcessing?: boolean;
  showStepNumbers?: boolean;
  allowSkipOptional?: boolean;
}

/**
 * WizardPageTemplate - GHXSTSHIP Standardized
 * 
 * Reusable template for multi-step guided workflows and onboarding.
 * Provides step-by-step navigation with progress tracking and validation.
 * 
 * Features:
 * - Step-by-step navigation with visual progress
 * - Step validation before proceeding
 * - Optional steps that can be skipped
 * - Back/Next navigation
 * - Summary/review step support
 * - Completion confirmation
 * - Mobile-responsive layout
 * 
 * @example
 * <WizardPageTemplate
 *   title="Welcome to GVTEWAY"
 *   description="Let's get you set up"
 *   steps={[
 *     { id: 'interests', title: 'Your Interests', content: <InterestsStep /> },
 *     { id: 'location', title: 'Location', content: <LocationStep />, optional: true },
 *     { id: 'preferences', title: 'Preferences', content: <PreferencesStep /> }
 *   ]}
 *   onComplete={handleComplete}
 *   allowSkipOptional
 * />
 */
export function WizardPageTemplate({
  title,
  description,
  steps,
  onComplete,
  onSkip,
  isProcessing = false,
  showStepNumbers = true,
  allowSkipOptional = true,
}: WizardPageTemplateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;
  const currentStepData = steps[currentStep];
  const isOptionalStep = currentStepData?.optional && allowSkipOptional;

  const handleNext = async () => {
    if (currentStepData.validation) {
      const isValid = await currentStepData.validation();
      if (!isValid) return;
    }

    setCompletedSteps(prev => new Set(prev).add(currentStep));
    
    if (isLastStep) {
      await onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip(currentStepData.id);
    }
    setCurrentStep(prev => prev + 1);
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />

      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <PageTitle className="mb-4 uppercase text-ghxst-primary">{title}</PageTitle>
            {description && (
              <BodyText className="text-ghxst-text-secondary">{description}</BodyText>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <Metadata className="text-ghxst-text-secondary">
                Step {currentStep + 1} of {totalSteps}
              </Metadata>
              <Metadata className="text-ghxst-text-secondary">
                {Math.round(progressPercentage)}% Complete
              </Metadata>
            </div>
            <div className="h-2 bg-ghxst-border rounded-full overflow-hidden">
              <div
                className="h-full bg-ghxst-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      index === currentStep
                        ? 'bg-ghxst-primary border-ghxst-primary text-white scale-110'
                        : completedSteps.has(index)
                        ? 'bg-success-light0 border-success text-white'
                        : 'bg-white border-ghxst-border text-ghxst-text-secondary'
                    }`}
                  >
                    {completedSteps.has(index) ? (
                      <Check className="w-6 h-6" />
                    ) : step.icon ? (
                      step.icon
                    ) : showStepNumbers ? (
                      <span className="font-bebas text-h5">{index + 1}</span>
                    ) : null}
                  </div>
                  <Metadata
                    className={`mt-2 text-center text-caption ${
                      index === currentStep
                        ? 'text-ghxst-primary'
                        : completedSteps.has(index)
                        ? 'text-success'
                        : 'text-ghxst-text-secondary'
                    }`}
                  >
                    {step.title}
                  </Metadata>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                      completedSteps.has(index) || index < currentStep
                        ? 'bg-success-light0'
                        : 'bg-ghxst-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="mb-6">
                <SectionHeader className="mb-2 font-bebas text-h4">
                  {currentStepData.title}
                  {isOptionalStep && (
                    <span className="ml-2 text-body-sm text-ghxst-text-secondary">
                      (Optional)
                    </span>
                  )}
                </SectionHeader>
                {currentStepData.description && (
                  <BodyText className="text-ghxst-text-secondary">
                    {currentStepData.description}
                  </BodyText>
                )}
              </div>
              {currentStepData.content}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={isFirstStep || isProcessing}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {isOptionalStep && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={isProcessing}
                >
                  Skip
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={isProcessing}
              >
                {isProcessing
                  ? 'Processing...'
                  : isLastStep
                  ? 'Complete'
                  : 'Next'}
                {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
