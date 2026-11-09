import Link from "next/link";
import type { ReactNode } from "react";
import Wordmark from "./Wordmark";
import Backdrop from "./Backdrop";

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <Backdrop variant="aurora-b" className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 dark:border-paper/10 bg-paper/85 dark:bg-ink/85 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-6 flex justify-center border-b border-ink/10 dark:border-paper/10 pb-5">
          <Link href="/" aria-label="Back to home page" className="transition-opacity hover:opacity-85">
            <Wordmark size="md" />
          </Link>
        </div>
        {children}
      </div>
    </Backdrop>
  );
}
