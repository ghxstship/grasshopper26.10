import * as React from "react";
import { cn } from "@/lib/utils";
import { HeroTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { SearchBar } from "@/components/atoms/SearchBar";
import { CategoryTab } from "@/components/atoms/CategoryTab";
import { Button } from "@/components/atoms/Button";
import { Music, ShoppingBag, MapPin, Compass, Calendar } from "lucide-react";

interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");

  const categories = [
    { id: "all", label: "All", icon: null },
    { id: "events", label: "Events", icon: <Calendar className="w-4 h-4" /> },
    { id: "music", label: "Music", icon: <Music className="w-4 h-4" /> },
    { id: "brands", label: "Brands", icon: <ShoppingBag className="w-4 h-4" /> },
    { id: "destinations", label: "Destinations", icon: <MapPin className="w-4 h-4" /> },
    { id: "adventures", label: "Adventures", icon: <Compass className="w-4 h-4" /> },
  ];

  return (
    <section className={cn("relative min-h-[80vh] flex items-center justify-center bg-ghxst-white", className)}>
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          {/* Hero Title */}
          <HeroTitle className="uppercase text-ghxst-primary">
            Discover<br />
            Everything<br />
            Live
          </HeroTitle>

          {/* Subtitle */}
          <BodyText className="text-ghxst-text-secondary max-w-2xl mx-auto">
            Community First Experiences<br />
            Experience First Communities
          </BodyText>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <SearchBar />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <CategoryTab
                key={category.id}
                active={activeCategory === category.id}
                icon={category.icon}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </CategoryTab>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="primary" size="lg">
              Start Exploring
            </Button>
            <Button variant="secondary" size="lg">
              Join Now
            </Button>
          </div>

          {/* Stats */}
          <Metadata className="text-grey-600 pt-8">
            5,000+ Members • 200+ Monthly Events • 500+ Artists • 160+ Brands
          </Metadata>
        </div>
      </div>
    </section>
  );
};

HeroSection.displayName = "HeroSection";
