"use client";

/**
 * GDPR/CCPA Compliant Cookie Consent Banner
 * Required for data privacy compliance
 */

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { BodyText, SmallHeader, Caption } from "@/components/atoms/Typography";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const CookieConsent = () => {
  // Initialize visibility based on saved preferences
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("cookie-preferences");
  });
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    savePreferences(allAccepted);
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    savePreferences(necessaryOnly);
    setIsVisible(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie-preferences", JSON.stringify(prefs));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 start-0 end-0 z-[1050] p-4 bg-ghxst-black/95 backdrop-blur-sm"
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-description"
    >
      <Card variant="default" className="max-w-4xl mx-auto p-6">
        <SmallHeader className="mb-4">Cookie Preferences</SmallHeader>

        <BodyText id="cookie-description" className="mb-4">
          We use cookies to enhance your experience, analyze site traffic, and
          personalize content. You can customize your preferences below.
        </BodyText>

        {showDetails && (
          <div className="space-y-4 mb-6">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={preferences.necessary}
                disabled
                aria-label="Necessary cookies (required)"
                className="mt-1"
              />
              <div>
                <Caption className="font-semibold">Necessary Cookies</Caption>
                <Caption className="text-ghxst-text-secondary">
                  Essential for the website to function. Cannot be disabled.
                </Caption>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    analytics: e.target.checked,
                  })
                }
                aria-label="Analytics cookies"
                className="mt-1"
              />
              <div>
                <Caption className="font-semibold">Analytics Cookies</Caption>
                <Caption className="text-ghxst-text-secondary">
                  Help us understand how visitors use our website.
                </Caption>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    marketing: e.target.checked,
                  })
                }
                aria-label="Marketing cookies"
                className="mt-1"
              />
              <div>
                <Caption className="font-semibold">Marketing Cookies</Caption>
                <Caption className="text-ghxst-text-secondary">
                  Used to deliver personalized advertisements.
                </Caption>
              </div>
            </label>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button size="sm" onClick={handleAcceptAll}>
            Accept All
          </Button>

          <Button size="sm" onClick={handleRejectAll}>
            Reject All
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide" : "Show"} Details
          </Button>

          {showDetails && (
            <Button size="sm" onClick={handleAcceptSelected}>
              Save Preferences
            </Button>
          )}
        </div>

        <Caption className="mt-4 text-ghxst-text-secondary">
          <a href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </a>
          {" • "}
          <a href="/cookie-policy" className="hover:underline">
            Cookie Policy
          </a>
        </Caption>
      </Card>
    </div>
  );
};
