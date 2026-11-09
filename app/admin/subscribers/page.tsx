"use client";

import { useState } from "react";
import { api, listPage } from "@/lib/api";
import { Btn, DeleteBtn, Empty, Notice, PageHead, errText, useLoad } from "@/components/admin/kit";

type Sub = { id: string; email: string; created_at: string };

export default function SubscribersPage() {
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState("");
  const { data, error, reload } = useLoad(() => listPage<Sub>("/admin/subscribers", page, 50), [page]);

  async function remove(s: Sub) {
    try { await api.delete(`/admin/subscribers/${s.id}`, true); reload(); } catch (e) { setMsg(errText(e)); }
  }

  return (
    <>
      <PageHead title="Subscribers" hint={data ? `${data.total} people get your newsletter. To email them, use the Newsletter page.` : undefined} />
      {(error || msg) && <Notice kind="error">{error || msg}</Notice>}
      {data && data.items.length === 0 && <Empty>No subscribers yet. </Empty>}
      <ul className="divide-y divide-ink/10 dark:divide-paper/10">
        {data?.items.map((s) => (
          <li key={s.id} className="flex items-center gap-4 py-3 text-sm">
            <span className="min-w-0 flex-1 truncate">{s.email}</span>
            <span className="text-ink/50 dark:text-paper/50">{s.created_at}</span>
            <DeleteBtn label="Remove" onConfirm={() => remove(s)} />
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
