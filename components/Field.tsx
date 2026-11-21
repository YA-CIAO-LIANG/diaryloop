import { useId, type ComponentProps, type ReactNode } from "react";

const controlClassName =
  "w-full rounded-base border border-line bg-surface px-3 py-2 text-body text-ink placeholder:text-ink-muted pointer-coarse:min-h-11 aria-invalid:border-error";

type FieldProps = {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: (ids: { id: string; describedBy: string | undefined }) => ReactNode;
};

/** A labeled form control with an optional hint and error (role=alert). */
export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-supporting font-semibold text-ink">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-metadata text-ink-muted">
          {hint}
        </p>
      )}
      {children({ id, describedBy })}
      {error && (
        <p id={errorId} role="alert" className="text-supporting text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={[controlClassName, className].filter(Boolean).join(" ")}
    />
  );
}

/**
 * The diary page: ruled paper, the diary serif, lines spaced so text
 * sits on them. English writing, so lang="en" unless told otherwise.
 */
export function DiaryTextArea({
  className,
  lang = "en",
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      lang={lang}
      spellCheck
      {...props}
      className={[
        "w-full resize-y rounded-base border border-line paper-ruled px-4 py-[0.9em] font-diary text-diary text-ink placeholder:text-ink-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
