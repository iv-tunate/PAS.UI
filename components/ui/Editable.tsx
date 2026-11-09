"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useContent } from "@/contexts/ContentContext";
import { CONTENT_DEFAULTS } from "@/lib/content-defaults";
import ScrollWords from "./ScrollWords";

/**
 * Text that comes from the database, with the placeholder as fallback.
 * Everyone sees plain text. A logged-in admin sees the same page, plus
 * a small Edit button on hover.
 *
 * `paragraphs` splits on blank lines into <p> elements.
 * `bare` skips the inline Edit button (for places that clip overflow,
 * like the hero name); those get an Edit control elsewhere.
 */
export default function Editable({
  k,
  as: Tag = "span",
  className = "",
  paragraphClassName = "",
  paragraphs = false,
  bare = false,
  style,
  scrollWords = false,
}: {
  k: string;
  as?: ElementType;
  className?: string;
  paragraphClassName?: string;
  paragraphs?: boolean;
  bare?: boolean;
  style?: CSSProperties;
  /** Light the words up one by one as the page scrolls. A plain flag, so server components can use it. */
  scrollWords?: boolean;
}) {
  const { get, isCustom, isAdmin, openEditor } = useContent();
  const text = get(k);
  const label = CONTENT_DEFAULTS[k]?.label ?? k;

  const body: ReactNode = scrollWords
    ? <ScrollWords text={text} />
    : paragraphs
    ? text.split(/\n{2,}/).map((p, i) => (
        <p key={i} className={paragraphClassName}>
          {p}
        </p>
      ))
    : text;

  const showEdit = isAdmin && !bare;

  return (
    <Tag
      className={`${className} ${showEdit ? "group/edit relative rounded-sm hover:outline hover:outline-1 hover:outline-dashed hover:outline-offset-4 hover:outline-brand-sky/70" : ""}`}
      style={style}
    >
      {body}
      {showEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openEditor(k);
          }}
          aria-label={`Edit: ${label}`}
          className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 align-middle ring-1 ring-paper/40 dark:ring-ink/40 font-body text-xs font-medium text-paper opacity-0 shadow-lg transition-opacity focus:opacity-100 group-hover/edit:opacity-100 dark:bg-paper dark:text-ink"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          {isCustom(k) ? "Edit" : "Edit placeholder"}
        </button>
      )}
    </Tag>
  );
}
