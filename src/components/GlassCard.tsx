import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true }: GlassCardProps) {
  return (
    <div className={cn(
      "glass-panel rounded-2xl p-6 relative overflow-hidden",
      hoverEffect && "glass-card-hover cursor-pointer",
      className
    )}>
      {/* Subtle top glare effect */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      {children}
    </div>
  );
}
