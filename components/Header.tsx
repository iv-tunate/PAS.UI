"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Wordmark from "./ui/Wordmark";
import NavLink from "./ui/NavLink";
import Button from "./ui/Button";
import { useAuth } from "@/contexts/AuthContext";

const LINKS: { href: string; label: string; external?: boolean }[] = [
  { href: "/#about", label: "About" },
  { href: "/messages", label: "Messages" },
  { href: "/books", label: "Books" },
  { href: "/relearn", label: "Relearn" },
  { href: "/#events", label: "Events" },
  { href: "https://gatewaynation.org/", label: "Gateway Nation", external: true },
];

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-md dark:border-paper/10 dark:bg-ink/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Akintola Samuel, home" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.href} href={l.href} external={l.external}>
              {l.label}
            </NavLink>
          ))}
          {/* Only an admin who is signed in ever sees these. */}
          {user && <NavLink href="/admin">Dashboard</NavLink>}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user && (
            <Button variant="outline" onClick={logout} className="hidden md:inline-flex">
              Sign out
            </Button>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span className={`block h-[2px] w-5 bg-current transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-[2px] w-5 bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-[2px] w-5 bg-current transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-5 border-t border-ink/10 bg-paper px-6 py-6 font-display text-2xl font-semibold dark:border-paper/10 dark:bg-ink md:hidden">
          {LINKS.map((l) =>
            l.external ? (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  setOpen(false);
                  if (l.href.startsWith("/#") && typeof window !== "undefined" && window.location.pathname === "/") {
                    const el = document.getElementById(l.href.replace("/#", ""));
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", l.href);
                    }
                  }
                }}
              >
                {l.label}
              </Link>
            ),
          )}
          {user && (
            <>
              <Link href="/admin" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <div className="pt-2 font-body text-base font-medium">
                <Button variant="outline" onClick={logout}>
                  Sign out
                </Button>
              </div>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
