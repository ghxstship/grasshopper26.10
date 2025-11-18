import * as React from "react";
import { Badge } from "./Badge";

interface ApplicationStatusBadgeProps {
  status: string;
  className?: string;
}

const statusLabels: Record<string, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  OFFER_PENDING: "Offer Pending",
  OFFER_SENT: "Offer Sent",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  ONBOARDING: "Onboarding",
  COMPLETED: "Completed",
};

const statusColors: Record<string, "default" | "info" | "warning" | "success" | "error"> = {
  SUBMITTED: "info",
  UNDER_REVIEW: "info",
  SHORTLISTED: "warning",
  INTERVIEW: "warning",
  OFFER_PENDING: "warning",
  OFFER_SENT: "success",
  ACCEPTED: "success",
  REJECTED: "error",
  WITHDRAWN: "default",
  ONBOARDING: "info",
  COMPLETED: "success",
};

export function ApplicationStatusBadge({ status, className }: ApplicationStatusBadgeProps) {
  const label = statusLabels[status] || status;
  const variant = statusColors[status] || "default";

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
