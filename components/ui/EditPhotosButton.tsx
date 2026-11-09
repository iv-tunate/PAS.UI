"use client";

import { useContent } from "@/contexts/ContentContext";
import type { PhotoSet } from "@/components/admin/PhotoManager";

/** Admin-only shortcut to the photo manager. Renders nothing for visitors. */
export default function EditPhotosButton({ className = "", set = "pastor" }: { className?: string; set?: PhotoSet }) {
  const { isAdmin, openPhotos } = useContent();
  if (!isAdmin) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openPhotos(set);
      }}
      className={`inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-paper shadow-lg dark:bg-paper dark:text-ink ${className}`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
      Edit photos
    </button>
  );
}
