import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonClassName, type ButtonSize, type ButtonVariant } from "./Button";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
};

/** A link styled exactly like Button, for navigation ("Write today →"). */
export function ButtonLink({
  variant = "secondary",
  size = "md",
  arrow = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={buttonClassName({ variant, size, className, as: "link" })}
    >
      {children}
      {arrow && <span aria-hidden="true">→</span>}
    </Link>
  );
}
