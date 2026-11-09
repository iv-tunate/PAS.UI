"use client";

import { useState } from "react";
import { api, listPage } from "@/lib/api";
import { shortDateTime } from "@/lib/format";
import { Badge, Btn, DeleteBtn, Empty, Notice, PageHead, errText, useLoad } from "@/components/admin/kit";

type Row = { id: string; topic: string; name: string; email: string; phone: string; preferred_time: string; body: string; is_read: boolean; created_at: string };
const TOPIC: Record<string, string> = { message: "Message", appointment: "Appointment", prayer: "Prayer request" };

export default function InboxPage() {
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState("");
  const { data, error, reload } = useLoad(() => listPage<Row>("/admin/inbox", page, 20), [page]);

  async function act(fn: () => Promise<unknown>) {
    setMsg("");
    try { await fn(); reload(); } catch (e) { setMsg(errText(e)); }
  }

  return (
    <>
      <PageHead title="Inbox" hint="" />
      {/* <PageHead title="Inbox" hint="Messages, prayer requests and appointment requests from the contact form. Each is also emailed to every admin; reply from your email and it goes straight to the sender." /> */}
      {(error || msg) && <Notice kind="error">{error || msg}</Notice>}
      {data && data.items.length === 0 && <Empty>Nothing here yet.</Empty>}
      <ul className="space-y-4">
        {data?.items.map((r) => (
          <li key={r.id} className={`border p-5 ${r.is_read ? "border-ink/10 dark:border-paper/10" : "border-brand-magenta"}`}>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone={r.topic === "appointment" ? "warn" : "plain"}>{TOPIC[r.topic] ?? r.topic}</Badge>
              {!r.is_read && <Badge tone="bad">New</Badge>}
              <span className="ml-auto text-xs text-ink/55 dark:text-paper/55">{shortDateTime(r.created_at)}</span>
            </div>
            <p className="mt-3 font-medium">{r.name}</p>
            <p className="text-sm text-ink/65 dark:text-paper/65">
              <a href={`mailto:${r.email}`} className="underline">{r.email}</a> · <a href={`tel:${r.phone}`} className="underline">{r.phone}</a>
            </p>
            {r.preferred_time && <p className="mt-2 text-sm"><strong>Preferred time:</strong> {r.preferred_time}</p>}
            <p className="mt-3 whitespace-pre-line leading-relaxed">{r.body}</p>
            <div className="mt-4 flex gap-2">
              <Btn kind="ghost" className="!px-3 !py-1" onClick={() => act(() => api.put(`/admin/inbox/${r.id}/read`, { is_read: !r.is_read }, true))}>
                {r.is_read ? "Mark as unread" : "Mark as read"}
              </Btn>
              <DeleteBtn onConfirm={() => act(() => api.delete(`/admin/inbox/${r.id}`, true))} />
            </div>
          </li>
        ))}
      </ul>
      {data && data.total > data.perPage && (
        <div className="mt-6 flex items-center gap-4 text-sm">
          <Btn kind="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Btn>
          <span>Page {page}</span>
          <Btn kind="ghost" disabled={page * data.perPage >= data.total} onClick={() => setPage(page + 1)}>Next</Btn>
        </div>
      )}
    </>
  );
}
