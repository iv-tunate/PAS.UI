import Link from "next/link";
import type { ReactNode } from "react";

/**
 * One nav-link style for the whole header — internal routes, same-page
 * anchors, and external links (Gateway Nation) all render identically,
 * with the gradient underline only appearing on hover/focus so it stays
 * one of the few places the gradient shows up at all.
 */
export default function NavLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const classes =
    "relative text-sm text-ink/80 dark:text-paper/80 hover:text-ink dark:hover:text-paper transition-colors " +
    "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 " +
    "after:bg-brand-gradient after:transition-all hover:after:w-full";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("/#") && typeof window !== "undefined" && window.location.pathname === "/") {
      const targetId = href.replace("/#", "");
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={classes}>
      {children}
    </Link>
  );
}
