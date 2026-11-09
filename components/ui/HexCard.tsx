import type { ReactNode } from "react";

/**
 * The one recurring structural shape across the site, pulled from the
 * logo's hexagon mark: a rectangle with its top-left and bottom-right
 * corners clipped at an angle. Used for course/book tiles and stat
 * blocks instead of generic rounded SaaS cards, so the shape itself
 * ties back to the brand rather than being decoration.
 */
export default function HexCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-ink/10 dark:border-paper/10 bg-paper dark:bg-ink-raised ${className}`}
      style={{
        clipPath:
          "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
      }}
    >
      {children}
    </div>
  );
}
