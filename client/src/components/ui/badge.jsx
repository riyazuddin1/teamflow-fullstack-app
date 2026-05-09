import { cn } from "../../lib/utils";

export function Badge({ className = "", tone = "default", ...props }) {
  const tones = {
    default: "bg-muted text-foreground",
    success: "bg-emerald-500/20 text-emerald-300",
    warning: "bg-amber-500/20 text-amber-300",
    danger: "bg-rose-500/20 text-rose-300",
    info: "bg-indigo-500/20 text-indigo-300"
  };

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)} {...props} />
  );
}
