"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Wordmark from "@/components/ui/Wordmark";
import ThemeToggle from "@/components/ThemeToggle";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/orders", label: "Orders" },
  // { href: "/admin/messages", label: "Messages" },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/courses", label: "Relearn Courses" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/admins", label: "Admins" },
];

const OPEN = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const open = OPEN.includes(path);

  useEffect(() => {
    if (!open && !loading && !user) router.replace("/admin/login");
  }, [open, user, loading, router]);

  useEffect(() => setMenu(false), [path]);

  if (open) return <>{children}</>;

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-ink/60 dark:text-paper/60">Checking access…</div>;
  }

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {NAV.map((l) => {
        const active = l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              active ? "bg-ink font-medium text-paper dark:bg-paper dark:text-ink" : "hover:bg-ink/5 dark:hover:bg-paper/10"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-ink dark:text-paper">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/10 bg-paper/90 px-4 py-3 backdrop-blur dark:border-paper/10 dark:bg-ink/90 md:hidden">
        <Link href="/" title="Go to landing page" className="transition-opacity hover:opacity-80">
          <Wordmark size="sm" />
        </Link>
        <button onClick={() => setMenu((m) => !m)} aria-expanded={menu} className="rounded-full border border-ink/20 px-4 py-1.5 text-sm dark:border-paper/20">
          {menu ? "Close" : "Menu"}
        </button>
      </header>
      {menu && <div className="border-b border-ink/10 p-4 dark:border-paper/10 md:hidden">{nav}</div>}

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 md:grid-cols-[220px_1fr] md:px-6 md:py-10">
        <aside className="hidden md:block">
          <div className="sticky top-10">
            <Link href="/" title="Go to landing page" className="block transition-opacity hover:opacity-80">
              <Wordmark size="sm" />
            </Link>
            <p className="mb-6 mt-1 text-xs text-ink/50 dark:text-paper/50">Admin</p>
            {nav}
            <div className="mt-8 flex flex-col gap-3 border-t border-ink/10 pt-6 text-sm dark:border-paper/10">
              <Link href="/" className="text-ink/70 hover:underline dark:text-paper/70">
                View the site (edit text and photos there)
              </Link>
              <p className="truncate text-xs text-ink/50 dark:text-paper/50">{user.email}</p>
              <div className="flex items-center gap-3">
                <button onClick={async () => { await logout(); router.replace("/admin/login"); }} className="underline">
                  Sign out
                </button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
