import type { ComponentProps } from "react";

const variantClassNames = {
  // The one suggested next step on a screen: filled.
  primary: "border-primary bg-primary text-on-primary",
  secondary: "border-line bg-surface text-ink",
  ghost: "border-transparent text-ink-muted",
  // Cannot be undone (deleting a diary or the account); always confirmed.
  danger: "border-error bg-transparent text-error",
} as const;

// Buttons skip hover while disabled; `enabled:` doesn't apply to links.
const hoverClassNames = {
  button: {
    primary: "enabled:hover:brightness-110",
    secondary: "enabled:hover:bg-band",
    ghost: "enabled:hover:bg-band enabled:hover:text-ink",
    danger: "enabled:hover:bg-error/10",
  },
  link: {
    primary: "hover:brightness-110",
    secondary: "hover:bg-band",
    ghost: "hover:bg-band hover:text-ink",
    danger: "hover:bg-error/10",
  },
} as const;

// Touch screens get at least 44px. Heights are minimums: a long label
// wraps instead of being cut off.
const sizeClassNames = {
  sm: "min-h-8 px-3 py-1 text-supporting pointer-coarse:min-h-11 pointer-coarse:min-w-11",
  md: "min-h-10 px-4 py-1.5 text-body pointer-coarse:min-h-11 pointer-coarse:min-w-11",
  lg: "min-h-12 px-6 py-2 text-body",
} as const;

export type ButtonVariant = keyof typeof variantClassNames;
export type ButtonSize = keyof typeof sizeClassNames;

/** Shared by Button and ButtonLink so both look identical. */
export function buttonClassName({
  variant,
  size,
  className,
  as = "button",
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  className?: string;
  as?: "button" | "link";
}): string {
  return [
    "pressable inline-flex max-w-full items-center justify-center gap-2 rounded-base border font-semibold text-center text-balance select-none disabled:cursor-not-allowed disabled:opacity-45",
    variantClassNames[variant],
    hoverClassNames[as][variant],
    sizeClassNames[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Appends a small → to the label. */
  arrow?: boolean;
};

export function Button({
  variant = "secondary",
  size = "md",
  arrow = false,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-variant={variant}
      {...props}
      className={buttonClassName({ variant, size, className })}
    >
      {children}
      {arrow && <span aria-hidden="true">→</span>}
    </button>
  );
}
