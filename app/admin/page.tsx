"use client";

import Link from "next/link";
import { api } from "@/lib/api";
import { naira, dollars } from "@/lib/format";
import { PageHead, Notice, useLoad } from "@/components/admin/kit";

type Stats = {
  paid_orders: number;
  pending_orders: number;
  revenue_kobo: number;
  revenue_usd_cents: number;
  subscribers: number;
  unread_inbox: number;
  messages: number;
  events: number;
};

export default function AdminHome() {
  const { data: s, error } = useLoad(() => api.get<Stats>("/admin/stats", true));

  const tiles = s
    ? [
        { label: "Unread messages", value: s.unread_inbox, href: "/admin/inbox", hot: s.unread_inbox > 0 },
        { label: "Paid orders", value: s.paid_orders, href: "/admin/orders" },
        { label: "Waiting for payment", value: s.pending_orders, href: "/admin/orders" },
        { label: "Subscribers", value: s.subscribers, href: "/admin/subscribers" },
        // { label: "Videos on Messages page", value: s.messages, href: "/admin/messages" },
        { label: "Events", value: s.events, href: "/admin/events" },
      ]
    : [];

  return (
    <>
      <PageHead title="Overview" hint="What needs your attention, and where to find everything." />
      {error && <Notice kind="error">{error}</Notice>}

      {s && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {tiles.map((t) => (
              <Link key={t.label} href={t.href} className={`border p-5 transition-colors hover:border-brand-violet ${t.hot ? "border-brand-magenta" : "border-ink/15 dark:border-paper/15"}`}>
                <p className="font-display text-4xl font-semibold">{t.value}</p>
                <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">{t.label}</p>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink/65 dark:text-paper/65">
            Sales so far: <strong>{naira(s.revenue_kobo)}</strong>
            {s.revenue_usd_cents > 0 && <> and <strong>{dollars(s.revenue_usd_cents)}</strong></>}.
          </p>
        </>
      )}

      <section className="mt-12 border-t border-ink/10 pt-8 dark:border-paper/10">
        <h2 className="mb-3 font-display text-lg font-semibold">Editing the website</h2>
        <ul className="max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/70 dark:text-paper/70">
          <li>
            <strong>Words and photos:</strong> open the <Link href="/" className="underline">site</Link> while signed in. Hover any text to see an Edit button, and use “Edit photos” on photo sections.
          </li>
          <li><strong>Books, teachings, and events:</strong> use the pages in the menu. Changes appear on the site straight away.</li>
          <li><strong>Free or paid:</strong> set it on each book and teaching. Free ones email the link right away, paid ones after payment.</li>
        </ul>
      </section>
    </>
  );
}
