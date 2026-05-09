import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Button = forwardRef(function Button(
  { className = "", variant = "default", ...props },
  ref
) {
  const variants = {
    default: "bg-primary text-primary-foreground shadow-lg shadow-indigo-900/30 hover:-translate-y-0.5 hover:opacity-95",
    outline: "border border-border bg-transparent hover:bg-muted",
    ghost: "hover:bg-muted"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
