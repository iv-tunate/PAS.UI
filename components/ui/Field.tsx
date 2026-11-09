import type { InputHTMLAttributes, ReactNode } from "react";

/**
 * Labeled form input, shared by every auth form (login, signup,
 * forgot/reset password) so spacing and focus styles can't drift
 * between them.
 */
export default function Field({
  label,
  trailingLabel,
  ...inputProps
}: {
  label: string;
  trailingLabel?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm">{label}</label>
        {trailingLabel}
      </div>
      <input
        {...inputProps}
        className="w-full px-4 py-2.5 border border-ink/15 dark:border-paper/15 bg-transparent focus:border-brand-violet outline-none"
      />
    </div>
  );
}
