import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground transition placeholder:text-muted-foreground/90 focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
      {...props}
    />
  );
});
