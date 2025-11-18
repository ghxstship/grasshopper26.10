'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { UserCheck, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useUpdateProfile } from '@/lib/hooks/shared/useProfile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

export default function CompvssOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const updateProfileMutation = useUpdateProfile();
  const roles = [
    { id: 'crew', name: 'Production Crew', description: 'Stage crew, riggers, technicians' },
    { id: 'staff', name: 'Event Staff', description: 'Security, ushers, box office' },
    { id: 'media', name: 'Media & Press', description: 'Journalists, photographers' },
    { id: 'vendor', name: 'Vendor', description: 'Suppliers, contractors' },
    { id: 'affiliate', name: 'Affiliate', description: 'Sales partners, referrals' },
    { id: 'other', name: 'Other', description: 'Government, partners, guests' },
  ];

  const steps = [
    { number: 1, title: 'Select Role', description: 'Choose your primary role' },
    { number: 2, title: 'Profile Info', description: 'Complete your profile' },
    { number: 3, title: 'Credentials', description: 'Upload certifications' },
    { number: 4, title: 'Complete', description: 'Start using COMPVSS' },
  ];

  const handleContinue = async () => {
    setError('');

    try {
      await updateProfileMutation.mutateAsync({
        role: selectedRole,
        onboardingStep: currentStep
      });

      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        router.push('/compvss/dashboard');
      }
    } catch {
      setError('Failed to save your selection. Please try again.');
    }
  };

  return (
    <CompvssLayout>
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 -m-6">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative z-10 w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/compvss">
                <h1 className="compvss-text-gradient text-5xl font-anton mb-2 cursor-pointer">
                  COMPVSS
                </h1>
              </Link>
              <p className="text-gray-400 font-oswald">Welcome! Let&apos;s get you set up</p>
            </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bebas text-lg transition-all ${
                      currentStep >= step.number 
                        ? 'bg-compvss-cyan-500 text-black' 
                        : 'bg-gray-800 text-gray-500'
                    }`}>
                      {currentStep > step.number ? <CheckCircle2 className="w-6 h-6" /> : step.number}
                    </div>
                    <p className="text-xs font-oswald text-gray-400 mt-2 text-center">{step.title}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 transition-all ${
                      currentStep > step.number ? 'bg-compvss-cyan-500' : 'bg-gray-800'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-compvss-cyan-500" />
                Select Your Role
              </CardTitle>
              <CardDescription className="text-gray-400">
                Choose the role that best describes your work
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/30 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-error" />
                  <p className="text-sm text-error font-share-tech">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {roles.map((role) => (
                  <Button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    variant={selectedRole === role.id ? 'compvss' : 'outline'}
                    className="h-auto p-4 text-left justify-start"
                  >
                    <div>
                      <h3 className="font-oswald text-white mb-1">{role.name}</h3>
                      <p className="text-sm text-gray-400 font-share-tech">{role.description}</p>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  variant="compvss"
                  size="lg"
                  className="flex-1"
                  disabled={!selectedRole || updateProfileMutation.isPending}
                  onClick={handleContinue}
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Link href="/compvss/dashboard" className="text-sm text-gray-500 hover:text-gray-400 font-share-tech">
              Skip for now →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
    </CompvssLayout>
  );
}
