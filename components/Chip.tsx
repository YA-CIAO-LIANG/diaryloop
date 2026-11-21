import type { ComponentProps } from "react";

type ChipProps = ComponentProps<"button"> & { selected?: boolean };

/**
 * A small toggle (mood, weather, tag, length). Selected: accent border,
 * band fill, and a check mark, never color alone.
 */
export function Chip({
  selected = false,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      {...props}
      className={[
        "inline-flex min-h-9 pressable items-center gap-1.5 rounded-full border px-3 py-1 text-supporting pointer-coarse:min-h-11",
        selected
          ? "border-accent bg-band font-semibold text-ink"
          : "border-line bg-surface text-ink-muted hover:text-ink",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {selected && <span aria-hidden="true">✓</span>}
      {children}
    </button>
  );
}
