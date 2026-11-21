import type { ComponentProps } from "react";

/**
 * A sheet of paper: surface, a hairline border, a soft shadow. Use for
 * things the learner holds (today's entry, a letter), not every section.
 */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={[
        "rounded-base border border-line bg-surface p-4 shadow-card sm:p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
