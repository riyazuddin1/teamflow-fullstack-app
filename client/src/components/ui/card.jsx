import { cn } from "../../lib/utils";

export function Card({ className = "", ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/90 bg-card/95 p-5 shadow-[0_10px_40px_-20px_rgba(59,130,246,0.35)] backdrop-blur-sm transition duration-200",
        className
      )}
      {...props}
    />
  );
}
