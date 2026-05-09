import { useMemo } from "react";

export default function Avatar({ name = "User", size = "md" }) {
  const initials = useMemo(
    () =>
      name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [name]
  );

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base"
  };

  return (
    <div
      className={`grid place-items-center rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 font-semibold text-indigo-200 ring-1 ring-indigo-400/30 ${sizes[size]}`}
    >
      {initials}
    </div>
  );
}
