import * as React from "react";
import { Badge } from "./Badge";

interface OpportunityBadgeProps {
  category: string;
  className?: string;
}

const categoryLabels: Record<string, string> = {
  RFP_JOB: "RFP/Job",
  CAREER_FULL_TIME: "Full Time",
  CAREER_PART_TIME: "Part Time",
  CAREER_SEASONAL: "Seasonal",
  CAREER_INTERN: "Internship",
  AUDITION_CASTING: "Audition",
  CONTRACTOR: "Contractor",
  SUBCONTRACTOR: "Subcontractor",
  INDEPENDENT: "Independent",
  SPONSOR: "Sponsor",
  BRAND_AMBASSADOR: "Brand Ambassador",
  STREET_TEAM: "Street Team",
  INFLUENCER: "Influencer",
  AFFILIATE: "Affiliate",
};

const categoryColors: Record<string, "compvss" | "atlvs" | "gvteway" | "info" | "success"> = {
  RFP_JOB: "atlvs",
  CAREER_FULL_TIME: "success",
  CAREER_PART_TIME: "info",
  CAREER_SEASONAL: "compvss",
  CAREER_INTERN: "info",
  AUDITION_CASTING: "gvteway",
  CONTRACTOR: "atlvs",
  SUBCONTRACTOR: "atlvs",
  INDEPENDENT: "atlvs",
  SPONSOR: "gvteway",
  BRAND_AMBASSADOR: "compvss",
  STREET_TEAM: "compvss",
  INFLUENCER: "compvss",
  AFFILIATE: "compvss",
};

export function OpportunityBadge({ category, className }: OpportunityBadgeProps) {
  const label = categoryLabels[category] || category;
  const variant = categoryColors[category] || "default";

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
