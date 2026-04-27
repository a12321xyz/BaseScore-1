import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  indicatorClassName?: string;
}

export function Progress({ value, className, indicatorClassName, ...props }: ProgressProps) {
  return (
    <div className={cn("h-2 w-full overflow-hidden bg-[#222]", className)} {...props}>
      <div
        className={cn("h-full transition-all duration-500 ease-in-out", indicatorClassName || "bg-[#00ff00]")}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
