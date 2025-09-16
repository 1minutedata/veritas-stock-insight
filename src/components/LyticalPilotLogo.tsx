import { cn } from "@/lib/utils";

interface LyticalPilotLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LyticalPilotLogo({ className, size = "md" }: LyticalPilotLogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  return (
    <div className={cn(
      "font-bold tracking-wider text-white",
      sizeClasses[size],
      className
    )}>
      LyticalPilot
    </div>
  );
}