"use client";

import { useEffect, type ReactNode } from "react";

/** Shared shell for the admin editing dialogs: backdrop, Esc to close, titled panel. */
export default function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full overflow-y-auto bg-paper p-6 text-ink dark:bg-ink-raised dark:text-paper md:p-8 ${wide ? "max-w-3xl" : "max-w-xl"}`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-sm text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
