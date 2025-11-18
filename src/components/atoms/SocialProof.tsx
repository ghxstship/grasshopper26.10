import * as React from "react";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface SocialProofProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  label?: string;
  icon?: React.ReactNode;
}

export const SocialProof: React.FC<SocialProofProps> = ({ 
  count, 
  label = "Going",
  icon,
  className,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-share-tech-mono text-body-sm text-gray-700",
        className
      )}
      {...props}
    >
      {icon || <Users className="w-4 h-4" />}
      <span>{count} {label}</span>
    </div>
  );
};

SocialProof.displayName = "SocialProof";
