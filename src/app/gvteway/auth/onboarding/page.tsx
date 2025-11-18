'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Music, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/hooks/gvteway';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { FormField } from '@/components/molecules/FormField';


export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    username: '',
    location: '',
    interests: [] as string[],
  });
  const { data } = useAuth();
  const INTERESTS = (data as any)?.interests || [
    'Music', 'Sports', 'Comedy', 'Theater', 'Festivals', 'Conferences',
    'Food & Drink', 'Art', 'Dance', 'Family', 'Nightlife', 'Wellness'
  ];

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: typeof profile) => {
      const response = await fetch('/api/gvteway/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to complete onboarding');
      return response.json();
    },
    onSuccess: () => {
      router.push('/gvteway/events');
    },
  });

  const handleComplete = () => {
    completeOnboardingMutation.mutate(profile);
  };

  return (
    <GvtewayLayout showNav={false}>
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl font-anton gvteway-text-gradient mb-2">GVTEWAY</h1>
            <p className="text-gray-400 font-oswald">Let&apos;s personalize your experience</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Step {step} of 3</span>
              <span className="text-sm text-gray-400">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gvteway-red-500 to-gvteway-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <User className="w-12 h-12 text-gvteway-red-500 mx-auto mb-3" />
                    <h2 className="text-2xl font-bebas text-white mb-2">Create Your Profile</h2>
                    <p className="text-gray-400">Tell us a bit about yourself</p>
                  </div>

                  <FormField label="Username">
                    <Input
                      placeholder="Choose a unique username"
                      value={profile.username}
                      onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                      variant="gvteway"
                    />
                  </FormField>

                  <FormField label="Location">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input
                        placeholder="City, State"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        className="pl-10"
                        variant="gvteway"
                      />
                    </div>
                  </FormField>

                  <Button
                    variant="gvteway"
                    size="lg"
                    className="w-full"
                    rounded="full"
                    onClick={() => setStep(2)}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Music className="w-12 h-12 text-gvteway-red-500 mx-auto mb-3" />
                    <h2 className="text-2xl font-bebas text-white mb-2">Choose Your Interests</h2>
                    <p className="text-gray-400">Select at least 3 categories you love</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {INTERESTS.map((interest) => (
                      <Button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        variant="ghost"
                        className={`p-4 rounded-xl border-2 transition-all ${
                          profile.interests.includes(interest)
                            ? 'border-gvteway-red-500 bg-gvteway-red-500/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <span className="text-sm font-medium">{interest}</span>
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      rounded="full"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="gvteway"
                      size="lg"
                      className="w-full"
                      rounded="full"
                      onClick={() => setStep(3)}
                      disabled={profile.interests.length < 3}
                    >
                      Continue
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Calendar className="w-12 h-12 text-gvteway-red-500 mx-auto mb-3" />
                    <h2 className="text-2xl font-bebas text-white mb-2">All Set!</h2>
                    <p className="text-gray-400">Review your profile</p>
                  </div>

                  <div className="space-y-4 bg-gray-800/50 rounded-xl p-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Username</p>
                      <p className="text-white font-medium">{profile.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Location</p>
                      <p className="text-white font-medium">{profile.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, idx) => (
                          <Badge key={idx} variant="gvteway">{interest}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      rounded="full"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Link href="/gvteway/events" className="w-full">
                      <Button
                        variant="gvteway"
                        size="lg"
                        className="w-full"
                        rounded="full"
                        onClick={handleComplete}
                      >
                        Start Exploring
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    </GvtewayLayout>
  );
}
