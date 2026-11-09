"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Button from "./Button";
import { useContent } from "@/contexts/ContentContext";

/**
 * What an admin sees where a section has nothing to show yet.
 * Visitors never see it: pass the section's own "hide" logic around it.
 */
export default function AdminHint({
  title,
  children,
  href,
  action,
}: {
  title: string;
  children: ReactNode;
  href: string;
  action: string;
}) {
  const { isAdmin } = useContent();
  if (!isAdmin) return null;
  return (
    <div className="border border-dashed border-ink/20 p-10 text-center dark:border-paper/20">
      <p className="mb-2 font-display text-lg font-semibold">{title}</p>
      <p className="mx-auto mb-5 max-w-sm text-sm text-ink/60 dark:text-paper/60">{children}</p>
      <Button href={href} variant="primary">
        {action}
      </Button>
      <p className="mt-4 text-xs text-ink/50 dark:text-paper/50">
        Only you can see this box. <Link href="/admin" className="underline">Open the dashboard</Link>
      </p>
    </div>
  );
}
