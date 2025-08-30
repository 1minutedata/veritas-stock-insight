import { cn } from "@/lib/utils";

interface VeritasierLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VeritasierLogo({ className, size = "md" }: VeritasierLogoProps) {
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
      VERITASIER
    </div>
  );
}