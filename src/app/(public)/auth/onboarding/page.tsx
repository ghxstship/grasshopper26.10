/**
 * Onboarding Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Hero, H2, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    displayName: '',
    bio: '',
    interests: [] as string[],
  });
  const [loading, setLoading] = React.useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await apiClient.post('/api/auth/onboarding', formData);
      router.push('/(rebuild)/dashboard');
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Hero className="mb-8 text-center">WELCOME</Hero>
        
        <Card>
          <CardHeader>
            <CardTitle>Step {step} of 3</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <H2 className="mb-4">Tell us about yourself</H2>
                <div>
                  <Label htmlFor="displayName">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="flex w-full border-2 border-black bg-white px-4 py-2 font-share-tech text-base"
                  />
                </div>
              </>
            )}
            
            {step === 2 && (
              <>
                <H2 className="mb-4">What are you interested in?</H2>
                <Body className="text-gray-600 mb-4">Select your interests</Body>
                <div className="grid grid-cols-2 gap-4">
                  {['Music', 'Sports', 'Arts', 'Comedy', 'Theater', 'Festivals'].map((interest) => (
                    <Button
                      key={interest}
                      variant={formData.interests.includes(interest) ? 'primary' : 'secondary'}
                      onClick={() => {
                        const newInterests = formData.interests.includes(interest)
                          ? formData.interests.filter((i) => i !== interest)
                          : [...formData.interests, interest];
                        setFormData({ ...formData, interests: newInterests });
                      }}
                      fullWidth
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </>
            )}
            
            {step === 3 && (
              <>
                <H2 className="mb-4">All set!</H2>
                <Body className="text-gray-600">
                  You&apos;re ready to start exploring events and connecting with others.
                </Body>
              </>
            )}
          </CardContent>
          <CardContent className="flex gap-3">
            {step > 1 && (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button fullWidth onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button fullWidth onClick={handleComplete} loading={loading}>
                Complete
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
