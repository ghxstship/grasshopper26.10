'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, Music, Calendar, ArrowRight } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { PageTitle, SectionHeader, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';

const INTERESTS = [
  { id: 'music', label: 'Music', icon: Music },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'destinations', label: 'Destinations', icon: MapPin },
];

const GENRES = [
  'Electronic', 'Hip Hop', 'Rock', 'Pop', 'Jazz', 'Classical',
  'Country', 'R&B', 'Latin', 'Indie', 'Metal', 'Folk'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [location, setLocation] = useState('');

  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleGenre = (genre: string) => {
    setGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleComplete = async () => {
    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: { interests, genres, location },
          onboardingCompleted: true,
        }),
      });
      router.push('/gvteway/dashboard');
    } catch {
      // Handle error
    }
  };

  return (
    <GvtewayLayout>
      <section className="section-padding">
        <div className="max-w-2xl mx-auto px-8">
          <div className="text-center mb-12">
            <PageTitle className="mb-4 uppercase text-ghxst-primary">Welcome to GVTEWAY</PageTitle>
            <BodyText className="text-ghxst-text-secondary">
              Let&apos;s personalize your experience
            </BodyText>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full ${ s <= step ? 'bg-ghxst-primary' : 'bg-ghxst-border' } ${s < 3 ? 'mr-2' : ''}`}
                />
              ))}
            </div>
            <Metadata className="text-ghxst-text-secondary text-center">
              Step {step} of 3
            </Metadata>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <SectionHeader className="uppercase text-ghxst-primary">
                What interests you?
              </SectionHeader>
              <BodyText className="text-ghxst-text-secondary">
                Select all that apply
              </BodyText>

              <div className="grid md:grid-cols-3 gap-4">
                {INTERESTS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleInterest(id)}
                    className={`p-6 border-2 rounded-lg transition-all ${ interests.includes(id) ? 'border-ghxst-primary bg-ghxst-surface' : 'border-ghxst-border hover:border-ghxst-text-secondary' }`}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-3 text-ghxst-primary" />
                    <Metadata className="text-ghxst-text-primary">
                      {label}
                    </Metadata>
                  </button>
                ))}
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setStep(2)}
                disabled={interests.length === 0}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <SectionHeader className="uppercase text-ghxst-primary">
                Favorite Music Genres
              </SectionHeader>
              <BodyText className="text-ghxst-text-secondary">
                Choose your favorite genres
              </BodyText>

              <div className="flex flex-wrap gap-3">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className="inline-block"
                  >
                    <Badge
                      variant={genres.includes(genre) ? 'default' : 'gvteway-outline'}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {genre}
                    </Badge>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(3)}
                  disabled={genres.length === 0}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <SectionHeader className="uppercase text-ghxst-primary">
                Where are you located?
              </SectionHeader>
              <BodyText className="text-ghxst-text-secondary">
                We&apos;ll show you events near you
              </BodyText>

              <div>
                <label htmlFor="location" className="block mb-2">
                  <Metadata className="text-ghxst-text-primary">City or ZIP Code</Metadata>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ghxst-text-secondary" />
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Tampa, FL or 33602"
                    className="w-full pl-12 pr-4 py-3 border-2 border-ghxst-border rounded-lg focus:border-ghxst-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handleComplete}
                  disabled={!location}
                >
                  Complete
                  <User className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </GvtewayLayout>
  );
}
