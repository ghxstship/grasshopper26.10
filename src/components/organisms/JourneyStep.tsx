import * as React from "react";
import { cn } from "@/lib/utils";
import { SectionHeader, BodyText, Metadata, BodyTextSmall, HeroTitle } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Check } from "lucide-react";
import Image from "next/image";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface JourneyStepProps {
  step: number;
  title: string;
  description: string;
  features?: Feature[];
  image?: string;
  imagePosition?: 'left' | 'right';
  ctaText?: string;
  ctaLink?: string;
  stats?: string;
  className?: string;
}

export const JourneyStep: React.FC<JourneyStepProps> = ({
  step,
  title,
  description,
  features = [],
  image,
  imagePosition = 'left',
  ctaText,
  ctaLink,
  stats,
  className,
}) => {
  const isImageLeft = imagePosition === 'left';

  return (
    <section className={cn("section-padding bg-ghxst-white", className)}>
      <div className="max-w-7xl mx-auto px-8">
        <div className={cn(
          "grid lg:grid-cols-2 gap-12 items-center",
          isImageLeft ? "" : "lg:grid-flow-dense"
        )}>
          {/* Image */}
          {image && (
            <div className={cn(
              "relative aspect-[4/3] rounded-lg overflow-hidden bg-grey-100",
              isImageLeft ? "" : "lg:col-start-2"
            )}>
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className={cn(
            "space-y-6",
            isImageLeft ? "" : "lg:col-start-1 lg:row-start-1"
          )}>
            {/* Step Number */}
            <div className="text-grey-200">
              {step.toString().padStart(2, '0')}
            </div>

            {/* Title */}
            <SectionHeader className="uppercase">
              {title}
            </SectionHeader>

            {/* Description */}
            <BodyText className="text-grey-700">
              {description}
            </BodyText>

            {/* Features */}
            {features.length > 0 && (
              <div className="space-y-4 pt-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ghxst-black text-ghxst-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h5 className="mb-1">{feature.title}</h5>
                      <p className="-tech text-grey-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            {stats && (
              <Metadata className="text-grey-600 pt-4">
                {stats}
              </Metadata>
            )}

            {/* CTA */}
            {ctaText && (
              <div className="pt-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => {
                    if (ctaLink) window.location.href = ctaLink;
                  }}
                >
                  {ctaText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

JourneyStep.displayName = "JourneyStep";
